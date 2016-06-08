/**
 * Copyright (C) 2016 Hyphenate Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.gikoo5.hyphenate;

import android.app.Application;
import android.content.Context;

import cn.jpush.android.api.JPushInterface;

public class GKApplication extends Application {

	public static Context applicationContext;
	private static GKApplication instance;
	// login user name
	public final String PREF_USERNAME = "username";
	
	/**
	 * 当前用户nickname,为了苹果推送不是userid而是昵称
	 */
	public static String currentUserNick = "";

	@Override
	public void onCreate() {
		super.onCreate();
        applicationContext = this;
        instance = this;
        
        EMHelper.getInstance().init(applicationContext);

		JPushInterface.setDebugMode(true);
		JPushInterface.init(this);
	}

	public static GKApplication getInstance() {
		return instance;
	}
}
