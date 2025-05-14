# Umgebung
Debian Version 12
node -v 20.9.0
npm -v 10.1.0

# Installation
npm i
npm i pm2 -g
nano .env
npm run build
pm2 run "npm run start" --name "Olympia"

# Clean DB
chmod +x node_modules/.bin/prisma
chmod -R 755 node_modules

npx prisma generate
npx tsx prisma/cleanDB.ts
npx prisma migrate deploy

