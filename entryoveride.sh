#!/usr/bin/env sh
set -e # Abort script at first error
githubRepo="https://github.com/$GITHUB_REPOSITORY"
echo $githubRepo
trufflehog --regex --entropy=True $githubRepo