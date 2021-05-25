<?php

try{
        $myPDO = new PDO("pgsql:host=wf-usda-4.cbirtswcvghj.us-west-2.rds.amazonaws.com;dbname=postgres","wf", "Dietc0keDietc0ke");
        echo "Connected to Postgres via PDO";

} catch(PDOException $e){

    echo $e->getmessage();

}
$sql = 'SELECT *  FROM food_category';
foreach ($conn->query($sql) as $row) {
    print $row['code'] . "\t";
 }


?>
