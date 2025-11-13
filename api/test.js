// Test endpoint to verify API is working
export default function handler(req, res) {
  res.status(200).json({ 
    status: 'ok',
    message: 'API is working!',
    timestamp: new Date().toISOString(),
    prototypes: {
      aspire: '/api/aspire-ai',
      wardrobe: '/api/wardrobe-ai'
    }
  });
}
