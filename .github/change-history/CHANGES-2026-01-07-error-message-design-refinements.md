# Change Log: Error Message Design Refinements

**Date:** 2026-01-07  
**Ticket:** AICE-234  
**Author:** AI Assistant

---

## Summary for Jira Ticket

Refined the error message design in the conversation component based on design review:
- Removed warning icon from error messages for cleaner visual presentation
- Changed "There is a problem" to semantic h3 for improved screen reader navigation
- Removed "contact support with error code" text (out of scope for first iteration)
- Changed sender label from "Error" to "System message" for clearer attribution
- Added three error scenarios: timeout (retry possible), fatal error (must start over), and access denied (service unavailable)
- Added copy-paste warning for all error types to help users preserve their work
- Changed "What you can do" from bold text to h4 heading for better hierarchy
- Enhanced test mode to demonstrate recovery/retry behaviour for all three scenarios

---

## Technical Changes

### Files Changed

| File | Change |
|------|--------|
| `src/server/common/components/conversation/template.njk` | Redesigned error message block with h3, removed icon, updated content for two scenarios |
| `src/client/stylesheets/components/conversation/_conversation.scss` | Removed icon styling (`.app-error-message__header` and `.app-error-message__icon`) |

### Files to Delete

None.

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

- [ ] Verify error message displays without warning icon
- [ ] Verify "There is a problem" is announced as heading by screen readers
- [ ] Verify "System message at [time]" appears as sender label
- [ ] Verify timeout error shows retry content with "Wait a moment and try sending your message again"
- [ ] Verify timeout error shows "if this keeps happening" warning with copy-paste advice
- [ ] Verify fatal error shows "Start a new conversation" link with copy-paste advice
- [ ] Verify 403 error shows "AI service is not available" message
- [ ] Verify 403 error explains retrying won't help
- [ ] Verify "Start a new conversation" links work correctly
- [ ] Verify no "contact support with error code" text appears
- [ ] Test with screen reader to confirm heading navigation works
- [ ] Run integration tests: `npm test`

---

## Design Decisions

| Decision | Rationale |
|----------|-----------|
| Removed warning icon | Cleaner visual design; the red border and heading already indicate an error |
| Semantic h3 heading | WCAG 2.2 1.3.1 and 2.4.6 - helps screen reader users navigate by headings within conversation |
| "System message" as sender | Distinguishes system messages from AI model responses; clearer attribution than "Error" |
| Three error scenarios | Different errors need different guidance: retry (timeout), not your fault (403), must restart (400) |
| Removed error code | Out of scope for MVP; simplifies the user interface |
| Copy-paste warning | Critical information for all error types - helps users preserve their work |
| "What you can do" as h4 | Proper heading hierarchy (h1→h2→h3→h4) and improves navigation for screen reader users |
| 403 content avoids blame | Makes clear it's not the user's fault; avoids technical jargon like "IAM permissions" |
| Assistant text colour | Fixed from dark-grey to black for better readability |

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

- Error panel retains `role="alert"` and `aria-live="polite"` for immediate screen reader announcement
- "There is a problem" is now semantic `<h3>` for heading navigation (fits hierarchy below page h1/h2)
- Link text "Start a new conversation" is descriptive and actionable
- Colour contrast continues to meet WCAG 2.2 AA requirements

---

## UI Design Reference (Updated)

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
│ moment. This is not a problem with your message.        │
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


