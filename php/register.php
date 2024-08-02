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

    public function userExistsInMySQL($id) {
        $stmt = $this->mysqlConnection->prepare("SELECT PersonId FROM Myuser WHERE PersonId = ?");
        $stmt->bind_param("s", $id);
        $stmt->execute();
        $stmt->store_result();
        $exists = $stmt->num_rows > 0;
        $stmt->close();
        return $exists;
    }

    public function userExistsInMongoDB($id) {
        $existingDocument = $this->mongoCollection->findOne(['_id' => $id]);
        return $existingDocument !== null;
    }

    public function userExists($id) {
        return $this->userExistsInMySQL($id) || $this->userExistsInMongoDB($id);
    }

    public function insertInMongoDB($id, $fname, $lname) {
        $document = array(
            '_id' => $id,
            'fname' => $fname,
            'lname' => $lname,
            'age' => 0,
            'gender' => '-',
            'mobile' => 0,
            'dob' => '-'
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
        if ($this->userExists($id)) {
            return false;
        }

        $this->insertInMongoDB($id, $fname, $lname);
        $this->insertInMySQL($id, $password);
        
        return true;
    }
}

$userManager = new UserManager($db->userdata, $con);
$id = $_POST['mail'];
$password = $_POST['password'];
$fname = $_POST['fname'];
$lname = $_POST['lname'];

if ($userManager->register($id, $password, $fname, $lname)) {
    echo json_encode(['status' => 'success', 'id' => $id]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'User already exists.']);
}

$con->close();

