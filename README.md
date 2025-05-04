# Clean DB
<Optional Preperation>
npm install ts-node --save-dev
npm install -g ts-node
npm install typescript --save-dev
<Execute as Admin>
cd ./olympia
chmod +x node_modules/.bin/prisma
chmod -R 755 node_modules

npx prisma generate
npx tsx prisma/cleanDB.ts
npx prisma migrate deploy

