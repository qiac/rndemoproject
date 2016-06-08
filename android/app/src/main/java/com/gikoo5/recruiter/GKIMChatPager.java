package com.gikoo5.recruiter;

import android.content.Intent;
import android.os.Bundle;
import android.support.annotation.Nullable;
import android.support.v4.app.FragmentActivity;
import android.text.TextUtils;
import android.view.View;
import android.view.WindowManager.LayoutParams;
import android.widget.ImageView;
import android.widget.TextView;

import com.gikoo5.hyphenate.Constant;
import com.gikoo5.hyphenate.ui.ChatFragment;
import com.hyphenate.easeui.ui.EaseChatFragment;
import com.hyphenate.util.EasyUtils;

/**
 * Created by taobangping on 16/5/6.
 */
public class GKIMChatPager extends FragmentActivity implements View.OnClickListener {
    private EaseChatFragment mChatFragment;

    private TextView mChatTitle;
    private ImageView mChatBackBtn;

    // 界面传值
    private String mToChatUsername;
    private String mToChatDisplayname;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.gk_imchat_pager);
        getWindow().setLayout(LayoutParams.MATCH_PARENT, LayoutParams.MATCH_PARENT);

        mChatTitle = (TextView) findViewById(R.id.im_title_txt);
        mChatBackBtn = (ImageView) findViewById(R.id.im_back_btn);
        mChatBackBtn.setOnClickListener(this);

        // 聊天人或群id
        mToChatUsername = getIntent().getStringExtra(Constant.EXTRA_USER_ID);
        mToChatDisplayname = getIntent().getStringExtra(Constant.EXTEND_ATTR_TO_DISPLAYNAME);

        // 设置标题
        if(TextUtils.isEmpty(mToChatDisplayname) || "null".equals(mToChatDisplayname)) {
            mToChatDisplayname = "聊天中";
        }
        mChatTitle.setText(mToChatDisplayname);

        mChatFragment = new ChatFragment();
        //传入参数
        mChatFragment.setArguments(getIntent().getExtras());
        getSupportFragmentManager().beginTransaction().add(R.id.container, mChatFragment).commit();
    }

    @Override
    protected void onNewIntent(Intent intent) {
        // 点击notification bar进入聊天界面，保证只有一个聊天页面
        String username = intent.getStringExtra(Constant.EXTRA_USER_ID);
        if(mToChatUsername.equals(username)) {
            super.onNewIntent(intent);
        } else {
            finish();
            startActivity(intent);
        }
    }

    @Override
    public void onBackPressed() {
        mChatFragment.onBackPressed();
        if(EasyUtils.isSingleActivity(this)) {
            Intent intent = new Intent(this, MainActivity.class);
            startActivity(intent);
        }
    }

    @Override
    public void onClick(View view) {
        if(view == mChatBackBtn) {
            mChatFragment.onBackPressed();
        }
    }
}
