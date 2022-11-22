package com.unity.uprtech.service;

import android.util.Log;

import com.unity.uprtech.nativemodules.NativeWrappers;

import java.util.concurrent.ExecutorService;

public class GpuService {
    private ExecutorService gpuProfileService;
    public String type = "";
    public GpuService(){}


    public static String[] maligpuKey = new String[]{
            "GpuCycles",
            "ComputeCycles",
            "VertexCycles",
            "VertexComputeCycles",
            "FragmentCycles",
            "TilerCycles",

            "ComputeJobs",
            "VertexJobs",
            "VertexComputeJobs",
            "FragmentJobs",

            "InputPrimitives",
            "CulledPrimitives",
            "VisiblePrimitives",

            "Tiles",
            "TransactionEliminations",

            "EarlyZTests",
            "EarlyZKilled",
            "LateZTests",
            "LateZKilled",

            "ShaderComputeCycles",
            "ShaderFragmentCycles",
            "ShaderCycles",
            "ShaderArithmeticCycles",
            "ShaderInterpolatorCycles",
            "ShaderLoadStoreCycles",
            "ShaderTextureCycles",

            "ExternalMemoryReadAccesses",
            "ExternalMemoryWriteAccesses",
            "ExternalMemoryReadStalls",
            "ExternalMemoryWriteStalls",
            "ExternalMemoryReadBytes",
            "ExternalMemoryWriteBytes"};

    public boolean startMaliGpuProfiler() {
        return NativeWrappers.jni_hwcpipe_start();
    }

    public long[] getMaliGpuSnapshot() {
        Log.i("perfCat", "start mali init");
        return NativeWrappers.jni_hwcpipe_capture();
    }

    public int startAdrenoGpuProfiler(){
        Log.i("perfCat", "start adreno init");
        return NativeWrappers.jni_adreno_start();
    }

    public long[] getAdrenoGpuSnapshot(){
        return NativeWrappers.jni_adreno_capture();
    }

    public boolean startPVRGpuProfiler(){
        Log.i("perfCat", "start pvr init");
        return NativeWrappers.initPVRScope();
    }

    public float[] getPVRGpuSnapshot(){
//        int[] cpuMetric = NativeWrappers.returnCPUMetrics();
        float[] scopeData = NativeWrappers.returnPVRScope();
//        String[] s = NativeWrappers.returnPVRScopeStrings();
//        System.out.println(s.length);
//        System.out.println(scopeData.length);
//        for (int i = 0; i < s.length; i++){
//            System.out.printf("Get %s with value %f\n", s[i], scopeData[i]);
//        }
        return scopeData;
    }
    public boolean stopPVRGpuProfiler(){
        return NativeWrappers.deinitPVRScope();
    }
    public String[] getPVRGpuNames(){
        return NativeWrappers.returnPVRScopeStrings();
    }
}
