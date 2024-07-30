<?php
include 'mongodb.php';
require '../vendor/autoload.php';
$token = $_POST['token'];

$redis = new Predis\Client([
    'scheme' => 'tcp',
    'host' => '127.0.0.7',
    'port' => 6379,
]);

$id = $redis->get("session:$token");
if ($id) {
$collection = $db->userdata;
} else {
    echo json_encode(['error'=>'Session expired']);
    exit;
}
$user = $collection->findOne(['_id' => $id], [
    'projection' => [
        'age' => 1,
        'gender' => 1,
        'mobile' => 1,
        '_id'=> 1,
        'fname' => 1,
        'lname' => 1,
        'dob'=>1
    ]
]);

if ($user) {
    echo json_encode($user);
} else {
    echo json_encode(['error' => 'User not found']);
}
