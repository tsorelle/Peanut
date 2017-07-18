<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 7/1/2017
 * Time: 7:27 AM
 */
include "minify-js.php";

function minifyScript($name, $srcDir, $destDir = null) {
    print "Minifying $name from $srcDir...";
    if (empty($destDir)) {
        $destDir = $srcDir;
    }
    $contents = file_get_contents($srcDir.'\\'.$name.'.js');
    $result = minify_js($contents);
    print "\nWriting $name to $destDir...\n";
    file_put_contents($destDir.'\\'.$name.'.min.js',$result);
    print "Done with $name\n";
}

$fileRoot = realpath(__DIR__.'/..');

minifyScript('peanut',$fileRoot.'/pnut/dist');
minifyScript('loader',$fileRoot.'/pnut/core',$fileRoot.'/pnut/dist');

print "Done";