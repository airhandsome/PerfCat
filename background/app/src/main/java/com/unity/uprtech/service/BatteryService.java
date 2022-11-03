package com.unity.uprtech.service;

import android.content.Context;
import android.os.BatteryManager;


public class BatteryService {
    private int temperature;

    private BatteryManager manager;
    public BatteryService(Context context){
        manager = (BatteryManager)context.getSystemService(Context.BATTERY_SERVICE); // use Context.ACTIVITY_SERVICE not the literal "activity"

    }

    public int getBatteryTemp(){
        return manager.getIntProperty(BatteryManager.BATTERY_HEALTH_COLD);
    }

    public int getBatteryHealth(){
        return manager.getIntProperty(BatteryManager.BATTERY_PROPERTY_CAPACITY);
    }

}
