package com.newlist.AppModule.fileHelper;

import android.content.Context;
import android.util.Log;

import com.facebook.react.bridge.ReactApplicationContext;

import java.io.File;

public class FileManager {

    private Context context;

    public FileManager(ReactApplicationContext reactContext) {
        this.context = reactContext;
    }

    private void onDeleteRecursive(File fileOrDirectory) {
        if (fileOrDirectory.isDirectory()) {
            for (File child : fileOrDirectory.listFiles()) {
                onDeleteRecursive(child);
            }
        }
        boolean result = fileOrDirectory.delete();
        Log.d("Result Delete", String.valueOf(result));
    }

    public void clearCache() {
        try {
            File file = new File(context.getCacheDir().getAbsolutePath());
            if (file.exists()) {
                onDeleteRecursive(file);
            }
        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }
}
