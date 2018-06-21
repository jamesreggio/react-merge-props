#!/bin/bash

set -e

# Ensure branch is clean
if [[ ! -z $(git status -s) ]]; then
  echo "Tree has uncomitted changes"
  exit -1
fi

# Ensure version isn't already taken
VERSION=$(node -e "console.log(require('./package.json').version)")

if git tag | grep -q "v$VERSION"; then
  echo "Version $VERSION already exists"
  exit -1
fi

# Generate unique branch name
LAST_BRANCH=$(git rev-parse --symbolic-full-name --abbrev-ref HEAD)
NEXT_BRANCH=release-$RANDOM

git checkout --orphan $NEXT_BRANCH
git reset

yarn run build

rm *.config.js
rm release.sh
rm -rf src

git add -A
git commit -m "Release $VERSION"
git tag "v$VERSION"

git checkout $LAST_BRANCH
git branch -D $NEXT_BRANCH

echo "Created release tag v$VERSION"
