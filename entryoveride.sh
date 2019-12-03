#!/bin/bash -l

set -e # Abort script at first error
set -u # nounset - Attempt to use undefined variable outputs error message, and forces an exit
# set -x # verbose (expands commands)

gitleaks -v --exclude-forks --redact --threads=1 \
  --branch=$GITHUB_REF \
  --repo-path=$GITHUB_WORKSPACE \
  --commit=$GITHUB_SHA \