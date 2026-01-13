# AICE-177: AI Patterns Playbook Setup

**Date:** 13 January 2026  
**Author:** Interaction Designer  
**Related ticket:** AICE-177

---

## Summary for Jira ticket

<!-- Copy this section directly into the Jira ticket -->

**What changed:**
- Created `defra-ai-patterns` GitHub repository with Astro static site build
- Implemented GDS/Defra-inspired page template using `govuk-frontend` package
- Replaced GDS Transport font with Roboto (open source alternative)
- Removed crown logos; using Defra crest in header
- Created basic landing page with playbook description and navigation cards
- Set up GitHub Pages deployment workflow (via GitHub Action, not gh-deploy branch)
- Implemented security components: SonarCloud, Trivy scanning, Shai-Hulud detection, unpinned dependency check
- Configured `.npmrc` with `save-exact=true` and `ignore-scripts=true`

**Why:**
- Centralised location needed for approved AI patterns so developers can see and apply correct patterns
- Repository can be public (signed off in ADR-003)

**Testing notes:**
- Build site locally with `npm run build`
- Test skip link with keyboard navigation (Tab key)
- Check card components display correctly across breakpoints
- Verify header shows "Defra" with crest (full name in footer)

---

## Technical changes

### Files changed

| File | Change |
|------|--------|
| `src/layouts/Layout.astro` | Updated layout with skip link, simplified header, footer with full department name |
| `src/layouts/MarkdownPost.astro` | Updated markdown post layout styling |
| `src/components/card/Card.astro` | Adopted DfE card pattern for accessibility |
| `src/components/card/CardContainer.astro` | Changed to use `.dfe-grid-container` class |
| `src/pages/index.mdx` | Landing page with lead paragraph and navigation cards |
| `src/pages/use-cases/index.mdx` | Section index with lead paragraph, last updated date |
| `src/pages/technical/index.mdx` | Section index with lead paragraph, last updated date |
| `src/pages/blog/index.mdx` | Blog index with bordered post list styling |
| `src/stylesheets/application.scss` | Added blog post list styling |
| `src/stylesheets/components/card/_card.scss` | DfE card pattern implementation |
| `src/stylesheets/components/header/_header.scss` | Simplified header for "Defra" text |
| `package.json` | Added `@fontsource/roboto` for font replacement |
| `Dockerfile` | Updated for build process |
| `compose.yaml` | Updated for local development |

### Files added

| File | Purpose |
|------|---------|
| `src/stylesheets/components/service-navigation/_service-navigation.scss` | Service navigation component styling |
| `.github/workflows/deploy.yaml` | GitHub Pages deployment via GitHub Action |
| `.github/workflows/scan.yaml` | Trivy and Shai-Hulud security scanning |
| `scripts/shai-hulud-detect.sh` | Detection script for Astro supply-chain protection |
| `scripts/check-unpinned-dependencies.sh` | Checks for unpinned npm dependencies |
| `sonar-project.properties` | SonarCloud configuration |
| `.npmrc` | Security settings (save-exact, ignore-scripts) |

### Files to delete (cleanup)

None required.

---

## Developer actions required

1. Run `npm ci` to install dependencies
2. Run `npm run build` to verify the static site builds correctly
3. Configure SonarCloud following instructions in `sonar-project.properties` comments
4. Enable GitHub Pages in repository settings (deploy from GitHub Action)

---

## Testing checklist

- [ ] Site builds successfully with `npm run build`
- [ ] Skip link appears on keyboard focus (Tab key) and navigates to main content
- [ ] Cards display correctly at mobile, tablet, and desktop widths
- [ ] Card hover and focus states are visible and accessible
- [ ] Header displays "Defra" with crest logo (no crown)
- [ ] Footer displays full department name
- [ ] Roboto font renders correctly (not GDS Transport)
- [ ] Security scans pass in GitHub Actions
- [ ] Lead paragraphs render with correct `govuk-body-l` styling

---

## Design decisions

### Static site technology
- **Decision:** Use Astro (JavaScript-based) rather than Jekyll (Ruby-based)
- **Rationale:** Makes using GDS styling via `govuk-frontend` npm package easier
- **Alternatives considered:** Jekyll (used in previous playbooks)

### Font replacement
- **Decision:** Use Roboto instead of GDS Transport
- **Rationale:** GDS Transport font is only licensed for GOV.UK services; Roboto is open source and has similar clarity
- **Source:** `@fontsource/roboto` package

### Crown logo removal
- **Decision:** Removed crown logos, using Defra crest instead
- **Rationale:** Crown logos are only appropriate for official GOV.UK services; Defra crest provides departmental identity

### Card pattern
- **Decision:** Adopted DfE card pattern rather than custom implementation
- **Rationale:** DfE pattern is well-tested, accessible, and follows GDS principles
- **Source:** https://design.education.gov.uk/design-system/components/card

### Header abbreviation
- **Decision:** Use "Defra" abbreviation in header, full name in footer
- **Rationale:** Reduces header height, improves mobile experience and accessibility while maintaining clarity

### Deployment approach
- **Decision:** Deploy via GitHub Action rather than gh-deploy branch
- **Rationale:** More control over build process; follows modern CI/CD practices

### Security hardening
- **Decision:** Implement multiple security layers (SonarCloud, Trivy, Shai-Hulud, unpinned checks, npmrc)
- **Rationale:** Protects against supply-chain attacks; follows Defra security standards

---

## Known issues and future work

### Navigation duplication
- **Issue:** Navigation is currently repeated in tabs and cards on the front page
- **Status:** Acknowledged but not resolved
- **Rationale:** Without content or established user needs, premature to invest in navigation design. Will revisit once content strategy is clearer.

### Content placeholder
- **Issue:** Minimal content on landing page and section pages
- **Status:** Intentional - awaiting content and user research
- **Rationale:** Focus of this ticket is infrastructure setup; content will follow in subsequent tickets

---

## Service Standard alignment

| Standard | How this work supports it |
|----------|---------------------------|
| **5. Make sure everyone can use the service** | Skip link, DfE accessible card pattern, keyboard navigation support |
| **12. Make new source code open** | Public repository (ADR-003), clear documentation |
| **13. Use and contribute to open standards** | GDS Design System adoption via `govuk-frontend` |

---

## Acceptance criteria checklist

| AC | Status | Notes |
|----|--------|-------|
| GitHub repository called defra-ai-patterns created | ✅ | Repository established |
| Playbook can be built as a static site | ✅ | `npm run build` creates `dist/` |
| Uses a GDS/Defra inspired page template | ✅ | `govuk-frontend` package, Defra crest |
| GDS Transport font replaced | ✅ | Using Roboto |
| No crown logos | ✅ | Removed, using Defra crest |
| Basic landing page created | ✅ | Description and navigation cards |
| Site deployed onto GitHub Pages | ⏳ | Workflow ready, pending enable in settings |
| SonarCloud | ✅ | Configured in sonar-project.properties |
| Trivy scanning | ✅ | scan.yaml workflow |
| Shai-Hulud detection script | ✅ | scripts/shai-hulud-detect.sh |
| Unpinned dependency check | ✅ | scripts/check-unpinned-dependencies.sh |
| .npmrc with save-exact and ignore-scripts | ✅ | Configured |
