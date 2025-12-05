# HCDI Prototypes - Fashion and Style Applications

A collection of prototypes exploring human-centered design solutions for the problem: "A Closet Full of Clothes and Nothing to Wear."

Created as part of the Human-Centered Design and Innovation (HCDI) course at Columbia University, Fall 2025.

## Overview

This repository contains four interactive prototypes, each exploring a different approach to helping users manage their wardrobes and express their personal style.

## Prototypes

### Prototype 1: Aspire (Personal Style Evolution)

Bridge the gap between who you are and who you aspire to be through mindful wardrobe management.

- Define aspirational identities
- AI-powered style matching
- Smart wardrobe tracking
- Personalized style guides

**Location:** `/prototype1-aspire/`

### Prototype 2: Wardrobe (Outfit Analytics and Insights)

Track your wardrobe, analyze your style patterns, and get AI-powered outfit recommendations.

- Track daily outfits
- Analytics dashboard
- AI recommendations
- Smart shopping suggestions

**Location:** `/prototype2-wardrobe/`

### Prototype 3: Thrift and Swap (Sustainable Fashion Exchange)

A sustainable platform where you can sell clothing to earn points and swap for new styles.

- Sell items for points
- Swap for new styles
- Track style evolution
- Subscription tiers

**Location:** `/prototype3-thrift/`

### Prototype 4: Aspire - Identity Evolution Engine (Final)

Transform your wardrobe intentionally. Define your aspirational identity and track alignment between who you want to be and what you wear.

- AI identity archetype creation
- Alignment scoring
- Daily outfit logging and analysis
- Personalized recommendations

**Location:** `/prototype4-aspire/`

## Technology Stack

- Frontend: Vanilla HTML, CSS, JavaScript
- AI Integration: Anthropic Claude API via Vercel serverless functions
- Deployment: Vercel
- Storage: Browser localStorage

## Getting Started

### Prerequisites

- Modern web browser
- Node.js (for API functions)
- Anthropic API key (for AI features)

### Local Development

1. Clone the repository
2. For prototype 4 with AI features, set up the Anthropic API key in your environment
3. Open any prototype's `index.html` in a browser, or use a local server

### Deployment

The project is configured for deployment on Vercel. See `DEPLOYMENT.md` for details.

## Project Structure

```
/
├── index.html              # Landing page with all prototypes
├── api/                    # Vercel serverless functions for AI
├── prototype1-aspire/      # First iteration
├── prototype2-wardrobe/    # Second iteration  
├── prototype3-thrift/      # Third iteration
└── prototype4-aspire/      # Final iteration
```

## Team

- Anushka Bhatnagar
- Babajide Hamzat
- Karina Castolo
- Leonah Esteves

## Course

Human-Centered Design and Innovation (HCDI)
Columbia University
Fall 2025
