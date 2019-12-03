#!/usr/bin/env sh
set -e # Abort script at first error
trufflehog --regex --entropy=True https://github.com/edplato/linkCrawl