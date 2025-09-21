<?php
    // Utility functions for JSON handling
	require_once('../vendor/autoload.php');
	use \Firebase\JWT\JWT; 
    
    function getRequestInfo() {
		return json_decode(file_get_contents('php://input'), true);
	}

    function returnWithError( $err ) {
		$retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
		sendResultInfoAsJson( $retValue );
	}

    function sendResultInfoAsJson( $obj ) {
		header('Content-type: application/json');
		echo $obj;
	}

    function returnWithInfo( $firstName, $lastName, $id ) {
		$retValue = '{"id":' . $id . ',"firstName":"' . $firstName . '","lastName":"' . $lastName . '","error":""}';
		sendResultInfoAsJson( $retValue );
	}

    function returnWithContactInfo( $conn, $userID, $search ) {
        $searchResults = "";
	    $searchCount = 0;
        
        $stmt = $conn->prepare("SELECT contact_id, first_name, last_name, email, phone FROM Contacts WHERE user_id = ? AND (first_name LIKE ? OR last_name LIKE ?)");
		$stmt->bind_param("iss", $userID, $search, $search);
		$stmt->execute();
		$result = $stmt->get_result();
		//var_dump("Query Result: ".$result);

        while ($row = $result->fetch_assoc()) {

			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
			$searchResults .= '{"contact_id":"' . $row['contact_id'] . '","firstName":"' . $row['first_name'] . '","lastName":"' . $row['last_name'] . '","email":"' . $row['email'] . '","phone":"' . $row['phone'] . '"}';
		}

		if ($searchCount == 0)
		{
			returnWithError("No Records Found");
		} else {
			sendResultInfoAsJson( '{"results":[' . $searchResults . '],"error":""}' );
		}
        $stmt->close();
    }

	    function returnPageOfContacts( $conn, $userID, $page, $pageSize ) {
        $searchResults = "";
	    $searchCount = 0;
		$offset = ($page - 1) * $pageSize;
        $stmt = $conn->prepare("SELECT contact_id, first_name, last_name, email, phone FROM Contacts WHERE user_id = ? LIMIT $pageSize OFFSET $offset");
		$stmt->bind_param("i", $userID);
		$stmt->execute();
		$result = $stmt->get_result();

        while ($row = $result->fetch_assoc()) {

			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
			$searchResults .= '{"contact_id":"' . $row['contact_id'] . '","firstName":"' . $row['first_name'] . '","lastName":"' . $row['last_name'] . '","email":"' . $row['email'] . '","phone":"' . $row['phone'] . '"}';
		}

		if ($searchCount == 0)
		{
			returnWithError("No Records Found");
		} else {
			sendResultInfoAsJson( '{"results":[' . $searchResults . '],"error":""}' );
		}
        $stmt->close();
    }

    function addContact( $userFirstName, $userLastName, $contactPhone, $contactEmail, $userID, $conn ) {
        // insert contact info
        $stmt = $conn->prepare("INSERT INTO Contacts (first_name, last_name, phone, email, user_id) VALUES (?, ?, ?, ?, ?)");
        $stmt->bind_param("ssssi", $userFirstName, $userLastName, $contactPhone, $contactEmail, $userID);
        $stmt->execute();

        if($stmt->affected_rows > 0)
		{
			http_response_code(200);
			$message = "Successfully Added Contact";
			$retValue = '{"message":' . $message . '","error":"null"}';
			sendResultInfoAsJson( $retValue );
		}
		else
		{
			http_response_code(400);
			returnWithError("Failed to add contact: " + $stmt->error);
		}
        $stmt->close();
    }

	function generateJWT($userID, $key, $hostname) {
		// creating payload
		$payload = array(
			'iss' => $hostname,
			"exp" => time() + (60 * 60), // expiration date of 1 hour
			"userID" => $userID
		);
		$jwt = JWT::encode($payload, $key, 'HS256');

		return $jwt;
	}

	function validateJWT($jwt, $key, $hostname) {
		try {
			$decoded = JWT::decode($jwt, new \Firebase\JWT\Key($key, 'HS256'));
			// verify the issuer
			if ( ($decoded->iss != $hostname) || ($decoded->exp < time()) ) {
				echo("Invalid token issuer or expired token");
				return null;
			}
			return $decoded->userID;
		} catch (Exception $e) {
			return null;
		}
	}

	function isEmpty($val) {
    	return !isset($val) || trim($val) === '';
	}

	function getBearerTokenFromApache() {
    	if (function_exists('apache_request_headers')) {
    	    $requestHeaders = apache_request_headers();
    	    if (isset($requestHeaders['Authorization'])) {
    	        $authorizationHeader = trim($requestHeaders['Authorization']);
    	        if (preg_match('/Bearer\s(\S+)/', $authorizationHeader, $matches)) {
    	            return $matches[1];
    	        }
    	    }
    	}
    	return null;
	}
?>