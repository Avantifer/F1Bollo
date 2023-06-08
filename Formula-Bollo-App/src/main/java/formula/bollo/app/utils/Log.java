package formula.bollo.app.utils;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class Log {
    
    public static final Logger logger = LoggerFactory.getLogger(Log.class);
    private static StackTraceElement logStatement = Thread.currentThread().getStackTrace()[0];
    
    private Log() {}
    
    /**
     * Shows a log with an error message.
     * @param errorMessage Message to be displayed in the error.
     * @param e The error object.
    */
    public static void error(String errorMessage, Object e){
        logStatement = Thread.currentThread().getStackTrace()[2];
        String messageFromatted = String.format("%s:%d - %s - %s", logStatement.getClassName(), logStatement.getLineNumber(), errorMessage, e);
        logger.error(messageFromatted);
    }
    
    /**
     * Puts a log with an informative message.
     * @param infoMessage Message to be displayed in the log.
    */
    public static void info(String infoMessage) {
        logStatement = Thread.currentThread().getStackTrace()[2];
        String messageFromatted = String.format("%s:%d - %s", logStatement.getClassName(), logStatement.getLineNumber(), infoMessage);
        logger.info(messageFromatted);
    }
}
