# DÜSK - React Native Mobile App


**DÜSK** ist eine professionelle Mobile-Anwendung für iOS und Android zur Erfassung und Auswertung von Selbst- und Fremdeinschätzungen von Schülerkompetenzen. Die App ist mit React Native entwickelt und kommuniziert mit einer PHP-API.

---

## 📋 Inhaltsverzeichnis

- [Überblick](#-überblick)
- [Features](#-features)
- [Screenshots](#-screenshots)
- [Technologie-Stack](#-technologie-stack)
- [API-Dokumentation](#-api-dokumentation)
- [Datenbankstruktur](#-datenbankstruktur)
- [Installation](#-installation)
- [Projektstruktur](#-projektstruktur)
- [Berechnungslogik](#-berechnungslogik)
- [Konfiguration](#-konfiguration)
- [Fehlerbehandlung](#-fehlerbehandlung)
- [Build & Deployment](#-build--deployment)
- [Entwicklung](#-entwicklung)


---

## 🎯 Überblick

DÜSK (Düsseldorfer Schülerinventar) ist ein diagnostisches Instrument zur Erfassung von Schülerkompetenzen in sechs Bereichen:

| Bereich | Beschreibung |
|---------|--------------|
| 1. **Arbeitsverhalten** | Zuverlässigkeit, Arbeitstempo, Planung, Organisation |
| 2. **Lernverhalten** | Selbstständigkeit, Belastbarkeit, Konzentration, Merkfähigkeit |
| 3. **Sozialverhalten** | Teamfähigkeit, Hilfsbereitschaft, Kommunikation, Konfliktfähigkeit |
| 4. **Fachkompetenz** | Schreiben, Lesen, Mathematik, Naturwissenschaften, Fremdsprachen |
| 5. **Personale Kompetenz** | Kreativität, Problemlösung, Abstraktion, Reflexion |
| 6. **Methodenkompetenz** | Präsentation, PC-Kenntnisse, fächerübergreifendes Denken |

Die Anwendung ermöglicht den Vergleich von **Selbsteinschätzung (SE)** und **Fremdeinschätzung (FE)** mit Normtabellen für Hauptschulen (HS) und Förderschulen (FS).

---

## ✨ Features

### Kernfunktionen
- ✅ **Login/Logout** mit Session-Verwaltung und persistenter Authentifizierung
- ✅ **CRUD-Operationen** für Schülerprofile (Erstellen, Lesen, Aktualisieren, Löschen)
- ✅ **36 Items** pro Einschätzung (4-stufige Likert-Skala: 1-4)
- ✅ **Automatische Kompetenzberechnung** aus 72 Items
- ✅ **Normwertvergleich** (HS/FS Normtabellen)
- ✅ **Profilansicht** mit Tabellen, interaktiven Diagrammen und Textinterpretation

### Erweiterte Funktionen
- 📊 **Zeitreihenanalyse** für Gruppenentwicklung über Zeit
- 📈 **Vergleichsdiagramme** (SE vs. FE mit Pearson-Korrelation)
- 📐 **Korrelationsberechnung** mit statistischer Interpretation
- 📑 **Exportfunktion** (Teilen als Text/PDF)
- 🔍 **Such- und Filterfunktionen** (nach Namen und Gruppen)
- 📁 **Gruppenverwaltung** (CRUD mit Umbenennung)
- 🌙 **Dark Mode Support** (automatisch)
- 💾 **Offline-Cache** (AsyncStorage für Sessions)
- 📱 **Responsive Design** für alle Bildschirmgrößen


---

## 🛠 Technologie-Stack

### React Native Mobile App

| Komponente | Technologie | Version |
|------------|-------------|---------|
| Framework | React Native | 0.73.0 |
| Sprache | TypeScript | 5.3.3 |
| Navigation | React Navigation | 6.x |
| HTTP-Client | Axios | 1.6.5 |
| Charts | React Native Chart Kit | 6.12.0 |
| Icons | React Native Vector Icons | 10.0.3 |
| UI-Komponenten | React Native Paper | 5.10.6 |
| Persistenz | AsyncStorage | 1.22.0 |
| Picker | React Native Picker | 2.6.0 |
| Sharing | React Native Share | 10.0.0 |
| Mindest-iOS | iOS 12.4 | - |
| Mindest-Android | Android 6.0 (API 23) | - |

### Server (PHP API)

| Komponente | Technologie |
|------------|-------------|
| Backend | PHP 7.4+ |
| Datenbank | MySQL 5.7+ |
| Webserver | Apache/Nginx |
| Format | JSON |

---

## 📡 API-Dokumentation

Die REST-API ist unter `https://paul-koop.org/api/` verfügbar.

### Authentifizierung

#### POST `/api_login.php`

```json
// Request
{
    "username": "gast",
    "password": "gast"
}

// Response (Success)
{
    "success": true,
    "userID": "12345",
    "session": "abc123def456789"
}

// Response (Error)
{
    "success": false,
    "error": "Invalid credentials"
}
```

### Profile-Endpunkte

> **Wichtig:** Alle Profile-Endpunkte benötigen die Header:
> - `X-User-ID`: Benutzer-ID aus Login
> - `X-Session`: Session-Token aus Login

#### GET `/api_profiles.php`

**Response**: Array aller Profile des Benutzers

```json
[
    {
        "profilID": "1",
        "name": "Max Mustermann",
        "gruppename": "Klasse 8a",
        "gruppeID": "5",
        "created_at": "2024-01-15 10:30:00",
        "item1": 4, "item2": 3, ..., "item36": 2,
        "feitem1": 3, "feitem2": 4, ..., "feitem36": 3
    }
]
```

#### GET `/api_profiles.php?id={profileId}`

**Response**: Einzelnes Profil

#### POST `/api_profiles.php`

**Request Body**: Vollständiges Profil-Objekt (alle 72 Items)
**Response**: `200 OK` bei Erfolg

#### PUT `/api_profiles.php`

**Request Body**: Aktualisiertes Profil-Objekt
**Response**: `200 OK` bei Erfolg

#### DELETE `/api_profiles.php?id={profileId}`

**Response**: `200 OK` bei Erfolg

### Gruppen-Endpunkte

#### GET `/api_groups.php`

**Response**:
```json
[
    {"gruppeID": 1, "name": "Klasse 8a"},
    {"gruppeID": 2, "name": "Klasse 8b"},
    {"gruppeID": 3, "name": "Klasse 9a"}
]
```

#### POST `/api_groups.php`

**Request Body**: `{"name": "Neue Gruppe"}`
**Response**: `200 OK` bei Erfolg

#### DELETE `/api_groups.php?id={groupId}`

**Response**: `200 OK` bei Erfolg

---

## 🗄 Datenbankstruktur

### ER-Diagramm

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│    users    │     │   groups    │     │  profiles   │
├─────────────┤     ├─────────────┤     ├─────────────┤
│ userID (PK) │────<│ userID (FK) │     │ profilID(PK)│
│ username    │     │ gruppeID(PK)│<────│ userID (FK) │
│ password    │     │ name        │     │ gruppeID(FK)│
│ session     │     │ created_at  │     │ name        │
│ created_at  │     └─────────────┘     │ item1-36    │
└─────────────┘                          │ feitem1-36  │
                                         │ created_at  │
                                         │ updated_at  │
                                         └─────────────┘
```

### SQL-Schema

```sql
-- Users Tabelle
CREATE TABLE users (
    userID INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    session_token VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Groups Tabelle
CREATE TABLE groups (
    gruppeID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE,
    UNIQUE KEY unique_group_per_user (userID, name)
);

-- Profiles Tabelle
CREATE TABLE profiles (
    profilID INT AUTO_INCREMENT PRIMARY KEY,
    userID INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    gruppeID INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    -- 36 SE-Items (Werte 1-4)
    item1 TINYINT DEFAULT 2, item2 TINYINT DEFAULT 2, item3 TINYINT DEFAULT 2,
    item4 TINYINT DEFAULT 2, item5 TINYINT DEFAULT 2, item6 TINYINT DEFAULT 2,
    item7 TINYINT DEFAULT 2, item8 TINYINT DEFAULT 2, item9 TINYINT DEFAULT 2,
    item10 TINYINT DEFAULT 2, item11 TINYINT DEFAULT 2, item12 TINYINT DEFAULT 2,
    item13 TINYINT DEFAULT 2, item14 TINYINT DEFAULT 2, item15 TINYINT DEFAULT 2,
    item16 TINYINT DEFAULT 2, item17 TINYINT DEFAULT 2, item18 TINYINT DEFAULT 2,
    item19 TINYINT DEFAULT 2, item20 TINYINT DEFAULT 2, item21 TINYINT DEFAULT 2,
    item22 TINYINT DEFAULT 2, item23 TINYINT DEFAULT 2, item24 TINYINT DEFAULT 2,
    item25 TINYINT DEFAULT 2, item26 TINYINT DEFAULT 2, item27 TINYINT DEFAULT 2,
    item28 TINYINT DEFAULT 2, item29 TINYINT DEFAULT 2, item30 TINYINT DEFAULT 2,
    item31 TINYINT DEFAULT 2, item32 TINYINT DEFAULT 2, item33 TINYINT DEFAULT 2,
    item34 TINYINT DEFAULT 2, item35 TINYINT DEFAULT 2, item36 TINYINT DEFAULT 2,
    -- 36 FE-Items (Werte 1-4)
    feitem1 TINYINT DEFAULT 2, feitem2 TINYINT DEFAULT 2, feitem3 TINYINT DEFAULT 2,
    feitem4 TINYINT DEFAULT 2, feitem5 TINYINT DEFAULT 2, feitem6 TINYINT DEFAULT 2,
    feitem7 TINYINT DEFAULT 2, feitem8 TINYINT DEFAULT 2, feitem9 TINYINT DEFAULT 2,
    feitem10 TINYINT DEFAULT 2, feitem11 TINYINT DEFAULT 2, feitem12 TINYINT DEFAULT 2,
    feitem13 TINYINT DEFAULT 2, feitem14 TINYINT DEFAULT 2, feitem15 TINYINT DEFAULT 2,
    feitem16 TINYINT DEFAULT 2, feitem17 TINYINT DEFAULT 2, feitem18 TINYINT DEFAULT 2,
    feitem19 TINYINT DEFAULT 2, feitem20 TINYINT DEFAULT 2, feitem21 TINYINT DEFAULT 2,
    feitem22 TINYINT DEFAULT 2, feitem23 TINYINT DEFAULT 2, feitem24 TINYINT DEFAULT 2,
    feitem25 TINYINT DEFAULT 2, feitem26 TINYINT DEFAULT 2, feitem27 TINYINT DEFAULT 2,
    feitem28 TINYINT DEFAULT 2, feitem29 TINYINT DEFAULT 2, feitem30 TINYINT DEFAULT 2,
    feitem31 TINYINT DEFAULT 2, feitem32 TINYINT DEFAULT 2, feitem33 TINYINT DEFAULT 2,
    feitem34 TINYINT DEFAULT 2, feitem35 TINYINT DEFAULT 2, feitem36 TINYINT DEFAULT 2,
    FOREIGN KEY (userID) REFERENCES users(userID) ON DELETE CASCADE,
    FOREIGN KEY (gruppeID) REFERENCES groups(gruppeID) ON DELETE SET NULL
);
```

---

## 💻 Installation

### Voraussetzungen

- Node.js 18+ ([Download](https://nodejs.org/))
- npm oder yarn
- React Native CLI
- Für iOS: Xcode 14+ (nur macOS)
- Für Android: Android Studio mit SDK

### Schritt-für-Schritt Installation

```bash
# 1. Repository klonen
git clone https://github.com/yourusername/duesk-mobile.git
cd duesk-mobile

# 2. Abhängigkeiten installieren
npm install
# oder
yarn install

# 3. iOS: CocoaPods installieren (nur macOS)
cd ios && pod install && cd ..

# 4. App starten
# Android
npx react-native run-android

# iOS (nur macOS)
npx react-native run-ios

# 5. Metro Bundler starten (falls nicht automatisch)
npx react-native start
```

### Schnellstart mit der Batch-Datei (Windows)

```batch
# Projektstruktur erstellen
create_react_native_project.bat

# In das Projekt wechseln
cd duesk-mobile

# Abhängigkeiten installieren
npm install

# App starten
npx react-native run-android
```

---

## 📁 Projektstruktur

```
duesk-mobile/
├── src/
│   ├── App.tsx                    # Hauptanwendung mit Navigation
│   ├── components/                # Wiederverwendbare UI-Komponenten
│   │   ├── LoadingSpinner.tsx     # Ladezustandsanzeige
│   │   ├── CompetenceTable.tsx    # X-Markierungstabelle
│   │   ├── CompetenceChart.tsx    # Liniendiagramm
│   │   ├── ProfileCard.tsx        # Profilkarte für Liste
│   │   └── ItemRatingCard.tsx     # Item-Bewertungskarte
│   ├── screens/                   # Views / Seiten
│   │   ├── LoginScreen.tsx        # Authentifizierung
│   │   ├── MainScreen.tsx         # Profilliste mit Sidebar
│   │   ├── ProfileDetailScreen.tsx # Profildetails mit Charts
│   │   ├── ProfileEditScreen.tsx  # Profil erstellen/bearbeiten
│   │   ├── GroupManagerScreen.tsx # Gruppenverwaltung
│   │   └── TimeSeriesScreen.tsx   # Zeitreihenanalyse
│   ├── services/                  # Geschäftslogik & API
│   │   ├── SessionManager.ts      # Session & Auth
│   │   ├── ApiService.ts          # Netzwerk-API Calls
│   │   └── Calculator.ts          # Berechnungslogik
│   ├── types/                     # TypeScript Interfaces
│   │   └── index.ts               # Profile, Group, LoginResponse
│   ├── constants/                 # Statische Daten
│   │   └── norms.ts               # Normtabellen & Items
│   └── utils/                     # Hilfsfunktionen
│       └── helpers.ts             # Formatierer etc.
├── assets/                        # Bilder, Fonts, Icons
│   ├── images/
│   └── fonts/
├── android/                       # Android native Code
├── ios/                           # iOS native Code
├── package.json                   # Abhängigkeiten
├── tsconfig.json                  # TypeScript Config
├── babel.config.js                # Babel Config
├── metro.config.js                # Metro Bundler Config
├── index.js                       # App Einstiegspunkt
├── app.json                       # App Konfiguration
└── README.md
```

---

## 🧮 Berechnungslogik

### Item-zu-Kompetenz-Zuordnung

```typescript
// Kompetenz 1: Arbeitsverhalten (Items 1-10)
const kompetenz1 = items[0] + items[1] + ... + items[9];

// Kompetenz 2: Lernverhalten (Items 11-20)
const kompetenz2 = items[10] + items[11] + ... + items[19];

// Kompetenz 3: Sozialverhalten (Items 21-28 + Items 9-10)
const kompetenz3 = items[20] + ... + items[27] + items[8] + items[9];

// Kompetenz 4: Fachkompetenz (Items 29-36)
const kompetenz4 = items[28] + items[29] + ... + items[35];

// Kompetenz 5: Personale Kompetenz (spezifische Items)
const kompetenz5 = items[0] + items[1] + items[5] + items[6] + items[7] +
                   items[8] + items[9] + items[11] + items[12] + items[13] + items[14];

// Kompetenz 6: Methodenkompetenz (spezifische Items)
const kompetenz6 = items[2] + items[3] + items[4] + items[8] + items[9] +
                   items[10] + items[16] + items[17];
```

### Profilwertberechnung

```typescript
function calculateProfileValue(rawSum: number, normTable: number[]): number {
    // 1 = weit unterdurchschnittlich
    // 2 = unterdurchschnittlich  
    // 3 = durchschnittlich
    // 4 = überdurchschnittlich
    // 5 = weit überdurchschnittlich
    
    for (let i = 0; i < normTable.length; i++) {
        if (rawSum < normTable[i]) {
            return i + 1;  // 1-5 Skala
        }
    }
    return 5;
}
```

### Korrelationsberechnung (Pearson)

```typescript
function pearsonCorrelation(seValues: number[], feValues: number[]): number {
    const n = seValues.length;
    let sumSE = 0, sumFE = 0, sumSEFE = 0, sumSE2 = 0, sumFE2 = 0;
    
    for (let i = 0; i < n; i++) {
        sumSE += seValues[i];
        sumFE += feValues[i];
        sumSEFE += seValues[i] * feValues[i];
        sumSE2 += seValues[i] * seValues[i];
        sumFE2 += feValues[i] * feValues[i];
    }
    
    const numerator = n * sumSEFE - sumSE * sumFE;
    const denominator = Math.sqrt((n * sumSE2 - sumSE * sumSE) * 
                                   (n * sumFE2 - sumFE * sumFE));
    
    return denominator === 0 ? 0 : numerator / denominator;
}
```

### Normtabellen (Vollständig)

| Kompetenz | HS SE Grenzwerte | HS FE Grenzwerte |
|-----------|------------------|------------------|
| Arbeitsverhalten | 21.33, 25.33, 29.33, 33.32, 37.32 | 12.66, 18.16, 23.66, 29.16, 34.66 |
| Lernverhalten | 20.87, 24.95, 29.03, 33.13, 37.18 | 13.33, 18.42, 23.51, 28.60, 33.69 |
| Sozialverhalten | 17.93, 21.37, 24.80, 28.23, 31.67 | 10.75, 15.41, 20.07, 24.73, 29.39 |
| Fachkompetenz | 13.98, 17.71, 21.44, 25.17, 28.90 | 14.22, 15.30, 16.38, 17.46, 18.54 |
| Personale Kompetenz | 24.60, 28.55, 33.04, 37.53, 42.01 | 14.12, 20.21, 26.30, 32.39, 38.48 |
| Methodenkompetenz | 15.53, 18.97, 22.40, 25.83, 29.27 | 10.53, 14.51, 18.49, 22.47, 26.45 |

*Für FS (Förderschule) existieren separate Normtabellen.*
