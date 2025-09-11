<?php
	require '../vendor/autoload.php';
	require_once 'json.php';

    if ($_SERVER['REQUEST_METHOD'] != 'POST') {
        http_response_code(405); // Method Not Allowed
        exit();
    }

    // for environment variables
	$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
	$dotenv->load();

    $inData = getRequestInfo();

    // database info
    $username = $_ENV['DB_USERNAME'];
    $password = $_ENV['DB_PASSWORD'];
    $hostname = $_ENV['DB'];

    #Server Info
    $servername = $_ENV['HOST_NAME'];

    // User info
    $userLogin = $inData["login"];
    $userPassword = $inData["password"];
    $userFirstName = $inData["first_name"];
    $userLastName = $inData["last_name"];

    $conn = new mysqli($servername, $username, $password, $hostname); 	
    if( $conn->connect_error ) {
		returnWithError( $conn->connect_error );
	}
    else {
        $userPassword = password_hash($userPassword, PASSWORD_DEFAULT); // hash password 
        // prevents SQL injection
		$stmt = $conn->prepare("INSERT INTO Users (first_name, last_name, login, password) VALUES (?, ?, ?, ?)");
		$stmt->bind_param("ssss", $userFirstName, $userLastName, $userLogin, $userPassword);

        if($stmt->execute()) {
            http_response_code(201);
            // get the latest user_id
            $userID = $stmt->insert_id;
            returnWithInfo( $userFirstName, $userLastName, $userID );
            $stmt->close();
            $conn->close();
		} else {
            http_response_code(400);
            returnWithError("User Already Exists"); // yet to implement in database
            $stmt->close();
		    $conn->close();
        }
	}
?>