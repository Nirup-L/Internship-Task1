<?php
include 'mongodb.php';
include 'redis.php'; // Include Redis connection

$id = $_POST['id'];
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

        // Update the cached data in Redis
        $userCacheKey = "user:$id";
        $redis->set($userCacheKey, json_encode($response), 'EX', 150); // Update cache with new data
    } else {
        $response = ['error' => 'No documents matched the query.'];
    }
} catch (MongoDB\Exception\Exception $e) {
    $response = ['error' => 'Error updating document: ' . $e->getMessage()];
}

echo json_encode($response);

