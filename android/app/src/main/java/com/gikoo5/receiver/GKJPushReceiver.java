package com.gikoo5.receiver;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.os.Bundle;

import com.gikoo5.recruiter.MainActivity;
import com.gikoo5.utils.GKConstant;
import com.gikoo5.utils.GKPreferenceManager;

import org.json.JSONException;
import org.json.JSONObject;

import cn.jpush.android.api.JPushInterface;

/**
 * 自定义JPush消息接收器<br>
 * 相关参数设置参考：http://docs.jpush.cn/pages/viewpage.action?pageId=1343602
 *
 * @author tao_bp
 *
 */
public class GKJPushReceiver extends BroadcastReceiver {
	@Override
	public void onReceive(Context context, Intent intent) {
		
        Bundle bundle = intent.getExtras();
        if(bundle == null) return;
        
        /*
         * 保留设置，获取REGISTRATION_ID后发送服务器
         * String regId = bundle.getString(JPushInterface.EXTRA_REGISTRATION_ID);
         */
        if (JPushInterface.ACTION_REGISTRATION_ID.equals(intent.getAction())) {
        	
        } 
        // 保留设置，接收自定义消息 -> bundle.getString(JPushInterface.EXTRA_MESSAGE)
        else if (JPushInterface.ACTION_MESSAGE_RECEIVED.equals(intent.getAction())) {
        	
        } 
        // 接收到推送通知
        else if (JPushInterface.ACTION_NOTIFICATION_RECEIVED.equals(intent.getAction())) {
        	String jpushInfo = null;
        	for (String key : bundle.keySet()) {
        		if (key.equals(JPushInterface.EXTRA_EXTRA)) {
        			jpushInfo = bundle.getString(key);
        		}
  			}

        	JSONObject jsonInfoObj = null;
			if (jpushInfo != null) {
				try {
					jsonInfoObj = new JSONObject(jpushInfo.trim());
				} catch (JSONException e) {
					e.printStackTrace();
				}
			}

    		if (jsonInfoObj != null) {
				String type = jsonInfoObj.optString("type");
				// 登出
				if ("user".equals(type)) {
					// 停用JPush
					JPushInterface.stopPush(context.getApplicationContext());
					// 清空Token
					GKPreferenceManager.putString(GKConstant.TOKEN, null);
					// 登出IM
//					IMHelper.getInstance().logoutIMServer();
				} 
			} 
        } 
        // 点击Notification打开通知
        else if (JPushInterface.ACTION_NOTIFICATION_OPENED.equals(intent.getAction())) {
			String jpushInfo = null;
			for (String key : bundle.keySet()) {
				if (key.equals(JPushInterface.EXTRA_EXTRA)) {
					jpushInfo = bundle.getString(key);
				}
			}

			JSONObject jsonInfoObj = null;
			if (jpushInfo != null) {
				try {
					jsonInfoObj = new JSONObject(jpushInfo.trim());
				} catch (JSONException e) {
					e.printStackTrace();
				}
			}

			if (jsonInfoObj != null) {
				Intent pIntent = new Intent(context, MainActivity.class);
				pIntent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

				String type = jsonInfoObj.optString("type");
				if (!"user".equals(type)) {
					pIntent.putExtra("isFromeJpush", true);
					pIntent.putExtra("push_json", jpushInfo);
				}

				context.startActivity(pIntent);
			}
		// 接收到RICH PUSH -> bundle.getString(JPushInterface.EXTRA_EXTRA)
        } else if (JPushInterface.ACTION_RICHPUSH_CALLBACK.equals(intent.getAction())) {

		}
		// 接收到连接状态改变回调 -> intent.getBooleanExtra(JPushInterface.EXTRA_CONNECTION_CHANGE, false)
		else if(JPushInterface.ACTION_CONNECTION_CHANGE.equals(intent.getAction())) {

		}
		// Unhandled intent
		else {

		}
	}
}
