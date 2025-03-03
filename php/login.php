<?php
include 'db.php';
include 'redis.php';
class User {
    private $con;
    private $redis;
    public function __construct($dbConnection,$redisConnection) {
        $this->con = $dbConnection;
        $this->redis = $redisConnection;
    }

    public function authenticate($email, $password) {
        $query = "SELECT PersonPassword FROM myuser WHERE PersonId = ?";
        if ($stmt = $this->con->prepare($query)) {
            $stmt->bind_param("s", $email);
            $stmt->execute();
            $stmt->store_result();
            $stored_password='';
            if ($stmt->num_rows > 0) {
                $stmt->bind_result($stored_password);
                $stmt->fetch();
                if ($password === $stored_password) {
                    $stmt->close();
                    return $this->generateSessionToken($email);
                }
            }
            $stmt->close();
        }
        return false;
    }

    private function generateSessionToken($userid){
        $sessionToken = bin2hex(random_bytes(32));
        $this->redis->set("session:$sessionToken", $userid);
        $this->redis->expire("session:$sessionToken", 150);
        return [
            'status' => 'success',
            'token' => $sessionToken
        ];
    }
}
$email = $_POST['mail'];
$password = $_POST['password'];
$user = new User($con, $redis);
$response = $user->authenticate($email, $password);

if ($response) {
    echo json_encode($response);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid']);
}