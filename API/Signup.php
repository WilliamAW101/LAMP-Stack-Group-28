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

    // Before continuing, make sure everything is filled in
    if (isEmpty($userLogin)) {
        http_response_code(400);
        returnWithInfo("null", "Username is empty", "Invalid Username");
        exit(1);
    } else if (isEmpty($userPassword)) {
        http_response_code(400);
        returnWithInfo("null", "Password is empty", "Invalid Password");
        exit(1);
    } else if (isEmpty($userFirstName)) {
        http_response_code(400);
        returnWithInfo("null", "FirstName is empty", "Invalid FirstName");
        exit(1);
    } else if (isEmpty($userLastName)) {
        http_response_code(400);
        returnWithInfo("null", "LastName is empty", "Invalid LastName");
        exit(1);
    }

    $conn = new mysqli($servername, $username, $password, $hostname); 	
    if( $conn->connect_error ) {
        returnWithInfo("null", "Could not connect to database", $conn->connect_error);
	}
    else {
        $userPassword = password_hash($userPassword, PASSWORD_DEFAULT); // hash password 
        // prevents SQL injection
		$stmt = $conn->prepare("INSERT INTO Users (first_name, last_name, login, password) VALUES (?, ?, ?, ?)");
		$stmt->bind_param("ssss", $userFirstName, $userLastName, $userLogin, $userPassword);
        
        // Database should tell us if there is a duplicate username that exists, we'll pass it to frontend
        if($stmt->execute()) {
            http_response_code(201);
            returnWithInfo("null", "Added user successfully","null");
            $stmt->close();
            $conn->close();
		} else {
            http_response_code(400);
            returnWithInfo("null", "Failed to add user",$stmt->error);
            $stmt->close();
		    $conn->close();
        }
	}
?>