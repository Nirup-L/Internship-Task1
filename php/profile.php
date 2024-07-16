<?php
include 'mongodb.php';

$id = $_POST['id'];
$collection = $db->userdata;
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
?>
