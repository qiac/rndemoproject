package com.gikoo5.utils;

import android.content.Context;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.os.Handler;
import android.os.Message;
import android.text.TextUtils;
import android.util.Log;

import com.lenovo.lps.sus.SUS;

import java.util.Set;

import cn.jpush.android.api.JPushInterface;
import cn.jpush.android.api.TagAliasCallback;

/**
 * Created by taobangping on 16/5/10.
 */
public class GKHelper {
    private static GKHelper mInstance;

    private static final int MSG_SET_ALIAS = 1001;
    private JPushHandler mHandler;
    private JPushAliasCallback mAliasCallback;

    // 保证自动更新检查仅执行一次
    private static boolean isStartVersionUpdateFlag = false;

    private GKHelper() {}

    public static GKHelper getInstance() {
        if (mInstance == null) {
            synchronized (GKHelper.class) {
                if (mInstance == null)
                    mInstance = new GKHelper();
            }
        }
        return mInstance;
    }

    /**
     * 检查APP版本更新
     *
     * @author tao_bp
     */
    public void checkVersionUpdate(Context context) {
        if (context == null) {
            return;
        }
        if (!isStartVersionUpdateFlag) {
            isStartVersionUpdateFlag = true;
            SUS.setDebugModeFlag(true);
        }

        // 获取包信息
        PackageInfo packageInfo = null;
        try {
            packageInfo = context.getPackageManager().getPackageInfo(context.getPackageName(), 0);
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }

        // 获取应用信息
        ApplicationInfo applicationInfo = null;
        try {
            applicationInfo = context.getPackageManager().getApplicationInfo(context.getPackageName(), PackageManager.GET_META_DATA);
        } catch (PackageManager.NameNotFoundException e1) {
            e1.printStackTrace();
        }

        // 版本Code
        int versionCode = 0;
        // 联想自动更新KEY
        String appKey = null;
        // 联想自动更新渠道KEY
        String channelKey = null;

        if (packageInfo != null) {
            versionCode = packageInfo.versionCode;
        }

        if (applicationInfo != null && applicationInfo.metaData != null) {
            appKey = applicationInfo.metaData.getString("SUS_APPKEY");
            channelKey = applicationInfo.metaData.getString("SUS_CHANNEL");
        }

        if (!SUS.isVersionUpdateStarted()) {
            SUS.AsyncStartVersionUpdateByAppKey(context, appKey, versionCode, channelKey);
        }
    }
    /**
     * 初始化JPush
     *
     * @author tao_bp
     */
    public void initJPush(final Context context) {
        if (context == null) {
            return;
        }
        JPushInterface.init(context.getApplicationContext());

        mHandler = new JPushHandler(context);
        mAliasCallback = new JPushAliasCallback(context);

        // 延迟2s，等待JPush初始化完成，提高设置Alias成功率
        new Handler().postDelayed(new Runnable() {
            @Override
            public void run() {
                String rid = JPushInterface.getRegistrationID(context.getApplicationContext());
                String token = GKPreferenceManager.getString(GKConstant.TOKEN, null);

                // JPush已初始化成功
                if(!TextUtils.isEmpty(rid) && !TextUtils.isEmpty(token)) {
                    mHandler.sendMessage(mHandler.obtainMessage(MSG_SET_ALIAS, token));
                }
            }
        }, 2000);
    }

    class JPushHandler extends Handler {
        private Context mContext;
        public JPushHandler(Context context) {
            this.mContext = context;
        }
        @Override
        public void handleMessage(Message msg) {
            super.handleMessage(msg);
            switch (msg.what) {
                case MSG_SET_ALIAS:
                    JPushInterface.setAlias(mContext.getApplicationContext(), (String) msg.obj, mAliasCallback);
                    break;
                default: break;
            }
        }
    }

    class JPushAliasCallback implements TagAliasCallback {
        private Context mContext;
        public JPushAliasCallback(Context context) {
            this.mContext = context;
        }
        @Override
        public void gotResult(int code, String alias, Set<String> tags) {
            switch (code) {
                case 0: // success
                    Log.v("tbp", "jpush init code:" + code + " ,alias:" + alias);
                    break;
                case 6002: // timeout, try again after 60s
                    Log.v("tbp", "jpush init timeout. try again after 60s.");
                    if (GKUtils.isConnected(mContext.getApplicationContext())) {
                        mHandler.sendMessageDelayed(mHandler.obtainMessage(MSG_SET_ALIAS, alias), 1000 * 60);
                    }
                    break;
                default:
                    Log.v("tbp", "jpush init exception. code:" + code);
                    break;
            }
        }
    }
}
