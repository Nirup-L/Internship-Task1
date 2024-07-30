<?php
include 'mongodb.php';
include 'db.php';

class UserManager {
    private $mongoCollection;
    private $mysqlConnection;

    public function __construct($mongoCollection, $mysqlConnection) {
        $this->mongoCollection = $mongoCollection;
        $this->mysqlConnection = $mysqlConnection;
    }

    public function insertInMongoDB($id, $fname, $lname) {
        $document = array( 
            '_id'=> $id,
            'fname'=> $fname,
            'lname'=> $lname,
            'age'=> 0,
            'gender'=>'-',
            'mobile'=>0,
            'dob'=>'-'
        );
        $this->mongoCollection->insertOne($document);
    }

    public function insertInMySQL($id, $password) {
        $stmt = $this->mysqlConnection->prepare("INSERT INTO Myuser(PersonId, PersonPassword) VALUES (?, ?)");
        $stmt->bind_param("ss", $id, $password);
        $stmt->execute();
        $stmt->close();
    }

    public function register($id, $password, $fname, $lname) {
        $this->insertInMongoDB($id, $fname, $lname);
        $this->insertInMySQL($id, $password);
        
        echo $id;
    }
}

$userManager = new UserManager($db->userdata, $con);

$id = $_POST['mail'];
$password = $_POST['password'];
$fname = $_POST['fname'];
$lname = $_POST['lname'];
$userManager->register($id, $password, $fname, $lname);

$con->close();
