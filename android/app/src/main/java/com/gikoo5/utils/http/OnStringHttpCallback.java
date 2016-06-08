package com.gikoo5.utils.http;

import com.android.volley.VolleyError;

public interface OnStringHttpCallback {
	public void onSuccess(String response);
	public void onFailure(VolleyError error);
}
