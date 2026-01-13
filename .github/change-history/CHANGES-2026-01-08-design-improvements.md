# Design Improvements - 8 January 2026

## Summary for Jira ticket

Implemented design improvements following GDS principles and DfE card pattern. Changes include: new accessible card component, simplified header (Defra abbreviation), skip link for accessibility, lead paragraphs instead of blockquotes, and removal of notification banners. Full department name now appears in footer.

---

## Technical changes

### Files changed

| File | Change type | Description |
|------|-------------|-------------|
| `src/stylesheets/components/card/_card.scss` | Modified | Replaced custom card styles with DfE card pattern |
| `src/stylesheets/components/header/_header.scss` | Modified | Simplified header for single-line "Defra" text |
| `src/components/card/Card.astro` | Modified | Updated to use DfE card markup structure |
| `src/components/card/CardContainer.astro` | Modified | Changed to use `.dfe-grid-container` class |
| `src/layouts/Layout.astro` | Modified | Added skip link, simplified header, updated footer |
| `src/pages/index.mdx` | Modified | Changed intro to lead paragraph, fixed typo |
| `src/pages/use-cases/index.mdx` | Modified | Removed back link, lead paragraph, last updated date |
| `src/pages/technical/index.mdx` | Modified | Removed back link, lead paragraph, last updated date |
| `src/pages/blog/index.mdx` | Modified | Removed back link, lead paragraph, bordered post list |
| `src/stylesheets/application.scss` | Modified | Added blog post list styling |

### Files added

None

### Files to delete

None

---

## Developer actions required

1. Run `npm run build` to verify SCSS compiles correctly
2. Test skip link functionality with keyboard navigation
3. Review card styling in browser across breakpoints

---

## Testing checklist

- [ ] Skip link appears on keyboard focus (Tab key)
- [ ] Skip link navigates to main content
- [ ] Cards display correctly at mobile, tablet, and desktop widths
- [ ] Card hover states work correctly
- [ ] Card focus states are visible
- [ ] Header displays "Defra" with crest logo
- [ ] Footer displays full department name
- [ ] Last updated date displays correctly on index pages
- [ ] Lead paragraphs render with correct `govuk-body-l` styling

---

## Design decisions

### Card pattern
- **Decision:** Adopted DfE card pattern rather than custom implementation
- **Rationale:** DfE pattern is well-tested, accessible, and follows GDS principles
- **Source:** https://design.education.gov.uk/design-system/components/card

### Card border colour
- **Decision:** Changed from `#dcdcdc` to `$govuk-border-colour` (GDS mid-grey)
- **Rationale:** Meets WCAG 2.2 AA contrast ratio of 3:1 for non-text elements

### Header abbreviation
- **Decision:** Use "Defra" instead of full three-line department name
- **Rationale:** Reduces header height, improves mobile experience. Full name appears in footer and page content for clarity.

### Back links removed from index pages
- **Decision:** Removed back links from Use cases and Technical index pages
- **Rationale:** Service navigation tabs provide sufficient wayfinding; back links redundant

### Lead paragraphs
- **Decision:** Changed blockquotes to `govuk-body-l` lead paragraphs
- **Rationale:** Lead paragraphs are the correct GDS pattern for introductory text

### Notification banners replaced
- **Decision:** Replaced notification banners with simple paragraph for empty states
- **Rationale:** Notification banners should only be used for important time-sensitive information, not empty content states

### Last updated date
- **Decision:** Added "Last updated" date to section index pages
- **Rationale:** Follows GDS guidance page pattern; helps users understand content currency

### Blog post list styling
- **Decision:** Changed blog posts from tag-based date display to bordered list with meta text and "Read this post" links
- **Rationale:** More scannable layout; follows common blog index pattern; clearer call-to-action
