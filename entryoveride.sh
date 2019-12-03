#!/usr/bin/env sh
set -e # Abort script at first error
trufflehog --regex --entropy DO_ENTROPY $GITHUB_WORKSPACE