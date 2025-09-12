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
        $user_ID = validateJWT($jwt, $_ENV['JWT_SECRET'], $hostname); // get user ID from JWT
        if ($user_ID != null) {
            $contactID   = $inData["contact_id"];
            $firstName   = $inData["first_name"];
            $lastName    = $inData["last_name"];
            $email       = $inData["email"];
            $phone       = $inData["phone"];

            $stmt = $conn->prepare("UPDATE Contacts 
                                    SET first_name = ?, last_name = ?, email = ?, phone = ? 
                                    WHERE ID = ?");
            $stmt->bind_param("ssssi", $firstName, $lastName, $email, $phone, $contactID);
            $stmt->execute();

            if ($stmt->affected_rows > 0) {
                returnWithInfo("Contact updated successfully.");
            } else {
                returnWithError("No contact found or nothing changed.");
            }
        }

        $stmt->close();
        $conn->close();
    }
?>