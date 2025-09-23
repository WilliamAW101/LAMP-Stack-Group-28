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

    // User info
    $jwt = getBearerTokenFromApache();
    if  ($jwt == null) {
        http_response_code(401);
        returnWithError("No token found");
        exit();
    }
    $userFirstName = $inData["first_name"];
    $userLastName = $inData["last_name"];
    $contactEmail = $inData["email"];
    $contactPhone = $inData["phone"];

    if (isEmpty($userFirstName)) {
        http_response_code(400);
        returnWithError("Invalid Firstname");
        exit(1);
    } else if (isEmpty($userLastName)) {
        http_response_code(400);
        returnWithError("Invalid Lastname");
        exit(1);
    } else if (isEmpty($contactEmail)) {
        http_response_code(400);
        returnWithError("Invalid Email");
        exit(1);
    } else if (isEmpty($contactPhone)) {
        http_response_code(400);
        returnWithError("Invalid Phone");
        exit(1);
    }

    $conn = new mysqli($hostname, $username, $password, $database); 	
    if( $conn->connect_error ) {
		returnWithError( $conn->connect_error );
	} else {
        $user_ID = validateJWT($jwt, $_ENV['JWT_SECRET'], $hostname);
        // if it is greater than zero, we know it was successfull to add the user
        if($user_ID != null) {
            $ID = $user_ID;
			addContact( $userFirstName, $userLastName, $contactPhone, $contactEmail, $ID, $conn );
		    $conn->close();
		}
		else {
            http_response_code(401);
			returnWithError("Invalid Token");
		    $conn->close();
        }
    }
?>