/* Comments.java
   =============================================================================
                         Josh Talley and Daniel O'Donnell
                                Dulaney High School
                      Mobile Application Development 2016-17
   =============================================================================
   Purpose: This activity allows you to both add new comments, review existing
   comments posted on a sale item, and delete comments.
*/
package com.fbla.dulaney.fblayardsale;

import android.content.Context;
import android.databinding.DataBindingUtil;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.LinearLayoutManager;
import android.util.Log;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.Toast;

import com.fbla.dulaney.fblayardsale.controller.CommentListController;
import com.fbla.dulaney.fblayardsale.databinding.ActivityCommentsBinding;
import com.fbla.dulaney.fblayardsale.model.Account;
import com.fbla.dulaney.fblayardsale.model.ItemComment;
import com.microsoft.windowsazure.mobileservices.table.MobileServiceTable;

import java.util.UUID;

public class Comments extends AppCompatActivity implements View.OnClickListener, FblaAzure.LogonResultListener {
    private ActivityCommentsBinding mBinding;
    private MobileServiceTable<ItemComment> mCommentTable;
    private FblaAzure mAzure;

    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_comments);
        Bundle b = getIntent().getExtras();
        String userId = b.getString("userId");
        String token = b.getString("token");
        if (userId == null || token == null) {
            Toast.makeText(this, "Unable to connect to Azure. Please try again.", Toast.LENGTH_LONG).show();
            finish();
            return;
        }

        mAzure = new FblaAzure(this);
        mAzure.setLogonListener(this);
        mAzure.doLogon(userId, token);

        mBinding = DataBindingUtil.setContentView(this, R.layout.activity_comments);
        mBinding.post.setOnClickListener(this);
        mBinding.list.setLayoutManager(new LinearLayoutManager(this));
        setSupportActionBar(mBinding.myToolbar);

        mCommentTable = mAzure.getClient().getTable(ItemComment.class);

        Log.d("Comments", "onCreate");
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.post:
                if (!mBinding.newcomment.getText().toString().equals("")) {
                    addItem(v);
                }
                break;
            default:
                break;
        }
    }

    @Override
    public void onBackPressed()
    {
        this.finish();
    }

    // Add a new item to the database.
    private void addItem(View view) {
        if (!mAzure.getLoggedOn()) return;

        // Create a new comment from the ItemComment model.
        final ItemComment comment = new ItemComment();
        comment.setId(UUID.randomUUID().toString());
        comment.setComment(mBinding.newcomment.getText().toString());
        comment.setUserId(mAzure.getUserId());
        comment.setItemId(CommentListController.getItem().getId());
        comment.setAccount(mAzure.getAccount());
        CommentListController.addComment(comment);

        // Save the item to the database over the internet.
        AsyncTask<Void, Void, Void> task = new AsyncTask<Void, Void, Void>() {
            @Override
            protected Void doInBackground(Void... params) {
                try {
                    mCommentTable.insert(comment);
                    Log.d("Comments:insert", "Created comment " + comment.getComment());
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                        }
                    });
                } catch (Exception e) {
                    Log.d("Comments:insert", e.toString());
                }
                return null;
            }
        };
        task.executeOnExecutor(AsyncTask.SERIAL_EXECUTOR);
        if (this.getCurrentFocus() != null) {
            InputMethodManager imm = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
            imm.hideSoftInputFromWindow(this.getCurrentFocus().getWindowToken(), 0);
            mBinding.newcomment.setText("");
        }
    }

    @Override
    public void onLogonComplete(Exception e) {
        CommentsAdapter adapter = new CommentsAdapter(this, this, mAzure);
        CommentListController.AttachAdapter(adapter);
        mBinding.list.setAdapter(adapter);
    }
}
