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
        returnWithInfoWithoutToken('null',"Did not send token in header", "No token found");
        exit();
    }
    $page = $_GET['page'];
    $pageSize = $_GET['pageSize'];
    

    $conn = new mysqli($hostname, $username, $password, $database); 	
    if( $conn->connect_error ) {
		returnWithInfoWithoutToken('null',"Could not connect to database", $conn->connect_error);
	} else {
        $user_ID = validateJWT($jwt, $_ENV['JWT_SECRET'], $hostname);

        if($user_ID != null) {
            $ID = $user_ID;
            returnPageOfContacts( $conn, $ID, $page, $pageSize );
		    $conn->close();
		}
		else {
            http_response_code(401);
			returnWithInfoWithoutToken('null',"Bad token provided", "Invalid Token");
		    $conn->close();
        }
    }
?>