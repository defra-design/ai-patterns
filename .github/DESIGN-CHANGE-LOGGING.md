# Design Change Logging Rules

This document defines how design and frontend changes should be documented to support collaboration between designers, developers, and delivery teams.

---

## Purpose

Change logs help:
- **Developers** understand what changed and what actions they need to take
- **Designers** track design decisions and rationale
- **Delivery teams** update Jira tickets and prepare for assessments
- **GDS assessors** see evidence of iterative design and decision-making

---

## Change History Location

All change log files are stored in: `.github/change-history/`

---

## When to Create a Change Log

Create a new change log file when:
- Starting a new feature or user story
- Making significant design changes
- Completing a sprint's worth of frontend work
- Making changes that affect backend compatibility

---

## File Naming Convention

**Format:** `CHANGES-[YYYY-MM-DD]-[short-description].md`

**Examples:**
- `CHANGES-2024-12-16-feedback-page-updates.md`
- `CHANGES-2024-12-20-homepage-redesign.md`
- `CHANGES-2025-01-10-accessibility-fixes.md`

---

## Required Sections

Each change log file must include:

```markdown
# [Brief title of changes]

**Date:** [DD Month YYYY]  
**Author:** [Name/Role]  
**Related ticket:** [Jira ticket number]

---

## Summary for Jira ticket

<!-- Copy this section directly into the Jira ticket -->

**What changed:**
- [Bullet point summary of user-facing changes]

**Why:**
- [Brief explanation of the reason for changes]

**Testing notes:**
- [Any specific things to test]

---

## Technical changes

### Files changed

| File | Change |
|------|--------|
| `path/to/file` | Brief description |

### Files added

| File | Purpose |
|------|---------|
| `path/to/file` | Brief description |

### Files to delete (cleanup)

| File | Reason |
|------|--------|
| `path/to/file` | Brief description |

---

## Developer actions required

<!-- List any manual steps developers need to take -->

1. [Action item]
2. [Action item]

---

## Testing checklist

- [ ] [Test scenario 1]
- [ ] [Test scenario 2]

---

## Design decisions

<!-- Document any design choices made and why - valuable for GDS assessments -->

- **Decision:** [What was decided]
  - **Rationale:** [Why this approach was chosen]
  - **Alternatives considered:** [What else was considered]
```

---

## Linking to Service Standards

When relevant, note which GDS Service Standard points the changes support:

| Standard | Example changes |
|----------|-----------------|
| **3. Provide a joined up experience** | Navigation, cross-service links |
| **4. Make the service simple to use** | Content design, form simplification |
| **5. Make sure everyone can use the service** | Accessibility improvements |
| **6. Have a multidisciplinary team** | Design/dev collaboration notes |
| **10. Define what success looks like** | Analytics, feedback mechanisms |
| **12. Make new source code open** | Documentation improvements |
| **13. Use and contribute to open standards** | GDS Design System adoption |

---

## File References

- **Frontend rules:** `.github/FRONTEND-RULES.md`
- **Design systems:** `.github/DESIGN-SYSTEMS.md`
- **Change history:** `.github/change-history/`

