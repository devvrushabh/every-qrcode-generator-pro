# Every QRCode Generator Pro - Android Mobile App 📱

This directory contains the production-ready, **Google Play Store publishable** Android application project for **Every QRCode Generator Pro**.

## 📁 Key Output Files Ready for Deployment

- **`EveryQRCodeGeneratorPro-release.aab`** (2.77 MB): **Google Play Store App Bundle** format. This is the exact file required to upload to the Google Play Console for production release.
- **`EveryQRCodeGeneratorPro-release.apk`** (2.49 MB): Signed, R8-optimized production release APK for direct side-loading.
- **`android/`**: Complete native Android Studio project source (Gradle build scripts, Java/Kotlin source, R8 ProGuard rules, signed Keystore config, network security rules).

---

## 🛠️ Google Play Store Publishing Specs

- **Target SDK**: API 34 (Android 14 - compliant with Google Play Console requirements)
- **Min SDK**: API 22 (Android 5.1+)
- **Package Name**: `com.everyqrcodegenerator.app`
- **Version**: `1.0.0` (Version Code: `1`)
- **Code Optimization**: R8 / ProGuard enabled with resource shrinking (`minifyEnabled true`, `shrinkResources true`).
- **Network Security**: Enforces HTTPS with `network_security_config.xml`.

---

## 🔑 Keystore & Signing Configuration

The release build is signed using a production Keystore configured in `android/app/release.keystore` and `android/gradle.properties`:

- **Keystore File**: `android/app/release.keystore`
- **Key Alias**: `release-key`
- **Store Password**: `androidrelease`
- **Key Password**: `androidrelease`

---

## 🚀 How to Build via Android Studio or Terminal

### Option A: Using Android Studio
1. Launch **Android Studio**.
2. Select **Open** and choose the `mobile app/android` folder.
3. To generate a new Google Play App Bundle (`.aab`):
   - Navigate to **Build** > **Generate Signed Bundle / APK...**
   - Select **Android App Bundle** > **Next**.
   - Use the existing `release.keystore` or create a new key.

### Option B: Using Terminal Command Line
To re-compile the signed `.aab` and `.apk` files at any time:
```bash
cd "mobile app/android"
./gradlew bundleRelease assembleRelease
```
