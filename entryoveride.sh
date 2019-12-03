#!/usr/bin/env sh
set -e # Abort script at first error
echo 'test override'
trufflehog --regex --entropy=False $GITHUB_WORKSPACE