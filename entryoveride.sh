#!/usr/bin/env sh
set -e # Abort script at first error
th=trufflehog --regex --entropy DO_ENTROPY $GITHUB_WORKSPACE
echo "$th"