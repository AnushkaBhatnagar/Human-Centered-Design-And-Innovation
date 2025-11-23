// Claude AI Integration for Aspire Loop
const ClaudeAI = {
    API_URL: '/api/aspire-loop-ai',

    // Analyze identity from inspiration images and keywords
    async analyzeIdentity(images, keywords) {
        const prompt = `KEYWORDS: ${keywords.join(', ')}
IMAGES: ${images.length} inspiration images provided

Create an identity archetype profile. Output ONLY valid JSON, no other text or explanation.

{
  "name": "archetype name (e.g. Confident Creative Minimalist)",
  "description": "2-3 sentences about this identity",
  "colorPalette": ["color1", "color2", "color3", "color4", "color5"],
  "silhouettes": ["silhouette1", "silhouette2", "silhouette3"],
  "archetypes": ["item1", "item2", "item3", "item4"],
  "styleStatement": "one powerful sentence",
  "behavioralCues": ["cue1", "cue2", "cue3"]
}`;

        try {
            const response = await this.callAPI(prompt, 'You are a JSON-only API. Respond with valid JSON only, no markdown, no explanations, no other text.');
            return JSON.parse(this.cleanJSON(response));
        } catch (error) {
            console.error('Error analyzing identity:', error);
            throw error;
        }
    },

    // Auto-detect wardrobe items from image and/or description
    async detectWardrobeItem(description, imageData = null) {
        const hasImage = imageData && typeof imageData === 'string';
        
        const textPrompt = `${description ? `USER DESCRIPTION: ${description}\n\n` : ''}${!hasImage ? 'NOTE: No image provided. Infer details from description.\n\n' : ''}TASK: Analyze this clothing item and extract structured information.

CRITICAL REQUIREMENT: You MUST respond with ONLY the JSON object below. Do not include any explanatory text, markdown formatting, or conversational responses. Return ONLY the JSON.

Required JSON format:
{
  "name": "descriptive item name",
  "category": "top|bottom|shoes|accessory|outerwear",
  "color": "primary color",
  "style": "style description (e.g., casual, formal, streetwear)",
  "formality": "casual|business casual|formal",
  "season": "all|spring|summer|fall|winter"
}

Example valid response:
{
  "name": "Black Leather Jacket",
  "category": "outerwear",
  "color": "black",
  "style": "edgy, biker-inspired",
  "formality": "casual",
  "season": "fall"
}

NOW RESPOND WITH ONLY THE JSON:`;

        try {
            const response = await this.callAPIWithVision(textPrompt, imageData, 'You are a JSON extraction API. You MUST respond with ONLY valid JSON. Never include explanations, apologies, or conversational text. If you cannot determine a field, make a reasonable inference. Output pure JSON only.');
            return JSON.parse(this.cleanJSON(response));
        } catch (error) {
            console.error('Error detecting item:', error);
            throw error;
        }
    },

    // Calculate alignment scores
    async calculateAlignment(identity, wardrobe, recentBehavior) {
        const wardrobeList = wardrobe.map(item => 
            `- ${item.name} (${item.category}): ${item.color || 'no color'}, ${item.style || 'no style'}`
        ).join('\n');

        const behaviorSummary = recentBehavior.length > 0 
            ? `Worn items: ${recentBehavior.map(log => log.itemsWorn.length).join(', ')} items over ${recentBehavior.length} days`
            : 'No recent activity';

        const prompt = `IDENTITY: ${identity.archetype.name}
Colors: ${identity.archetype.colorPalette.join(', ')}
Silhouettes: ${identity.archetype.silhouettes.join(', ')}

WARDROBE: ${wardrobe.length} items
${wardrobeList || 'Empty'}

BEHAVIOR: ${behaviorSummary}

Calculate alignment scores (0-100). Output ONLY valid JSON, no other text.

{
  "overall": 67,
  "identity": {
    "score": 75,
    "insights": ["insight 1", "insight 2"]
  },
  "wardrobe": {
    "score": 80,
    "insights": ["insight 1", "insight 2"]
  },
  "behavior": {
    "score": 45,
    "insights": ["insight 1", "insight 2"]
  }
}`;

        try {
            const response = await this.callAPI(prompt, 'You are a JSON-only API. Respond with valid JSON only, no markdown, no explanations, no other text.');
            return JSON.parse(this.cleanJSON(response));
        } catch (error) {
            console.error('Error calculating alignment:', error);
            throw error;
        }
    },

    // Analyze daily log
    async analyzeDailyLog(itemsWorn, identity) {
        const itemsList = itemsWorn.map(item => 
            `- ${item.name} (${item.category}, ${item.color})`
        ).join('\n');

        const prompt = `IDENTITY: ${identity.archetype.name}
Cues: ${identity.archetype.behavioralCues.join(', ')}

ITEMS WORN:
${itemsList}

Analyze outfit alignment. Output ONLY valid JSON, no other text.

{
  "colors": ["color1", "color2"],
  "silhouette": "description",
  "formality": "casual|business casual|formal",
  "alignmentScore": 75,
  "insight": "one sentence"
}`;

        try {
            const response = await this.callAPI(prompt, 'You are a JSON-only API. Respond with valid JSON only, no markdown, no explanations, no other text.');
            return JSON.parse(this.cleanJSON(response));
        } catch (error) {
            console.error('Error analyzing log:', error);
            throw error;
        }
    },

    // Generate outfit suggestion
    async generateOutfit(identity, wardrobe, occasion = 'everyday') {
        const wardrobeList = wardrobe.map(item => 
            `- ${item.name} (${item.category}, ${item.color})`
        ).join('\n');

        const prompt = `IDENTITY: ${identity.archetype.name}
Statement: ${identity.archetype.styleStatement}
Colors: ${identity.archetype.colorPalette.join(', ')}

OCCASION: ${occasion}

ITEMS:
${wardrobeList}

Create outfit with 3-5 items. Output ONLY valid JSON, no other text.

{
  "name": "outfit name",
  "items": ["item name 1", "item name 2"],
  "alignmentScore": 85,
  "reason": "why this works",
  "stylingTips": "how to wear"
}`;

        try {
            const response = await this.callAPI(prompt, 'You are a JSON-only API. Respond with valid JSON only, no markdown, no explanations, no other text.');
            const outfit = JSON.parse(this.cleanJSON(response));
            
            // Map item names to IDs
            outfit.itemIds = outfit.items.map(itemName => {
                const item = wardrobe.find(w => 
                    w.name.toLowerCase() === itemName.toLowerCase()
                );
                return item ? item.id : null;
            }).filter(id => id !== null);
            
            return outfit;
        } catch (error) {
            console.error('Error generating outfit:', error);
            throw error;
        }
    },

    // Generate recommendations
    async generateRecommendations(identity, wardrobe, alignment) {
        const wardrobeList = wardrobe.map(item => 
            `- ${item.name} (${item.category})`
        ).join('\n');

        const prompt = `IDENTITY: ${identity.archetype.name}
ALIGNMENT: ${alignment.overall}%

WARDROBE:
${wardrobeList || 'Empty'}

INSIGHTS:
${alignment.identity.insights.join('. ')}

Generate 3-5 recommendations. Output ONLY valid JSON array, no other text.

[
  {
    "type": "wear-existing",
    "item": "description",
    "reason": "why this helps",
    "priority": "high",
    "alignmentImpact": 15
  }
]`;

        try {
            const response = await this.callAPI(prompt, 'You are a JSON-only API. Respond with valid JSON only, no markdown, no explanations, no other text.');
            return JSON.parse(this.cleanJSON(response));
        } catch (error) {
            console.error('Error generating recommendations:', error);
            throw error;
        }
    },

    // Call Claude API with vision support
    async callAPIWithVision(textPrompt, imageData = null, systemMessage = 'You are a personal style advisor for the Aspire app, helping users align their wardrobe with their aspirational identity. Be specific, actionable, and encouraging.') {
        console.log('🤖 Calling Claude Vision API...');
        
        try {
            // Build content array with image and text
            const content = [];
            
            // Add image if provided and valid
            if (imageData && typeof imageData === 'string') {
                // Extract base64 data and media type
                const matches = imageData.match(/^data:(.+);base64,(.+)$/);
                if (matches) {
                    const mediaType = matches[1];
                    const base64Data = matches[2];
                    
                    content.push({
                        type: 'image',
                        source: {
                            type: 'base64',
                            media_type: mediaType,
                            data: base64Data
                        }
                    });
                    console.log('✅ Image added to request');
                } else {
                    console.warn('⚠️ Image data format invalid, skipping image');
                }
            }
            
            // Add text prompt
            content.push({
                type: 'text',
                text: textPrompt
            });
            
            const response = await fetch(this.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: [{
                        role: 'user',
                        content: content
                    }],
                    system: systemMessage,
                    max_tokens: 2048
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API request failed: ${response.status} ${errorText}`);
            }

            const data = await response.json();
            console.log('✅ Vision API Success');
            return data.content[0].text;
        } catch (error) {
            console.error('❌ Vision API Error:', error);
            throw new Error(`Failed to connect to AI service: ${error.message}`);
        }
    },

    // Call Claude API via serverless function
    async callAPI(prompt, systemMessage = 'You are a personal style advisor for the Aspire app, helping users align their wardrobe with their aspirational identity. Be specific, actionable, and encouraging.') {
        console.log('🤖 Calling Claude API...');
        
        try {
            const response = await fetch(this.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: [{
                        role: 'user',
                        content: prompt
                    }],
                    system: systemMessage,
                    max_tokens: 2048
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API request failed: ${response.status} ${errorText}`);
            }

            const data = await response.json();
            console.log('✅ API Success');
            return data.content[0].text;
        } catch (error) {
            console.error('❌ API Error:', error);
            throw new Error(`Failed to connect to AI service: ${error.message}`);
        }
    },

    // Clean JSON response
    cleanJSON(text) {
        let cleaned = text.trim();
        
        // Remove markdown code fences
        if (cleaned.startsWith('```json')) {
            cleaned = cleaned.substring(7);
        } else if (cleaned.startsWith('```')) {
            cleaned = cleaned.substring(3);
        }
        
        if (cleaned.endsWith('```')) {
            cleaned = cleaned.substring(0, cleaned.length - 3);
        }
        
        return cleaned.trim();
    },

    // Show loading toast
    showLoading(message = 'Processing...') {
        const toast = document.createElement('div');
        toast.className = 'loading-toast';
        toast.innerHTML = `
            <div class="loading-spinner"></div>
            <span>${message}</span>
        `;
        toast.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: var(--bg-elevated);
            padding: 24px 32px;
            border-radius: 16px;
            display: flex;
            align-items: center;
            gap: 16px;
            box-shadow: var(--shadow-xl);
            z-index: 1000;
        `;
        document.body.appendChild(toast);
        return toast;
    },

    hideLoading(toast) {
        if (toast && toast.parentNode) {
            toast.remove();
        }
    }
};

// Make globally available
window.ClaudeAI = ClaudeAI;
