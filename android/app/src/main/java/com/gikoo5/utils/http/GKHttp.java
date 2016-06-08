package com.gikoo5.utils.http;

import java.io.UnsupportedEncodingException;
import java.util.HashMap;
import java.util.Map;

import org.json.JSONException;
import org.json.JSONObject;

import com.android.volley.AuthFailureError;
import com.android.volley.DefaultRetryPolicy;
import com.android.volley.NetworkResponse;
import com.android.volley.Request.Method;
import com.android.volley.RequestQueue;
import com.android.volley.Response;
import com.android.volley.Response.ErrorListener;
import com.android.volley.Response.Listener;
import com.android.volley.VolleyError;
import com.android.volley.toolbox.HttpHeaderParser;
import com.android.volley.toolbox.JsonObjectRequest;
import com.android.volley.toolbox.Volley;
import com.gikoo5.utils.GKConstant;
import com.gikoo5.utils.GKPreferenceManager;

import android.content.Context;

public class GKHttp {
	// 默认超时时长1分钟
	public static final int DEFAULT_TIMEOUT = 1 * 60 * 1000;
	private static GKHttp mInstance = null;
	private static RequestQueue mRequestQueue;
	private GKHttp() {

	}

	public static void initVolley(Context context) {
		mRequestQueue = Volley.newRequestQueue(context);
	}

	public static GKHttp getInstance() {
		if (mInstance == null) {
			synchronized (GKHttp.class) {
				if (mInstance == null)
					mInstance = new GKHttp();
			}
		}
		return mInstance;
	}
	
	/**
	 * 设置请求头
	 * 
	 * @return
	 */
	private Map<String, String> getHttpHeader(boolean isAuth) {
		Map<String, String> headers = new HashMap<String, String>();
		headers.put("Content-Type", "application/json; charset=UTF-8");
		if (isAuth) {
			headers.put("Authorization", "Token " + GKPreferenceManager.getString(GKConstant.TOKEN, ""));
		}
		return headers;
	}

	/**
	 * 对返回值进行UTF-8编码
	 * 
	 * @param response
	 * @return
	 */
	@SuppressWarnings("unchecked")
	private Response<String> convertStringResponseEncode(NetworkResponse response) {
		String data = null;
		try {
			data = new String(response.data, "UTF-8");
		} catch (UnsupportedEncodingException e1) {
			e1.printStackTrace();
		}

		return Response.success(data, HttpHeaderParser.parseCacheHeaders(response));
	}

	private Response<JSONObject> convertJSONObjectResponseEncode(NetworkResponse response) {
		JSONObject jsonObj = null;
		String data = null;
		try {
			data = new String(response.data, "UTF-8");
		} catch (UnsupportedEncodingException e1) {
			e1.printStackTrace();
		}

		try {
			jsonObj = (JSONObject) new JSONObject(data);
		} catch (JSONException e) {
			e.printStackTrace();
		}

		return Response.success(jsonObj, HttpHeaderParser.parseCacheHeaders(response));
	}

	public void get(String url, String tag, final OnJsonHttpCallback callback) {
		get(url, tag, true, callback);
	}

	/**
	 * Get请求
	 * 
	 * @param url
	 * @param tag
	 * @param callback
	 */
	public void get(String url, String tag, final boolean isAuth, final OnJsonHttpCallback callback) {
		mRequestQueue.cancelAll(tag);
		Listener<JSONObject> success = new Listener<JSONObject>() {
			@Override
			public void onResponse(JSONObject response) {
				if (callback != null) {
					callback.onSuccess(response);
				}
			}
		};
		ErrorListener error = new ErrorListener() {
			@Override
			public void onErrorResponse(VolleyError error) {
				if (callback != null) {
					callback.onFailure(error);
				}
			}
		};
		JsonObjectRequest request = new JsonObjectRequest(Method.GET, url, null, success, error) {
			@Override
			public Map<String, String> getHeaders() throws AuthFailureError {
				return getHttpHeader(isAuth);
			}

			@Override
			protected Response<JSONObject> parseNetworkResponse(NetworkResponse response) {
				return convertJSONObjectResponseEncode(response);
			}
		};

		request.setTag(tag);
		request.setRetryPolicy(new DefaultRetryPolicy(DEFAULT_TIMEOUT, 0, 0));
		mRequestQueue.add(request);
	}

	public void post(String url, String tag, final OnJsonHttpCallback callback) {
		get(url, tag, true, callback);
	}

	/**
	 * Post请求
	 * 
	 * @param url
	 * @param params
	 * @param tag
	 * @param callback
	 */
	public void post(String url, Map<String, Object> params, String tag, final boolean isAuth, final OnJsonHttpCallback callback) {
		mRequestQueue.cancelAll(tag);
		Listener<JSONObject> success = new Listener<JSONObject>() {
			@Override
			public void onResponse(JSONObject response) {
				if (callback != null) {
					callback.onSuccess(response);
				}
			}
		};
		ErrorListener error = new ErrorListener() {
			@Override
			public void onErrorResponse(VolleyError error) {
				if (callback != null) {
					callback.onFailure(error);
				}
			}
		};
		JsonObjectRequest request = new JsonObjectRequest(Method.POST, url, new JSONObject(params), success, error) {
			@Override
			public Map<String, String> getHeaders() throws AuthFailureError {
				return getHttpHeader(isAuth);
			}

			@Override
			protected Response<JSONObject> parseNetworkResponse(NetworkResponse response) {
				return convertJSONObjectResponseEncode(response);
			}
		};

		request.setTag(tag);
		request.setRetryPolicy(new DefaultRetryPolicy(DEFAULT_TIMEOUT, 0, 0));
		mRequestQueue.add(request);
	}
	
	
	/**
	 * put请求
	 * 
	 * @param url
	 * @param tag
	 * @param callback
	 */
	public void put(String url,Map<String, Object> params, String tag, final boolean isAuth, final OnJsonHttpCallback callback) {
		mRequestQueue.cancelAll(tag);
		Listener<JSONObject> success = new Listener<JSONObject>() {
			@Override
			public void onResponse(JSONObject response) {
				if (callback != null) {
					callback.onSuccess(response);
				}
			}
		};
		ErrorListener error = new ErrorListener() {
			@Override
			public void onErrorResponse(VolleyError error) {
				if (callback != null) {
					callback.onFailure(error);
				}
			}
		};
		JsonObjectRequest request = new JsonObjectRequest(Method.PUT, url, new JSONObject(params), success, error) {
			@Override
			public Map<String, String> getHeaders() throws AuthFailureError {
				return getHttpHeader(isAuth);
			}

			@Override
			protected Response<JSONObject> parseNetworkResponse(NetworkResponse response) {
				return convertJSONObjectResponseEncode(response);
			}
		};

		request.setTag(tag);
		request.setRetryPolicy(new DefaultRetryPolicy(DEFAULT_TIMEOUT, 0, 0));
		mRequestQueue.add(request);
	}
	
	public void cancel(String tag){
		mRequestQueue.cancelAll(tag);
	}
}
