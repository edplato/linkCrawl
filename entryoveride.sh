#!/usr/bin/env sh
set -e # Abort script at first error
trufflehog --regex --entropy=False --since_commit $GITHUB_SHA $GITHUB_WORKSPACE