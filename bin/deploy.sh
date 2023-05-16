#!/bin/bash
set -e

commit=$(git rev-parse --short HEAD)
echo "Deploying release $commit ..."
echo "VITE_RELEASE=$commit" > .env

if [[ "$1" == "--cache" ]]; then
  curl -sS http://localhost:3000/qas > src/store/qas.json
fi
npm run build
git checkout -- src/store/qas.json
rm .env
git checkout static
ls | grep -ve dist -e tmp -e .gitignore -e .git -e node_modules | xargs rm -rf
mv dist/* .
git add -A
git commit -m "Static version update"
git push origin static
git checkout main
