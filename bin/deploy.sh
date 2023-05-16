#!/bin/bash
set -e

commit=$(git rev-parse --short HEAD)
echo "Deploying release $commit ..."
echo "VITE_RELEASE=$commit" > .env
npm run build
rm .env
git checkout static
ls | grep -ve dist -e tmp -e .gitignore -e .git -e node_modules | xargs rm -rf
mv dist/* .
git add -A
git commit -m "Static version update"
git push origin static
git checkout main
