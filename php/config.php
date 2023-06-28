<?php

require '../vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable('../');
$dotenv->load();

$cd_host = $_ENV['DB_HOST'];
$cd_user = $_ENV['DB_USER'];
$cd_dbname = $_ENV['DB_NAME'];
$cd_password = $_ENV['DB_PASSWORD'];

?>
