<?php
/**
 * Created by PhpStorm.
 * User: Terry
 * Date: 8/12/2017
 * Time: 10:01 AM
 */
include "../config/peanut-bootstrap.php";
$settings = \Peanut\Bootstrap::initialize();
session_start();
\Tops\sys\TSession::Initialize();
$loader = $settings->optimize ?  '../..'.$settings->peanutRootPath.'dist/loader.min.js'
    : '../..'.$settings->peanutRootPath.'core/PeanutLoader.js';
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">


    <title>Peanut Package Installer</title>

    <link rel="stylesheet" type="text/css"href="../assets/themes/cerulean/bootstrap.min.css" />
    <!-- link rel="stylesheet" type="text/css"href="https://maxcdn.bootstrapcdn.com/bootswatch/3.3.7/cerulean/bootstrap.min.css"/ -->

    <script src="http://cdnjs.cloudflare.com/ajax/libs/headjs/1.0.3/head.load.min.js"></script>
    <script src='http://code.jquery.com/jquery-1.12.4.min.js'></script>
    <script src='https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js'></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/knockout/3.4.1/knockout-min.js"></script>

    <?php
        print "<script src=\"$loader\"></script>";
    ?>
</head>

<body>

<div class="container">
    <div class="row">
        <div class="col-md-12" id='service-messages-container'><service-messages></service-messages></div>
    </div>
    <div class="row">
        <div class="col-md-12">
            <h1>Peanut Package Installer</h1>
            <div id="installpackages-view-container">
                <div data-bind="visible:activePage()=='packageList'">
                    <table class="table">
                        <thead>
                        <tr>
                            <th>Package Name</th><th>Status</th><th>Action</th>
                        </tr>
                        </thead>
                        <tbody data-bind="foreach:packageList">
                            <tr>
                                <td data-bind="text:name"></td>
                                <td data-bind="text:status"></td>
                                <td>
                                    <a href="#" data-bind="visible:status=='Ready to install'">Install now >></a>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                </div>
                <div data-bind="visible:activePage()=='noPackages'">
                    <p>No packages were found.</p>
                </div>
            </div>
        </div>
    </div>
</div>

</body>
<script>
    Peanut.PeanutLoader.startApplication('@pnut/admin/InstallPackages');
</script>
</html>
