# Copy branch files to another repository

## When to use

When you need to copy all files from a branch in one repository to a new branch in a different repository.

## Prerequisites

- You have two separate git repositories
- You're on the source branch you want to copy from
- The target repository should be empty (or you've cleared the files you want to replace)

## Steps

**1. Create a new branch in the target repository:**

```bash
cd /path/to/target-repo
git checkout -b BRANCH-NAME
```

**2. Copy all files from the source repository (excluding git history):**

```bash
cd /path/to/source-repo
rsync -av --exclude='.git' ./ /path/to/target-repo/
```

**3. Stage and commit the files in the target repository:**

```bash
cd /path/to/target-repo
git add .
git commit -m "Copy files from source-repo BRANCH-NAME branch"
```

## Notes

- The `rsync` command copies all files while preserving folder structure
- `--exclude='.git'` ensures you don't overwrite the target repo's git history
- The `-av` flags mean archive mode (preserves permissions) and verbose output

## Example

To copy the `AICE-design` branch from `ai-defra-search-frontend` to `ai-patterns`:

```bash
# Step 1: Create branch in target
cd /Users/anneequalexperts/Documents/GitHub/ai-patterns
git checkout -b AICE-design

# Step 2: Copy files from source
cd /Users/anneequalexperts/Documents/GitHub/ai-defra-search-frontend
rsync -av --exclude='.git' ./ /Users/anneequalexperts/Documents/GitHub/ai-patterns/

# Step 3: Commit in target
cd /Users/anneequalexperts/Documents/GitHub/ai-patterns
git add .
git commit -m "Copy files from ai-defra-search-frontend AICE-design branch"
```
