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

    // variables to store our query information of the user logging in
    $contact_id = 0;
    $firstName = "";
    $lastName = "";

    $conn = new mysqli($hostname, $username, $password, $database);

    // Debugging code to see if we can connect and query the database
//     $result = $conn->query("SELECT * FROM Users where login='john_Bob'");
//     $rows = [];
//     while ($row = $result->fetch_assoc()) {
//         $rows[] = $row;
//     }
// sendResultInfoAsJson(json_encode($rows));


    if( $conn->connect_error ) {
		returnWithError( $conn->connect_error );
	}
    else {
        var_dump($inData["login"]);
        var_dump($inData["password"]);
        // prevents SQL injection
		$stmt = $conn->prepare("SELECT ID,password FROM Users WHERE login=?");
		$stmt->bind_param("s", $inData["login"]);
		$stmt->execute();
        //var_dump($stmt);
		$result = $stmt->get_result();
        //var_dump($result);
		$row = $result->fetch_assoc();
        
        if (password_verify($inData["password"], $row["password"])) {
            $jwt = generateJWT($row['ID'], $_ENV['JWT_SECRET'], $hostname); 
            sendResultInfoAsJson(json_encode(["token" => $jwt]));
		    $stmt->close();
		    $conn->close();
        } else {
            returnWithError("Invalid Username or Password");
        }
	}
?>