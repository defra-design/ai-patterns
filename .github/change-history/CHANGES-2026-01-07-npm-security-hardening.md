# NPM Security Hardening

**Date:** 2026-01-07  
**Type:** Security improvement

---

## Summary for Jira ticket

Added NPM security guidance to cursor rules and fixed an unpinned dependency. These changes protect against npm supply-chain attacks by ensuring all dependencies use exact versions and documenting security practices for the team.

---

## Technical changes

### Files changed

| File | Change |
|------|--------|
| `package.json` | Removed caret (`^`) from `tmp` dependency in overrides section |
| `.cursorrules` | Added NPM Security section with guidance |

### Files already in place (no change needed)

| File | Purpose |
|------|---------|
| `.npmrc` | Contains `ignore-scripts=true` and `save-exact=true` settings |

---

## Developer actions required

1. **Pull latest changes** to get the updated `.cursorrules` and `package.json`
2. **Delete `node_modules` and reinstall** if you want to ensure clean state:
   ```bash
   rm -rf node_modules
   npm install --ignore-scripts
   ```

---

## Testing checklist

- [ ] Confirm `.npmrc` file exists with correct settings
- [ ] Verify no `^` or `~` symbols in package.json dependencies
- [ ] Run `npm install --ignore-scripts` successfully
- [ ] Application runs normally after reinstall

---

## Design decisions

### Why both `.npmrc` and cursor rules?

- **`.npmrc`** provides **technical enforcement** - npm will automatically use these settings
- **`.cursorrules`** provides **awareness** - AI tools and team members are reminded of security practices

### Why pin exact versions?

Unpinned versions (with `^` or `~`) allow npm to automatically pull newer minor/patch versions. If a package is compromised and a malicious version is published, unpinned dependencies could automatically pull that version.

### Reference

Based on guidance from senior developer regarding npm malware protection measures.

