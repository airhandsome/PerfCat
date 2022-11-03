package com.unity.uprtech.service;


import android.os.Build;
import java.io.File;
import java.io.FileFilter;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

public class CpuService {
    public static final int PROC_TERM_MASK = 0xff;
    public static final int PROC_ZERO_TERM = 0;
    public static final int PROC_SPACE_TERM = (int)' ';
    public static final int PROC_TAB_TERM = (int)'\t';
    public static final int PROC_NEWLINE_TERM = (int) '\n';
    public static final int PROC_COMBINE = 0x100;
    public static final int PROC_PARENS = 0x200;
    public static final int PROC_QUOTES = 0x400;
    public static final int PROC_CHAR = 0x800;
    public static final int PROC_OUT_STRING = 0x1000;
    public static final int PROC_OUT_LONG = 0x2000;
    public static final int PROC_OUT_FLOAT = 0x4000;

    private static final int[] PROCESS_STATS_FORMAT = new int[] {
            PROC_SPACE_TERM,
            PROC_SPACE_TERM|PROC_PARENS,
            PROC_SPACE_TERM,
            PROC_SPACE_TERM,
            PROC_SPACE_TERM,
            PROC_SPACE_TERM,
            PROC_SPACE_TERM,
            PROC_SPACE_TERM,
            PROC_SPACE_TERM,
            PROC_SPACE_TERM|PROC_OUT_LONG,                  // 9: minor faults
            PROC_SPACE_TERM,
            PROC_SPACE_TERM|PROC_OUT_LONG,                  // 11: major faults
            PROC_SPACE_TERM,
            PROC_SPACE_TERM|PROC_OUT_LONG,                  // 13: utime
            PROC_SPACE_TERM|PROC_OUT_LONG                   // 14: stime
    };

    private static final int[] SYSTEM_CPU_FORMAT = new int[] {
            PROC_SPACE_TERM|PROC_COMBINE,
            PROC_SPACE_TERM|PROC_OUT_LONG,                  // 1: user time
            PROC_SPACE_TERM|PROC_OUT_LONG,                  // 2: nice time
            PROC_SPACE_TERM|PROC_OUT_LONG,                  // 3: sys time
            PROC_SPACE_TERM|PROC_OUT_LONG,                  // 4: idle time
            PROC_SPACE_TERM|PROC_OUT_LONG,                  // 5: iowait time
            PROC_SPACE_TERM|PROC_OUT_LONG,                  // 6: irq time
            PROC_SPACE_TERM|PROC_OUT_LONG                   // 7: softirq time
    };

    private long[] lastStatsData = null;
    private long[] lastSysCpu = null;
    private boolean firstCpu = false;
    private int cpuCores = -1;

    public CpuService(){
        cpuCores = getNumberOfCPUCores();
    }
    public void GetCpuInfo(int pid) throws NoSuchMethodException, InvocationTargetException, IllegalAccessException, InterruptedException {
        long[] statsData = new long[4]; //utime stime cutime cstime
        long[] sysCpu = new long[7];

        Method readProcFile = android.os.Process.class.getMethod("readProcFile", String.class, int[].class, String[].class, long[].class, float[].class);
        readProcFile.setAccessible(true);
        boolean process = (Boolean)readProcFile.invoke(null, "/proc/" + pid + "/stat", PROCESS_STATS_FORMAT, null, statsData, null);
        boolean system = (Boolean)readProcFile.invoke(null, "/proc/stat", SYSTEM_CPU_FORMAT, null, sysCpu, null);
        if (!firstCpu){
            firstCpu = true;
            lastStatsData = statsData.clone();
            lastSysCpu = sysCpu.clone();
            Thread.sleep(1000);
            GetCpuInfo(pid);
        }else {
            float cpuTotalDiff = TotalCount(sysCpu) - TotalCount(lastSysCpu);
            float processDiff = statsData[2] + statsData[3] - lastStatsData[2] - lastStatsData[3];
            if (cpuTotalDiff > 0) {
                float processCpuUsage = processDiff / cpuTotalDiff;
                System.out.println("Process Cpu Usage is: " + processCpuUsage * 100 + "%  with cpu cores: " + cpuCores);

                float cpuUsage = (cpuTotalDiff - sysCpu[3] + lastSysCpu[3]) / cpuTotalDiff;
                System.out.println("Total Cpu Usage is: " + cpuUsage * 100 + "%  with cpu cores: " + cpuCores);
            }


            lastStatsData = statsData.clone();
            lastSysCpu = sysCpu.clone();
        }
    }

    private float TotalCount(long[] data){
        float sum = 0;
        for (int i=0; i<data.length; i++)
            sum += data[i];
        return (float)sum;
    }

    public int getNumberOfCPUCores() {
        if (Build.VERSION.SDK_INT <= Build.VERSION_CODES.GINGERBREAD_MR1) {
            // Gingerbread doesn't support giving a single application access to both cores, but a
            // handful of devices (Atrix 4G and Droid X2 for example) were released with a dual-core
            // chipset and Gingerbread; that can let an app in the background run without impacting
            // the foreground application. But for our purposes, it makes them single core.
            return 1;
        }
        int cores;
        try {
            cores = new File("/sys/devices/system/cpu/").listFiles(CPU_FILTER).length;
        } catch (SecurityException e) {
            return 0;
        } catch (NullPointerException e) {
            return 0;
        }
        return cores;
    }


    private static final FileFilter CPU_FILTER = new FileFilter() {
        public boolean accept(File pathname) {
            String path = pathname.getName();
            //regex is slow, so checking char by char.
            if (path.startsWith("cpu")) {
                for (int i = 3; i < path.length(); i++) {
                    if (path.charAt(i) < '0' || path.charAt(i) > '9') {
                        return false;
                    }
                }
                return true;
            }
            return false;
        }
    };
}
