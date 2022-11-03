package com.unity.uprtech.service;
import android.app.ActivityManager;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.os.Build;
import android.os.Debug;
import android.os.IBinder;
import android.util.Log;

import com.unity.uprtech.service.proxy.IActivityManagerProxy;

import java.lang.reflect.Field;
import java.lang.reflect.Method;
import java.lang.reflect.Proxy;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class MemoryService extends Service {
    @Override
    public IBinder onBind(Intent intent) {
        int pid = intent.getIntExtra("pid", 14773);
//        new Thread(new Runnable() {
//            @Override
//            public void run() {
//                getDeviceMemoryInfo(pid);
//            }
//        }).start();
        return null;
    }
    private void getDeviceMemoryInfo(int pid, Context context){

        ActivityManager localActivityManager = (ActivityManager)context.getSystemService(Context.ACTIVITY_SERVICE); // use Context.ACTIVITY_SERVICE not the literal "activity"
        Debug.MemoryInfo[] procsMemInfo = localActivityManager.getProcessMemoryInfo(new int[]{pid});
        System.out.println(procsMemInfo.length);
        Debug.MemoryInfo memoryInfo = procsMemInfo[0];

        Log.d("uprtech", "memory start");
        try {
            while (true) {
                String memMessage = String.format("App Memory: Pss=%.2f MB\nPrivate=%.2f MB\nShared=%.2f MB",
                        memoryInfo.getTotalPss() / 1024.0,
                        memoryInfo.getTotalPrivateDirty() / 1024.0,
                        memoryInfo.getTotalSharedDirty() / 1024.0);
                System.out.println(memMessage);
                Log.i("uprtech", memMessage);
                Thread.sleep(3000);
            }
        }catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    private static Method GetMemoryReflectMethod(String str, Class<?>... clsArr){
        try{
            return Debug.MemoryInfo.class.getDeclaredMethod(str, clsArr);
        } catch (NoSuchMethodException e) {
            e.printStackTrace();
            return null;
        }
    }

    private static int GetMemoryReflectMethod(String str){
        try {
            return ((Integer) Debug.MemoryInfo.class.getDeclaredField(str).get(null)).intValue();
        } catch (Exception e) {
            e.printStackTrace();
            return -1;
        }
    }

    public static String GetMemoryInfo(Context context, int pid){
        Map<String, Object> memoryParam = new HashMap<>();
        List<Integer> memoryList = new ArrayList<>();
        Debug.MemoryInfo[] processMemoryInfo = ((ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE)).getProcessMemoryInfo(new int[]{pid});
        if (processMemoryInfo.length > 0) {
            memoryParam.put("totalprivatedirty",processMemoryInfo[0].getTotalPrivateDirty());
            memoryParam.put("totalswappablepss",processMemoryInfo[0].getTotalSwappablePss());
            memoryParam.put("totalpss",processMemoryInfo[0].getTotalPss());
            memoryParam.put("nativepss",processMemoryInfo[0].nativePss);
            Method getTotalSwappedOut = GetMemoryReflectMethod("getTotalSwappedOut", new Class[0]);
            Method getOtherLabel = GetMemoryReflectMethod("getOtherLabel", Integer.TYPE);
            Method getOtherPss = GetMemoryReflectMethod("getOtherPss", Integer.TYPE);
            Method getOtherPrivate = GetMemoryReflectMethod("getOtherPrivate", Integer.TYPE);
            int other_stats = GetMemoryReflectMethod("NUM_OTHER_STATS");
            int otherPss = processMemoryInfo[0].otherPss;
            int dalvikPrivateDirty = processMemoryInfo[0].dalvikPrivateDirty;
            memoryParam.put("totalpss", processMemoryInfo[0].getTotalPss() / 1024);
            if (getTotalSwappedOut != null) {
                try {
                    memoryParam.put("totalswappedout", ((Integer) getTotalSwappedOut.invoke(processMemoryInfo[0], new Object[0])).intValue() / 1024);
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
            memoryParam.put("nativePss", processMemoryInfo[0].nativePss);
            if (!(other_stats == -1 || getOtherPss == null)) {
                for (int i4 = 0; i4 < other_stats; i4++) {
                    try {
                        otherPss -= ((Integer) getOtherPss.invoke(processMemoryInfo[0], Integer.valueOf(i4))).intValue();
                        String str = (String) getOtherLabel.invoke(processMemoryInfo[0], Integer.valueOf(i4));
                        if (!str.equals("GL")) {
                            if (!str.equals("GL mtrack")) {
                                if (str.equals("Gfx dev")) {
                                    memoryList.add(((Integer) getOtherPss.invoke(processMemoryInfo[0], Integer.valueOf(i4))).intValue());
                                } else if (str.equals(".art mmap")) {
                                    dalvikPrivateDirty += ((Integer) getOtherPrivate.invoke(processMemoryInfo[0], Integer.valueOf(i4))).intValue();
                                }
                            }
                        }
                        memoryList.add(((Integer) getOtherPss.invoke(processMemoryInfo[0], Integer.valueOf(i4))).intValue());
                    } catch (Exception e2) {
                        e2.printStackTrace();
                        otherPss = otherPss;
                    }
                }
                memoryList.add(otherPss);
                memoryList.add(dalvikPrivateDirty);
            }
            memoryParam.put("paramlist", memoryList);
        }
        memoryParam.put("timestamp", new Date().getTime());
        return memoryParam.toString();
    }

    private static int GetTotalSwappedOut(Debug.MemoryInfo memoryInfo){
        if (Build.VERSION.SDK_INT > 26) {
            return Integer.parseInt(memoryInfo.getMemoryStat("summary.total-swap")) / 1024;
        }
        Method totalSwap = GetMemoryReflectMethod("getTotalSwappedOut", new Class[0]);
        if (totalSwap == null) {
            return -1;
        }
        try {
            return ((Integer) totalSwap.invoke(memoryInfo, new Object[0])).intValue() / 1024;
        } catch (Exception e) {
            Log.e("helloworld", "", e);
            return -1;
        }
    }

    public static long GetMemoryThreshold(Context context) {
        ActivityManager.MemoryInfo memoryInfo = new ActivityManager.MemoryInfo();
        ((ActivityManager) context.getSystemService(Context.ACTIVITY_SERVICE)).getMemoryInfo(memoryInfo);
        return (memoryInfo.threshold / 1024) / 1024;
    }


    public static void hookAms(int pid) throws ClassNotFoundException, NoSuchFieldException, IllegalAccessException {
        //Get gDefault object.
        Class activityManagerNativeClass = Class.forName("android.app.ActivityManagerNative");
        Field gDefaultField = activityManagerNativeClass.getDeclaredField("gDefault");
        gDefaultField.setAccessible(true);
        Object gDefault = gDefaultField.get(null);

        //Get IActivityManager object.
        Class<?> singletonClass = Class.forName("android.util.Singleton");
        Field mInstanceField = singletonClass.getDeclaredField("mInstance");
        mInstanceField.setAccessible(true);
        Object iActivityManager = mInstanceField.get(gDefault);

        Class<?> iActivityManagerClass = Class.forName("android.app.IActivityManager");
        //Generate iactivity proxy object.
        Object iActivityManagerProxy = Proxy.newProxyInstance(Thread.currentThread().getContextClassLoader(),
                new Class<?>[]{iActivityManagerClass}, new IActivityManagerProxy(iActivityManager));

        //Replace proxy object.
        mInstanceField.set(gDefault, iActivityManagerProxy);
        try{
            Method GetPss = iActivityManagerProxy.getClass().getMethod("getprocesspss");
            int[] pids = new int[]{pid};
            Object pss = GetPss.invoke(iActivityManagerProxy, pids);
            System.out.println(pss);
        }catch (Exception e){
            System.out.println("reflect get pss error: " + e);
        }
    }

}
