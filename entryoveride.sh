#!/usr/bin/env sh
set -e # Abort script at first error
trufflehog --regex --entropy=False $GITHUB_WORKSPACE