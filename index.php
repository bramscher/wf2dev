<?php
    $servername = "wf-usda-4.cbirtswcvghj.us-west-2.rds.amazonaws.com";
    $username = "wf";
    $password = "Dietc0keDietc0ke";
    $dbname = "wf-usda";



Code language: HTML, XML (xml)

    // Create connection
    $conn = new mysqli($servername, $username, $password, $dbname);
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "SELECT * FROM `wf-usda`.food_category;";
    $result = $conn->query($sql);


    if ($result->num_rows > 0) {
        // output data of each row
        while($row = $result->fetch_assoc()) {
            echo "id: " . $row["id"]. " | code: " . $row["code"]. " | description: " . $row["description"]. "<br>";
        }
    } else {
        echo "0 results";
    }
    $conn->close();

echo "<br>Test Complete!<br>";
    ?>
