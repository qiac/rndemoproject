package com.hyphenate.easeui.adapter;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import com.hyphenate.easeui.R;

/**
 * An array adapter that knows how to render views when given CustomData classes
 */
public class GKStoreImageAdapter extends ArrayAdapter<String> {
    private LayoutInflater mInflater;

    public GKStoreImageAdapter(Context context, String[] values) {
        super(context, R.layout.gk_store_image_item, values);
        mInflater = (LayoutInflater) getContext().getSystemService(Context.LAYOUT_INFLATER_SERVICE);
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        Holder holder;

        if (convertView == null) {
            // Inflate the view since it does not exist
            convertView = mInflater.inflate(R.layout.gk_store_image_item, parent, false);

            // Create and save off the holder in the tag so we get quick access to inner fields
            // This must be done for performance reasons
            holder = new Holder();
            holder.imageView = (ImageView) convertView.findViewById(R.id.imageView);
            convertView.setTag(holder);
        } else {
            holder = (Holder) convertView.getTag();
        }

        return convertView;
    }

    /**
     * View holder for the views we need access to
     */
    private static class Holder {
        public ImageView imageView;
    }
}
