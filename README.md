# Barcode Scanner (React Native)

A React Native barcode & QR code scanner built with **VisionCamera** and
**react-native-vision-camera** (ML Kit on Android / Vision on iOS).

Scans 1D barcodes and 2D codes in real time:

- **1D**: Code 128, Code 39, Code 93, Codabar, EAN-13, EAN-8, UPC-A, UPC-E,
  ITF, ITF-14, GS1 DataBar family
- **2D**: QR, PDF417, Aztec, Data Matrix

Features:

- Live scan overlay with corner frame + animated scan line
- Flash (torch) toggle, auto-scan with haptic feedback on success
- Scan history list with copy / open-link / delete / clear actions
- Dark theme UI, safe-area aware

Built with React Native 0.86 (TypeScript) + `react-native-vision-camera@4.7`.

## Prerequisites

- Node.js >= 22
- An **external Android device** (USB debugging enabled) or an emulator
- [React Native environment set up](https://reactnative.dev/docs/set-up-your-environment)
  (Android SDK, JDK 17)

## Install

```sh
npm install
```

## Run on your Android device

1. Connect your phone over USB and enable **USB debugging** (Developer options).
2. Verify the device is seen by adb:

   ```sh
   adb devices
   ```

   Ensure your device shows up as `device` (not `unauthorized` — accept the
   prompt on the phone).

3. Build and install the app on the device, and start Metro:

   ```sh
   npm run android
   ```

   This compiles the native project, installs the APK on the phone, and starts
   the Metro dev server. Keep the Metro terminal open.

4. Open the app on your phone. If the debug build doesn't load automatically,
   shake the phone and press **Reload**.

> **Note:** The build downloads ML Kit / native dependencies on first run and
> can take several minutes.

Alternatively, start Metro and run separately:

```sh
npm start        # terminal 1: Metro dev server
npm run android  # terminal 2: build + install
```

## Use

- Point the camera at a barcode or QR code — it scans automatically and
  vibrates on success.
- The result shows the code value, type, and actions:
  - **Copy** — copy the value to the clipboard
  - **Open** — open URLs (`http`, `https`, `tel:`, `mailto:`, ...) in the
    browser or relevant app
- **Flash** — toggles the torch (only on the rear camera).
- **History** — view all previous scans, copy / open / delete entries, or
  clear everything.

## Structure

```
App.tsx                     # Root: screen switching + scan state
src/
  screens/
    ScannerScreen.tsx       # Live camera + overlay + result banner
    HistoryScreen.tsx       # Scan history list
  components/
    ScanFrame.tsx           # Corner frame + animated scan line
    ScanResultBanner.tsx    # Latest scan result panel
  types/scan.ts             # Scan type
  utils/scans.ts            # Code type labels, helpers, debounce
  theme.ts                  # Colors
```

## Scripts

```sh
npm start      # Metro dev server
npm run android# Build + install on device/emulator
npm run ios    # iOS (pod install required first: cd ios && bundle install && bundle exec pod install)
npm run lint   # ESLint
npm test       # Jest
```

## Android permission

`CAMERA` permission is declared in
`android/app/src/main/AndroidManifest.xml` and requested at runtime when the
app first opens.