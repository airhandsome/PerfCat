package com.unity.uprtech.service;

import android.util.Log;

import com.unity.uprtech.nativemodules.NativeWrappers;

import org.json.JSONException;
import org.json.JSONObject;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ExecutorService;

public class GpuService {
    private ExecutorService gpuProfileService;
    public String type = "";
    public GpuService(){
        System.load("/data/local/tmp/libnative-lib.so");
    }

    public static String[] gpuKey = new String[]{
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

        return NativeWrappers.jni_hwcpipe_capture();
    }

    public int startAdrenoGpuProfiler(){
        return NativeWrappers.jni_adreno_start();
    }

    public long[] getAdrenoGpuSnapshot(){
        return NativeWrappers.jni_adreno_capture();
    }



}
