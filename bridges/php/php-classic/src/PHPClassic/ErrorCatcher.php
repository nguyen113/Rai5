<?php

namespace PHPClassic;

use PHPClassic\ErrorCatcherException;

/**
 * This class allows you to use override default php exception handler
 *
 * @author Jonas Sciangula Street <joni2back {at} gmail.com>
 * @todo Method to set view template and remove html code from draw() method
 * @todo Avoid the use of highlight_string() to make php syntax highlight
 */

class ErrorCatcher
{
    /**
     * @var \Closure
     */
    public static $callback;

    /**
     * @var bool
     */
    protected static $enabled = false;

    /**
     * @param int $errno
     * @param string $errstr
     * @param string $errfile
     * @param int $errline
     * @throws ErrorCatcherException
     */
    public static function handle($errno, $errstr, $errfile, $errline)
    {
        $oException = static::buildException($errstr, $errno, $errfile, $errline);
        throw $oException;
    }

    /**
     * @param string $message
     * @param int $code
     * @param string $filename
     * @param int $lineno
     * @return \PHPClassic\ErrorCatcherException
     */
    protected static function buildException($message, $code, $filename, $lineno)
    {
        return new ErrorCatcherException($message, $code, 0, $filename, $lineno);
    }

    /**
     * @param \Closure $callback
     * @return void
     */
    public static function onFatal(\Closure $callback)
    {
        static::$callback = $callback;
    }

    /**
     * @return void
     */
    public static function handleFatal()
    {
        if (static::$enabled && is_callable(static::$callback) &&
            $err = error_get_last()) {
            if ($err['type'] !== \E_ERROR) {
                return;
            }
            if (ob_get_contents()) {
                ob_clean();
            }
            $msg = null; @preg_match("/(ge\s\'(.*)\')/", $err['message'], $msg);
            $msg = isset($msg[2]) ? $msg[2] : $err['message'];
            call_user_func(static::$callback, static::buildException(
                $msg, $err['type'], $err['file'], $err['line'])
            );
        }
    }

    /**
     * @return void
     */
    public static function register()
    {
        static::$enabled = true;
        set_error_handler(array(__CLASS__, "handle"));
        register_shutdown_function(array(__CLASS__, "handleFatal"));
    }

    /**
     * @return void
     */
    public static function unregister()
    {
        restore_error_handler();
        static::$enabled = false;
        static::$callback = null;
    }
}