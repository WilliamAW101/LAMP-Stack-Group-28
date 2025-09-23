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
        returnWithError("No token found");
        exit();
    }

    $conn = new mysqli($hostname, $username, $password, $database);
    var_dump("ContactID to delete: " . $inData["contact_id"]);
    if ($conn->connect_error) {
        returnWithError($conn->connect_error);
    } else {
        $user_ID = validateJWT($jwt, $_ENV['JWT_SECRET'], $hostname); // get user ID from JWT
        if ($user_ID != null) {
            var_dump("Users ID: " . $user_ID);
            // Delete query, prevents SQL injection
            $stmt = $conn->prepare("DELETE FROM Contacts WHERE contact_id = ?");
            $stmt->bind_param("i", $inData["contact_id"]);
            $stmt->execute();
            var_dump($stmt->affected_rows);
            if ($stmt->affected_rows != 0) {
                $message = "Contact deleted successfully.";
			    $retValue = '{"message":' . $message . '","error":"null"}';
			    sendResultInfoAsJson( $retValue );
                
            } else {
                http_response_code(404);
                returnWithError("No contact found with given ID.");
            }
        }

        $stmt->close();
        $conn->close();
    }
?>