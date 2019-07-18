package com.duck.trackshare;

import android.annotation.TargetApi;
import android.content.Context;
import android.os.Build;

import com.umeng.commonsdk.UMConfigure;

import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;

public class TrackShare {

    /**
     * 注意: 即使您已经在AndroidManifest.xml中配置过appkey和channel值，
     * 也需要在App代码中调用初始化接口（如需要使用AndroidManifest.xml中配置好的appkey和channel值，UMConfigure
     * .init调用中appkey和channel参数请置为null）。
     *
     * @param context
     */
    public static void init(Context context) {
        UMConfigure.init(context, "appkey", "channel", UMConfigure.DEVICE_TYPE_PHONE, null);
        UMConfigure.setLogEnabled(true);
    }

    @TargetApi(Build.VERSION_CODES.KITKAT)
    private static void initRN(String v, String t) {
        Method method = null;
        try {
            Class<?> config = Class.forName("com.umeng.commonsdk.UMConfigure");
            method = config.getDeclaredMethod("setWraperType", String.class, String.class);
            method.setAccessible(true);
            method.invoke(null, v, t);
        } catch (NoSuchMethodException | InvocationTargetException | IllegalAccessException | ClassNotFoundException e) {
            e.printStackTrace();
        }
    }
}