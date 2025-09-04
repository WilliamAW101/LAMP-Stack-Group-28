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

    #Server Info
    $hostname = $_ENV['HOST_NAME'];

    // variables to store our query information of the user logging in
    $contact_id = 0;
    $firstName = "";
    $lastName = "";

    $conn = new mysqli($hostname, $username, $password, $database); 	
    if( $conn->connect_error ) {
		returnWithError( $conn->connect_error );
	}
    else {
        // prevents SQL injection
		$stmt = $conn->prepare("SELECT ID,first_name,last_name FROM Users WHERE login=? AND password =?");
		$stmt->bind_param("ss", $inData["login"], $inData["password"]);
		$stmt->execute();
		$result = $stmt->get_result();
		$row = $result->fetch_assoc();
		returnWithContactInfo( $result, $conn, $row['ID'] );
		$stmt->close();
		$conn->close();
	}
?>