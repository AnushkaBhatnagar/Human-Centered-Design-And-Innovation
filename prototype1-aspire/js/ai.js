// Anthropic Claude API Integration (via Vercel serverless function)
const AI = {
    API_URL: '/api/aspire-ai',
    MODEL: 'claude-sonnet-4-20250514',

    // Analyze a single item against all aspirations
    async analyzeItem(item, aspirations) {
        try {
            const prompt = this.buildItemAnalysisPrompt(item, aspirations);
            const response = await this.callOpenAI(prompt);
            return this.parseItemAnalysis(response, aspirations);
        } catch (error) {
            console.error('Error analyzing item:', error);
            throw error;
        }
    },

    // Analyze all wardrobe items against all aspirations
    async analyzeWardrobe(items, aspirations) {
        try {
            const results = [];
            for (const item of items) {
                const analysis = await this.analyzeItem(item, aspirations);
                results.push({
                    itemId: item.id,
                    analysis
                });
                // Add small delay to avoid rate limiting
                await this.delay(500);
            }
            return results;
        } catch (error) {
            console.error('Error analyzing wardrobe:', error);
            throw error;
        }
    },

    // Generate recommendations for wardrobe gaps
    async generateRecommendations(aspiration, currentItems) {
        try {
            const prompt = this.buildRecommendationsPrompt(aspiration, currentItems);
            const response = await this.callOpenAI(prompt);
            return this.parseRecommendations(response);
        } catch (error) {
            console.error('Error generating recommendations:', error);
            throw error;
        }
    },

    // Get style insights for an aspiration
    async getStyleInsights(aspiration) {
        try {
            const prompt = `Provide detailed style insights for someone aspiring to be a "${aspiration.name}". 
            Description: ${aspiration.description}
            Keywords: ${aspiration.keywords.join(', ')}
            
            Please provide:
            1. Key style elements (colors, silhouettes, fabrics)
            2. Essential wardrobe pieces
            3. Style do's and don'ts
            4. How to transition gradually
            
            Format as JSON with keys: styleElements, essentialPieces, dos, donts, transitionTips`;
            
            const response = await this.callOpenAI(prompt);
            const cleaned = this.cleanJsonResponse(response);
            return JSON.parse(cleaned);
        } catch (error) {
            console.error('Error getting style insights:', error);
            throw error;
        }
    },

    // Build prompt for item analysis
    buildItemAnalysisPrompt(item, aspirations) {
        const aspirationDescriptions = aspirations.map(asp => 
            `- ${asp.name}: ${asp.description} (Keywords: ${asp.keywords.join(', ')})`
        ).join('\n');

        return `You are a personal style advisor. Analyze this clothing item against the user's aspirational identities.

CLOTHING ITEM:
- Name: ${item.name}
- Type: ${item.type}
- Description: ${item.description}
- Color: ${item.color}
- Brand: ${item.brand}

ASPIRATIONAL IDENTITIES:
${aspirationDescriptions}

For each aspiration, provide:
1. Match Score (0-100): How well this item aligns with the aspiration
2. Reasoning: Brief explanation of the match/mismatch
3. Suggestions: How to style or when to wear this item for this aspiration

Respond with a JSON array where each object has:
{
  "aspirationName": "name",
  "matchScore": number,
  "reasoning": "brief explanation",
  "suggestions": "styling tips"
}`;
    },

    // Build prompt for recommendations
    buildRecommendationsPrompt(aspiration, currentItems) {
        const itemsList = currentItems.map(item => 
            `- ${item.name} (${item.type}): ${item.description}`
        ).join('\n');

        return `You are a personal style advisor. Based on the user's aspiration and current wardrobe, suggest what they should consider adding.

ASPIRATION:
- Name: ${aspiration.name}
- Description: ${aspiration.description}
- Keywords: ${aspiration.keywords.join(', ')}

CURRENT WARDROBE:
${itemsList || 'Empty wardrobe'}

Provide 5 thoughtful recommendations for filling wardrobe gaps. Focus on versatile pieces that align with their aspiration. For each recommendation:
1. Item type and description
2. Why it supports their aspiration
3. How it works with existing pieces
4. Priority level (high, medium, low)

Respond with JSON array of objects with keys: type, description, reasoning, compatibility, priority`;
    },

    // Call Anthropic Claude API (via proxy)
    async callOpenAI(prompt, systemMessage = 'You are a helpful personal style advisor focused on mindful, intentional fashion choices.') {
        console.log('🤖 Calling Claude API via proxy...');
        console.log('Model:', this.MODEL);
        console.log('Proxy URL:', this.API_URL);
        
        try {
            const response = await fetch(this.API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: this.MODEL,
                    system: systemMessage,
                    messages: [
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    max_tokens: 4096,
                    temperature: 0.7
                })
            });

            console.log('Response status:', response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error('❌ API Error:', errorData);
                throw new Error(errorData.error?.message || `API request failed with status ${response.status}`);
            }

            const data = await response.json();
            console.log('✅ API Success!');
            console.log('Response:', data);
            return data.content[0].text;
        } catch (error) {
            console.error('❌ API Call Failed:', error);
            throw error;
        }
    },

    // Helper: Clean markdown code blocks from response
    cleanJsonResponse(text) {
        // Remove markdown code fences if present
        let cleaned = text.trim();
        
        // Remove ```json or ``` at start
        if (cleaned.startsWith('```json')) {
            cleaned = cleaned.substring(7);
        } else if (cleaned.startsWith('```')) {
            cleaned = cleaned.substring(3);
        }
        
        // Remove ``` at end
        if (cleaned.endsWith('```')) {
            cleaned = cleaned.substring(0, cleaned.length - 3);
        }
        
        return cleaned.trim();
    },

    // Parse item analysis response
    parseItemAnalysis(response, aspirations) {
        try {
            const cleaned = this.cleanJsonResponse(response);
            const parsed = JSON.parse(cleaned);
            const results = {};
            
            parsed.forEach(item => {
                const aspiration = aspirations.find(a => 
                    a.name.toLowerCase() === item.aspirationName.toLowerCase()
                );
                
                if (aspiration) {
                    results[aspiration.id] = {
                        matchScore: item.matchScore / 100, // Convert to 0-1 scale
                        reasoning: item.reasoning,
                        suggestions: item.suggestions
                    };
                }
            });
            
            return results;
        } catch (error) {
            console.error('Error parsing analysis:', error);
            // Return default structure if parsing fails
            const results = {};
            aspirations.forEach(asp => {
                results[asp.id] = {
                    matchScore: 0.5,
                    reasoning: 'Analysis unavailable',
                    suggestions: 'Try again later'
                };
            });
            return results;
        }
    },

    // Parse recommendations response
    parseRecommendations(response) {
        try {
            const cleaned = this.cleanJsonResponse(response);
            return JSON.parse(cleaned);
        } catch (error) {
            console.error('Error parsing recommendations:', error);
            return [];
        }
    },

    // Utility: Delay function
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    // Get match level from score
    getMatchLevel(score) {
        if (score >= 0.7) return 'high';
        if (score >= 0.4) return 'medium';
        return 'low';
    },

    // Get match color
    getMatchColor(score) {
        if (score >= 0.7) return 'var(--success)';
        if (score >= 0.4) return 'var(--warning)';
        return 'var(--error)';
    },

    // Format match score for display
    formatMatchScore(score) {
        return Math.round(score * 100) + '%';
    },

    // Batch analyze with progress callback
    async analyzeBatchWithProgress(items, aspirations, progressCallback) {
        const total = items.length;
        const results = [];

        for (let i = 0; i < items.length; i++) {
            try {
                const analysis = await this.analyzeItem(items[i], aspirations);
                results.push({
                    itemId: items[i].id,
                    analysis,
                    success: true
                });
                
                if (progressCallback) {
                    progressCallback({
                        current: i + 1,
                        total,
                        percentage: Math.round(((i + 1) / total) * 100),
                        item: items[i]
                    });
                }
                
                // Delay between requests
                if (i < items.length - 1) {
                    await this.delay(500);
                }
            } catch (error) {
                results.push({
                    itemId: items[i].id,
                    error: error.message,
                    success: false
                });
            }
        }

        return results;
    },

    // Suggest complete outfit for an aspiration
    async suggestOutfitForAspiration(aspiration, wardrobeItems) {
        try {
            const itemsList = wardrobeItems.map(item => 
                `- ${item.name} (${item.category}): ${item.description || 'No description'}, Color: ${item.color || 'N/A'}`
            ).join('\n');

            const prompt = `You are a personal style advisor. Create a complete outfit from the available wardrobe items that embodies this aspiration.

ASPIRATION:
- Name: ${aspiration.name}
- Description: ${aspiration.description}
- Keywords: ${aspiration.keywords.join(', ')}

AVAILABLE WARDROBE ITEMS:
${itemsList}

Create ONE complete outfit that best represents this aspiration. Select 3-5 items that work together harmoniously.

Respond with JSON:
{
  "outfitName": "suggested name for the outfit",
  "selectedItems": ["item name 1", "item name 2", ...],
  "reasoning": "why these items work together for this aspiration",
  "occasion": "when/where to wear this outfit",
  "stylingTips": "additional tips for wearing this outfit"
}`;

            const response = await this.callOpenAI(prompt);
            const cleaned = this.cleanJsonResponse(response);
            const parsed = JSON.parse(cleaned);
            
            // Map item names to IDs
            const selectedIds = [];
            parsed.selectedItems.forEach(itemName => {
                const item = wardrobeItems.find(i => 
                    i.name.toLowerCase() === itemName.toLowerCase()
                );
                if (item) selectedIds.push(item.id);
            });

            return {
                ...parsed,
                selectedItemIds: selectedIds
            };
        } catch (error) {
            console.error('Error suggesting outfit:', error);
            throw error;
        }
    },

    // Match inspiration photo to wardrobe items
    async matchInspirationToWardrobe(inspirationDescription, wardrobeItems) {
        try {
            const itemsList = wardrobeItems.map(item => 
                `- ${item.name} (${item.category}): ${item.color || 'N/A'}`
            ).join('\n');

            const prompt = `You are a personal style advisor. A user has saved an inspiration photo with this description: "${inspirationDescription}"

AVAILABLE WARDROBE ITEMS:
${itemsList}

Identify which items from their wardrobe could recreate a similar look to the inspiration. Select 3-5 items that together would achieve a comparable style.

Respond with JSON:
{
  "matchingItems": ["item name 1", "item name 2", ...],
  "reasoning": "why these items recreate the inspiration look",
  "missingElements": "what's missing from their wardrobe to fully achieve this look",
  "stylingAdvice": "how to wear these items to match the inspiration"
}`;

            const response = await this.callOpenAI(prompt);
            const cleaned = this.cleanJsonResponse(response);
            const parsed = JSON.parse(cleaned);
            
            // Map item names to IDs
            const matchingIds = [];
            parsed.matchingItems.forEach(itemName => {
                const item = wardrobeItems.find(i => 
                    i.name.toLowerCase() === itemName.toLowerCase()
                );
                if (item) matchingIds.push(item.id);
            });

            return {
                ...parsed,
                matchingItemIds: matchingIds
            };
        } catch (error) {
            console.error('Error matching inspiration:', error);
            throw error;
        }
    },

    // Get comprehensive style insights for an aspiration
    async getStyleInsights(aspiration) {
        try {
            const prompt = `You are an expert fashion consultant. Provide comprehensive style guidance for someone aspiring to embody this identity:

ASPIRATION:
- Name: ${aspiration.name}
- Description: ${aspiration.description}
- Keywords: ${aspiration.keywords.join(', ')}

Provide detailed, actionable style insights. Be specific and practical.

Respond with JSON:
{
  "styleElements": {
    "colors": ["color 1", "color 2", "color 3"],
    "silhouettes": ["silhouette style 1", "silhouette style 2"],
    "fabrics": ["fabric 1", "fabric 2", "fabric 3"]
  },
  "essentialPieces": [
    "essential item 1",
    "essential item 2",
    "essential item 3",
    "essential item 4",
    "essential item 5"
  ],
  "dos": [
    "do 1",
    "do 2",
    "do 3"
  ],
  "donts": [
    "don't 1",
    "don't 2",
    "don't 3"
  ],
  "transitionTips": [
    "step 1: ...",
    "step 2: ...",
    "step 3: ..."
  ]
}`;

            const response = await this.callOpenAI(prompt);
            const cleaned = this.cleanJsonResponse(response);
            return JSON.parse(cleaned);
        } catch (error) {
            console.error('Error getting style insights:', error);
            throw error;
        }
    }
};

// Make AI globally available
window.AI = AI;
