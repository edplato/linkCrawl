#!/usr/bin/env sh
set -e # Abort script at first error
echo $GITHUB_WORKSPACE
ls $GITHUB_WORKSPACE
trufflehog --regex --entropy=True $GITHUB_WORKSPACE