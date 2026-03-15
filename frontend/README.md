# Betriebsradar Frontend

Eine aktuelle Version der App ist unter [https://azubihilfe-netzwerk.github.io/Betriebsradar/](https://azubihilfe-netzwerk.github.io/Betriebsradar/) verfügbar.


## Entwickeln

Installieren der Abhängigkeiten:

```
yarn install
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

Das frontend wird akutell auf Github pages deployed. Das geht sehr convenient mit dem `gh-pages` Skript. Um den aktuellen (lokalen) Stand zu deployen, führe folgendes Kommando aus:

```
npm run deploy
```

> **Hinweis**: Wenn `.env.local` vorhanden ist, wird das frontend mit den Variablen aus env.local deployed.

Die App ist dann unter [https://azubihilfe-netzwerk.github.io/Betriebsradar/](https://azubihilfe-netzwerk.github.io/Betriebsradar/) deployed.
