package com.gikoo5.recruiter;

import android.os.Bundle;

import com.facebook.react.ReactActivity;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.gikoo5.reactnative.RNPackage;
import com.gikoo5.reactnative.ReactNativeDialogsPackage;
import com.gikoo5.utils.GKHelper;
import com.imagepicker.ImagePickerPackage;
import com.keyee.datetime.*;  // <--- import
import java.util.Arrays;
import java.util.List;

import cn.jpush.android.api.JPushInterface;
import com.keyee.datetime.*;  // <--- import
public class MainActivity extends ReactActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // 检查版本更新
        GKHelper.getInstance().checkVersionUpdate(this);
        // 初始化JPush
        GKHelper.getInstance().initJPush(this);
    }

    @Override
    protected void onResume() {
        super.onResume();
        JPushInterface.onResume(this);
    }

    @Override
    protected void onPause() {
        super.onPause();
        JPushInterface.onPause(this);
    }

    /**
     * Returns the name of the main component registered from JavaScript.
     * This is used to schedule rendering of the component.
     */
    @Override
    protected String getMainComponentName() {
        return "RNRecruiterProj";
    }

    /**
     * Returns whether dev mode should be enabled.
     * This enables e.g. the dev menu.
     */
    @Override
    protected boolean getUseDeveloperSupport() {
        return BuildConfig.DEBUG;
    }

    /**
     * A list of packages used by the app. If the app uses additional views
     * or modules besides the default ones, add more packages here.
     */
    @Override
    protected List<ReactPackage> getPackages() {
        return Arrays.<ReactPackage>asList(
                new RCTDateTimePickerPackage(this), // <------ add here
                new MainReactPackage(),
                new ImagePickerPackage(), // Add package
                new RNPackage(), new ReactNativeDialogsPackage()
        );
    }
}
