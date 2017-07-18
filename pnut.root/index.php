<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 4/27/2017
 * Time: 8:29 AM
 */
include __DIR__.'/pnutcms/src/CmsController.php';
$pnutcms = \Peanut\cms\CmsController::Start(__DIR__);
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">


    <title>Peanut 2017</title>

    <!-- link rel="stylesheet" type="text/css"href="styles/bootstrap-3.3.7/bootstrap.min.css" / -->
    <link rel="stylesheet" type="text/css"href="assets/themes/cerulean/bootstrap.min.css" />

    <?php
        if($pnutcms->getScriptDebug()):
            $debugMode = 'Distribution: DEBUG'
            ?>
        <script src='assets/js/libraries/head.load.js'></script>
        <script src='assets/js/libraries/jquery-1.12.4.js'></script>
        <script src='assets/js/libraries/bootstrap-3.3.7.js'></script>
        <script src='assets/js/libraries/knockout-3.4.2-debug.js'></script>
        <script src="modules/pnut/core/PeanutLoader.js"></script>
    <?php else:
        $debugMode = 'Distribution: OPTIMIZED'
        ?>
        <script src="http://cdnjs.cloudflare.com/ajax/libs/headjs/1.0.3/head.load.min.js"></script>
        <script src='http://code.jquery.com/jquery-1.12.4.min.js'></script>
        <script src='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js'></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/knockout/3.4.1/knockout-min.js"></script>
        <script src='assets/js/libraries/underscore-min.js'></script>
        <script src="modules/pnut/dist/loader.min.js"></script>
    <?php endif; ?>

</head>

<body>

<div class="container">
    <div class="row">
        <div class="col-md-12" id='service-messages-container'><service-messages></service-messages></div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <p><br><?php print $debugMode; ?></p>
            <?php
            include $pnutcms->getContentFile();
            ?>
        </div>
    </div>
</div>

</body>
<?php
  echo $pnutcms->getScriptInit();
?>
</html>
