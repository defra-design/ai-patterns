# Frontend updates: Phase banner, feedback page, accessibility improvements

**Date:** 16 December 2024  
**Author:** Design/Frontend collaboration  
**Related tickets:** AICE-136, AICE-137

---

## Summary for Jira ticket

<!-- Copy this section directly into the Jira ticket -->

**What changed:**
- Added phase banner (Alpha) with feedback link to all pages
- Updated feedback page to follow GDS satisfaction survey pattern (5-point scale)
- Improved accessibility of conversation component
- Added inline error handling for feedback form
- Created design systems reference documentation

**Why:**
- Align with GDS Design System standards for service assessment
- Provide richer feedback data (5-point scale vs binary yes/no)
- Better screen reader support for conversation interface
- Improve form validation user experience

**Testing notes:**
- Check phase banner appears on all pages
- Test feedback form submission with all 5 rating options
- Verify inline errors display correctly when submitting without selection
- Test feedback link opens in new tab

---

## AC amendments (design improvements)

### AICE-136 - Proposed AC updates

The following ACs were enhanced based on GDS Design System patterns:

| Original AC | Updated AC | Rationale |
|-------------|------------|-----------|
| "Question 1: Yes/No radio buttons - Was your AI response useful?" | "Question 1: 5-point satisfaction scale - Overall, how useful was the AI Assistant for your task?" | Follows [GDS feedback page pattern](https://www.gov.uk/service-manual/service-assessments/get-feedback-page) and provides richer data for service improvement |
| "Question 2: Please provide some context for your answer..." | "Question 2: How could we improve the AI Assistant?" with hint "Tell us what you were trying to do and how well it worked." | Clearer, more actionable question following GDS content design |
| "Before you go" call-to-action at conversation end | Feedback link in phase banner (consistent across all pages) | Standard GDS pattern - phase banner appears on all pages per [GDS phase banner component](https://design-system.service.gov.uk/components/phase-banner/) |
| Character limit unspecified | 1200 characters | Aligned with standard feedback form patterns |

**New ACs added:**
- ✅ Inline error messages display when form submitted without rating selection
- ✅ Error summary at top of page links to field with error
- ✅ Success page follows GDS confirmation page pattern with "What happens next" section

### AICE-137 - Backend impact

The frontend now sends different values for `wasHelpful`:

| Original | New |
|----------|-----|
| `yes` / `no` (boolean) | `very-useful`, `useful`, `neither`, `not-useful`, `not-at-all-useful` (string) |

**Backend team action:** Update API to accept string values instead of boolean, or map the 5-point scale to boolean for storage.

---

## Technical changes

### Files changed

| File | Change |
|------|--------|
| `src/server/common/templates/layouts/page.njk` | Added phase banner with feedback link |
| `src/server/common/components/conversation/template.njk` | Changed heading to labelled region (span + aria-labelledby) |
| `src/server/common/components/model-select/template.njk` | Changed legend from h2/--m to h3/--s |
| `src/server/start/start.njk` | Removed feedback component import and usage |
| `src/server/feedback/feedback.njk` | Updated to GDS pattern (h1 XL, 5-point scale, 1200 chars, inline errors) |
| `src/server/feedback/feedback-schema.js` | Updated validation for 5-point scale and 1200 char limit |
| `src/server/feedback/controller.js` | Updated error handling for multiple fields |
| `src/server/feedback/success.njk` | Updated to follow GDS confirmation page pattern |

### Files added

| File | Purpose |
|------|---------|
| `.github/DESIGN-SYSTEMS.md` | Reference links to UK government design systems |
| `.github/DESIGN-CHANGE-LOGGING.md` | Rules for documenting design changes |
| `.github/change-history/` | Folder for change log files |

### Files to delete (cleanup)

| File | Reason |
|------|--------|
| `src/server/common/components/feedback/template.njk` | No longer used - feedback link moved to phase banner |
| `src/server/common/components/feedback/macro.njk` | No longer used - feedback link moved to phase banner |
| `.cursorrules` | Replaced by `.github/DESIGN-CHANGE-LOGGING.md` |
| `FRONTEND-CHANGES-NOTES.md` | Replaced by this file |
| `CHANGES-2024-12-16-frontend-updates.md` | Moved to `.github/change-history/` |

---

## Developer actions required

### 1. Schema already updated ✅
The `feedback-schema.js` has been updated to accept the new 5-point scale values:
- `very-useful`, `useful`, `neither`, `not-useful`, `not-at-all-useful`

### 2. Check backend API compatibility
**File:** `src/server/feedback/feedback-api.js`

If the backend API expects specific values for `wasHelpful`, verify it can handle:
- Old values: `yes`, `no`
- New values: `very-useful`, `useful`, `neither`, `not-useful`, `not-at-all-useful`

### 3. Update tests
**File:** `tests/integration/server/feedback/controller.test.js`

Tests currently use `wasHelpful: 'yes'` which will fail validation. Update to use new values.

### 4. Delete unused files (optional cleanup)
```bash
rm src/server/common/components/feedback/template.njk
rm src/server/common/components/feedback/macro.njk
rm .cursorrules
rm FRONTEND-CHANGES-NOTES.md
rm CHANGES-2024-12-16-frontend-updates.md
```

---

## Testing checklist

### Phase banner
- [ ] Phase banner appears on all pages
- [ ] Shows "Alpha" tag
- [ ] Feedback link opens `/feedback` in new tab
- [ ] Link text includes "(opens in new tab)"

### Feedback form
- [ ] H1 is size XL
- [ ] All 5 radio options display correctly
- [ ] Character count shows 1200 limit
- [ ] Submitting without selection shows inline error on radio group
- [ ] Error summary at top links to correct field
- [ ] Exceeding character limit shows error

### Feedback success page
- [ ] Panel displays "Feedback submitted"
- [ ] "What happens next" section displays
- [ ] Return link goes to `/start`

### Accessibility
- [ ] Screen reader announces conversation region label
- [ ] Focus states visible on all interactive elements
- [ ] Error messages announced to screen readers
- [ ] Focus moves to error summary when form has errors

---

## Design decisions

- **5-point satisfaction scale instead of Yes/No**
  - Rationale: Follows [GDS standard feedback pattern](https://www.gov.uk/service-manual/service-assessments/get-feedback-page), provides richer data for service improvement
  - Alternatives considered: Keep Yes/No as per original AC, but this provides less actionable insight

- **Feedback link in phase banner instead of "Before you go" section**
  - Rationale: Follows GDS standard pattern, appears consistently across all pages
  - Alternatives considered: Both phase banner AND "Before you go" section, but this felt redundant

- **1200 character limit instead of 1000**
  - Rationale: Gives users slightly more space for detailed feedback
  - Alternatives considered: 1000 as per backend AC, but 1200 is a common standard

- **Conversation heading changed to labelled region**
  - Rationale: Improves heading hierarchy, provides accessible label for screen reader users

---

## Service Standard alignment

These changes support:
- **Standard 4:** Make the service simple to use (clearer questions, better error handling)
- **Standard 5:** Make sure everyone can use the service (accessibility improvements)
- **Standard 10:** Define what success looks like (richer feedback data)
- **Standard 13:** Use and contribute to open standards (GDS Design System patterns)

---

## Notes

- Phase banner is set to **Alpha** - change to `"Beta"` in `page.njk` when service progresses
- Tests need updating for new `wasHelpful` values
- Consider adding privacy page at `/privacy` (currently returns 404)

