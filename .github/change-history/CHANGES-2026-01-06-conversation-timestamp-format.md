# Conversation timestamp format update

**Date:** 06 January 2026  
**Author:** Interaction Designer  
**Related ticket:** AICE-???

---

## Summary for Jira ticket

<!-- Copy this section directly into the Jira ticket -->

**What changed:**
- Updated timestamp format in the conversation component from full date/time to a friendlier time-only format
- Changed "AI Assistant" label to "AI assistant" (sentence case)

**Why:**
- Improved readability - users don't need the full date when viewing a current conversation
- Consistent with GDS content design guidelines (sentence case for labels)

**Testing notes:**
- Check timestamps display correctly for both user and assistant messages
- Verify AM/PM times display in lowercase (e.g., "10:59pm" not "10:59PM")

---

## Technical changes

### Files changed

| File | Change |
|------|--------|
| `src/server/common/components/conversation/template.njk` | Updated timestamp format from `yyyy-MM-dd HH:mm:ss` to `h:mmaaa`, changed label case |

### Files added

None.

### Files to delete (cleanup)

None.

---

## Developer actions required

<!-- List any manual steps developers need to take -->

1. Pull latest changes from branch
2. No additional configuration required - changes are template-only

---

## Testing checklist

- [ ] User messages show timestamp as "You at [time]" (e.g., "You at 10:59pm")
- [ ] Assistant messages show timestamp as "AI assistant (Model Name) at [time]"
- [ ] Times display in 12-hour format with lowercase am/pm
- [ ] Timestamps update correctly for new messages sent

---

## Design decisions

- **Decision:** Use time-only format instead of full date/time
  - **Rationale:** Conversations are typically viewed in the current session, so the date adds visual noise without value. The simpler format improves scannability.
  - **Alternatives considered:** Relative timestamps ("2 minutes ago") were considered but rejected as they require JavaScript to stay updated and can be confusing.

- **Decision:** Use sentence case for "AI assistant" label
  - **Rationale:** Aligns with GDS content design guidelines which recommend sentence case. Consistent with how other labels appear in GOV.UK services.
  - **Alternatives considered:** Title case ("AI Assistant") was the existing format but doesn't follow GDS conventions.

---

## GDS Service Standards supported

| Standard | How this change supports it |
|----------|----------------------------|
| **4. Make the service simple to use** | Cleaner, more readable timestamp format |
| **5. Make sure everyone can use the service** | Simpler text is easier to read for users with cognitive accessibility needs |
| **13. Use and contribute to open standards** | Follows GDS content design conventions |
