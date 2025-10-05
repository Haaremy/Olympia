package de.haaremy.olympia;

import android.os.Bundle;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import com.getcapacitor.BridgeActivity;
import android.app.NotificationManager;
import android.content.Context;



public class MainActivity extends BridgeActivity {



    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        // Vollbild aktivieren
        getWindow().getDecorView().setSystemUiVisibility(
                android.view.View.SYSTEM_UI_FLAG_FULLSCREEN
                        | android.view.View.SYSTEM_UI_FLAG_HIDE_NAVIGATION
                        | android.view.View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
        );

        // Capacitor-WebView referenzieren
        WebView webView = (WebView) this.bridge.getWebView();

        webView.getSettings().setJavaScriptEnabled(true);

        // Offline-Ersatzseite, falls Server nicht erreichbar
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onReceivedError(WebView view, int errorCode,
                                        String description, String failingUrl) {
                // Lade lokale HTML-Datei aus assets
                webView.loadUrl("file:///android_assets/public/customfiles/offline.html");
            }
        });
    }

    @Override
    public void onDestroy() {
        super.onDestroy();

        // Alle Notifications löschen, wenn App geschlossen wird
        NotificationManager manager = (NotificationManager) getSystemService(Context.NOTIFICATION_SERVICE);
        if (manager != null) {
            manager.cancelAll();
        }
    }

}
