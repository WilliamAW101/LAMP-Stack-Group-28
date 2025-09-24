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

    $jwt = getBearerTokenFromApache();
    if  ($jwt == null) {
        http_response_code(401);
        returnWithInfoWithoutToken('null',"Did not send token in header", "No token found");
        exit();
    }

    $conn = new mysqli($hostname, $username, $password, $database);
    if ($conn->connect_error) {
        returnWithInfoWithoutToken('null',"Could not connect to database", $conn->connect_error);
    } else {
        $user_ID = validateJWT($jwt, $_ENV['JWT_SECRET'], $hostname); // get user ID from JWT
        if ($user_ID != null) {
            // Delete query, prevents SQL injection
            $stmt = $conn->prepare("DELETE FROM Contacts WHERE contact_id = ?");
            $stmt->bind_param("i", $inData["contact_id"]);
            $stmt->execute();

            if ($stmt->affected_rows != 0) {
                $message = "Contact deleted successfully.";
                returnWithInfoWithoutToken('null',$message, "null");
            } else {
                http_response_code(404);
                returnWithInfoWithoutToken('null',"No contact found with given ID.", "Failed to parse contact");
            }
        }

        $stmt->close();
        $conn->close();
    }
?>