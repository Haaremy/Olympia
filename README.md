# Umgebung
Debian Version 12
node -v 20.9.0
npm -v 10.1.0

# Installation
npm i
npm i pm2 -g
nano .env
´´´
# .env.production
NEXTAUTH_URL=<URL zum Server>
NEXTAUTH_SECRET=<generate Seceret>

# Database configuration (example)
DATABASE_URL="file:./dev.db"
#DIRECT_URL=<URL zum Datenbank Server, falls vorhanden>

# Security headers
SECURE_COOKIES=true
COOKIE_DOMAIN=<Domain>
´´´
# Deploy on Linux
npm i
-> clean DB
npm run build
pm2 run "npm run start" --name "Olympia"

# Develop in Android Studio
npx next build
npx cap copy
npx cap sync
npx cap open android
build.gradle (Module App) -> Versions Code ++

# Clean DB
chmod +x node_modules/.bin/prisma
chmod -R 755 node_modules

npx prisma generate
npx tsx prisma/cleanDB.ts
npx prisma migrate deploy



## Game Entries Tags:
|Tag|Beschreibung|
|lowest|Weltrekord filter nach niedrigstem Wert.|
|field1|Weltrekord filter relavantes Feld.|
|:unit:sec:unit:|Weltrekord Einheit des Rekords: Sekunden|
|overridePlayers|Zeigt alle Einträge-Felder unabhängig der Spielerzahl.|
|noGame|Versteckt alle Einträge-Felder unabhängig der Spielerzahl.|
|noWorldRecord|versteckt das Spiel auf der Weltrekord-Seite|
|showF<3/4>| Zeigt das Einträge-Feld unabhängig der Spielerzahl.|
|hideF<2-4>| Versteckt das Einträge-Feld unabhängig der Spielerzahl.|
|hidden|Punkte und Werte sind geheim zu halten. Schließt Wertung in Weltrekorde aus.|