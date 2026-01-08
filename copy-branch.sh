#!/bin/bash

# Copy branch files to another repository
# This script copies all files (excluding .git) from a source branch to a new branch in a target repo

set -e  # Exit on any error

# Default paths - update these if your repos move
DEFAULT_SOURCE_REPO="/Users/anneequalexperts/Documents/GitHub/defra-ai-patterns"
DEFAULT_TARGET_REPO="/Users/anneequalexperts/Documents/GitHub/ai-patterns"

echo "================================================"
echo "Copy Branch to Another Repository"
echo "================================================"
echo ""

# Confirm source repo
read -p "Source repo [$DEFAULT_SOURCE_REPO]: " SOURCE_REPO
SOURCE_REPO="${SOURCE_REPO:-$DEFAULT_SOURCE_REPO}"

# Check source repo exists
if [ ! -d "$SOURCE_REPO/.git" ]; then
    echo "Error: Source repo not found at $SOURCE_REPO"
    exit 1
fi

# Confirm target repo
read -p "Target repo [$DEFAULT_TARGET_REPO]: " TARGET_REPO
TARGET_REPO="${TARGET_REPO:-$DEFAULT_TARGET_REPO}"

# Check target repo exists
if [ ! -d "$TARGET_REPO/.git" ]; then
    echo "Error: Target repo not found at $TARGET_REPO"
    exit 1
fi

echo ""

# Get source branch name
cd "$SOURCE_REPO"
CURRENT_BRANCH=$(git branch --show-current)
read -p "Source branch to copy FROM [$CURRENT_BRANCH]: " SOURCE_BRANCH
SOURCE_BRANCH="${SOURCE_BRANCH:-$CURRENT_BRANCH}"

# Check source branch exists
if ! git show-ref --verify --quiet "refs/heads/$SOURCE_BRANCH"; then
    echo "Error: Branch '$SOURCE_BRANCH' does not exist in source repo"
    exit 1
fi

# Get target branch name
read -p "Target branch to copy TO (will be created): " TARGET_BRANCH

if [ -z "$TARGET_BRANCH" ]; then
    echo "Error: Target branch name is required"
    exit 1
fi

echo ""
echo "================================================"
echo "Summary"
echo "================================================"
echo "Source repo:   $SOURCE_REPO"
echo "Source branch: $SOURCE_BRANCH"
echo "Target repo:   $TARGET_REPO"
echo "Target branch: $TARGET_BRANCH (new)"
echo "================================================"
echo ""

read -p "Proceed? (y/n): " CONFIRM
if [ "$CONFIRM" != "y" ] && [ "$CONFIRM" != "Y" ]; then
    echo "Cancelled."
    exit 0
fi

echo ""
echo "Step 1: Checking out source branch..."
cd "$SOURCE_REPO"
git checkout "$SOURCE_BRANCH"

echo ""
echo "Step 2: Creating new branch in target repo..."
cd "$TARGET_REPO"
git checkout -b "$TARGET_BRANCH"

echo ""
echo "Step 3: Copying files..."
rsync -av --exclude='.git' "$SOURCE_REPO/" "$TARGET_REPO/"

echo ""
echo "Step 4: Staging files..."
cd "$TARGET_REPO"
git add .

echo ""
echo "Step 5: Committing..."
git commit -m "Copy files from $(basename $SOURCE_REPO) $SOURCE_BRANCH branch"

echo ""
echo "================================================"
echo "Done!"
echo "================================================"
echo "Files copied to: $TARGET_REPO"
echo "New branch: $TARGET_BRANCH"
echo ""
echo "Next steps:"
echo "  cd $TARGET_REPO"
echo "  git push -u origin $TARGET_BRANCH"
echo "================================================"
