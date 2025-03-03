<?php
include 'mongodb.php';
include 'redis.php';
$token = $_POST['token'];
$id = $redis->get("session:$token");
$fname = $_POST['fname'];
$lname = $_POST['lname'];
$dob = $_POST['dob'];
$age = $_POST['age'];
$gender = $_POST['gender'];
$mobile = $_POST['mobile'];

try {
    $collection = $db->selectCollection('userdata');
    $result = $collection->updateOne(
        ['_id' => $id],
        ['$set' => [
            'fname' => $fname,
            'lname' => $lname,
            'dob' => $dob,
            'age' => $age,
            'gender' => $gender,
            'mobile' => $mobile
        ]]
    );

    if ($result->getModifiedCount() > 0) {
        $response = [
            '_id' => $id,
            'fname' => $fname,
            'lname' => $lname,
            'dob' => $dob,
            'age' => $age,
            'gender' => $gender,
            'mobile' => $mobile
        ];
        $userCacheKey = "user:$id";
        $redis->set($userCacheKey, json_encode($response), 'EX', 150);
    } else {
        $response = ['error' => 'No documents matched the query.'];
    }
} catch (MongoDB\Exception\Exception $e) {
    $response = ['error' => 'Error updating document: ' . $e->getMessage()];
}

echo json_encode($response);

