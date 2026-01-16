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

### Image Generation (Dual Provider Support)

#### **OpenAI GPT Image** (Default)
- **Models**:
  - `gpt-image-1-mini` - Cheaper, faster, great for iteration (currently selected)
  - `gpt-image-1` - Higher quality, better composition
  - `dall-e-3`, `dall-e-2` - Also supported
- **Endpoint**: `https://api.openai.com/v1/images/generations`
- **API Key format**: `sk-...` (OpenAI API key)
- **Response format**: Base64 JSON (image embedded in response)

#### **Google Gemini 2.5 Flash Image** (aka "Nano Banana")
- **Endpoint**: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent`
- **Fast, optimized for speed and efficiency**
- **Generates 1024px resolution images**
- **Portrait format support with aspect ratios**
- **API Key format**: `AIzaSy...` (Google API key)

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
2. User selects AI provider (OpenAI or Gemini)
3. Frontend sends prompt + provider to `/api/generate`
4. Server creates job ID, stores as "pending" in memory
5. Server returns job ID immediately
6. Mirror becomes hazy/muddy (shimmer overlay appears)
7. Server calls selected provider API in background
   - **OpenAI**: `gpt-image-1-mini` at 1024x1024
   - **Gemini**: `gemini-2.5-flash-image` at 1024x1024
8. Frontend polls `/api/status/:jobId` every second
9. When complete, image fades into view through the haze
10. User can like/dislike or regenerate

## Environment Variables

```env
PORT=3000                          # Server port (optional)
OPENAI_API_KEY=sk-...              # OpenAI API key (default provider)
GEMINI_API_KEY=AIzaSy...           # Google Gemini API key
```

### OpenAI API Configuration

**How to get OpenAI API Key:**
1. Visit https://platform.openai.com/api-keys
2. Sign up / Sign in
3. Create new API key
4. Copy the key (starts with `sk-...`)

**Model Selection:**
- **`gpt-image-1-mini`** (Current default)
  - ✅ Cheaper, faster
  - ✅ Great for iteration
  - ✅ Best for development
- **`gpt-image-1`**
  - Higher quality
  - Better composition
  - More expensive
- Also supports: `dall-e-3`, `dall-e-2`, `gpt-image-1.5`

**Size Options:**
- `512x512` - Cheapest (~75% cost savings)
- `1024x1024` - Best default (currently selected)
- `1024x1792` or `1792x1024` - Portrait/poster format

**Prompt Best Practices:**
- Be **explicit but concise**
- Include: `style`, `subject`, `composition`, `background`
- Example: *"Clean, modern illustration, flat colors, soft shadows, portrait of a person, neutral background, daylight"*
- OpenAI API is more literal than ChatGPT UI - be specific

**Cost-Saving Strategy:**
1. Iterate with `512x512` during development
2. Lock the final prompt
3. Regenerate once at `1024x1024` for production
4. This can cut costs by **~75%**

**Important Security Notes:**
- ⚠️ **Never expose API key in frontend JavaScript**
- ⚠️ **Always call from server/API route** (already implemented)
- ⚠️ **OpenAI API keys cannot be restricted to image models only**
  - Keys are account-level, not model-scoped
  - Our server-side allowlist pattern prevents misuse
  - Frontend can never directly call text models
  - This is the recommended production pattern
- ⚠️ URLs are temporary if using `url` response format (we use base64)

### Gemini API Configuration

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

**Only 2 minimal dependencies:**
- `express` (^4.18.2) - Web server
- `dotenv` (^16.0.3) - Environment variable loading

**All framework dependencies removed:**
- ✅ Removed Next.js
- ✅ Removed React
- ✅ Removed Vercel analytics
- ✅ Removed Tailwind CSS
- ✅ Removed TypeScript compilation
- ✅ Removed all build tools
- ✅ No OpenAI SDK (using native fetch instead)

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

✅ **Already Implemented:**
- Server-side API key protection (keys never exposed to frontend)
- Model allowlist pattern (only image generation endpoints)
- Async job processing with background generation
- Base64 image response (no temporary URLs)

1. **Content Moderation**
   - Implement prompt validation
   - Filter sexual content
   - Ensure portrait-oriented human subjects
   - Rate limiting per user/IP

2. **Image Configuration**
   - Add aspect ratio control (portrait 2:3 or 9:16)
   - Implement prompt engineering for better portraits
   - Add size selection (512x512 vs 1024x1024)
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
- Removed all framework dependencies (only express + dotenv)
- **Dual AI provider support:**
  - ✅ OpenAI (gpt-image-1-mini) - Default
  - ✅ Google Gemini (Nano Banana) - Alternative
  - ✅ Provider switcher in UI
- In-memory job storage
- Shimmer overlay properly overlaps image during generation
- Vanilla HTML/CSS/JS frontend
- Async job polling with background generation

🚧 **Next Steps:**
1. Test both OpenAI and Gemini API integrations
2. Design and implement gilded antique frame UI
3. Enhance hazy "pensieve" mirror effect
4. Add portrait aspect ratio support (2:3 or 9:16)
5. Implement content moderation
6. Add like/dislike feedback buttons
7. Create stats/about page
8. Deploy to Railway or similar platform
