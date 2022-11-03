package com.unity.uprtech;


import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;

import com.unity.uprtech.service.MemoryService;

public class MainActivity extends Activity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        Intent intent = new Intent(this, MemoryService.class);
//        intent.putExtra("pid", 23642);
        startService(intent);
    }

}