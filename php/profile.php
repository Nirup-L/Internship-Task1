<?php
include 'mongodb.php';
include 'redis.php';
require '../vendor/autoload.php';
$token = $_POST['token'];
$id = $redis->get("session:$token");
if ($id) {
    $userCacheKey = "user:$id";
    $cachedUser = $redis->get($userCacheKey);

    if ($cachedUser) {
        echo json_encode(['source' => 'cache', 'data' => json_decode($cachedUser, true)]);
    } else {
        $collection = $db->userdata;
        $user = $collection->findOne(['_id' => $id], 
        [
            'projection' => [
                'age' => 1,
                'gender' => 1,
                'mobile' => 1,
                '_id' => 1,
                'fname' => 1,
                'lname' => 1,
                'dob' => 1
            ]
        ]);
        if ($user) {
            $userData = json_encode($user);
            $redis->set($userCacheKey, $userData,'EX', 150);
            echo json_encode(['source' => 'database', 'data' => $user]);
        } else {
            echo json_encode(['error' => 'User not found']);
        }
    }
} else {
    echo json_encode(['error' => 'Session expired']);
}
