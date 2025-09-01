<?php
	require '../vendor/autoload.php';

	$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
	$dotenv->load();

    $inData = getRequestInfo();

    // database info
    $username = $_ENV["DB_USERNAME"];
    $password = $_ENV["DB_PASSWORD"];
    $database = "testingLAMP";

    // variables to store our query information of the user logging in
    $contact_id = 0;
    $firstName = "";
    $lastName = "";

    $conn = new mysqli("localhost", $username, $password, $database); 	
    if( $conn->connect_error )
	{
		returnWithError( $conn->connect_error );
	}
    else
	{
        // prevents SQL injection
		$stmt = $conn->prepare("SELECT ID,first_name,last_name FROM Users WHERE login=? AND password =?");
		$stmt->bind_param("ss", $inData["login"], $inData["password"]);
		$stmt->execute();
		$result = $stmt->get_result();

		if( $row = $result->fetch_assoc()  )
		{
            $stmt = $conn->prepare("SELECT first_name, last_name, email, phone FROM Contacts WHERE user_id = ?");
		    $stmt->bind_param("i", $row['ID']);
		    $stmt->execute();
		    $result = $stmt->get_result();
            $row = $result->fetch_assoc();
			returnWithInfo( $row['first_name'], $row['last_name'], $row['email'], $row['phone'] );
		}
		else
		{
			returnWithError("No Records Found");
		}

		$stmt->close();
		$conn->close();
	}

    // function will receive the JSON POST request
    function getRequestInfo()
	{
		return json_decode(file_get_contents('php://input'), true);
	}

    function returnWithError( $err )
	{
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

    function sendResultInfoAsJson( $obj )
	{
		header('Content-type: application/json');
		echo $obj;
	}

    function returnWithInfo( $firstName, $lastName, $email, $phone )
	{
		$retValue = '{"firstName":"' . $firstName . '","lastName":"' . $lastName . '","email":"' . $email . '","phone":"' . $phone . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
?>