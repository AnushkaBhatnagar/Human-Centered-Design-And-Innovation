// Anthropic Claude API Integration (via Vercel serverless function)
const Anthropic = {
    apiEndpoint: '/api/wardrobe-ai',
    model: 'claude-sonnet-4-20250514',

    // Analyze clothing image
    async analyzeClothing(imageBase64) {
        try {
            // Extract base64 data and media type
            const matches = imageBase64.match(/^data:([^;]+);base64,(.+)$/);
            const mediaType = matches ? matches[1] : 'image/jpeg';
            const base64Data = matches ? matches[2] : imageBase64;

            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    messages: [
                        {
                            role: 'user',
                            content: [
                                {
                                    type: 'image',
                                    source: {
                                        type: 'base64',
                                        media_type: mediaType,
                                        data: base64Data
                                    }
                                },
                                {
                                    type: 'text',
                                    text: 'Analyze this clothing item and provide: 1) The type of clothing (e.g., shirt, pants, dress, jacket), 2) Primary colors (list up to 3), 3) Style/formality (casual, formal, business casual, athletic, etc.), 4) Suggested occasions or purposes. Format your response as JSON with keys: type, colors (array), style, occasions (array).'
                                }
                            ]
                        }
                    ],
                    max_tokens: 1024
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API error: ${response.status} - ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();
            const content = data.content[0].text;
            
            // Try to parse JSON from response
            try {
                return JSON.parse(content);
            } catch {
                // Fallback if not valid JSON
                return this.parseAnalysisText(content);
            }
        } catch (error) {
            console.error('Error analyzing clothing:', error);
            return null;
        }
    },

    // Parse text response as fallback
    parseAnalysisText(text) {
        return {
            type: 'clothing',
            colors: ['unknown'],
            style: 'casual',
            occasions: ['everyday']
        };
    },

    // Get outfit recommendations
    async getOutfitRecommendations(mood, occasion, wardrobeItems) {
        try {
            const itemsDescription = wardrobeItems.map(item => 
                `${item.name} (${item.type}, ${item.color})`
            ).join(', ');

            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    system: 'You are a professional fashion stylist who helps people choose outfits based on their mood, occasion, and existing wardrobe.',
                    messages: [
                        {
                            role: 'user',
                            content: `I'm feeling ${mood} and need an outfit for ${occasion}. Here are my wardrobe items: ${itemsDescription}. 

Please suggest 3 complete outfits using only these items. For each outfit, explain:
1. Which items to combine
2. Why this combination works for my mood and occasion
3. Styling tips

Format as JSON array with objects containing: items (array of item names), reasoning (string), stylingTips (string)`
                        }
                    ],
                    max_tokens: 2048
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API error: ${response.status} - ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();
            const content = data.content[0].text;
            
            try {
                return JSON.parse(content);
            } catch {
                // Fallback to simple recommendations
                return this.generateFallbackRecommendations(wardrobeItems, mood);
            }
        } catch (error) {
            console.error('Error getting recommendations:', error);
            return this.generateFallbackRecommendations(wardrobeItems, mood);
        }
    },

    // Fallback recommendations without AI
    generateFallbackRecommendations(items, mood) {
        const recommendations = [];
        const shuffled = [...items].sort(() => Math.random() - 0.5);
        
        for (let i = 0; i < Math.min(3, Math.floor(shuffled.length / 3)); i++) {
            const outfitItems = shuffled.slice(i * 3, (i + 1) * 3);
            recommendations.push({
                items: outfitItems.map(item => item.name),
                reasoning: `This combination works well for a ${mood} mood, balancing comfort and style.`,
                stylingTips: 'Accessorize to match your personal style and the occasion.'
            });
        }
        
        return recommendations;
    },

    // Get shopping suggestions
    async getShoppingSuggestions(wardrobeGaps, style, budget) {
        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    system: 'You are a personal shopping consultant who helps people build versatile, sustainable wardrobes.',
                    messages: [
                        {
                            role: 'user',
                            content: `Based on my wardrobe analysis, I'm missing: ${wardrobeGaps.join(', ')}. 
My style preference is ${style} and my budget is ${budget}. 

Please suggest 5-7 items I should consider purchasing to complete my wardrobe. For each item:
1. Item name and description
2. Why it's versatile and fills a gap
3. How to style it with existing pieces
4. Approximate price range

Format as JSON array with objects containing: name, description, reasoning, stylingIdeas (array), priceRange`
                        }
                    ],
                    max_tokens: 2048
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API error: ${response.status} - ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();
            const content = data.content[0].text;
            
            try {
                return JSON.parse(content);
            } catch {
                return this.generateFallbackShopping(wardrobeGaps);
            }
        } catch (error) {
            console.error('Error getting shopping suggestions:', error);
            return this.generateFallbackShopping(wardrobeGaps);
        }
    },

    // Fallback shopping suggestions
    generateFallbackShopping(gaps) {
        const suggestions = [];
        const items = {
            'basics': { name: 'Classic White T-shirt', price: '$15-30', description: 'A wardrobe essential' },
            'bottoms': { name: 'Dark Wash Jeans', price: '$40-80', description: 'Versatile and timeless' },
            'outerwear': { name: 'Neutral Blazer', price: '$60-150', description: 'Elevates any outfit' },
            'shoes': { name: 'Leather Sneakers', price: '$50-120', description: 'Comfortable and stylish' },
            'accessories': { name: 'Quality Watch', price: '$30-200', description: 'Finishing touch' }
        };

        gaps.forEach(gap => {
            const item = items[gap] || items['basics'];
            suggestions.push({
                name: item.name,
                description: item.description,
                reasoning: `This fills a gap in your ${gap} collection`,
                stylingIdeas: ['Pair with jeans for casual look', 'Dress up for formal occasions'],
                priceRange: item.price
            });
        });

        return suggestions;
    },

    // Analyze wardrobe patterns
    async analyzeWardrobePatterns(analytics) {
        try {
            const response = await fetch(this.apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    system: 'You are a wardrobe consultant who provides insights about clothing habits and style patterns.',
                    messages: [
                        {
                            role: 'user',
                            content: `Analyze my wardrobe data:
- Total items: ${analytics.totalItems}
- Most worn emotions: ${Object.keys(analytics.emotionCounts).slice(0, 3).join(', ')}
- Color distribution: ${Object.keys(analytics.colorCounts).slice(0, 5).join(', ')}
- Unworn items: ${analytics.leastWorn.length}

Provide 3-4 actionable insights about my wardrobe habits and suggestions for improvement. 
Format as JSON array with objects containing: insight (string), suggestion (string), icon (emoji)`
                        }
                    ],
                    max_tokens: 1024
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(`API error: ${response.status} - ${JSON.stringify(errorData)}`);
            }

            const data = await response.json();
            const content = data.content[0].text;
            
            try {
                return JSON.parse(content);
            } catch {
                return this.generateFallbackInsights(analytics);
            }
        } catch (error) {
            console.error('Error analyzing patterns:', error);
            return this.generateFallbackInsights(analytics);
        }
    },

    // Fallback insights
    generateFallbackInsights(analytics) {
        const insights = [];
        
        if (analytics.leastWorn.length > analytics.totalItems * 0.3) {
            insights.push({
                insight: `${analytics.leastWorn.length} items haven't been worn yet`,
                suggestion: 'Try creating outfits with unworn items to maximize your wardrobe',
                icon: '👕'
            });
        }

        if (Object.keys(analytics.colorCounts).length < 5) {
            insights.push({
                insight: 'Your color palette is quite limited',
                suggestion: 'Consider adding complementary colors to increase outfit variety',
                icon: '🎨'
            });
        }

        insights.push({
            insight: 'Track outfits regularly to identify patterns',
            suggestion: 'Consistent tracking helps you understand your true style preferences',
            icon: '📊'
        });

        return insights;
    }
};

// Maintain backward compatibility
const OpenAI = Anthropic;
