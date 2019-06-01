/* MySalesController.java
   =============================================================================
                         Josh Talley and Daniel O'Donnell
                                Dulaney High School
                      Mobile Application Development 2016-17
   =============================================================================
   Purpose: Used by MySalesFragment to control access to the list of Sale Items owned
   by the user. Attaching a recycler view to the class so that when the list of
   items is refreshed or changed, the recycler view is notified of that change.

   Items are fetched from the SaleItem table. Then for each item, the number of
   comments are counted from the ItemComment table in order to display it on
   the comments button.

   Pictures for each item are fetched from Azure storage using FblaPicture.

*/
package com.fbla.dulaney.fblayardsale.controller;

import android.graphics.Bitmap;
import android.os.AsyncTask;
import android.support.v7.widget.RecyclerView;
import android.util.Log;

import com.fbla.dulaney.fblayardsale.FblaAzure;
import com.fbla.dulaney.fblayardsale.FblaPicture;
import com.fbla.dulaney.fblayardsale.model.ItemComment;
import com.fbla.dulaney.fblayardsale.model.SaleItem;
import com.microsoft.windowsazure.mobileservices.MobileServiceList;
import com.microsoft.windowsazure.mobileservices.table.MobileServiceTable;

import java.util.ArrayList;

public class MySalesController {
    private static ArrayList<SaleItem> mSaleItems = new ArrayList<>();
    private static ArrayList<RecyclerView.Adapter> mAdapters = new ArrayList<>();

    public static void AttachAdapter(RecyclerView.Adapter adapter) {
        mAdapters.add(adapter);
    }

    public static int getItemCount() {
        return mSaleItems.size();
    }

    public static SaleItem getItem(int position) {
        if (mSaleItems.size() > position) return mSaleItems.get(position);
        else return null;
    }

    public static void notifyItem(SaleItem item) {
        if (mSaleItems.contains(item)) {
            int position = mSaleItems.indexOf(item);
            for (RecyclerView.Adapter adapter : mAdapters) {
                adapter.notifyItemChanged(position);
            }
        }
    }

    public static void addItem(SaleItem item) {
        mSaleItems.add(item);
        for (RecyclerView.Adapter adapter : mAdapters) {
            adapter.notifyDataSetChanged();
        }
    }

    public static void removeItem(int position) {
        mSaleItems.remove(position);
        for (RecyclerView.Adapter adapter : mAdapters) {
            adapter.notifyDataSetChanged();
        }
    }

    private static MobileServiceTable<SaleItem> mSaleItemTable;
    private static MobileServiceTable<ItemComment> mItemCommentTable;
    public static void Refresh(FblaAzure azure) {
        Log.d("MySalesController", "Refresh");
        if (!azure.getLoggedOn()) return;
        mSaleItems.clear();

        mSaleItemTable = azure.getClient().getTable(SaleItem.class);
        mItemCommentTable = azure.getClient().getTable(ItemComment.class);
        new AsyncTask<Object, Object, Object>() {
            class TaskResult {
                public FblaAzure azure;
                public ArrayList<SaleItem> saleItems;

                public TaskResult (FblaAzure a) {
                    azure = a;
                    saleItems = new ArrayList<>();
                }
            }

            @Override
            protected Object doInBackground(Object... params) {
                try {
                    FblaAzure azure = (FblaAzure)params[0];
                    TaskResult taskResult = new TaskResult(azure);
                    final MobileServiceList<SaleItem> result =
                            mSaleItemTable.where().field("userid").eq(azure.getUserId()).execute().get();
                    for (SaleItem s : result) {
                        final MobileServiceList<ItemComment> cnt =
                                mItemCommentTable.where().field("itemid").eq(s.getId()).includeInlineCount().execute().get();
                        s.setNumComments(cnt.getTotalCount());
                        // Now get the picture, if it exists.
                        if (s.getHasPicture())
                            s.setPicture(FblaPicture.DownloadImage(s.getId()));
                        taskResult.saleItems.add(s);
                    }
                    return taskResult;
                } catch (Exception exception) {
                    Log.e("MySalesController", exception.toString());
                    return null;
                }
            }
            @Override
            protected void onPostExecute(Object result) {
                if (result != null) {
                    TaskResult taskResult = (TaskResult)result;
                    for (SaleItem item : taskResult.saleItems) {
                        item.setAccount(taskResult.azure.getAccount());
                        mSaleItems.add(item);
                    }
                    Log.d("MySalesController", "Set Notify");
                    for (RecyclerView.Adapter adapter : mAdapters) {
                        adapter.notifyDataSetChanged();
                    }
                }
            }
        }.execute(azure);
    }
}
