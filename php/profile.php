<?php
include 'mongodb.php';

$id = $_POST['id'];

// Assuming you have established the MongoDB client and selected the database in mongodb.php
// For example:
// $client = new MongoDB\Client("mongodb://localhost:27017");
// $db = $client->mydatabase;

$collection = $db->userdata; // Replace 'mycollection' with your actual collection name

// Fetch the user document by id
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
