#!/bin/bash

timestamp=$(date +"%Y-%m-%d_%H:%M:%S")
git pull
git add .
git status
git commit -m "json built at $timestamp" -e
git push
