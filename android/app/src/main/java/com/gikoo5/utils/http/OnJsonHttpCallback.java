package com.gikoo5.utils.http;

import org.json.JSONObject;

import com.android.volley.VolleyError;

public interface OnJsonHttpCallback {
	public void onSuccess(JSONObject response);
	public void onFailure(VolleyError error);
}
