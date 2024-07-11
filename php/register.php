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

    public function insertUserInMongoDB($id, $fname, $lname) {
        $document = array( 
            '_id'=> $id,
            'fname'=> $fname,
            'lname'=> $lname,
            'age'=> '-',
            'gender'=>'-',
            'mobile'=>'-'
        );
        $this->mongoCollection->insertOne($document);
    }

    public function insertUserInMySQL($id, $password) {
        $stmt = $this->mysqlConnection->prepare("INSERT INTO Myuser(PersonId, PersonPassword) VALUES (?, ?)");
        $stmt->bind_param("ss", $id, $password);
        $stmt->execute();
        $stmt->close();
    }

    public function registerUser($id, $password, $fname, $lname) {
        $this->insertUserInMongoDB($id, $fname, $lname);
        $this->insertUserInMySQL($id, $password);
        
        echo "Data inserted successfully";
    }
}

$userManager = new UserManager($db->userdata, $con);

$id = $_POST['mail'];
$password = $_POST['password'];
$fname = $_POST['fname'];
$lname = $_POST['lname'];
$userManager->registerUser($id, $password, $fname, $lname);

$con->close();
?>
