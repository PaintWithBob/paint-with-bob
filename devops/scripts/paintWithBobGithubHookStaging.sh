#!/bin/bash

# Source our env file
source .env

echo "Using the Github Hook Secret: $GITHUB_HOOK_STAGING"

githubhook --callback=/gitmasterpr --secret=$GITHUB_HOOK_STAGING push:paint-with-bob:refs/heads/master ./restartStaging.sh
