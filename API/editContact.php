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

    $jwt = $inData["token"];

    $conn = new mysqli($hostname, $username, $password, $database);

    if ($conn->connect_error) {
        returnWithError($conn->connect_error);
    } else {
        $user_ID = validateJWT($jwt, $_ENV['JWT_SECRET'], $hostname); // get user ID from JWT
        if ($user_ID != null) {
            var_dump("Users ID: " . $user_ID);

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
                returnWithError("Contact not found for this user.");
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
			    $retValue = '{"message":' . $message . '","error":"null"}';
			    sendResultInfoAsJson( $retValue );
            } else {
                http_response_code(400);
                returnWithError("No contact found or nothing changed.");
            }
        }

        $stmt->close();
        $conn->close();
    }
?>