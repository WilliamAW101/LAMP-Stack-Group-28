<?php
require '../vendor/autoload.php';
require_once 'json.php';


header("Access-Control-Allow-Origin: http://localhost:3000");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Access-Control-Allow-Methods: GET, POST, PATCH, OPTIONS");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}


$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$inData = getRequestInfo();

// database info
$username = $_ENV['DB_USERNAME'];
$password = $_ENV['DB_PASSWORD'];
$database = $_ENV['DB'];
$hostname = $_ENV['HOST_NAME'];

$jwt = getBearerTokenFromApache();
if ($jwt == null) {
    http_response_code(401);
    returnWithInfoWithoutToken('null', "Did not send token in header", "No token found");
    exit();
}

$conn = new mysqli($hostname, $username, $password, $database);
if ($conn->connect_error) {
    returnWithInfoWithoutToken('null', "Could not connect to database", $conn->connect_error);
} else {
    $user_ID = validateJWT($jwt, $_ENV['JWT_SECRET'], $hostname); // get user ID from JWT
    if ($user_ID != null) {
        $contactID   = $inData["contact_id"];

        // Get current values
        $stmt = $conn->prepare("SELECT first_name, last_name, email, phone 
                                    FROM Contacts 
                                    WHERE contact_id = ?");
        $stmt->bind_param("i", $contactID);
        $stmt->execute();
        $result = $stmt->get_result();
        $current = $result->fetch_assoc();
        $stmt->close();

        if (!$current) {
            http_response_code(404);
            returnWithInfoWithoutToken('null', "Contact not found for this user", "Failed to parse contact");
            $conn->close();
            exit();
        }

        // Use existing values if new ones are empty
        $firstName = !empty($inData["first_name"]) ? $inData["first_name"] : $current["first_name"];
        $lastName  = !empty($inData["last_name"])  ? $inData["last_name"]  : $current["last_name"];
        $email     = !empty($inData["email"])     ? $inData["email"]     : $current["email"];
        $phone     = !empty($inData["phone"])     ? $inData["phone"]     : $current["phone"];

        $stmt = $conn->prepare("UPDATE Contacts 
                                    SET first_name = ?, last_name = ?, email = ?, phone = ? 
                                    WHERE contact_id = ?");
        $stmt->bind_param("ssssi", $firstName, $lastName, $email, $phone, $contactID);
        $stmt->execute();

        if ($stmt->affected_rows != 0) {
            http_response_code(200);
            $message = "Contact updated successfully.";
            $contact = [
                "contact_id" => $contactID,
                "firstName"  => $firstName,
                "lastName"   => $lastName,
                "email"      => $email,
                "phone"      => $phone
            ];
            returnWithInfoWithoutToken($contact, $message, "null");
        } else {
            http_response_code(400);
            returnWithInfoWithoutToken('null', "No contact found or nothing changed.", "Failed to change contact");
        }

        $stmt->close();
    } else {
        http_response_code(401);
        returnWithInfoWithoutToken('null', "Invalid token", "Authentication failed");
    }

    $conn->close();
}
