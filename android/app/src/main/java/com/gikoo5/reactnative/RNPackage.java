package com.gikoo5.reactnative;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.shell.MainReactPackage;
import com.gikoo5.reactnative.modules.RNCorrespond;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by taobangping on 16/5/3.
 * Powered by www.gikoo.cn
 */
public class RNPackage extends MainReactPackage {

    @Override
    public List<NativeModule> createNativeModules(ReactApplicationContext reactContext) {
        List<NativeModule> modules = new ArrayList<>();
        modules.add(new RNCorrespond(reactContext));

        return modules;
    }
}
