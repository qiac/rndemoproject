package com.gikoo5.utils;

import android.content.Context;
import android.content.SharedPreferences;

import com.gikoo5.hyphenate.GKApplication;

/**
 * Created by taobangping on 16/5/9.
 */
public class GKPreferenceManager {
    private static final String PREF_NAME = "gk_recruiter.pref";
    private static SharedPreferences mSharedPreference;

    static {
        mSharedPreference = GKApplication.getInstance().getSharedPreferences(PREF_NAME, Context.MODE_PRIVATE);
    }

    // -------- String --------
    public static void putString(String key, String value) {
        mSharedPreference.edit().putString(key, value).commit();
    }
    public static String getString(String key, String defalutValue) {
        return mSharedPreference.getString(key, defalutValue);
    }

    // -------- Boolean --------
    public static void putBoolean(String key, boolean value) {
        mSharedPreference.edit().putBoolean(key, value).commit();
    }
    public static boolean getBoolean(String key, boolean defaultValue) {
        return mSharedPreference.getBoolean(key, defaultValue);
    }

    // -------- Int --------
    public static void putInt(String key, int value) {
        mSharedPreference.edit().putInt(key, value).commit();
    }
    public static int getInt(String key, int defaultValue) {
        return mSharedPreference.getInt(key, defaultValue);
    }

    // -------- Float --------
    public static void putFloat(String key, float value) {
        mSharedPreference.edit().putFloat(key, value).commit();
    }
    public static float getFloat(String key, float defaultValue) {
        return mSharedPreference.getFloat(key, defaultValue);
    }
}
