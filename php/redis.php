<?php
require '../vendor/autoload.php';

$redis = new Predis\Client([
    'scheme' => 'tcp',
    'host' => '127.0.0.1', // Ensure this is correct for your setup
    'port' => 6379,
]);
