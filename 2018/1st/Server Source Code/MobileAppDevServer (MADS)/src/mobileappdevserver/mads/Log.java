/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package mobileappdevserver.mads;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;

/**
 *
 * @author cdsei
 */
public class Log {
    private static final DateFormat headerFormat;
    static {
        headerFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    }
    public static void m(String message) {
        String header = "[" + headerFormat.format(new Date()) + "] ";
        System.out.println(header + message);
    }
}
