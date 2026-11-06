# Design-Plan Pflegedienst Saaletal (Arbeitsdatei)
**Ziel:** Ruhig, vertrauenswürdig, lesbar für Ältere und Angehörige. Alles in System-Schriften (kein Google Fonts, DSGVO).
## Tokens
- Farben: Tiefgrün `#0f4c4a` (Aktionen), Dunkelgrün `#0a3534` (Überschriften/Footer), Hintergrund `#f4f8f7`, Weiß `#fff` (Wechselsektionen), Text `#17252a`, Gedämpft `#44585a`, Akzent Gelb `#f0b43c` (nur Terminmarker, dunkler Text). Kontraste: Text/Hintergrund >12:1, Gedämpft >7:1, Weiß auf Grün >9:1.
- Typo: Überschriften Georgia (Serif, warm), Fließtext System-Sans 18px/1.7, max. 68 Zeichen Zeilenlänge. H1 2,1–3,4rem, H2 1,7–2,4rem, H3 1,3rem.
- Raster: max. 1120px, Rand 24px, Sektionen 80px (mobil 56px) Abstand, Gaps 20–48px. Radius 12px, Buttons 10px, Touch-Ziele ≥48px.
## Aufbau
1. Notruf-Leiste (24 Std., tel:-Link) · 2. Sticky Header: Logo + Nav (Willkommen, Leistungen, Termine, Partner, Kontakt) · Skip-Link
3. Willkommen (weiß): links H1+Text, rechts Bild 4:3 (1200×900); darunter 4 Bilder 1170×780/878 · 4. Leistungen: Kacheln mit Akzentkante, Buttons „Kontakt“ (springt zum Formular) und „Formular“ (Overlay)
5. Termine (weiß): Monatskalender links, Terminliste rechts · 6. Partner: 3 Link-Kacheln mit Logo-Platzhalter 320×160 · 7. Kontakt (weiß): Daten + Formular (EmailJS) · 8. Footer: Impressum, Datenschutz
## Interaktion
Bilder → Galerie-Dialog (Pfeiltasten, Esc). „Formular“ → Dialog mit gleichem Formular. Fokus sichtbar, `prefers-reduced-motion` beachtet, Bewegung nur bei Nutzeraktion.
## Daten (Firebase Firestore)
`services` {title,text,order} · `events` {date YYYY-MM-DD,time,title}. Ohne Konfiguration: Standardleistungen aus der alten Seite.
## Änderungen v2
Name „Pflegedienst Saaletal“, Logo `logo.svg` (dunkelgrünes Symbol auf Weiß) im Header. Neue Sektion Team (14 Kacheln, Foto 400×400) zwischen Termine und Partner. Partner-Kacheln größer (min. 320px, Gap 40px). 2px-Trennlinien zwischen Sektionen, 2px-Rahmen um den Kontaktblock. Notruf zusätzlich bei Telefon und im Footer.
