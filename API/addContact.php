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
    $userLogin = $inData["login"];
    $userPassword = $inData["password"];
    $userFirstName = $inData["first_name"];
    $userLastName = $inData["last_name"];

    $contactEmail = $inData["email"];
    $contactPhone = $inData["phone"];

    $conn = new mysqli($hostname, $username, $password, $database); 	
    if( $conn->connect_error ) {
		returnWithError( $conn->connect_error );
	} else {
        
        // prevents SQL injection
		$stmt = $conn->prepare("SELECT ID,first_name,last_name FROM Users WHERE login=? AND password =?");
		$stmt->bind_param("ss", $inData["login"], $inData["password"]);
		$stmt->execute();
		$result = $stmt->get_result();
        $row = $result->fetch_assoc();
        $ID = $row['ID'];

        $stmt->close();
        // if it is greater than zero, we know it was successfull to add the user
        if($ID > 0) {   
			addContact( $userFirstName, $userLastName, $contactPhone, $contactEmail, $ID, $conn );
		    $conn->close();
		}
		else {
			returnWithError("FAILED TO ADD CONTACT");
            $stmt->close();
		    $conn->close();
        }
    }
?>