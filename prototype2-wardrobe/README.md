# Wardrobe App

A modern web application for tracking your wardrobe, analyzing your style patterns, and getting AI-powered outfit recommendations.

## Features

- 📸 **Track Outfits**: Upload daily outfit photos and tag by mood/purpose
- 📊 **Analytics**: View detailed breakdowns of your dressing habits and patterns
- ✨ **AI Recommendations**: Get outfit suggestions based on your mood using Claude AI
- 🛍️ **Shopping Suggestions**: Smart recommendations for completing your wardrobe
- 💡 **Insights**: Understand what you really need and how to optimize your wardrobe

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript
- **AI**: Anthropic Claude Sonnet 4 API
- **Storage**: Local Storage (browser-based)
- **Server**: Python HTTP Server

## Getting Started

### Prerequisites

- Python 3.x installed on your system
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Running the Application

1. **Navigate to the project directory**:
   ```bash
   cd path/to/prototype2-wardrobe
   ```

2. **Start the Python server**:
   ```bash
   python server.py
   ```
   
   Or if you have Python 3 specifically:
   ```bash
   python3 server.py
   ```

3. **Open your browser**:
   ```
   http://localhost:8000
   ```

4. **Stop the server**:
   Press `Ctrl+C` in the terminal

## Features Overview

### 1. Login & Onboarding
- Clean full-screen login experience
- Interactive 3-slide onboarding tutorial
- Personalized welcome

### 2. Dashboard
- Quick stats overview
- Recent outfits timeline
- Mood patterns
- Quick action buttons

### 3. Add Items
- Upload outfit or individual clothing photos
- Tag by mood and occasion
- AI-powered clothing analysis
- Color and season tagging

### 4. Analytics
- Mood distribution charts
- Most worn items ranking
- Color distribution analysis
- Unworn items tracking

### 5. Outfit Recommendations
- Mood-based outfit suggestions
- AI-powered combinations
- Styling tips
- Uses your existing wardrobe

### 6. Shopping
- Gap analysis in your wardrobe
- AI-generated shopping suggestions
- Price range recommendations
- Styling ideas for new items

## Design Features

- 🎨 Modern black & white theme
- 📱 Responsive design (optimized for desktop)
- ⚡ Smooth animations and transitions
- 🔍 0.8x zoom for optimal viewing
- 💫 Professional, clean interface

## API Configuration

The app uses Anthropic's Claude API for AI features:
- **Model**: claude-sonnet-4-20250514
- **Features**: Image analysis, outfit recommendations, shopping suggestions

To use your own API key, update `js/anthropic.js`:
```javascript
apiKey: 'your-api-key-here'
```

## Project Structure

```
prototype2-wardrobe/
├── index.html              # Main dashboard
├── add-item.html          # Add items page
├── analytics.html         # Analytics page
├── closet.html           # Closet view
├── recommendations.html   # Outfit ideas
├── shopping.html         # Shopping suggestions
├── server.py             # Python HTTP server
├── css/
│   └── style.css         # Main stylesheet
└── js/
    ├── anthropic.js      # Claude API integration
    ├── app.js            # Main app logic
    ├── add-item.js       # Add item functionality
    └── storage.js        # Local storage management
```

## Browser Compatibility

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ⚠️ Local Storage must be enabled

## Notes

- All data is stored locally in your browser
- No account or backend server required
- AI features require internet connection
- Images are stored as base64 in local storage

## Recent Updates

- ✅ Removed mobile version (desktop-only)
- ✅ Full-screen login/onboarding experience
- ✅ Migrated from OpenAI to Anthropic Claude API
- ✅ Added 0.8x zoom for better fit
- ✅ Removed dummy data from dashboard
- ✅ Fixed onboarding scroll issues
- ✅ Python localhost server included

## Support

For issues or questions, refer to the code comments or check browser console for errors.

---

**Built with ❤️ for better wardrobe management**
