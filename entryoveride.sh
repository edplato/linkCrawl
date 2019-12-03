#!/usr/bin/env sh
set -e # Abort script at first error
trufflehog --regex --since_commit $GITHUB_SHA $GITHUB_WORKSPACE