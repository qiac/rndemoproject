package com.gikoo5.reactnative;

/**
 * Created by taobangping on 16/5/16.
 */
public class GKReactNativeController {
    public static GKReactNativeController mController;
    private GKReactNativePackage mPackage;

    private GKReactNativeController() {
        mPackage = new GKReactNativePackage();
    }

    public static GKReactNativeController getController() {
        if (mController == null) {
            synchronized (GKReactNativeController.class) {
                if (mController == null)
                    mController = new GKReactNativeController();
            }
        }
        return mController;
    }

    public GKReactNativePackage getGKReactNativePackage() {
        return this.mPackage;
    }
}
