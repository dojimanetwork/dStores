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

# Function to get latest tag with error handling
get_latest_tag() {
    # Try to fetch tags with authentication
    if ! git fetch --tags 2>/dev/null; then
        echo "Warning: Could not fetch tags from remote. Using local tags only."
    fi

    # Try to get the latest tag
    local tag
    tag=$(git describe --tags --abbrev=0 2>/dev/null || echo "0.0.0")
    
    # If no tags found, return default
    if [ "$tag" = "0.0.0" ]; then
        echo "0.0.0"
        return 0
    fi

    # Remove 'v' prefix if it exists
    tag=${tag#v}
    echo "$tag"
}

# Get the latest tag
latest_tag=$(get_latest_tag)

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