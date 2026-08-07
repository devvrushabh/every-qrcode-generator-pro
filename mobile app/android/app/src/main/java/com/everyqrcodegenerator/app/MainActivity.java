package com.everyqrcodegenerator.app;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.ActivityNotFoundException;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.net.ConnectivityManager;
import android.net.NetworkCapabilities;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.util.Log;
import android.view.View;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.webkit.CookieManager;
import android.webkit.PermissionRequest;
import android.webkit.ValueCallback;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.content.ContextCompat;
import androidx.core.view.WindowCompat;


/**
 * Main Activity for Every QRCode Generator Pro.
 * Loads the web app inside a full-screen WebView with splash screen,
 * robust offline fallbacks, camera permissions, file chooser, and deep link handling.
 */
public class MainActivity extends AppCompatActivity {

    private static final String TAG = "EveryQRCodeMainActivity";
    private static final String ONLINE_URL = "https://every-qrcode-generator-pro.netlify.app";
    private static final String LOCAL_URL = "file:///android_asset/public/index.html";
    private static final int SPLASH_TIMEOUT_MS = 3000;

    private WebView webView;
    private View splashContainer;
    private View errorContainer;
    private boolean splashDismissed = false;
    private boolean isOfflineFallbackActive = false;

    // File upload handling
    private ValueCallback<Uri[]> fileUploadCallback;
    private final ActivityResultLauncher<Intent> fileChooserLauncher =
            registerForActivityResult(new ActivityResultContracts.StartActivityForResult(), result -> {
                if (fileUploadCallback == null) return;
                Uri[] results = null;
                try {
                    if (result.getResultCode() == RESULT_OK && result.getData() != null) {
                        String dataString = result.getData().getDataString();
                        if (dataString != null) {
                            results = new Uri[]{Uri.parse(dataString)};
                        } else if (result.getData().getClipData() != null) {
                            int count = result.getData().getClipData().getItemCount();
                            results = new Uri[count];
                            for (int i = 0; i < count; i++) {
                                results[i] = result.getData().getClipData().getItemAt(i).getUri();
                            }
                        }
                    }
                } catch (Exception e) {
                    Log.e(TAG, "Error handling file chooser result", e);
                }
                fileUploadCallback.onReceiveValue(results);
                fileUploadCallback = null;
            });

    // Camera permission launcher
    private final ActivityResultLauncher<String> cameraPermissionLauncher =
            registerForActivityResult(new ActivityResultContracts.RequestPermission(), isGranted -> {
                if (isGranted) {
                    Log.d(TAG, "Camera permission granted");
                }
            });

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        try {
            WindowCompat.setDecorFitsSystemWindows(getWindow(), false);
        } catch (Throwable t) {
            Log.e(TAG, "Failed to set decor fits system windows", t);
        }

        super.onCreate(savedInstanceState);



        try {
            setContentView(R.layout.activity_main);
        } catch (Throwable t) {
            Log.e(TAG, "Fatal layout inflation error in onCreate", t);
            Toast.makeText(this, "System error initializing app layout", Toast.LENGTH_LONG).show();
            finish();
            return;
        }

        splashContainer = findViewById(R.id.splash_container);
        errorContainer = findViewById(R.id.error_container);

        try {
            webView = findViewById(R.id.webview);
        } catch (Throwable t) {
            Log.e(TAG, "Failed to initialize WebView component", t);
            showOfflineError();
            return;
        }

        // Start splash glow animation
        startSplashAnimation();

        // Request camera permission for QR scanner
        requestCameraPermission();

        // Setup WebView settings and clients
        setupWebView();

        // Determine URL to load (check for Deep Link / Intent data)
        String targetUrl = getInitialUrl(getIntent());

        if (webView != null) {
            if (isNetworkAvailable()) {
                webView.loadUrl(targetUrl);
            } else {
                loadLocalAssetFallback();
            }
        }

        // Safety fallback timer to ensure splash screen is dismissed
        new Handler(Looper.getMainLooper()).postDelayed(this::dismissSplashWithFade, SPLASH_TIMEOUT_MS);
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        if (intent != null && intent.getData() != null) {
            String url = intent.getData().toString();
            Log.d(TAG, "Received new intent URL: " + url);
            if (webView != null) {
                webView.loadUrl(url);
            }
        }
    }

    private String getInitialUrl(Intent intent) {
        if (intent != null && intent.getData() != null) {
            String intentUrl = intent.getData().toString();
            if (intentUrl.startsWith("http://") || intentUrl.startsWith("https://")) {
                return intentUrl;
            }
        }
        return ONLINE_URL;
    }

    private void startSplashAnimation() {
        try {
            View glowRing = findViewById(R.id.glow_ring);
            if (glowRing != null) {
                Animation pulseAnim = AnimationUtils.loadAnimation(this, R.anim.glow_pulse);
                glowRing.startAnimation(pulseAnim);
            }
        } catch (Throwable t) {
            Log.e(TAG, "Error starting splash animation", t);
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    private void setupWebView() {
        if (webView == null) return;

        try {
            WebSettings settings = webView.getSettings();
            settings.setJavaScriptEnabled(true);
            settings.setDomStorageEnabled(true);
            settings.setDatabaseEnabled(true);
            settings.setAllowFileAccess(true);
            settings.setAllowContentAccess(true);
            settings.setAllowFileAccessFromFileURLs(true);
            settings.setAllowUniversalAccessFromFileURLs(true);
            settings.setLoadWithOverviewMode(true);
            settings.setUseWideViewPort(true);
            settings.setCacheMode(WebSettings.LOAD_DEFAULT);

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
            }
            settings.setMediaPlaybackRequiresUserGesture(false);
            settings.setJavaScriptCanOpenWindowsAutomatically(true);

            String defaultUA = settings.getUserAgentString();
            settings.setUserAgentString(defaultUA + " EveryQRCodeGeneratorPro/1.0.0");
        } catch (Throwable t) {
            Log.e(TAG, "Error configuring WebSettings", t);
        }

        try {
            CookieManager.getInstance().setAcceptCookie(true);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
                CookieManager.getInstance().setAcceptThirdPartyCookies(webView, true);
            }
        } catch (Throwable t) {
            Log.e(TAG, "Failed to set cookie manager parameters", t);
        }

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageStarted(WebView view, String url, Bitmap favicon) {
                super.onPageStarted(view, url, favicon);
                if (errorContainer != null) {
                    errorContainer.setVisibility(View.GONE);
                }
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                dismissSplashWithFade();
            }

            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                super.onReceivedError(view, request, error);
                if (request != null && request.isForMainFrame()) {
                    Log.w(TAG, "Main frame error: " + (error != null ? error.getDescription() : "unknown"));
                    if (!isOfflineFallbackActive) {
                        loadLocalAssetFallback();
                    }
                }
            }

            @Override
            public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) {
                if (request == null || request.getUrl() == null) return false;
                String url = request.getUrl().toString();

                if (url.contains("every-qrcode-generator-pro.netlify.app") ||
                        url.contains("supabase.co") ||
                        url.contains("accounts.google.com") ||
                        url.contains("google.com") ||
                        url.startsWith("file:///android_asset/")) {
                    return false;
                }

                try {
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    startActivity(intent);
                } catch (ActivityNotFoundException e) {
                    Log.e(TAG, "No activity found to handle external URL: " + url, e);
                    Toast.makeText(MainActivity.this, "No browser app found to open link", Toast.LENGTH_SHORT).show();
                } catch (Throwable t) {
                    Log.e(TAG, "Error opening external link: " + url, t);
                }
                return true;
            }
        });

        webView.setWebChromeClient(new WebChromeClient() {
            @Override
            public boolean onShowFileChooser(WebView webView, ValueCallback<Uri[]> callback,
                                             FileChooserParams params) {
                if (fileUploadCallback != null) {
                    fileUploadCallback.onReceiveValue(null);
                }
                fileUploadCallback = callback;

                try {
                    Intent intent = params != null ? params.createIntent() : new Intent(Intent.ACTION_GET_CONTENT).setType("*/*");
                    fileChooserLauncher.launch(intent);
                } catch (ActivityNotFoundException e) {
                    Log.e(TAG, "File chooser activity not found, falling back to GET_CONTENT", e);
                    try {
                        Intent fallbackIntent = new Intent(Intent.ACTION_GET_CONTENT);
                        fallbackIntent.setType("*/*");
                        fallbackIntent.addCategory(Intent.CATEGORY_OPENABLE);
                        fileChooserLauncher.launch(Intent.createChooser(fallbackIntent, "Select File"));
                    } catch (Throwable ex) {
                        Log.e(TAG, "Failed to launch fallback file chooser", ex);
                        if (fileUploadCallback != null) {
                            fileUploadCallback.onReceiveValue(null);
                            fileUploadCallback = null;
                        }
                    }
                } catch (Throwable t) {
                    Log.e(TAG, "Error launching file chooser", t);
                    if (fileUploadCallback != null) {
                        fileUploadCallback.onReceiveValue(null);
                        fileUploadCallback = null;
                    }
                }
                return true;
            }

            @Override
            public void onPermissionRequest(final PermissionRequest request) {
                if (request == null) return;
                runOnUiThread(() -> {
                    try {
                        request.grant(request.getResources());
                    } catch (Throwable t) {
                        Log.e(TAG, "Error granting WebView permissions", t);
                    }
                });
            }
        });
    }

    private void loadLocalAssetFallback() {
        runOnUiThread(() -> {
            try {
                isOfflineFallbackActive = true;
                if (webView != null) {
                    Log.d(TAG, "Loading local bundled fallback asset");
                    webView.loadUrl(LOCAL_URL);
                }
            } catch (Throwable t) {
                Log.e(TAG, "Error loading local asset fallback", t);
                showOfflineError();
            }
        });
    }

    private void requestCameraPermission() {
        try {
            if (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA)
                    != PackageManager.PERMISSION_GRANTED) {
                cameraPermissionLauncher.launch(Manifest.permission.CAMERA);
            }
        } catch (Throwable t) {
            Log.e(TAG, "Error requesting camera permission", t);
        }
    }

    private boolean isNetworkAvailable() {
        try {
            ConnectivityManager cm = (ConnectivityManager) getSystemService(CONNECTIVITY_SERVICE);
            if (cm == null) return false;
            NetworkCapabilities caps = cm.getNetworkCapabilities(cm.getActiveNetwork());
            return caps != null && (
                    caps.hasTransport(NetworkCapabilities.TRANSPORT_WIFI) ||
                    caps.hasTransport(NetworkCapabilities.TRANSPORT_CELLULAR) ||
                    caps.hasTransport(NetworkCapabilities.TRANSPORT_ETHERNET));
        } catch (Throwable t) {
            Log.e(TAG, "Error checking network availability", t);
            return true;
        }
    }

    private void showOfflineError() {
        runOnUiThread(() -> {
            dismissSplashWithFade();
            if (errorContainer != null) {
                errorContainer.setVisibility(View.VISIBLE);
                TextView errorText = errorContainer.findViewById(R.id.error_message);
                if (errorText != null) {
                    errorText.setText("No internet connection.\nPlease check your network and try again.");
                }
            }
        });
    }

    public void onRetryClick(View view) {
        isOfflineFallbackActive = false;
        if (isNetworkAvailable()) {
            if (errorContainer != null) {
                errorContainer.setVisibility(View.GONE);
            }
            if (webView != null) {
                webView.loadUrl(ONLINE_URL);
            }
        } else {
            loadLocalAssetFallback();
        }
    }

    private void dismissSplashWithFade() {
        runOnUiThread(() -> {
            if (splashDismissed || splashContainer == null) return;
            splashDismissed = true;

            try {
                splashContainer.animate()
                        .alpha(0f)
                        .setDuration(400)
                        .withEndAction(() -> splashContainer.setVisibility(View.GONE))
                        .start();
            } catch (Throwable t) {
                splashContainer.setVisibility(View.GONE);
            }
        });
    }

    @SuppressWarnings("deprecation")
    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        if (webView != null) {
            webView.onResume();
        }
    }

    @Override
    protected void onPause() {
        if (webView != null) {
            webView.onPause();
        }
        super.onPause();
    }

    @Override
    protected void onDestroy() {
        if (webView != null) {
            webView.destroy();
        }
        super.onDestroy();
    }
}
