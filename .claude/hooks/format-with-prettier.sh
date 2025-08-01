#!/bin/bash

# Prettier formatting hook for Claude Code
# This hook runs after Write/Edit operations to format code

# Read the JSON input from stdin
input=$(cat)

# Extract the file path from the JSON input using basic text processing
# Look for "file_path": "..." pattern
file_path=$(echo "$input" | grep -o '"file_path":[[:space:]]*"[^"]*"' | sed 's/"file_path":[[:space:]]*"//; s/"$//')

# If that didn't work, try alternative patterns
if [ -z "$file_path" ]; then
    file_path=$(echo "$input" | grep -o '"path":[[:space:]]*"[^"]*"' | sed 's/"path":[[:space:]]*"//; s/"$//')
fi

# If still no file path, exit gracefully
if [ -z "$file_path" ]; then
    exit 0
fi

# Check if the file exists
if [ ! -f "$file_path" ]; then
    exit 0
fi

# Get file extension
extension="${file_path##*.}"

# Define extensions that Prettier should format
case "$extension" in
    js|jsx|ts|tsx|json|css|scss|md|html|yaml|yml)
        # Check if file is in node_modules or other directories to skip
        if [[ "$file_path" == *"node_modules"* ]] || \
           [[ "$file_path" == *".next"* ]] || \
           [[ "$file_path" == *"dist"* ]] || \
           [[ "$file_path" == *"build"* ]]; then
            exit 0
        fi
        
        # Format with Prettier
        echo "🎨 Formatting $file_path with Prettier..." >&2
        
        # Use pnpm exec to run prettier (respects your package.json)
        if command -v pnpm >/dev/null 2>&1; then
            pnpm exec prettier --write "$file_path" 2>/dev/null
        elif command -v npx >/dev/null 2>&1; then
            npx prettier --write "$file_path" 2>/dev/null
        else
            # Fallback to global prettier if available
            if command -v prettier >/dev/null 2>&1; then
                prettier --write "$file_path" 2>/dev/null
            fi
        fi
        ;;
    *)
        # Skip files that Prettier doesn't handle
        exit 0
        ;;
esac

exit 0