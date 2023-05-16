#!/bin/bash
set -e

commit=$(git rev-parse --short HEAD)
npm run build
git checkout static
ls | grep -ve dist -e tmp -e .gitignore -e .git -e node_modules | xargs rm -rf
mv dist/* .
sed "s/LOCAL/$commit/" -i *.html
git add -A
git commit -m "Static version update"
git push origin static
git checkout main
