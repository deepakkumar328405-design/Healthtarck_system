# CareBridge — Health Support Website

A simple, responsive health-support website starter built with HTML, CSS, and vanilla JavaScript.

## Features that work in this demo

- Responsive homepage and service navigation.
- Basic health check-in form with a shareable/downloadable text summary.
- Consultation preparation form that saves a note locally and lets the user download it.
- Emergency call links for India's national emergency number **112** and ambulance number **108**.
- Medicine label image upload / camera input, with optional OCR text recognition using Tesseract.js (requires internet access to load the library).
- Built-in general medicine information notes for a small set of common medicines.
- Local browser storage and a button to clear saved data.
- No package installation or build step.

## Run locally

1. Download and extract `HealthTrack.zip`.
2. Open the `HealthTrack` folder in VS Code.
3. Open `index.html` in a modern browser.

For a local server, open a terminal in the folder and run:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Important limitations

This is a **frontend demonstration**, not a live medical service.

- It does not connect to real doctors, book appointments, run video consultations, or send consultation notes to a clinic.
- It does not dispatch ambulances or share your location with emergency services. The phone links simply open the device's calling interface when supported.
- The check-in does not diagnose or triage medical conditions.
- The medicine lookup is a small static reference, not a complete drug database. OCR can misread labels, strengths, and ingredients. Verify the packaging with a pharmacist.
- Do not use the website to choose a dose or replace professional medical care.
- Local data is stored in the browser on the current device. It is not encrypted or synced to a secure medical record. Avoid sensitive details on shared devices.
- OCR loads Tesseract.js from a public CDN and therefore needs an internet connection. If it cannot load, users can type the medicine name manually.

## Project structure

```text
HealthTrack/
├── index.html
├── styles.css
├── app.js
└── README.md
```

## Emergency information

For emergencies in India, call **112**. The **108** ambulance number is also used by ambulance services in many areas; availability and routing can vary by state. Do not wait for a website response during an emergency.

## Before using with real patients

A production service would need verified healthcare professionals, real appointment/telemedicine integrations, a maintained medicine data source, secure server-side storage, authentication and access controls, consent and privacy workflows, accessibility testing, security review, and review by qualified medical and legal professionals.
