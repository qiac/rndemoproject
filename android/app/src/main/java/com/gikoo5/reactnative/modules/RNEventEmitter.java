package com.gikoo5.reactnative.modules;

import android.support.annotation.Nullable;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;

/**
 * Created by taobangping on 16/5/16.
 */
public class RNEventEmitter extends ReactContextBaseJavaModule {
    private ReactContext mReactContext;

    public RNEventEmitter(ReactApplicationContext reactContext) {
        super(reactContext);
        this.mReactContext = reactContext;
    }

    @Override
    public String getName() {
        return "RNEventEmitter";
    }

    // 发送参数到JS端
    private void sendEvent(ReactContext reactContext,
                           String eventName,
                           @Nullable WritableMap params) {
        reactContext
                .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit(eventName, params);
    }

    public void sendUnreadCountChangedEvent() {
        WritableMap event = Arguments.createMap();
        event.putString("message", "Unread IM Message Count Changed.");
        sendEvent(mReactContext, "receiveUnreadCountChangedEvent", event);
    }
}