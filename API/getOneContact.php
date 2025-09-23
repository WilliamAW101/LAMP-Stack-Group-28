<?php
    require '../vendor/autoload.php';
	require_once 'json.php';

    if ($_SERVER['REQUEST_METHOD'] != 'GET') {
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
    $contact_id = $_GET['contact_id'];
    $conn = new mysqli($hostname, $username, $password, $database); 	
    if( $conn->connect_error ) {
		returnWithError( $conn->connect_error );
	} else {
        $user_ID = validateJWT($jwt, $_ENV['JWT_SECRET'], $hostname);

        if($user_ID != null) {
            $ID = $user_ID;
            returnWithOneContactInfo( $conn, $ID, $contact_id );
		    $conn->close();
		}
		else {
            http_response_code(401);
			returnWithError("Invalid or expired token");
		    $conn->close();
        }
    }
?>