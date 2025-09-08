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

    // User info
    $jwt = $inData["token"];
    $search = "%" . $inData["search"] . "%";

    $conn = new mysqli($hostname, $username, $password, $database); 	
    if( $conn->connect_error ) {
		returnWithError( $conn->connect_error );
	} else {
        $user_ID = validateJWT($jwt, $_ENV['JWT_SECRET'], $hostname);

        // if it is greater than zero, we know it was successfull to add the user
        if($user_ID != null) {
            $ID = $user_ID;
            returnWithContactInfo( $search, $conn, $ID, $search );
		    $conn->close();
		}
		else {
			returnWithError("FAILED TO SEARCH CONTACTS");
            $stmt->close();
		    $conn->close();
        }
    }
?>