# Aspire Loop - Identity Evolution Engine

A revolutionary fashion app that helps users align their wardrobe with their aspirational identity through AI-powered insights and behavioral tracking.

## 🌟 Concept

Aspire Loop is not just a styling app—it's a **transformation engine** that creates a living feedback loop between:
- **Identity** (Who you want to become)
- **Wardrobe** (What you own)
- **Behavior** (What you actually wear)

## ✨ Key Features

### 1. Identity Definition
- Upload inspiration images from camera roll
- Define style keywords
- AI generates complete identity archetype:
  - Identity name (e.g., "Confident Creative Minimalist")
  - Color palette
  - Silhouette tendencies
  - Style statement
  - Behavioral cues

### 2. Auto-Detected Wardrobe
- AI-assisted item detection
- Describe items, AI extracts details
- Zero-friction wardrobe building
- Photo uploads optional

### 3. The Alignment Engine (Core Innovation)
- **Three-part scoring system**:
  - Identity Score: How well wardrobe matches identity
  - Wardrobe Score: How complete/cohesive wardrobe is
  - Behavior Score: How aligned wearing patterns are

### 4. Daily Logging
- Take outfit selfies (optional)
- Select items worn
- AI analyzes alignment
- Updates behavioral insights

### 5. Progress Tracking
- Weekly/monthly insights
- Alignment score over time
- Identity drift detection
- Wardrobe usage patterns

### 6. Gap-Closing Recommendations
- AI-powered suggestions
- Prioritizes using existing items
- Minimal shopping, maximum styling
- Identity-driven guidance

### 7. AI Outfit Generation
- Creates outfits from existing wardrobe
- Aligned with aspirational identity
- Context-aware (occasion, season)
- Styling tips included

## 🎨 Design

- **Dark, modern aesthetic** (luxury fashion app meets Apple design)
- **Mobile-first** (390x844px phone frame)
- **Color palette**: Deep blacks with gold accents
- **Clean interface**: No status bar, pure app content
- **Smooth animations**: Subtle micro-interactions

## 🔧 Technical Stack

- **Frontend**: Vanilla JavaScript
- **AI**: Claude (Anthropic) via Vercel serverless function
- **Storage**: Local Storage (with export/import)
- **Images**: Base64 dataURLs
- **UI Framework**: Custom CSS with modern features

## 📁 Project Structure

```
prototype4-aspire/
├── index.html              # Main entry point
├── css/
│   ├── aspire-loop.css    # Core dark theme styling
│   └── identity-viz.css    # Alignment visualizations
├── js/
│   ├── app.js             # Main application controller
│   ├── storage.js         # localStorage management
│   ├── claude-ai.js       # AI integration
│   ├── identity-engine.js  # Identity analysis
│   ├── wardrobe-detector.js # Wardrobe auto-detection
│   ├── alignment-scorer.js  # Alignment calculations
│   ├── behavior-tracker.js  # Daily logging
│   ├── outfit-generator.js  # AI outfit creation
│   ├── progress-tracker.js  # Progress insights
│   └── gap-analyzer.js     # Recommendations
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser
- Python 3.x
- Anthropic API key (already configured in server)

### Quick Start

```bash
cd prototype4-aspire
python server.py
```

That's it! The browser will automatically open to the app.

### What the Server Does

✅ Serves the web app on `http://localhost:8000`
✅ Proxies API requests to Anthropic Claude
✅ Handles CORS headers properly
✅ Keeps API key secure server-side

### Important Notes

⚠️ **Always use the Python server** - Opening `index.html` directly won't work due to API requirements.

🔑 **API Key**: Currently hardcoded in `server.py` for testing. Remove before production deployment.

### First Time Use

1. **Onboarding**: Enter your name
2. **Define Identity**: 
   - Upload 2-5 inspiration images
   - Add 3-5 style keywords
   - AI creates your identity archetype
3. **Add Wardrobe Items**:
   - Describe items (AI extracts details)
   - Upload photos (optional)
4. **Daily Logging**:
   - Log what you wear
   - Take selfies (optional)
   - AI updates alignment
5. **Track Progress**:
   - View alignment over time
   - Get recommendations
   - Generate AI outfits

## 🎯 The Aspire Loop

The core loop users live in:

1. **Define Identity** → AI creates archetype
2. **Build Wardrobe** → Auto-detect or manual add
3. **Calculate Alignment** → Compare aspiration vs. reality
4. **Log Daily Outfits** → Track wearing patterns
5. **Get Insights** → AI updates alignment
6. **Take Action** → Wear suggested items or fill gaps
7. **Repeat** → Identity evolves, wardrobe evolves

**Result**: Notice → Adjust → Align → Evolve

## 💾 Data Management

- **Local Storage**: All data stored in browser
- **Export**: Download JSON backup anytime
- **Import**: Restore from backup file
- **Privacy**: No server storage, completely local

## 🎨 UI Pages

1. **Onboarding**: Welcome & name entry
2. **Identity Create**: Define aspirational identity
3. **Dashboard**: Alignment scores & insights
4. **Identity View**: View archetype details
5. **Daily Log**: Log today's outfit
6. **Progress**: Track evolution over time
7. **Profile**: Stats & recommendations
8. **Add Item**: Wardrobe management

## 🔮 Future Enhancements

- Real image analysis (computer vision)
- Social sharing of outfits
- Community features
- Shopping integration
- Advanced analytics
- Sustainability tracking

## 📱 Device Support

- **Desktop**: Full phone frame simulation (390x844px)
- **Mobile**: Full-screen responsive mode
- **Tablet**: Phone frame centered

## 🎨 Color Palette

```css
--bg-primary: #0A0A0A        /* Deep black */
--bg-secondary: #161616      /* Card backgrounds */
--text-primary: #FAFAFA      /* White text */
--accent-gold: #C9A961       /* Luxury gold */
```

## 🤖 AI Integration

Uses Claude (Anthropic) for:
- Identity archetype generation
- Wardrobe item detection
- Alignment scoring with insights
- Daily outfit analysis
- Outfit generation
- Gap recommendations

## 📄 License

This is a prototype/concept application.

## 👤 Author

Created as part of HCDI (Human-Centered Design and Innovation) project.

---

**Aspire Loop**: Where identity meets wardrobe. Transform intentionally.
