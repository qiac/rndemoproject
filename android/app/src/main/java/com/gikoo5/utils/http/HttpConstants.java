package com.gikoo5.utils.http;

public class HttpConstants {
	
	/**是否是DEV环境*/
	private static boolean IS_DEV = false;
	
	/**
	 * 服务地址
	 */
	private static final String SERVER = IS_DEV ? "http://mps5job.gikoo.cn/api/v1/" : "http://youth.gikoo.cn/api/v1/";
	
	/**
	 * 服务地址2
	 */
	private static final String SERVER2 = IS_DEV ? "http://mps5job.gikoo.cn/api/v1/" : "http://job.gikoo.cn/api/v1/";
	
	/**
	 * 通过ApplicationID来请求联系人信息
	 */
	public static final String GET_USER_INFOS = SERVER+"recruit/im/applications/?app_ids=";
}
