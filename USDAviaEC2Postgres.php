<?php 

$host = "wf-usda-4.cbirtswcvghj.us-west-2.rds.amazonaws.com"; 
$user = "wf"; 
$pass = "Dietc0keDietc0ke"; 
$db = "postgres"; 

$con = pg_connect("host=$host dbname=$db user=$user password=$pass")
    or die ("Could not connect to server\n"); 

$query = "SELECT * FROM food_category LIMIT 50"; 

$rs = pg_query($con, $query) or die("Cannot execute query: $query\n");

while ($row = pg_fetch_row($rs)) {
  echo "<TR>$row[0] $row[1] $row[2]<br /></TR>";
}

pg_close($con); 

?>



