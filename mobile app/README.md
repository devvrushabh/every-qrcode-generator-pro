# Every QRCode Generator Pro - Android Mobile App 📱

This directory contains the production-ready Android mobile application project for **Every QRCode Generator Pro**.

## 📁 Directory Overview

- **`android/`**: Complete native Android Studio project source (Gradle build files, Java/Kotlin source code, AndroidManifest, resources, layouts).
- **`dist/`**: Bundled web distribution assets synced from the main React/Vite SaaS application.
- **`capacitor.config.json`**: Capacitor cross-platform configuration file.

---

## 🛠️ Requirements & Prerequisites

To build and run the Android app locally:
- **Android Studio** (Hedgehog / Iguana / Jellyfish or newer)
- **Android SDK** API Level 34 (Android 14) or API Level 33 (Android 13)
- **Java Development Kit (JDK)** version 17 or higher
- **Gradle** 8.x

---

## 🚀 How to Build & Run the Android App

### Option A: Using Android Studio (Recommended)
1. Open **Android Studio**.
2. Click **Open** and select the `mobile app/android` directory:
   `d:\Coding\Antigravity Projects\Every QRCode Generator Pro\mobile app\android`
3. Wait for Gradle to finish syncing project dependencies.
4. Connect a physical Android phone via USB (with USB Debugging enabled) or start an Android Emulator from the AVD Manager.
5. Click the green **Run (Play)** button or press `Shift + F10`.

### Option B: Build APK via Command Line
Run the Gradle wrapper inside the `android` folder:
```bash
cd "mobile app/android"
./gradlew assembleDebug
```
The generated APK file will be located at:
`mobile app/android/app/build/outputs/apk/debug/app-debug.apk`

---

## 📱 Features & Permissions Included

- **Full Touch & Web UI Optimization**: Supports responsive views, dark mode, dynamic QR code generation, and analytics dashboards.
- **Permissions**:
  - `INTERNET` & `ACCESS_NETWORK_STATE`: Live backend communication with Supabase.
  - `CAMERA`: QR Code scanning & logo upload support.
  - `WRITE_EXTERNAL_STORAGE` / `READ_EXTERNAL_STORAGE`: Direct download of generated QR code images (PNG, SVG, JPEG).
