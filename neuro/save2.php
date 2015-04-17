<!DOCTYPE html>
<html>
	<body>
<?php
	$con=mysqli_connect("NSS5468412.db.8247988.hostedresource.com","NSS5468412","Nsss@132","NSS5468412");
	// Check connection
	if (mysqli_connect_errno()){
	  echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}

	mysqli_query($con,"INSERT INTO experiments (sessionID, date, data)
	VALUES ('".$_GET['sessionID']."',".$_GET['date'].",".$_GET['data'].")");

	mysqli_close($con);
?>
	</body>
</html>