package com.unity.uprtech;

import android.app.ActivityManager;
import android.content.Context;
import android.app.ActivityThread;
import android.os.Looper;
import android.os.Process;
import android.util.Log;

import com.unity.uprtech.service.BatteryService;
import com.unity.uprtech.service.CpuService;
import com.unity.uprtech.service.GpuService;
import com.unity.uprtech.service.MemoryService;

import org.apache.commons.cli.CommandLine;
import org.apache.commons.cli.CommandLineParser;
import org.apache.commons.cli.DefaultParser;
import org.apache.commons.cli.Options;
import org.apache.commons.cli.ParseException;

import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.PrintStream;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.List;

//adb shell "CLASSPATH=/data/local/tmp/test.jar app_process /data/local/tmp com.unity.uprtech.PerfCat -g"
public class PerfCat {
    private Context context = null;
    private Boolean keepCatch = true;
    private static String[] AdrenoType = {"Adreno a5xx", "Adreno a6xx"};
    private GpuService gpu = new GpuService();
    static {
        try{
            System.load("/data/local/tmp/libnative-lib.so");
        }catch (Exception e){
            Log.i("perfCat", "load so error");
        }
    }
    public static void main(String[] args){
        PerfCat cat = new PerfCat();
        PrintStream printStream = System.out;

        if (args.length == 0){
            try{
                PrintStream printStream2 = new PrintStream(new FileOutputStream("/dev/null"));
                System.setOut(printStream2);
                System.setErr(printStream2);
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            }
        }

        Looper.prepareMainLooper();
//        try{
//            cat.context = ActivityThread.systemMain().getSystemContext();
//        }catch (Exception e){
//            System.out.println("Get context error");
//        }
        //set parser options
        Options options = new Options();

        options.addOption("check", false, "check if the gpu can get");
        options.addOption("stop", false, "stop gpu initialized");
        options.addOption("g", "gpu", false, "get Gpu profiler");
        options.addOption("b", "battery",false, "get Battery");

        //need parameter
        options.addOption("c", "cpu",true, "get cpu usage of packageName");
        options.addOption("m", "memory",true, "get Pss of the packageName");
        options.addOption("p","pid", true, "get Pid of the packageName");

        //start parse args
        try{
            Method setArgV0 = Process.class.getDeclaredMethod("setArgV0", String.class);
            setArgV0.setAccessible(true);
            setArgV0.invoke(null,"UprTechExt");


            CommandLineParser parser = new DefaultParser();
            CommandLine cmd = parser.parse(options, args);
            if (cmd.hasOption("check")){
                Log.i("PerfCat","start check");
                int res = cat.CheckAdrenoGpuAvailable();
                if (res >= 0){
                    System.out.println(AdrenoType[res]);
                }else if (cat.CheckMaliGpuAvailable()){
                    System.out.println("mali");
                }else if (cat.CheckPowerVRAvailable()){
                    System.out.println("power vr");

                    String[] names = cat.GetPowerVRNames();
                    for (String name:names) {
                        System.out.println(name);
                    }
                }else{
                    System.out.println("null");
                }
            }
            if (cmd.hasOption("stop")){
                System.out.println(cat.ClosePowerVR());
            }
            if (cmd.hasOption("g")){
                cat.GetGpuSnapshot();
            }
            if (cmd.hasOption("m")){
                String packageName = cmd.getOptionValue("m");
                cat.GetMemoryMessage(packageName);
            }
            if (cmd.hasOption("c")){
                String packageName = cmd.getOptionValue("c");
                cat.GetCpuMessage(packageName);
            }
            if (cmd.hasOption("b")){
                cat.GetBatteryMessage();
            }
        } catch (ParseException | NoSuchMethodException e) {
            // oops, something went wrong
            System.err.println("Parsing failed.  Reason: " + e.getMessage());
        } catch (IllegalAccessException e) {
            e.printStackTrace();
        } catch (InvocationTargetException e) {
            e.printStackTrace();
        }
    }


    private void GetGpuSnapshot(){
        if (gpu.startAdrenoGpuProfiler() >= 0){
            gpu.type = "adreno";
        }else if (gpu.startMaliGpuProfiler()){
            gpu.type = "mali";
        }else if (gpu.startPVRGpuProfiler()){
            gpu.type = "pvr";
        }
        else{
            System.out.println("Can't support such gpu type");
        }
        try{
            while(keepCatch){
                long[] gpuSnapshot = new long[1];
                float[] pvrGpuSnapshot = new float[1];
                if (gpu.type == "adreno"){
                    gpuSnapshot = gpu.getAdrenoGpuSnapshot();
                }else if (gpu.type == "mali"){
                    gpuSnapshot = gpu.getMaliGpuSnapshot();
                }else if (gpu.type == "pvr"){
                    pvrGpuSnapshot = gpu.getPVRGpuSnapshot();
                }
                else{
                    break;
                }
                if (gpuSnapshot.length > 1){
                    System.out.print(gpuSnapshot[0]);
                    for (int i=1; i<gpuSnapshot.length; i++){
                        System.out.print("," + gpuSnapshot[i]);
                    }
                    System.out.println();
                }

                if (pvrGpuSnapshot.length > 1){
                    System.out.print(pvrGpuSnapshot[0]);
                    for (int i=1; i<pvrGpuSnapshot.length; i++){
                        System.out.print("," + pvrGpuSnapshot[i]);
                    }
                    System.out.println();
                }
                Thread.sleep(1000);

            }
        }catch (Exception e){
            System.out.println("Get Gpu Snapshot with error : " + e );
        }

    }

    private boolean CheckMaliGpuAvailable(){
        try{
            return gpu.startMaliGpuProfiler();
        }catch (Exception e){
            System.out.println(e);
            return false;
        }
    }

    private int CheckAdrenoGpuAvailable(){
        try{
            return gpu.startAdrenoGpuProfiler();
        }catch (Exception e){
            System.out.println(e);
            return -1;
        }
    }

    private boolean CheckPowerVRAvailable(){
        try{
            return gpu.startPVRGpuProfiler();
        }catch (Exception e){
            System.out.println(e);
            return false;
        }
    }
    private String[] GetPowerVRNames(){
        try{
            return gpu.getPVRGpuNames();
        }catch (Exception e){
            return new String[]{};
        }
    }

    private boolean ClosePowerVR(){
        try{
            return gpu.stopPVRGpuProfiler();
        }catch (Exception e){
            System.out.println(e);
            return false;
        }
    }

    private void GetMemoryMessage(String packageName){
        try{
            int pid = GetPidByPackageName(packageName);
            if (pid == -1){
                System.out.println("package name is not exist in the process");
                return;
            }

            MemoryService mService = new MemoryService();
            MemoryService.hookAms(pid);
//            String memory = mService.GetMemoryInfo(context, pid);
//            System.out.println(memory);
        }catch (Exception e){
            e.printStackTrace();
        }
    }

    private int GetPidByPackageName(String packageName){
        ActivityManager localActivityManager = (ActivityManager)context.getSystemService(Context.ACTIVITY_SERVICE); // use Context.ACTIVITY_SERVICE not the literal "activity"
        List<ActivityManager.RunningAppProcessInfo> procsInfo = localActivityManager.getRunningAppProcesses();
        for (int i = 0; i < procsInfo.size(); i++) {
            ActivityManager.RunningAppProcessInfo info = procsInfo.get(i);
            if (info.processName.equalsIgnoreCase(packageName)){
                return info.pid;
            }
        }
        return -1;
    }

    private void GetCpuMessage(String packageName) {
        int pid = GetPidByPackageName(packageName);
        if (pid == -1){
            System.out.println("package name is not exist in the process");
            return;
        }
        try{
            CpuService cpu = new CpuService();
            System.out.println();
            cpu.GetCpuInfo(pid);
        }catch (Exception e){
            System.err.println("Get Cpu Failed.  Reason: " + e.getMessage());
        }

    }

    private void GetBatteryMessage(){
        try{
            BatteryService battery = new BatteryService(this.context);
            System.out.println(battery.getBatteryTemp());
        }catch (Exception e){
            System.err.println("Get Battery Failed.  Reason: " + e.getMessage());
        }
    }
}
