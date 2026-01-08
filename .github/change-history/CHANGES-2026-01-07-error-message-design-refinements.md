# Change Log: Error Message Design Refinements

**Date:** 2026-01-07  
**Ticket:** AICE-234  
**Author:** AI Assistant

---

## Summary for Jira Ticket

Refined the error message design in the conversation component based on design review:
- Added semantic heading structure (h3 for "There is a problem", h4 for subsections) for screen reader navigation
- Changed sender label to "System message" for clearer attribution
- Added three error scenarios: timeout (retry possible), fatal error (must start over), and access denied (service unavailable)
- Added copy-paste warnings to help users preserve their work before starting a new conversation
- Fixed assistant response text colour from dark-grey to black for better readability

---

## Technical Changes

### Files Changed

| File | Change |
|------|--------|
| `src/server/common/components/conversation/template.njk` | Redesigned error message block with semantic headings and three error scenarios |
| `src/client/stylesheets/components/conversation/_conversation.scss` | Updated styling, fixed assistant text colour |
| `src/server/start/controller.js` | Added errorType support and test mode commands |
| `tests/integration/server/start/controller.test.js` | Updated tests for new error content |

---

## Developer Actions Required

When creating error messages in the controller, you can now specify `errorType`:
- `errorType: "timeout"` — Shows retry-friendly content with "if this keeps happening" warning
- `errorType: "access-denied"` — Shows 403 service unavailable content (temporary issue, not user's fault)
- No `errorType` (default) — Shows fatal error content with link to start new conversation

Example:
```javascript
messages.push({
  role: 'error',
  errorType: 'timeout', // or 'access-denied', or omit for fatal error
  timestamp: new Date()
})
```

### Test Mode Commands

To test the error designs locally, type these exact phrases in the chat input:
- **`test-400-error`** — Triggers fatal error scenario (400). Send another message to see that the error persists (conversation broken)
- **`test-timeout-error`** — Triggers timeout error scenario. Send another message to see successful recovery
- **`test-403-error`** — Triggers access denied scenario (403 - temporary service issue). Send another message to see that the service remains unavailable

---

## Testing Checklist

- [ ] Verify "There is a problem" is announced as heading by screen readers
- [ ] Verify "System message at [time]" appears as sender label
- [ ] Verify timeout error shows retry content with "Wait a moment and try sending your message again"
- [ ] Verify timeout error shows "If this keeps happening" section with copy-paste advice
- [ ] Verify fatal error shows "Start a new conversation" link with copy-paste advice
- [ ] Verify 403 error shows "AI assistant is not available" message
- [ ] Verify 403 error explains retrying won't help
- [ ] Verify "Start a new conversation" links work correctly
- [ ] Test with screen reader to confirm heading navigation works
- [ ] Run integration tests: `npm test`

---

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| Semantic h3/h4 headings | WCAG 2.2 1.3.1 and 2.4.6 - helps screen reader users navigate by headings within conversation |
| "System message" as sender | Distinguishes system messages from AI model responses; clearer attribution |
| Three error scenarios | Different errors need different guidance: retry (timeout), not your fault (403), must restart (400) |
| Copy-paste warning | Critical information for all error types - helps users preserve their work |
| 403 content avoids blame | Makes clear it's not the user's fault; avoids technical jargon |
| Assistant text colour | Changed from dark-grey to black for better readability |

---

## Content Design Notes

### Scenario 1: Timeout (can retry)
> **There is a problem**
>
> The response took too long and timed out.
>
> **What you can do**
> - Wait a moment and try sending your message again
> - Try making your message shorter
>
> **If this keeps happening**
>
> You may need to start a new conversation. You will not be able to recover this conversation, so copy any information you want to keep before starting again.

### Scenario 2: Fatal error (400 - must start over)
> **There is a problem**
>
> Something went wrong and we cannot continue this conversation.
>
> You'll need to start a new conversation. You will not be able to recover this conversation, so copy any information you want to keep before starting again.
>
> **What you can do**
> - Start a new conversation

### Scenario 3: Access denied (403 - temporary service issue)
> **There is a problem**
>
> The AI assistant is not available at the moment. This is not a problem with your message.
>
> This is usually a temporary issue with the service. Sending your message again will not fix the problem.
>
> **What you can do**
> - Try again later
> - If you need to use this service urgently, contact your organisation's IT support
>
> You may need to start a new conversation when the service is available again. Copy any information you want to keep before leaving this page.

---

## Accessibility Considerations

- Error panel uses `role="alert"` and `aria-live="polite"` for immediate screen reader announcement
- "There is a problem" is semantic `<h3>` for heading navigation (fits hierarchy below page h1/h2)
- "What you can do" and "If this keeps happening" are `<h4>` for proper hierarchy
- Link text "Start a new conversation" is descriptive and actionable
- Colour contrast meets WCAG 2.2 AA requirements

---

## UI Design Reference

### Timeout Error (can retry)
```
┌─────────────────────────────────────────────────┐
│ There is a problem                              │
│                                                 │
│ The response took too long and timed out.       │
│                                                 │
│ What you can do                                 │
│ • Wait a moment and try sending your message    │
│   again                                         │
│ • Try making your message shorter               │
│                                                 │
│ If this keeps happening                         │
│                                                 │
│ You may need to start a new conversation. You   │
│ will not be able to recover this conversation,  │
│ so copy any information you want to keep before │
│ starting again.                                 │
└─────────────────────────────────────────────────┘
System message at 3:18pm
```

### Fatal Error (400 - must start over)
```
┌─────────────────────────────────────────────────┐
│ There is a problem                              │
│                                                 │
│ Something went wrong and we cannot continue     │
│ this conversation.                              │
│                                                 │
│ You'll need to start a new conversation. You    │
│ will not be able to recover this conversation,  │
│ so copy any information you want to keep before │
│ starting again.                                 │
│                                                 │
│ What you can do                                 │
│ • Start a new conversation                      │
└─────────────────────────────────────────────────┘
System message at 3:18pm
```

### Access Denied Error (403 - temporary service issue)
```
┌─────────────────────────────────────────────────┐
│ There is a problem                              │
│                                                 │
│ The AI assistant is not available at the        │
│ moment. This is not a problem with your message.│
│                                                 │
│ This is usually a temporary issue with the      │
│ service. Sending your message again will not    │
│ fix the problem.                                │
│                                                 │
│ What you can do                                 │
│ • Try again later                               │
│ • If you need to use this service urgently,     │
│   contact your organisation's IT support        │
│                                                 │
│ You may need to start a new conversation when   │
│ the service is available again. Copy any        │
│ information you want to keep before leaving     │
│ this page.                                      │
└─────────────────────────────────────────────────┘
System message at 3:18pm
```
