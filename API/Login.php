<?php
require '../vendor/autoload.php';
require_once 'json.php';

header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}
// if ($_SERVER['REQUEST_METHOD'] != 'POST') {
//     http_response_code(405); // Method Not Allowed
//     exit();
// }

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$inData = getRequestInfo();

// database info
$username = $_ENV['DB_USERNAME'];
$password = $_ENV['DB_PASSWORD'];
$database = $_ENV['DB'];

#Server Info
$hostname = $_ENV['HOST_NAME'];

// Before continuing, make sure everything is filled in
if (isEmpty($inData["login"])) {
    http_response_code(400);
    returnWithInfo("null", "Username is empty", "Invalid Username");
    exit(1);
} else if (isEmpty($inData["password"])) {
    http_response_code(400);
    returnWithInfo("null", "Password is empty", "Invalid Password");
    exit(1);
}

$conn = new mysqli($hostname, $username, $password, $database);
if ($conn->connect_error) {
    returnWithInfo("null", "Could not connect to database", $conn->connect_error);
} else {
    // prevents SQL injection
    $stmt = $conn->prepare("SELECT ID,password FROM Users WHERE login=?");
    $stmt->bind_param("s", $inData["login"]);
    $stmt->execute();
    $result = $stmt->get_result();
    $row = $result->fetch_assoc();
    if ($row && password_verify($inData["password"], $row["password"])) {
        $jwt = generateJWT($row['ID'], $_ENV['JWT_SECRET'], $hostname);
        returnWithInfo($jwt, "Token created successfully!", "null");
        // sendResultInfoAsJson(json_encode(["token" => $jwt]));
        $stmt->close();
        $conn->close();
    } else {
        http_response_code(400);
        returnWithInfo("null", "Failed to either verify password or find login in database", "Invalid Username or Password");
        $stmt->close();
        $conn->close();
    }
}
