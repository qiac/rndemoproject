package com.gikoo5.hyphenate.parse;

import android.content.Context;

import com.hyphenate.EMValueCallBack;
import com.hyphenate.easeui.domain.EaseUser;

import java.util.List;

public class ParseManager {
	private static ParseManager instance = new ParseManager();
	

	private ParseManager() {
	}

	public static ParseManager getInstance() {
		return instance;
	}

	public void onInit(Context context) {
		
	}

	public boolean updateParseNickName(final String nickname) {
		return false;
	}

	public void getContactInfos(List<String> usernames, final EMValueCallBack<List<EaseUser>> callback) {
		
	}

	
	public void asyncGetCurrentUserInfo(final EMValueCallBack<EaseUser> callback){
		
	}
	
	public void asyncGetUserInfo(final String username,final EMValueCallBack<EaseUser> callback){
		
	}

	public String uploadParseAvatar(byte[] data) {
		
		return null;
	}
}
