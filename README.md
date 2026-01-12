# Bolus Calc PWA

A minimalist, high-speed, offline-first insulin bolus calculator optimised for Android.

## 🚀 Features
- **Instant Load:** Using a Cache-First Service Worker for sub-second startup.
- **Offline-First:** Works with zero data/internet connection after the initial visit.
- **Privacy-Focused:** No accounts, no backend, no tracking, and no analytics.
- **Local Persistence:** Your ISF, Target BG, and Carb Ratio are saved locally on your device.
- **PWA Ready:** Installable to the Android home screen for a native app experience.

## 🧮 Calculation Logic
The app uses standard medical formulas for T1D bolus calculation:
- **Carb Bolus** = `Carbohydrates / Carb Ratio`
- **Correction Bolus** = `(Current BG - Target BG) / ISF` (Returns 0 if Current BG < Target)
- **Total Dose** = `Carb Bolus + Correction Bolus`
- **Rounded Dose** = Total dose rounded to the nearest **0.5 units**.

## 🛠️ Technical Stack
- **HTML5 / CSS3:** Mobile-first, no-scroll layout with large tap targets.
- **Vanilla JavaScript:** Zero dependencies or frameworks.
- **Web Storage API:** `localStorage` for persisting settings.
- **Service Workers:** To enable offline functionality and caching.

## 📦 Installation & Hosting

### To Host (via GitHub Pages):
1. Create a new GitHub repository.
2. Upload `index.html`, `style.css`, `app.js`, `manifest.json`, and `service-worker.js`.
3. In GitHub, go to **Settings > Pages**.
4. Select `Deploy from a branch` and choose `main`.
5. Your site will be live at `https://your-username.github.io/your-repo-name/`.

### To Install on Android:
1. Open the URL in **Chrome**.
2. Wait for the page to load.
3. Tap the **three-dot menu (⋮)** in the top right.
4. Select **"Install app"** or **"Add to Home Screen"**.
5. The icon will appear on your home screen and work without internet.

## ⚠️ Disclaimer
**This application is a calculation aid only and does not provide medical advice.** The user assumes all responsibility for verifying the accuracy of calculations before administering insulin. Always consult with a healthcare professional regarding diabetes management. This tool does not account for Insulin on Board (IOB) or activity levels.

## 📜 License
This project is open-source and available under the MIT License.
