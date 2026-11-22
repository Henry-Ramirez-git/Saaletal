# Setup-Anleitung – Pflegedienst Saaletal

Solange in `app.js` noch „DEIN_…“ steht, läuft die Seite im **Vorschau-Modus** mit Beispielinhalten. Sobald Firebase verbunden ist, arbeiten `admin.html` und alle öffentlichen Seiten sofort zusammen.

Dateien im Repository (alle im selben Ordner): `index.html`, `newsfeed.html`, `rezensionen.html`, `admin.html`, `impressum.html`, `datenschutz.html`, `style.css`, `app.js`, `logo.svg`.

---

## 1. Firebase verbinden

1. Auf https://console.firebase.google.com anmelden → **Projekt hinzufügen** (Google Analytics kann aus bleiben).
2. Im Projekt: **Projekteinstellungen (Zahnrad) → Allgemein → „Meine Apps“ → Web-App (`</>`)** → App registrieren (Firebase Hosting nicht nötig). Es erscheint ein Block `firebaseConfig`.
3. Die vier Werte `apiKey`, `authDomain`, `projectId`, `appId` in **`app.js`** bei `const CFG={…}` einsetzen.
4. **Build → Firestore Database → Datenbank erstellen.** Region: `eur3 (europe-west)` oder `europe-west3 (Frankfurt)` (wegen DSGVO). Startmodus: **Produktionsmodus**.
5. **Build → Authentication → Los geht’s → Anmeldemethode → E-Mail/Passwort aktivieren.** Reiter **Users → Nutzer hinzufügen**: Ihre Admin-E-Mail und ein starkes Passwort. Damit melden Sie sich in `admin.html` an.
6. **Firestore → Regeln:** den gesamten Inhalt durch die Regeln unten ersetzen, `DEINE_ADMIN_EMAIL` durch die E-Mail aus Schritt 5 ersetzen, **Veröffentlichen**.
7. **Authentication → Einstellungen → Autorisierte Domains:** Ihre Domain hinzufügen (z. B. `ihr-name.github.io` und `ihre-domain.de`). `localhost` ist bereits eingetragen.
8. `admin.html` öffnen → anmelden → in den Bereichen **Leistungen, Team, Partner** auf **„Standardinhalte als Einträge anlegen“** klicken, damit die Platzhalter bearbeitbar werden. Danach Hero-Bilder, Termine, Neuigkeiten usw. pflegen.

### Firestore-Regeln

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Nur Ihr Admin-Konto darf Inhalte ändern
    function isAdmin() {
      return request.auth != null
          && request.auth.token.email == 'DEINE_ADMIN_EMAIL';
    }

    // Rezensionen: jeder darf lesen und (geprüft) eine neue schreiben, nur Admin darf löschen
    match /reviews/{id} {
      allow read: if true;
      allow create: if request.resource.data.keys().hasOnly(['name','stars','text','createdAt'])
                    && request.resource.data.name is string
                    && request.resource.data.name.size() > 0
                    && request.resource.data.name.size() <= 60
                    && request.resource.data.text is string
                    && request.resource.data.text.size() > 0
                    && request.resource.data.text.size() <= 600
                    && request.resource.data.stars is int
                    && request.resource.data.stars >= 1
                    && request.resource.data.stars <= 5
                    && request.resource.data.createdAt == request.time;
      allow update, delete: if isAdmin();
    }

    // Alles andere (Leistungen, Termine, News, Team, Partner, Bilder, Einstellungen):
    // lesen darf jeder, schreiben nur der Admin
    match /{collection}/{id} {
      allow read: if true;
      allow write: if isAdmin();
    }
  }
}
```

**Wichtig:** Der alte Admin-Zugang mit dem festen Passwort `1234` im Code wurde ersetzt. Ein Passwort im Browser-Code ist für jeden lesbar und schützt die Datenbank nicht. Mit Firebase Authentication und diesen Regeln können nur Sie Inhalte ändern.

Hinweis zum `apiKey`: Der Web-API-Key von Firebase ist kein Geheimnis. Der Schutz kommt durch die Regeln oben.

---

## 2. EmailJS verbinden (Kontaktformular)

1. Auf https://www.emailjs.com ein Konto anlegen.
2. **Email Services → Add New Service** (z. B. Gmail, Outlook oder SMTP) → verbinden. Die **Service ID** (z. B. `service_abc123`) kopieren → in `app.js` bei `EJS.svc`.
3. **Email Templates → Create New Template.** Im Reiter **Content** den Code-Editor öffnen und den HTML-Teil aus **`emailjs-vorlage.html`** einfügen. Im Reiter **Settings** eintragen:
   - **To Email:** `kontakt@familienpflege-pyritz.de`
   - **From Name:** `Website Pflegedienst Saaletal`
   - **Reply To:** `{{email}}`
   - **Subject:** `Neue Anfrage über die Website: {{subject}}`

   Speichern → die **Template ID** kopieren → in `app.js` bei `EJS.tpl`.
4. **Account → General → Public Key** kopieren → in `app.js` bei `EJS.pub`.
5. **Account → Security:** Ihre Domain als erlaubte Domain eintragen (schützt vor Missbrauch Ihres Kontingents).
6. Testen: Formular auf der Startseite absenden. Die Variablen heißen `name`, `email`, `phone`, `subject`, `message`.

---

## 3. Bilder ersetzen

Am einfachsten im **Admin-Bereich** hochladen: Dort werden Bilder automatisch verkleinert und direkt in Firestore gespeichert (kein Firebase Storage nötig, kein Bezahltarif).

| Bereich | Empfohlene Größe | Wo im Admin |
|---|---|---|
| Hero-Karussell (4 Bilder) | 1600×900 px | Startseite → Hero-Bilder |
| 4 Bilder unter den Stichpunkten | 1170×780 px | Startseite → Die 4 Bilder |
| Hintergrundbild | 1600×1000 px | Startseite → Hintergrundbild |
| Termin-Kopfbild | 1200×600 px | Termine |
| Mitarbeiter-Foto | 400×400 px | Team |
| Partner-Logo | 480×240 px | Partner |

Alternativ stehen im Code von `index.html` überall Kommentare **„BILD ERSETZEN“** an den Platzhaltern. Das Hintergrundbild lässt sich außerdem in `style.css` (Variable `--bg-img`) setzen.

---

## 4. Schrift Verdana Pro

Verdana Pro ist eine lizenzpflichtige Schrift und nicht auf jedem Gerät vorhanden. Ohne Dateien nutzt die Seite automatisch **Verdana** (sehr ähnlich). Für überall identische Darstellung: Schriftdateien legal erwerben, als `woff2` in den Ordner `fonts/` legen (`VerdanaPro-Regular.woff2`, `VerdanaPro-Bold.woff2`, `VerdanaPro-Black.woff2`). Die `@font-face`-Regeln in `style.css` sind schon vorbereitet. Es werden keine Google-Fonts geladen, die Datenschutzerklärung bleibt damit korrekt.

---

## 5. Hosting (GitHub Pages, Domain bei Squarespace)

1. Alle Dateien in ein GitHub-Repository hochladen → **Settings → Pages →** Branch `main`, Ordner `/ (root)`.
2. Eigene Domain bei Squarespace: Domain-Einstellungen → DNS-Einstellungen → benutzerdefinierte Einträge laut GitHub-Anleitung („Configuring a custom domain for GitHub Pages“) anlegen und die Domain in GitHub Pages eintragen.
3. Danach die Domain in Firebase (Schritt 1.7) und EmailJS (Schritt 2.5) freigeben.

---

## 6. Noch von Ihnen anzupassen

- **`datenschutz.html`:** Abschnitte ergänzen für **Firebase Authentication** (nur Admin), **Rezensionen** (Name und Text werden öffentlich gespeichert, Speicherung in Firestore) und die gespeicherten Bilder/Inhalte.
- **`impressum.html` und `datenschutz.html`:** Im Footer fehlt dort noch der Link zu den Rezensionen. Zum Einfügen nach dem Datenschutz-Link: `<a href="rezensionen.html">Rezensionen</a>`
- Die Seiten funktionieren mit dem neuen `style.css` unverändert weiter.

---

## 7. Was wo im Code verbunden wird

| Was | Datei | Stelle |
|---|---|---|
| Firebase-Zugangsdaten | `app.js` | `const CFG={…}` (oben) |
| EmailJS-Zugangsdaten | `app.js` | `const EJS={…}` (oben) |
| Senden des Kontaktformulars | `index.html` | Kommentar „EMAILJS“ im Formular-Abschnitt |
| Rezension speichern | `rezensionen.html` | Kommentar „FIREBASE“ beim Speichern |
| Inhalte bearbeiten | `admin.html` | läuft über dieselben Firebase-Daten |
| Hintergrundbild | `style.css` / Admin | Variable `--bg-img` |
| Bildplatzhalter | `index.html` | Kommentare „BILD ERSETZEN“ |
