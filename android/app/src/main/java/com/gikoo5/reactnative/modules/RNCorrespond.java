package com.gikoo5.reactnative.modules;

import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.support.v4.app.ActivityCompat;
import android.text.Spannable;
import android.text.TextUtils;
import android.util.Log;
import android.util.Pair;
import android.widget.TextView;
import android.widget.Toast;

import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.gikoo5.hyphenate.Constant;
import com.gikoo5.hyphenate.EMHelper;
import com.gikoo5.hyphenate.GKApplication;
import com.gikoo5.hyphenate.db.EMDBManager;
import com.gikoo5.recruiter.GKIMChatPager;
import com.gikoo5.utils.GKConstant;
import com.gikoo5.utils.GKHelper;
import com.gikoo5.utils.GKPreferenceManager;
import com.hyphenate.EMCallBack;
import com.hyphenate.chat.EMClient;
import com.hyphenate.chat.EMConversation;
import com.hyphenate.chat.EMMessage;
import com.hyphenate.chat.EMMessageBody;
import com.hyphenate.chat.EMTextMessageBody;
import com.hyphenate.easeui.EaseConstant;
import com.hyphenate.easeui.utils.EaseCommonUtils;
import com.hyphenate.easeui.utils.EaseSmileUtils;
import com.hyphenate.util.DateUtils;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.w3c.dom.Text;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Created by taobangping on 16/5/3.
 * Powered by www.gikoo.cn
 */
public class RNCorrespond extends ReactContextBaseJavaModule {
    private Context mContext;

    public RNCorrespond(ReactApplicationContext reactContext) {
        super(reactContext);
        this.mContext = reactContext;
    }

    @Override
    public String getName() {
        return "RNCorrespond";
    }

    /**
     * -------- 登录成功回调 ---------
     *
     * @param token         登录Token
     * @param ease_username 环信账户
     * @param ease_password 环信密码
     * @param ease_avatar   环信头像
     */
    @ReactMethod
    public void login(String token, String ease_username, String ease_password, String ease_avatar) {
        GKPreferenceManager.putString(GKConstant.TOKEN, token);
        GKPreferenceManager.putString(GKConstant.RECRUITER_AVATAR, ease_avatar);

        GKHelper.getInstance().initJPush(getReactApplicationContext());
    }

    /**
     * -------- 登出成功回调 ---------
     */
    @ReactMethod
    public void logout() {

    }

    /**
     * -------- 拨打本地电话回调 ---------
     *
     * @param phonenum 电话号码
     */
    @ReactMethod
    public void makeCall(String phonenum) {
        Intent intent = new Intent(Intent.ACTION_CALL, Uri.parse("tel:" + phonenum));
        if (ActivityCompat.checkSelfPermission(mContext, android.Manifest.permission.CALL_PHONE) != PackageManager.PERMISSION_GRANTED) {
            return;
        }
        mContext.startActivity(intent);
    }

    /**
     * -------- 分享回调 ---------
     *
     * @param shareUrl   分享Url地址
     * @param sharePic   分享图标
     * @param shareTitle 分享标题
     * @param shareDesc  分享描述
     */
    @ReactMethod
    public void share(String shareUrl, String sharePic, String shareTitle, String shareDesc) {

    }

    /**
     * -------- 删除会话回调 ---------
     *
     * @param ease_username 环信账户
     */
    @ReactMethod
    public void removeConversation(String ease_username) {
        if (!TextUtils.isEmpty(ease_username)) {
            EMClient.getInstance().chatManager().deleteConversation(ease_username, true);
        }
    }

    /**
     * -------- 获取会话列表 ---------
     *
     * @param callback
     */
    @ReactMethod
    public void getAllConversations(Callback callback) {
        List<EMConversation> conversations = loadConversationList();

        if (conversations == null || conversations.size() == 0) {
            callback.invoke("");
            return;
        }

        JSONObject jsonObj = new JSONObject();
        JSONArray array = new JSONArray();

        for (EMConversation conversation : conversations) {
            EMMessage message = conversation.getLastMessage();
            if (message == null) continue;

            // 发送方姓名
            String name = message.getStringAttribute(EaseConstant.EXTEND_ATTR_FROM_DISPLAYNAME, null);
            name = (name == null ? null : name + ": ");

            // 时间
            String time = DateUtils.getTimestampString(new Date(message.getMsgTime()));

            // 未读消息数量
            int unreadMsgCount = conversation.getUnreadMsgCount();

            // 聊天账户
            String ease_username = conversation.getUserName();

            // 申请岗位ID
            String applicationId = message.getStringAttribute(EaseConstant.EXTEND_ATTR_MESSAGE_TAG, "");

            // 最后一条消息是否是主动发送的
            boolean isSend = message.direct() == EMMessage.Direct.RECEIVE;

            // 消息内容
            String content = null;
            if (message.getType() == EMMessage.Type.TXT) { // 文本
                if(message.getBooleanAttribute(EaseConstant.MESSAGE_ATTR_IS_BIG_EXPRESSION, false)){
                    content = (isSend ? "[表情图片]" : name + "[表情图片]");
                } else {
                    EMTextMessageBody txtBody = (EMTextMessageBody) message.getBody();
                    Spannable span = EaseSmileUtils.getSmiledText(mContext, txtBody.getMessage());
                    content = span.toString();
                }
            }
            else if (message.getType() == EMMessage.Type.IMAGE) { // 图片
                content = (isSend ? "[图片]" : name + "[图片]");
            }
            else if (message.getType() == EMMessage.Type.LOCATION) { // 位置
                content = (isSend ? "[位置]" : name + "[位置]");
            }
            else if (message.getType() == EMMessage.Type.VOICE) { // 语音
                content = (isSend ? "[语音]" : name + "[语音]");
            }
            else if (message.getType() == EMMessage.Type.VIDEO) { // 视频
                content = (isSend ? "[视频]" : name + "[视频]");
            }
            else if (message.getType() == EMMessage.Type.FILE) { // 文件
                content = (isSend ? "[文件]" : name + "[文件]");
            }

            // 头像、姓名
            String avatar = null, realname = null;
            if (isSend) {
                avatar = message.getStringAttribute(EaseConstant.EXTEND_ATTR_FROM_AVATAR, null);
                realname = message.getStringAttribute(EaseConstant.EXTEND_ATTR_FROM_DISPLAYNAME, null);
            } else {
                avatar = message.getStringAttribute(EaseConstant.EXTEND_ATTR_TO_AVATAR, null);
                realname = message.getStringAttribute(EaseConstant.EXTEND_ATTR_TO_DISPLAYNAME, null);
            }

            JSONObject itemObj = new JSONObject();

            try {
                itemObj.put("time", time);
                itemObj.put("icon", avatar == null ? "" : avatar);
                itemObj.put("content", content == null ? "" : content);
                itemObj.put("real_name", realname == null ? "" : realname);
                itemObj.put("unread_count", unreadMsgCount);
                itemObj.put("ease_username", ease_username);
                itemObj.put("applicationId", applicationId);
            } catch (JSONException e) {
                e.printStackTrace();
            }

            array.put(itemObj);
        }

        try {
            jsonObj.put("results", array);
        } catch (JSONException e) {
            e.printStackTrace();
        }

        Log.v("tbp", "*****jsonObj:" + jsonObj);
        callback.invoke(jsonObj.toString());
    }

    /**
     * -------- 进入IM聊天界面回调 ---------
     *
     * @param to_username 聊天对方环信账户
     */
    @ReactMethod
    public void openIMChat(String to_username) {
        boolean isLoggedIn = EMHelper.getInstance().isLoggedIn();
        if (isLoggedIn) {
            Intent intent = new Intent(getReactApplicationContext(), GKIMChatPager.class);
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
            intent.putExtra(Constant.EXTRA_USER_ID, "13913835065");
            intent.putExtra(Constant.EXTEND_ATTR_TO_DISPLAYNAME, "陶邦平");
            intent.putExtra(Constant.EXTRA_CHAT_TYPE, Constant.CHATTYPE_SINGLE);

            getReactApplicationContext().startActivity(intent);
        } else {
            loginEase();
        }
    }

    /**
     * -------- 获取App版本号回调 ---------
     *
     * @param callback
     */
    @ReactMethod
    public void getAppVersion(Callback callback) {
        PackageInfo packageInfo = null;
        try {
            packageInfo = mContext.getPackageManager().getPackageInfo(mContext.getPackageName(), 0);
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
        callback.invoke(packageInfo == null ? "" : packageInfo.versionCode);
    }

    // ------------------------------- 分割线 ----------------------------------
    private List<EMConversation> loadConversationList() {
        // 获取所有会话，包括陌生人
        Map<String, EMConversation> conversations = EMClient.getInstance().chatManager().getAllConversations();
        List<Pair<Long, EMConversation>> sortList = new ArrayList<Pair<Long, EMConversation>>();
        synchronized (conversations) {
            for (EMConversation conversation : conversations.values()) {
                // 过滤掉messages size为0的conversation
                if (conversation.getAllMessages().size() != 0) {
                    if(conversation.getType() == EMConversation.EMConversationType.Chat){
                        sortList.add(new Pair<Long, EMConversation>(conversation.getLastMessage().getMsgTime(), conversation));
                    }
                }
            }
        }
        try {
            sortConversationByLastChatTime(sortList);
        } catch (Exception e) {
            e.printStackTrace();
        }
        List<EMConversation> list = new ArrayList<EMConversation>();
        for (Pair<Long, EMConversation> sortItem : sortList) {
            list.add(sortItem.second);
        }

        return list;
    }

    /**
     * 根据最后一条消息的时间排序
     *
     * @param conversationList
     */
    private void sortConversationByLastChatTime(List<Pair<Long, EMConversation>> conversationList) {
        Collections.sort(conversationList, new Comparator<Pair<Long, EMConversation>>() {
            @Override
            public int compare(final Pair<Long, EMConversation> con1, final Pair<Long, EMConversation> con2) {
                if (con1.first == con2.first) {
                    return 0;
                } else if (con2.first > con1.first) {
                    return 1;
                } else {
                    return -1;
                }
            }
        });
    }

    public void loginEase() {
        final Context context = getReactApplicationContext();
        if (!EaseCommonUtils.isNetWorkConnected(context)) {
            Toast.makeText(context, "网络不可用", Toast.LENGTH_SHORT).show();
            return;
        }

//        final ProgressDialog pd = new ProgressDialog(context);
//        pd.setCanceledOnTouchOutside(false);
//        pd.setMessage("正在登录...");
//        pd.show();

        // After logout，the DemoDB may still be accessed due to async callback, so the DemoDB will be re-opened again.
        // close it before login to make sure DemoDB not overlap
        EMDBManager.getInstance().closeDB();

        // reset current user name before login
        EMHelper.getInstance().setCurrentUserName("taobangping");

        // 调用sdk登陆方法登陆聊天服务器
        EMClient.getInstance().login("taobangping", "123456", new EMCallBack() {

            @Override
            public void onSuccess() {
//                if (!((Activity)context).isFinishing() && pd.isShowing()) {
//                    pd.dismiss();
//                }
//                Toast.makeText(context, "登录成功", Toast.LENGTH_SHORT).show();
                // ** 第一次登录或者之前logout后再登录，加载所有本地群和回话
                // ** manually load all local groups and
                EMClient.getInstance().groupManager().loadAllGroups();
                EMClient.getInstance().chatManager().loadAllConversations();

                // 更新当前用户的nickname 此方法的作用是在ios离线推送时能够显示用户nick
                GKApplication.currentUserNick = "陶邦平";
                EMClient.getInstance().updateCurrentUserNick(GKApplication.currentUserNick.trim());

                // 进入主页面
                Intent intent = new Intent(getReactApplicationContext(), GKIMChatPager.class);
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                intent.putExtra(Constant.EXTRA_USER_ID, "13913835065");
                intent.putExtra(Constant.EXTEND_ATTR_TO_DISPLAYNAME, "陶邦平");
                intent.putExtra(Constant.EXTRA_CHAT_TYPE, Constant.CHATTYPE_SINGLE);

                getReactApplicationContext().startActivity(intent);
            }

            @Override
            public void onProgress(int progress, String status) {
            }

            @Override
            public void onError(final int code, final String message) {
//                ((Activity)context).runOnUiThread(new Runnable() {
//                    public void run() {
//                        pd.dismiss();
//                Toast.makeText(context, "登录失败", Toast.LENGTH_SHORT).show();
                Log.e("tbp", "code=" + code + " ,msg=" + message);
//                    }
//                });
            }
        });
    }
}
