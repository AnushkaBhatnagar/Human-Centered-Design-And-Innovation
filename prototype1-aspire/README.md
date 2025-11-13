# Aspire - Personal Style Evolution App

A mobile-focused web app that helps individuals bridge the gap between who they are and who they aspire to be through mindful wardrobe management.

## Features

- 🎯 **Aspirational Identities** - Define who you want to become
- 👕 **Smart Wardrobe** - Track and categorize clothing items
- 🤖 **AI-Powered Analysis** - Claude AI matches items to aspirations
- ✨ **Magic Match** - AI outfit suggestions
- 🎨 **Style Guides** - Personalized fashion insights
- 💡 **Inspiration Board** - Save and match style inspiration
- 🛍️ **Smart Shopping** - Recommendations based on wardrobe gaps

## Quick Start

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)

### Running the App

1. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Start the server**
   ```bash
   python server.py
   ```
   
   This will start the server on http://localhost:3001

3. **Open the app**
   - Open your browser
   - Go to: **http://localhost:3001**
   - Start by entering your name!

### Important Notes

⚠️ **Always access via http://localhost:3001** (not by opening index.html directly)
- The app needs the backend server running for AI features to work
- Direct file access will cause CORS errors

## Project Structure

```
├── index.html              # Main app file
├── server.py              # Python Flask backend proxy
├── requirements.txt       # Python dependencies
├── css/                   # Stylesheets
│   ├── main.css
│   ├── components.css
│   ├── animations.css
│   └── mobile-frame.css
└── js/                    # JavaScript modules
    ├── app.js            # Main app logic
    ├── ai.js             # Claude AI integration
    ├── storage.js        # Local storage management
    ├── auth.js           # User authentication
    └── camera.js         # Image upload handling
```

## AI Integration

The app uses **Claude Sonnet 4.5** via Anthropic's API for:
- Wardrobe item analysis
- Outfit suggestions
- Style recommendations
- Fashion insights

The backend proxy (server.py) handles API calls securely.

## Tech Stack

- **Frontend:** Vanilla JavaScript, CSS3, HTML5
- **Backend:** Python Flask
- **AI:** Anthropic Claude API (Sonnet 4.5)
- **Storage:** Browser LocalStorage

## Color Palette (Minimalistic)

- Primary: #2C2C2C (Soft Charcoal)
- Secondary: #FAFAFA (Warm White)
- Accents: Beige/Taupe tones (#E8E0D5, #C4B5A0, #9B8B7E)
- Subtle gradients with low contrast

## Usage Tips

1. **Start Fresh:** App begins with onboarding (name input)
2. **Load Demo Data:** Go to Profile → "Load Demo Data" for testing
3. **Add Aspirations:** Define your style identities first
4. **Upload Items:** Add wardrobe items with photos
5. **AI Features:** Use "Magic Match" and "Style Guide" buttons
6. **Monitor Console:** Open DevTools (F12) to see AI logs

## Troubleshooting

**AI not working?**
- Make sure server is running (`python server.py`)
- Check browser console (F12) for error messages
- Verify you're on http://localhost:3001 (not file://)

**No data showing?**
- Load demo data from Profile page
- Or start adding items and aspirations manually

## License

MIT License - Feel free to use for prototypes and demos!
