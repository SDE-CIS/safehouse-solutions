# Safehouse Solutions

Safehouse Solutions er en moderne webplatform til intelligent hjemmestyring, hvor brugeren kan overvåge, styre og automatisere sine IoT-enheder via en sikker webgrænseflade.  
Projektet kombinerer IoT-teknologi, webudvikling og cloud-integration i et samlet system, der er designet til at være både brugervenligt, skalerbart og sikkert.

---

## Funktionelt overblik

### Offentlig del (hjemmeside)
- **Forside (Landing Page)** – præsentation af virksomheden med animerede effekter, baggrundsbevægelser og responsivt design.  
- **Login / Registrering** – brugergodkendelse via e-mail og adgangskode med JWT-tokenhåndtering.  
- **Kontakt & Privatlivspolitik** – statiske informationssider.  
- **Flersprogethed** – understøtter flere sprog via `i18next`.

### Dashboard (brugersystem)
Efter login får brugeren adgang til et komplet kontrolpanel for sit smart home:

| Modul | Funktion |
|--------|-----------|
| **Oversigt** | Live-opdaterede grafer og statistik over sensorer og enheder. |
| **Adgang (RFID)** | Administrér nøglekort, se adgangslog og registrér nye kort. |
| **Videoovervågning** | Se live-stream fra kameraer og hent optagelser fra Azure Blob Storage. |
| **Temperatur & Ventilation** | Fjernstyring af temperatur og blæser baseret på IoT-data via MQTT. |
| **To-do & Måltidsplan** | Simpelt husholdningsværktøj til daglig planlægning. |

---

## Teknisk arkitektur

### Frontend
Bygget med React, TypeScript og Vite, og designet med Chakra UI v3.  
Frontend kommunikerer med backend-API’et og MQTT-brokeren i realtid.

**Vigtige teknologier:**
- React (Vite) – hurtig bundling og modulopdeling  
- Chakra UI – moderne komponentbaseret UI  
- RTK Query – effektiv datacaching og API-kommunikation  
- MQTT.js – live-forbindelser til IoT-enheder  
- React Router – side-navigation  
- i18next – flersproget understøttelse  
- Zod – typesikker validering af API-data  
- Recharts – datavisualisering  

---

### Backend
Backend er bygget i Node.js (Express) og kører på en Windows Server / IIS med CI/CD gennem Azure DevOps.

**Nøglepunkter:**
- REST-API med Express  
- MySQL database til bruger- og enhedsdata  
- JWT til autentifikation  
- bcrypt til sikker hashing af adgangskoder  
- CORS, dotenv og static-file middleware  
- CI/CD pipelines via Azure DevOps (self-hosted agent)  
- Azure Blob Storage til videoarkiver  

---

### IoT-integration
Platformen kommunikerer med en MQTT-broker (kørende på Raspberry Pi 4), som forbinder alle IoT-enheder.

**Understøttede enheder:**
- RFID Smart Lock – adgangsstyring via nøglekort  
- Kameraer – live- og bevægelsesdetekteret video  
- Temperatur-sensorer – realtidsmålinger  
- Ventilatorer – fjernstyring baseret på sensorinput  

MQTT-emner følger et hierarkisk mønster:
IoT-enheder kan modtage konfigurationer via “settings”-topics og sende status tilbage i realtid.

---

## Sikkerhed
- TLS-kryptering på MQTT-kommunikation  
- JWT-baseret sessionhåndtering  
- GDPR-overholdelse og minimal datalagring  
- Firewall-beskyttelse og adskilt IoT-netværk  
- Self-signed CA-certifikater for enhedstillid  

---

## Udviklingsmiljø

**Krav**
- Node.js v18 eller nyere  
- NPM eller Yarn  
- MySQL-database  
- MQTT-broker (f.eks. Mosquitto)  

---

**Installation**
```bash
npm install
npm run dev
```

**Byg til produktion**
```bash
npm run build
```

---

## Deployment og skalering

* CI/CD pipelines via Azure DevOps
* Self-hosted agent på Windows Server
* Produktion hostes i IIS med Node.js process-management
* Videoer gemmes i Azure Blob Storage for skalerbarhed
* Staging- og produktionsmiljøer håndteres separat

---

## Fremtidige udvidelser

* Sagsstyring og support-system med e-mailnotifikationer
* Ansigtsgenkendelse via AI (Cascade Classifier)
* Mobilapp til fjernstyring og push-notifikationer
