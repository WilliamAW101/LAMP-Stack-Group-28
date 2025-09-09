<?php
	require '../vendor/autoload.php';
	require_once 'json.php';

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

    // variables to store our query information of the user logging in
    $contact_id = 0;
    $firstName = "";
    $lastName = "";

    $conn = new mysqli($servername, $username, $password, $hostname); 	
    if( $conn->connect_error ) {
		returnWithError( $conn->connect_error );
	}
    else {
        $userPassword = password_hash($userPassword, PASSWORD_DEFAULT); // hash password 
        // prevents SQL injection
		$stmt = $conn->prepare("INSERT INTO Users (first_name, last_name, login, password) VALUES (?, ?, ?, ?)");
		$stmt->bind_param("ssss", $userFirstName, $userLastName, $userLogin, $userPassword);
		$stmt->execute();
		$result = $stmt->get_result();
        // get the latest user_id
        $userID = $stmt->insert_id;
        $stmt->close();
        
        // if it is greater than zero, we know it was successfull to add the user
        if($userID > 0) {   
			sendResultInfoAsJson("OK");
		    $conn->close();
		} else {
			returnWithError("FAILED TO ADD USER");
		    $conn->close();
        }
	}
?>