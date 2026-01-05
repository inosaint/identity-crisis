# Identity Crisis - AI Mirror Portrait Generator

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
- **Next.js 13.0.0** - React metaframework
- **React 18.2.0** - UI library
- **TypeScript** - Type safety

### Image Generation
- **Currently**: OpenAI DALL-E 2 API
- **Planned**: Migrate to Midjourney API

### Infrastructure
- **@upstash/qstash** - Async job queue
- **@upstash/redis** - Result caching
- **sharp** - Image processing

### UI/UX
- **Tailwind CSS** - Styling (no shadcn/ui)
- **react-hot-toast** - Notifications
- Custom shimmer effect for loading state

### Analytics
- **Currently**: @vercel/analytics
- **Planned**: Remove Vercel dependencies

## Project Structure

```
├── pages/
│   ├── api/
│   │   ├── image.ts       # Image generation endpoint
│   │   ├── callback.ts    # Webhook from job queue
│   │   └── poll.ts        # Poll for results
│   ├── index.tsx          # Main mirror UI
│   ├── _app.tsx           # App wrapper
│   └── _document.tsx      # HTML document
├── utils/
│   ├── use-interval.tsx   # Polling hook
│   ├── rate-limit.ts      # Rate limiting
│   └── redis.ts           # Redis client
├── styles/
│   └── globals.css        # Tailwind directives
└── public/                # Static assets
```

## Image Generation Flow

1. User enters description in input field
2. Prompt validation (content moderation)
3. Mirror becomes hazy/muddy during generation
4. API call to image generation service
5. Polling for result (via Redis cache)
6. Image fades into view through the haze
7. User can like/dislike or regenerate

## Environment Variables

```env
OPENAI_API_KEY=sk-...              # OpenAI API key (current)
MIDJOURNEY_API_KEY=...             # Midjourney API key (planned)
UPSTASH_REDIS_REST_URL=...         # Redis endpoint
UPSTASH_REDIS_REST_TOKEN=...       # Redis auth token
QSTASH_TOKEN=...                   # QStash API token
```

## Dependencies to Remove

### Vercel-specific
- [x] `@vercel/analytics` in package.json
- [x] Analytics import in `pages/_app.tsx`
- [x] Hardcoded Vercel URL in `pages/api/image.ts`
- [x] Vercel deployment references in `pages/_document.tsx`

### Not Found (Already Clean)
- ✓ No v0 references
- ✓ No shadcn/ui references

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

2. **API Migration**
   - Switch from DALL-E 2 to Midjourney
   - Update API endpoints
   - Adjust prompt formatting for Midjourney
   - Handle Midjourney-specific responses

3. **Feedback System**
   - Store like/dislike in Redis
   - Track per-generation metadata
   - Analytics aggregation
   - Export capabilities

4. **Remove Vercel Dependencies**
   - Replace @vercel/analytics with alternative (e.g., Plausible, Umami)
   - Make URLs configurable via environment variables
   - Remove Vercel-specific metadata

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

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

1. **Midjourney Integration**: Do you have API access and documentation?
2. **Content Moderation**: Use external API (e.g., OpenAI Moderation) or custom rules?
3. **Stats Storage**: Redis (temporary) or persistent database?
4. **Analytics**: Preferred alternative to Vercel Analytics?
5. **Hosting**: Where will this be deployed (if not Vercel)?

## Next Steps

1. Remove all Vercel dependencies
2. Design and implement gilded frame UI
3. Enhance hazy mirror effect
4. Add content moderation layer
5. Implement feedback system
6. Create stats/about page
7. Integrate Midjourney API
8. Final testing and polish
