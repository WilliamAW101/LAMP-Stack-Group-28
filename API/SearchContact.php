<?php

        $inData = getRequestInfo();

        $searchResults = "";
        $searchCount = 0;

        $conn = new mysqli("localhost", $username, $password, $database);
        if ($conn->connect_error) 
        {
                returnWithError( $conn->connect_error );
        } 
        else
        {
                $stmt = $conn->prepare("select * from Contacts where (FirstName like ? OR LastName like ? OR Email like ? or Phone like ?) and UserID=?"); // Find colors with that user and text
                $colorName = "%" . $inData["search"] . "%";
                $stmt->bind_param("ssss", $userFirstName, $userLastName, $userLogin, $userPassword);
                $stmt->execute();

                $result = $stmt->get_result();

                while($row = $result->fetch_assoc())
                {
                        if( $searchCount > 0 )
                        {
                                $searchResults .= ",";
                        }
                        $searchCount++;
                        //$searchResults .= '"' . $row["FirstName"] . '"';
            $searchResults .= '{"FirstName" : "' . $row["FirstName"]. '", "LastName" : "' . $row["LastName"] . '", "Phone" : "' . $row["Phone"] . '", "Email" : "' . $row["Email"] . '", "UerID" : "' . $row["UserID"] . '"}';
                }

                if( $searchCount == 0 )
                {
                        returnWithError( "No Records Found" );
                }
                else
                {
                        returnWithInfo( $searchResults );
                }

                $stmt->close();
                $conn->close();
        }

        function getRequestInfo()
        {
                return json_decode(file_get_contents('php://input'), true);
        }

        function sendResultInfoAsJson( $obj )
        {
                header('Content-type: application/json');
                echo $obj;
        }

        function returnWithError( $err )
        {
                $retValue = '{"id":0,"firstName":"","lastName":"","error":"' . $err . '"}';
                sendResultInfoAsJson( $retValue );
        }

        function returnWithInfo( $searchResults )
        {
                $retValue = '{"results":[' . $searchResults . '],"error":""}';
                sendResultInfoAsJson( $retValue );
        }

?>