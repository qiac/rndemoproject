package com.gikoo5.reactnative;

import com.facebook.react.ReactPackage;
import com.facebook.react.bridge.JavaScriptModule;
import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ViewManager;
import com.gikoo5.reactnative.modules.DialogAndroid;
import com.gikoo5.reactnative.modules.RNCorrespond;
import com.gikoo5.reactnative.modules.RNEventEmitter;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

/**
 * Created by taobangping on 16/5/16.
 */
public class GKReactNativePackage implements ReactPackage {
    private RNEventEmitter mRNEventEmitter;

    public GKReactNativePackage() {

    }

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        mRNEventEmitter = new RNEventEmitter(reactContext);

        return Arrays.<NativeModule>asList(mRNEventEmitter,
                new RNCorrespond(reactContext),
                new DialogAndroid(reactContext));
    }

    @Override
    public List<Class<? extends JavaScriptModule>> createJSModules() {
        return Collections.emptyList();
    }

    @Override
    public List<ViewManager> createViewManagers(ReactApplicationContext reactContext) {
        return Collections.emptyList();
    }

    public RNEventEmitter getRNEventEmitter() {
        return this.mRNEventEmitter;
    }
}
