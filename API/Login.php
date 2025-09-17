<?php
	require '../vendor/autoload.php';
	require_once 'json.php';

    if ($_SERVER['REQUEST_METHOD'] != 'POST') {
        http_response_code(405); // Method Not Allowed
        exit();
    }

	$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
	$dotenv->load();

    $inData = getRequestInfo();

    // database info
    $username = $_ENV['DB_USERNAME'];
    $password = $_ENV['DB_PASSWORD'];
    $database = $_ENV['DB'];

    #Server Info
    $hostname = $_ENV['HOST_NAME'];

    // Before continuing, make sure everything is filled in
    if (isEmpty($inData["login"])) {
        http_response_code(400);
        returnWithError("Invalid Username");
        exit(1);
    } else if (isEmpty($inData["password"] )) {
        http_response_code(400);
        returnWithError("Invalid Password");
        exit(1);
    }

    $conn = new mysqli($hostname, $username, $password, $database); 	
    if( $conn->connect_error ) {
		returnWithError( $conn->connect_error );
	}
    else {
        // prevents SQL injection
		$stmt = $conn->prepare("SELECT ID,password FROM Users WHERE login=?");
		$stmt->bind_param("s", $inData["login"]);
		$stmt->execute();
		$result = $stmt->get_result();
		$row = $result->fetch_assoc();
        if ($row && password_verify($inData["password"], $row["password"])) {
            $jwt = generateJWT($row['ID'], $_ENV['JWT_SECRET'], $hostname); 
            sendResultInfoAsJson(json_encode(["token" => $jwt]));
		    $stmt->close();
		    $conn->close();
        } else {
            http_response_code(400);
            returnWithError("Invalid Username or Password");
            $stmt->close();
		    $conn->close();
        }
	}
?>