#!/bin/bash

# Usage: ./prepend_00.sh input.txt

FILE="$1"

if [[ -z "$FILE" || ! -f "$FILE" ]]; then
    echo "Usage: $0 <filename>"
    exit 1
fi

# Backup the original
cp "$FILE" "$FILE.bak"

# Prepend "00:" to each line
sed -i 's/^/00:/' "$FILE"

echo 'Prepended "00:" to each line. Backup saved as '"$FILE.bak"
