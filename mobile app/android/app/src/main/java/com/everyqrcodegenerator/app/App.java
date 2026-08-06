package com.everyqrcodegenerator.app;

import android.app.Application;
import android.util.Log;
import com.google.android.material.color.DynamicColors;

/**
 * Application class for Every QRCode Generator Pro.
 * Applies dynamic Material You theming on Android 12+ safely.
 */
public class App extends Application {

    private static final String TAG = "EveryQRCodeApp";

    @Override
    public void onCreate() {
        super.onCreate();
        try {
            // Apply Material You dynamic colors where available (Android 12+)
            DynamicColors.applyToActivitiesIfAvailable(this);
        } catch (Exception e) {
            Log.e(TAG, "Failed to apply dynamic colors safely", e);
        }
    }
}
