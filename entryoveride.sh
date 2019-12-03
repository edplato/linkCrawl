#!/usr/bin/env sh
set -e # Abort script at first error
githubRepo="https://github.com/$GITHUB_REPOSITORY"
trufflehog --regex --entropy=False --max_depth=5 $githubRepo