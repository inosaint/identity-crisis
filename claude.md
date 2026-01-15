# Identity Crisis - AI Mirror Portrait Generator

> **Note for Claude**: Do not create any .md files unless explicitly requested by the user.

## Project Overview

A mystical mirror interface that generates portrait images based on user descriptions. Inspired by the Pensieve from Harry Potter, the mirror appears hazy and dreamlike during generation, then reveals the AI-generated portrait.

## Concept

- **UI**: Antique gilded frame in portrait format centered on the page
- **Input**: Text box at the bottom for user descriptions
- **Generation**: Mirror becomes hazy (like a muddy pool) during image generation
- **Output**: Portrait-format AI-generated human images
- **Interaction**:
  - Refresh icon to regenerate
  - Like/dislike feedback buttons
  - Stats page showing feedback analytics

## Content Moderation

**Strict Requirements**:
- All prompts must be non-sexual in nature
- Images must be of human beings in portrait format
- Content validation before API calls

## Current Technical Stack

### Framework
- **Express.js** - Minimal Node.js web server
- **Vanilla HTML/CSS/JS** - Zero framework frontend
- **No build step required**

### Image Generation
- **Google Gemini 2.5 Flash Image** (aka "Nano Banana")
  - Endpoint: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent`
  - Fast, optimized for speed and efficiency
  - Generates 1024px resolution images
  - Portrait format support with aspect ratios
  - API Key format: `AIzaSy...` (Google API key)

### Infrastructure
- **In-memory job storage** - No external database needed
- **Native fetch** - No additional HTTP libraries
- **Single server.js file** (~120 lines)

### UI/UX
- **Pure CSS** - Custom styling, no frameworks
- **Vanilla JS** - No React, no build tools
- Custom shimmer/hazy effect for loading state

## Project Structure

```
identity-crisis/
├── public/
│   ├── index.html     # Main UI
│   ├── styles.css     # All styling
│   ├── script.js      # Vanilla JS
│   └── favicon.ico
├── server.js          # Single Express server (~120 lines)
├── package.json       # Only express dependency
├── .env.example
├── claude.md          # This file
└── todo.md
```

## Image Generation Flow

1. User enters description in input field
2. Frontend sends prompt to `/api/generate`
3. Server creates job ID, stores as "pending" in memory
4. Server returns job ID immediately
5. Mirror becomes hazy/muddy (shimmer effect)
6. Server calls Gemini API in background
7. Frontend polls `/api/status/:jobId` every second
8. When complete, image fades into view through the haze
9. User can like/dislike or regenerate

## Environment Variables

```env
PORT=3000                          # Server port (optional)
GEMINI_API_KEY=AIzaSy...           # Google Gemini API key
```

**How to get Gemini API Key:**
1. Visit https://ai.google.dev/
2. Sign up / Sign in with Google account
3. Go to "Get API Key"
4. Create new API key
5. Copy the key (starts with `AIzaSy...`)

**Gemini Image Generation Details:**
- Model: `gemini-2.5-flash-image` (aka "Nano Banana")
- Fast generation (~5-10 seconds)
- 1024x1024 default resolution
- Supports aspect ratios: 1:1, 2:3, 3:2, 3:4, 4:3, 4:5, 5:4, 9:16, 16:9, 21:9
- Returns base64 encoded PNG
- Free tier available

## Dependencies

**Only 1 production dependency:**
- `express` (^4.18.2) - Web server

**All framework dependencies removed:**
- ✅ Removed Next.js
- ✅ Removed React
- ✅ Removed OpenAI package
- ✅ Removed Vercel analytics
- ✅ Removed Tailwind CSS
- ✅ Removed TypeScript compilation
- ✅ Removed all build tools

## Planned Improvements

### UI/UX
1. **Gilded Frame Design**
   - Create antique mirror frame SVG/image
   - Portrait orientation (9:16 or similar ratio)
   - Center positioning
   - Responsive sizing

2. **Hazy Mirror Effect**
   - Enhance current shimmer effect
   - Add "muddy pool" aesthetic
   - Pensieve-inspired swirling animation
   - Smooth transition to clear image

3. **Input Design**
   - Elegant input box at bottom
   - Matches antique aesthetic
   - Placeholder text for guidance
   - Character limit display

4. **Action Buttons**
   - Refresh/regenerate icon
   - Like/dislike buttons (thumbs up/down or similar)
   - Minimal, elegant design

5. **Stats/About Page**
   - Display like/dislike statistics
   - Generation count
   - Popular prompt themes
   - Project information

### Backend
1. **Content Moderation**
   - Implement prompt validation
   - Filter sexual content
   - Ensure portrait-oriented human subjects
   - Rate limiting per user

2. **Gemini Configuration**
   - Add aspect ratio control (portrait 2:3 or 9:16)
   - Implement prompt engineering for better portraits
   - Add temperature/creativity controls
   - Error handling improvements

3. **Feedback System**
   - Store like/dislike in memory or simple file
   - Track per-generation metadata
   - Basic analytics aggregation
   - Stats endpoint

## Development Commands

```bash
npm install      # Install dependencies (only express)
npm run dev      # Start development server
npm start        # Start production server
```

No build step required!

## Git Workflow

**Current Branch**: `claude/remove-vercel-deps-0YnPn`

**Main Branch**: (to be determined)

All development should happen on feature branches starting with `claude/`

## Design Questions

1. **Gilded Frame**: Do you have a specific design/asset, or should we create one?
2. **Color Scheme**: What color palette for the antique aesthetic?
3. **Typography**: What fonts match the mystical/antique theme?
4. **Hazy Effect**: Specific animation preferences (swirl speed, opacity, color)?
5. **Feedback UI**: Question format - "Do you like this portrait?" or similar?

## Technical Questions

1. **Gemini Configuration**: What aspect ratio for portraits? (2:3 or 9:16 recommended)
2. **Content Moderation**: Simple keyword filter or external moderation API?
3. **Stats Storage**: In-memory, JSON file, or add a database?
4. **Deployment**: Railway, Render, or other platform?
5. **Rate Limiting**: How many generations per user per hour?

## Current Status

✅ **Completed:**
- Ultra-minimal rewrite (single server.js file)
- Removed all framework dependencies
- Integrated Google Gemini API (Nano Banana)
- In-memory job storage
- Basic shimmer/hazy effect
- Vanilla HTML/CSS/JS frontend

🚧 **Next Steps:**
1. Test Gemini API integration
2. Design and implement gilded antique frame UI
3. Enhance hazy "pensieve" mirror effect
4. Add portrait aspect ratio (2:3 or 9:16)
5. Implement content moderation
6. Add like/dislike feedback buttons
7. Create stats/about page
8. Deploy to Railway or similar platform
