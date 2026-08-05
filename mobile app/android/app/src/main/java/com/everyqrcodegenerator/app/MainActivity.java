package com.everyqrcodegenerator.app;

import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.view.View;
import android.view.animation.Animation;
import android.view.animation.AnimationUtils;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {
    private WebView webView;
    private View splashContainer;
    private boolean splashDismissed = false;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.webview);
        splashContainer = findViewById(R.id.splash_container);

        View glowRing = findViewById(R.id.glow_ring);
        if (glowRing != null) {
            Animation pulseAnim = AnimationUtils.loadAnimation(this, R.anim.glow_pulse);
            glowRing.startAnimation(pulseAnim);
        }

        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        webSettings.setDatabaseEnabled(true);
        webSettings.setAllowFileAccess(true);
        webSettings.setAllowContentAccess(true);
        webSettings.setLoadWithOverviewMode(true);
        webSettings.setUseWideViewPort(true);
        webSettings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);

        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onPageFinished(WebView view, String url) {
                super.onPageFinished(view, url);
                dismissSplashWithFade();
            }
        });

        webView.loadUrl("https://every-qrcode-generator-pro.netlify.app");

        // Fallback safety timer to dismiss splash screen after 2.5s maximum
        new Handler(Looper.getMainLooper()).postDelayed(new Runnable() {
            @Override
            public void run() {
                dismissSplashWithFade();
            }
        }, 2500);
    }

    private void dismissSplashWithFade() {
        if (splashDismissed || splashContainer == null) return;
        splashDismissed = true;

        splashContainer.animate()
                .alpha(0f)
                .setDuration(450)
                .withEndAction(new Runnable() {
                    @Override
                    public void run() {
                        splashContainer.setVisibility(View.GONE);
                    }
                })
                .start();
    }

    @Override
    public void onBackPressed() {
        if (webView != null && webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
