# Google Play Store ProGuard & R8 Code Optimization Rules

# Keep WebKit and JavaScript interfaces
-keepattributes JavascriptInterface
-keepclassmembers class * {
    @android.webkit.JavascriptInterface <methods>;
}
-keepclassmembers class fqcn.of.javascript.interface.for.webview {
   public *;
}
-keep class android.webkit.** { *; }

# Keep MainActivity class
-keep class com.everyqrcodegenerator.app.MainActivity { *; }

# Maintain line numbers for crash symbolication on Google Play Console
-keepattributes SourceFile,LineNumberTable

# Ignore Android Jetpack & WebView warnings during R8 minification
-dontwarn android.webkit.**
-dontwarn androidx.webkit.**
