# Betriebsradar Frontend

Eine aktuelle Version der App ist unter [https://azubihilfe-netzwerk.github.io/Betriebsradar/](https://azubihilfe-netzwerk.github.io/Betriebsradar/) verfügbar.


## Entwickeln

Installieren der Abhängigkeiten:

```
yarn install
```

Generieren der Api-Types:

```
npm run codegen
```

Starten des Frontends im development mode.

```
yarn start
```

Öffne [http://localhost:3000](http://localhost:3000), um die App im Browser zu testen.

### Entwickeln mit lokalem Backend

Um sich mit dem lokalen Backend zu verbinden, muss die backend URL geändert werden. Lege dazu eine Datei `.env.local` mit folgendem Inhalt an:

```
REACT_APP_BACKEND_URL=http://localhost:3010/api/graphql //hier url des lokalen backends eintragen
```

Starte anschließend das Frontend neu (`yarn start`).

## Deployen

Das frontend kann auf den uberspace server deployed werden, indem man das `./deploy.sh` Skript ausführt. Das baut die Reat App und kopiert die Files auf den Server.

> **Hinweis**: Wenn `.env.local` vorhanden ist, wird das frontend mit den Variablen aus env.local deployed.

Die App ist dann unter [https://azubihilfe-netzwerk.github.io/Betriebsradar/](https://azubihilfe-netzwerk.github.io/Betriebsradar/) deployed.
