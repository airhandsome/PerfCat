package com.unity.uprtech.nativemodules;

public class NativeWrappers {

    public static native boolean jni_hwcpipe_start();

    public static native long[] jni_hwcpipe_capture();

    public static native int jni_adreno_start();

    public static native long[] jni_adreno_capture();

    public static native boolean initPVRScope();

    public static native boolean deinitPVRScope();

    public static native int[] returnCPUMetrics();

    public static native float[] returnPVRScope();

    public static native String[] returnPVRScopeStrings();

}
