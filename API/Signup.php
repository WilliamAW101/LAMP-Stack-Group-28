<?php
	require '../vendor/autoload.php';

	$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
	$dotenv->load();

    $inData = getRequestInfo();

    // database info
    $username = $_ENV['DB_USERNAME'];
    $password = $_ENV['DB_PASSWORD'];
    $database = "testingLAMP";

    // User info
    $userLogin = $inData["login"];
    $userPassword = $inData["password"];
    $userFirstName = $inData["first_name"];
    $userLastName = $inData["last_name"];

    $contactEmail = $inData["email"];
    $contactPhone = $inData["phone"];

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
		$stmt = $conn->prepare("INSERT INTO Users (first_name, last_name, login, password) VALUES (?, ?, ?, ?)");
		$stmt->bind_param("ssss", $userFirstName, $userLastName, $userLogin, $userPassword);
		$stmt->execute();
		$result = $stmt->get_result();

        // get the latest user_id
        $userID = $stmt->insert_id;
        $stmt->close();
        

        // if it is greater than zero, we know it was successfull to add the user
        if($userID > 0)
		{   
            // insert contact info
            $stmt = $conn->prepare("INSERT INTO Contacts (first_name, last_name, phone, email, user_id) VALUES (?, ?, ?, ?, ?)");
            $stmt->bind_param("ssssi", $userFirstName, $userLastName, $contactPhone, $contactEmail, $userID);
            $stmt->execute();

            if($stmt->affected_rows > 0)
		    {
		    	returnWithInfo($userFirstName, $userLastName, $userID);
		    }
		    else
		    {
		    	returnWithError("FAILED TO ADD CONTACT");
		    }
		    $stmt->close();
		    $conn->close();
		}
		else
		{
			returnWithError("FAILED TO ADD USER");
            $stmt->close();
		    $conn->close();
        }
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

    function returnWithInfo( $firstName, $lastName, $id )
	{
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}
?>