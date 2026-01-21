# Cursor Agent Instruction: Add Loading Indicator to AI Assistant

## Task Overview

Add a loading indicator to the AI assistant chat interface that displays while waiting for the LLM to respond. The indicator must be accessible (WCAG 2.2 AA), work with progressive enhancement, and fit the existing GOV.UK/MOJ design patterns.

## Current State

The AI assistant interface currently:
- Uses MOJ Messages component for conversation display
- Has user messages (blue, right-aligned) and AI responses (grey, left-aligned)
- Shows sender name and timestamp below each message
- Has no feedback while waiting for AI response

## Requirements

### Acceptance Criteria
1. After submitting a question, a loading indicator displays while waiting for the LLM response
2. When the response is returned, the loading indicator disappears
3. Screen reader users are informed that a response is being generated
4. Users with `prefers-reduced-motion` see a static alternative to animation
5. The solution works without JavaScript (graceful degradation via page reload)

### Technical Constraints
- Must use `role="status"` with `aria-live="polite"` (NOT `aria-busy`)
- Live region must exist in the DOM at page load, not be dynamically created
- Visual animation must be hidden from assistive technology with `aria-hidden="true"`
- Must respect `prefers-reduced-motion` media query

## Implementation Steps

### Step 1: Add the ARIA live region to the page template

Add this near the top of the page body (outside the conversation area). This region announces to screen readers when loading starts:

```html
<!-- Screen reader announcement region - must exist at page load -->
<div id="ai-status" 
     role="status" 
     aria-live="polite" 
     aria-atomic="true" 
     class="govuk-visually-hidden">
</div>
```

### Step 2: Add the visual loading indicator component

Add this inside the conversation area, positioned where the AI response will appear. It should be hidden by default:

```html
<!-- Loading indicator - shows while waiting for AI response -->
<div class="moj-message-item moj-message-item--received" 
     id="ai-loading-indicator" 
     hidden>
  <div class="moj-message-item__text moj-message-item__text--received">
    <div class="ai-loading" aria-hidden="true">
      <span class="ai-loading__text">AI assistant is thinking</span>
      <span class="ai-loading__dots">
        <span class="ai-loading__dot"></span>
        <span class="ai-loading__dot"></span>
        <span class="ai-loading__dot"></span>
      </span>
    </div>
  </div>
  <div class="moj-message-item__meta">
    <span class="moj-message-item__meta--sender">AI assistant</span>
  </div>
</div>
```

### Step 3: Add the CSS styles

Add these styles to the stylesheet. They use GOV.UK colour variables where possible:

```css
/* ==========================================================================
   AI Loading Indicator
   ========================================================================== */

.ai-loading {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 0;
}

.ai-loading__text {
  font-family: "GDS Transport", arial, sans-serif;
  font-size: 16px;
  line-height: 1.25;
  color: #505a5f; /* govuk-colour("dark-grey") */
}

.ai-loading__dots {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.ai-loading__dot {
  width: 6px;
  height: 6px;
  background-color: #505a5f; /* govuk-colour("dark-grey") */
  border-radius: 50%;
  animation: ai-loading-bounce 1s ease-in-out infinite;
}

.ai-loading__dot:nth-child(2) {
  animation-delay: 0.1s;
}

.ai-loading__dot:nth-child(3) {
  animation-delay: 0.2s;
}

@keyframes ai-loading-bounce {
  0%, 60%, 100% {
    transform: translateY(0);
  }
  30% {
    transform: translateY(-4px);
  }
}

/* Reduced motion support - MANDATORY for accessibility */
@media (prefers-reduced-motion: reduce) {
  .ai-loading__dot {
    animation: none;
  }
  
  /* Hide animated dots, show static ellipsis instead */
  .ai-loading__dots {
    display: none;
  }
  
  .ai-loading__text::after {
    content: "...";
  }
}
```

### Step 4: Add the JavaScript functionality

Add these functions to control the loading indicator. They should be called when submitting a message and when receiving a response:

```javascript
/**
 * AI Loading Indicator Controller
 * Manages the display of the loading indicator and screen reader announcements
 */

const MINIMUM_DISPLAY_TIME = 500; // Prevent flicker on fast responses
let loadingShownAt = null;

/**
 * Show the loading indicator
 * Call this immediately when the user submits a message
 */
function showAiLoading() {
  loadingShownAt = Date.now();
  
  // Update screen reader announcement
  const statusRegion = document.getElementById('ai-status');
  if (statusRegion) {
    statusRegion.textContent = 'AI assistant is generating a response. Please wait.';
  }
  
  // Show visual indicator
  const loadingIndicator = document.getElementById('ai-loading-indicator');
  if (loadingIndicator) {
    loadingIndicator.hidden = false;
    
    // Scroll the indicator into view
    loadingIndicator.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }
}

/**
 * Hide the loading indicator
 * Call this when the AI response has been received and rendered
 */
function hideAiLoading() {
  const elapsed = Date.now() - (loadingShownAt || 0);
  const remainingTime = Math.max(0, MINIMUM_DISPLAY_TIME - elapsed);
  
  // Delay hiding to prevent flicker on very fast responses
  setTimeout(() => {
    // Clear screen reader announcement
    const statusRegion = document.getElementById('ai-status');
    if (statusRegion) {
      statusRegion.textContent = '';
    }
    
    // Hide visual indicator
    const loadingIndicator = document.getElementById('ai-loading-indicator');
    if (loadingIndicator) {
      loadingIndicator.hidden = true;
    }
    
    loadingShownAt = null;
  }, remainingTime);
}
```

### Step 5: Integrate with the form submission

Modify the existing form submission handler to show/hide the loading indicator:

```javascript
// Find this in the existing code - it's likely in the form submit handler
// Add showAiLoading() and hideAiLoading() calls

const chatForm = document.querySelector('.chat-form'); // Adjust selector as needed

if (chatForm) {
  chatForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    // Show loading indicator immediately
    showAiLoading();
    
    try {
      // Existing fetch/API call logic here
      const response = await fetch('/api/chat', {
        method: 'POST',
        body: new FormData(event.target)
      });
      
      const data = await response.json();
      
      // Render the AI response (existing logic)
      renderAiResponse(data);
      
    } catch (error) {
      // Handle error (existing logic)
      console.error('Error:', error);
      
    } finally {
      // Always hide loading indicator when done
      hideAiLoading();
    }
  });
}
```

## File Locations (adjust as needed)

Based on typical GOV.UK frontend structure:
- **HTML template:** `app/views/ai-assistant.html` or similar
- **CSS:** `app/assets/sass/components/_ai-loading.scss`
- **JavaScript:** `app/assets/javascripts/ai-loading.js`

## Testing Checklist

After implementation, verify:

### Functional
- [ ] Loading indicator appears when "Send message" is clicked
- [ ] Loading indicator disappears when AI response appears
- [ ] No flicker on fast responses (indicator shows for at least 500ms)
- [ ] Indicator scrolls into view if conversation is long

### Accessibility
- [ ] Screen reader (NVDA/JAWS) announces "AI assistant is generating a response"
- [ ] Screen reader does NOT announce "dot dot dot" or similar
- [ ] With `prefers-reduced-motion: reduce`, dots don't animate
- [ ] Indicator is visible in Windows High Contrast Mode

### Progressive Enhancement
- [ ] With JavaScript disabled, form submits normally and page reloads with response

## Visual Reference

The loading indicator should appear like this within the conversation:

```
┌─────────────────────────────────────────────────────┐
│                                              ┌────┐ │
│                                              │ hi │ │
│                                              └────┘ │
│                                        You at 10:59pm│
│                                                     │
│ ┌─────────────────────────────────────────────────┐ │
│ │ AI assistant is thinking ● ● ●                  │ │
│ └─────────────────────────────────────────────────┘ │
│ AI assistant                                        │
└─────────────────────────────────────────────────────┘
```

The dots should bounce subtly (4px vertical movement, 1 second loop, staggered timing).

## Notes

- The text "AI assistant is thinking" can be changed to "AI assistant is typing" if preferred
- The `(Sonnet 3.7)` model name from the existing responses is not included in the loading state as we don't know which model will respond until it does
- If response times are consistently long (10+ seconds), consider adding multi-stage messages in a future iteration (e.g., "Searching...", "Generating response...")

## Related Documentation

- GDS Design System Backlog - Loading Spinner: https://github.com/alphagov/govuk-design-system-backlog/issues/28
- GDS Backlog - Indeterminate Progress Indicator: https://github.com/alphagov/govuk-design-system-backlog/issues/164
- MOJ Messages Component: https://design-patterns.service.justice.gov.uk/components/messages/
- WCAG 4.1.3 Status Messages: https://www.w3.org/WAI/WCAG21/Understanding/status-messages.html
