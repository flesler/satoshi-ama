#!/bin/bash
set -e

npm run build
git checkout static
ls | grep -ve dist -e tmp -e .gitignore -e .git -e node_modules | xargs rm -rf
mv dist/* .
git add -A
git commit -m "Static version update"
git push origin static
git checkout main
