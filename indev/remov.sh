#!/bin/bash

# Usage: ./remove_av_lines.sh input.txt

FILE="$1"

if [[ -z "$FILE" || ! -f "$FILE" ]]; then
    echo "Usage: $0 <filename>"
    exit 1
fi

# Make a backup first
cp "$FILE" "$FILE.bak"

# Remove lines starting with "AV"
sed -i '/^AV/d' "$FILE"

echo "Removed all lines starting with 'AV'. Backup saved as $FILE.bak"
