# Identity Crisis - Project Roadmap

## Phase 1: Clean & Prepare ✓ IN PROGRESS

### Framework Migration
- [ ] Research Next.js alternatives → **Recommended: Vite + React + Express**
- [ ] Migrate from Next.js to Vite
- [ ] Set up Express server for API routes
- [ ] Update build configuration

### Dependency Cleanup
- [ ] Remove `@vercel/analytics` from package.json
- [ ] Remove analytics import from `_app.tsx`
- [ ] Remove `swr` (unused dependency)
- [ ] Update package.json with Vite dependencies

### Code Cleanup
- [ ] Remove hardcoded Vercel URL in `pages/api/image.ts`
- [ ] Remove Vercel metadata in `_document.tsx`
- [ ] Clean up unused imports across codebase

### Configuration
- [ ] Add environment variables for URLs (`VITE_APP_URL`, `API_URL`)
- [ ] Create `.env.example` with all required variables
- [ ] Enable stricter TypeScript settings (`strict: true`)
- [ ] Update ESLint configuration for Vite

---

## Phase 2: UI Transformation

### Gilded Frame Design
- [ ] Create/source antique gilded frame SVG asset
- [ ] Implement portrait orientation (9:16 ratio)
- [ ] Center frame on page with responsive sizing
- [ ] Add vintage texture overlay

### Pensieve Mirror Effect
- [ ] Replace shimmer with "pensieve" hazy effect
- [ ] Implement swirling/rippling animation
- [ ] Use murky colors (grays, silvers, blue tints)
- [ ] Add gradual fade from hazy → clear on image load
- [ ] Consider CSS animations vs. canvas-based particles

### Input Component Redesign
- [ ] Create elegant input box at bottom of frame
- [ ] Add ornate border matching frame aesthetic
- [ ] Implement placeholder text with guidance
- [ ] Add character limit display
- [ ] Style for antique theme

### Action Buttons
- [ ] Add refresh/regenerate icon button
- [ ] Create like/dislike feedback buttons
- [ ] Design minimal, elegant button styling
- [ ] Position buttons appropriately

### Typography & Theme
- [ ] Choose serif font for antique feel (EB Garamond, Cinzel, etc.)
- [ ] Define color scheme (gold/silver frame, background)
- [ ] Create CSS custom properties for theme colors
- [ ] Ensure dark/light theme compatibility

### Stats/About Page (Modal)
- [ ] Create stats modal overlay (accessible via button)
- [ ] Add Chart.js integration for visualizations
- [ ] Design modal UI with charts:
  - Gender distribution (pie chart)
  - Age ranges (bar chart)
  - Skin tones (doughnut chart)
  - Ethnicities (horizontal bar)
  - Art styles (bar chart)
- [ ] Add total generation count display
- [ ] Style modal to match antique theme
- [ ] Note: Backend analytics implementation in Phase 3

---

## Phase 3: Backend Updates

### Analytics & Data Collection
- [ ] Set up SQLite database with Railway volume mount (`/data`)
- [ ] Create database schema for generations
  ```sql
  CREATE TABLE generations (
    id TEXT PRIMARY KEY,
    prompt TEXT NOT NULL,
    image BLOB,
    provider TEXT,
    gender TEXT,
    age_range TEXT,
    skin_tone TEXT,
    ethnicity TEXT,
    art_style TEXT,
    mood TEXT,
    dominant_colors TEXT,
    created_at INTEGER,
    analyzed_at INTEGER,
    analysis_raw TEXT
  );
  ```
- [ ] Implement GPT-4 Vision background analysis
  - Analyze images after generation completes
  - Extract demographics (gender, age, skin tone, ethnicity)
  - Extract artistic attributes (style, mood, colors)
  - Run independently of client connection
- [ ] Create `/api/analytics` endpoint for aggregated data
- [ ] Add Railway configuration (`railway.toml`) with volume mount
- [ ] Handle database persistence across deployments
- [ ] Add privacy considerations (anonymous analytics notice)

### Midjourney API Integration
- [ ] Obtain Midjourney API access and documentation
- [ ] Create Midjourney API client wrapper
- [ ] Update image generation endpoint (`/api/image`)
- [ ] Adjust prompt formatting for Midjourney
  - Add `--ar 2:3` or `--ar 9:16` for portrait
  - Ensure "portrait of" prefix
- [ ] Handle Midjourney-specific response format
- [ ] Update polling mechanism (30-60s timeout)
- [ ] Update callback handler for Midjourney webhooks

### Content Moderation System
- [ ] Implement client-side keyword filtering
- [ ] Integrate OpenAI Moderation API
- [ ] Create custom rules for "portrait of human" validation
- [ ] Add sexual content filtering
- [ ] Implement user-friendly error messages
- [ ] Add prompt suggestions/examples

### Rate Limiting
- [ ] Implement rate limiting in API routes (use existing `rate-limit.ts`)
- [ ] Define limits (e.g., 10 requests per hour per IP)
- [ ] Add rate limit headers in responses
- [ ] Create user-friendly rate limit messaging

### Feedback System
- [ ] Design feedback data structure
  ```typescript
  interface Feedback {
    imageId: string;
    liked: boolean;
    prompt: string;
    timestamp: number;
  }
  ```
- [ ] Create `/api/feedback` endpoint
- [ ] Store feedback in Redis (with TTL) or database
- [ ] Create `/api/stats` endpoint for analytics
- [ ] Aggregate data for stats page

### Error Handling
- [ ] Add error boundary React component
- [ ] Implement retry logic for failed generations
- [ ] Add better error messages throughout
- [ ] Create fallback UI for errors
- [ ] Add logging for debugging

---

## Phase 4: Polish & Testing

### Performance Optimization
- [ ] Optimize image loading (lazy load, blur placeholder)
- [ ] Minimize bundle size
- [ ] Enable code splitting
- [ ] Add service worker for offline support (optional)
- [ ] Optimize CSS delivery

### Responsive Design
- [ ] Test on mobile devices (320px - 480px)
- [ ] Test on tablets (768px - 1024px)
- [ ] Test on desktop (1280px+)
- [ ] Ensure frame scales appropriately
- [ ] Test touch interactions

### Accessibility (a11y)
- [ ] Add ARIA labels to interactive elements
- [ ] Ensure keyboard navigation works
- [ ] Add alt text to images
- [ ] Test with screen readers
- [ ] Ensure color contrast meets WCAG standards
- [ ] Add focus indicators

### Cross-browser Testing
- [ ] Test in Chrome/Edge
- [ ] Test in Firefox
- [ ] Test in Safari
- [ ] Test in mobile browsers
- [ ] Fix any compatibility issues

### Code Quality
- [ ] Run ESLint and fix all warnings
- [ ] Enable TypeScript strict mode checks
- [ ] Add JSDoc comments to complex functions
- [ ] Remove console.logs and debug code
- [ ] Add error handling to all async operations

### Documentation
- [ ] Update README.md with new setup instructions
- [ ] Document environment variables
- [ ] Add API documentation
- [ ] Create deployment guide
- [ ] Document content moderation rules

### Final Testing
- [ ] Test full user flow (input → generate → feedback)
- [ ] Test error scenarios (network failure, API errors)
- [ ] Test rate limiting
- [ ] Test content moderation
- [ ] Verify analytics/stats accuracy
- [ ] Load testing (if needed)

---

## Future Enhancements (Post-Launch)

- [ ] Add image history (view previous generations in session)
- [ ] Add "save to gallery" feature
- [ ] Add social sharing (with privacy considerations)
- [ ] Add user accounts (optional)
- [ ] Add custom frame selection
- [ ] Add multiple language support
- [ ] Add progressive web app (PWA) features
- [ ] Add animation customization options

---

## Current Status

**Phase**: Phase 2 (UI Transformation)
**Branch**: `claude/portrait-mirror-golden-frame-KiM6V`
**Last Updated**: 2026-01-17

**Completed**:
- ✓ Portrait mirror format (rectangular, 4:5 ratio)
- ✓ Golden gilded frame with gradient border
- ✓ Updated all text from "crystal ball" to "mirror"
- ✓ Responsive sizing for portrait orientation

**In Progress**:
- Custom frame design options
- Phase 2 UI enhancements

**Blockers**:
- Need Midjourney API access for Phase 3
- Need custom gilded frame SVG/PNG asset (if user wants to provide)
- Need color scheme decisions for remaining Phase 2 work

**Decisions Needed**:
- Font selection (serif for antique feel)
- Pensieve effect vs. current shimmer animation
- Final color scheme refinements
- Analytics: SQLite decided for Phase 3
- Deployment: Railway confirmed
