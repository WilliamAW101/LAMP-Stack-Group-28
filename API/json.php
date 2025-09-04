<?php
    // Utility functions for JSON handling
    
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

    function returnWithContactInfo( $result, $conn, $userID ) {
        $searchResults = "";
	    $searchCount = 0;
        
        $stmt = $conn->prepare("SELECT first_name, last_name, email, phone FROM Contacts WHERE user_id = ?");
		$stmt->bind_param("i", $userID);
		$stmt->execute();
		$result = $stmt->get_result();

        while ($row = $result->fetch_assoc()) {

			if( $searchCount > 0 )
			{
				$searchResults .= ",";
			}
			$searchCount++;
			$searchResults .= '{"firstName":"' . $row['first_name'] . '","lastName":"' . $row['last_name'] . '","email":"' . $row['email'] . '","phone":"' . $row['phone'] . '","error":""}';
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
			returnWithInfo($userFirstName, $userLastName, $userID);
		}
		else
		{
			returnWithError("FAILED TO ADD CONTACT");
		}
        $stmt->close();
    }
?>