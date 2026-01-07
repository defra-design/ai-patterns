# Change Log: HTTP 400 Error Handling for AWS Bedrock

**Date:** 2026-01-06  
**Ticket:** AICE-234  
**Author:** AI Assistant

---

## Summary for Jira Ticket

Implemented graceful handling of HTTP 400 errors returned from AWS Bedrock. When the LLM returns a 400 response (e.g., content filter violations, message too long), the UI now:
- Displays an inline error message in the conversation history
- Preserves the user's message in the input field for easy retry
- Shows a user-friendly error panel with actionable guidance
- Includes an error code for support reference (BR400-[timestamp])
- Keeps the Send button enabled for immediate resubmission

---

## Technical Changes

### Files Changed

| File | Change |
|------|--------|
| `src/server/start/chat-api.js` | Added `ChatApiError` class and specific 400 error handling |
| `src/server/start/controller.js` | Added handler for 400 errors with conversation preservation |
| `src/server/common/components/conversation/template.njk` | Added error message template for role="error" messages |
| `src/client/stylesheets/components/conversation/_conversation.scss` | Added `.app-error-message` styling |
| `tests/mocks/chat-api-handlers.js` | Updated mock to handle 400 errors with realistic response |
| `tests/integration/server/start/controller.test.js` | Added tests for 400 error scenarios |

### Key Implementation Details

1. **New `ChatApiError` class** - Custom error that preserves HTTP status code and generates error codes
2. **Error code format**: `BR400-YYYYMMDDHHmmss` (e.g., BR400-20260106120000)
3. **Controller returns HTTP 400** - Per tech notes, frontend returns 400 (not 500) when Bedrock returns 400
4. **Conversation preserved** - User's failed message appears in conversation with inline error below it

---

## Developer Actions Required

None - changes are self-contained.

---

## Testing Checklist

- [ ] Submit a message that triggers AWS Bedrock 400 error
- [ ] Verify inline error message appears in conversation
- [ ] Verify user's message is shown in conversation history
- [ ] Verify user's message is preserved in input field
- [ ] Verify Send button remains enabled
- [ ] Verify error code is displayed (BR400-[timestamp])
- [ ] Verify error panel has correct ARIA attributes (role="alert")
- [ ] Verify styling matches GOV.UK error pattern (red left border)
- [ ] Verify subsequent successful message clears the error state
- [ ] Run integration tests: `npm test`

---

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| Inline error in conversation | Keeps context visible; user can see their failed message alongside the error |
| Red left border styling | Follows GOV.UK error pattern while distinguishing from AI responses |
| Keep Send button enabled | Allows immediate retry after editing message |
| Preserve input text | Prevents user losing their work; they can edit and retry |
| Include error code | Enables support to trace issues with specific timestamp |
| Return HTTP 400 from frontend | Tech notes specified this rather than masking as 500 |

---

## UI Design Reference

```
┌─────────────────────────────────────────────────┐
│ ⚠ There is a problem                            │
│                                                  │
│ We could not process your message.              │
│                                                  │
│ This is usually because the message is too      │
│ long or contains content we cannot process.     │
│                                                  │
│ What you can do:                                │
│ • Try making your message shorter               │
│ • Break your question into smaller parts        │
│ • Check your message does not contain           │
│   unusual characters                            │
│                                                  │
│ If this keeps happening, contact support        │
│ with error code: BR400-[timestamp]              │
└─────────────────────────────────────────────────┘
```

---

## Accessibility Considerations

- Error panel uses `role="alert"` and `aria-live="polite"` for screen reader announcements
- Warning icon is marked `aria-hidden="true"` (decorative)
- Error message uses semantic HTML with proper heading hierarchy
- Colour contrast meets WCAG 2.2 AA requirements

