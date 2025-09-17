<?php
    require '../vendor/autoload.php';
    require_once 'json.php';

    $dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
    $dotenv->load();

    $inData = getRequestInfo();

    // database info
    $username = $_ENV['DB_USERNAME'];
    $password = $_ENV['DB_PASSWORD'];
    $database = $_ENV['DB'];
    $hostname = $_ENV['HOST_NAME'];

    $conn = new mysqli($hostname, $username, $password, $database);

    if ($conn->connect_error) {
        returnWithError($conn->connect_error);
    } else {
        // Require a valid JWT token in the request
        if (!isset($inData["token"])) {
            returnWithError("Missing token");
            exit();
        }

        try {
            $decoded = validateJWT($inData["token"], $_ENV['JWT_SECRET'], $hostname);
            $userId = $decoded["id"]; // ID embedded in the token

            // Delete user account
            $stmt = $conn->prepare("DELETE FROM Users WHERE ID = ?");
            $stmt->bind_param("i", $userId);
            $stmt->execute();

            if ($stmt->affected_rows > 0) {
                sendResultInfoAsJson("User deleted successfully.");
            } else {
                returnWithError("No user found to delete.");
            }

            $stmt->close();
            $conn->close();
        } catch (Exception $e) {
            returnWithError("Invalid or expired token: " . $e->getMessage());
        }
    }
?>