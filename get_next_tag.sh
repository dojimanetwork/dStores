#!/bin/bash

# Exit on error
set -e

# Check if increment type is provided
if [ -z "$1" ]; then
    echo "Error: Increment type not provided"
    echo "Usage: $0 [major|minor|patch]"
    exit 1
fi

INCREMENT_TYPE=$1

# Validate increment type
if [[ ! "$INCREMENT_TYPE" =~ ^(major|minor|patch)$ ]]; then
    echo "Error: Invalid increment type '$INCREMENT_TYPE'"
    echo "Usage: $0 [major|minor|patch]"
    exit 1
fi

# Fetch tags from the remote repository
git fetch --tags 2>/dev/null || true

# Get the latest tag, default to 0.0.0 if no tags exist
latest_tag=$(git describe --tags --abbrev=0 2>/dev/null || echo "0.0.0")

# Remove 'v' prefix if it exists
latest_tag=${latest_tag#v}

# Validate tag format
if ! [[ $latest_tag =~ ^[0-9]+\.[0-9]+\.[0-9]+$ ]]; then
    echo "Error: Invalid tag format '$latest_tag'. Expected format: X.Y.Z"
    exit 1
fi

# Split the version into major, minor, and patch parts
IFS='.' read -r -a parts <<< "$latest_tag"
major=${parts[0]}
minor=${parts[1]}
patch=${parts[2]}

# Validate version numbers are integers
if ! [[ "$major" =~ ^[0-9]+$ ]] || ! [[ "$minor" =~ ^[0-9]+$ ]] || ! [[ "$patch" =~ ^[0-9]+$ ]]; then
    echo "Error: Version numbers must be integers"
    exit 1
fi

# Increment the version based on the provided type
case "$INCREMENT_TYPE" in
    major)
        ((major++))
        minor=0
        patch=0
        ;;
    minor)
        ((minor++))
        patch=0
        ;;
    patch)
        ((patch++))
        ;;
esac

# Create new tag
new_tag="$major.$minor.$patch"

# Output the new tag
echo "$new_tag" 