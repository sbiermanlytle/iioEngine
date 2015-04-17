<?php
	$con=mysqli_connect("NSS5468412.db.8247988.hostedresource.com","NSS5468412","Nsss@132","NSS5468412");
	// Check connection
	if (mysqli_connect_errno()){
	  echo "Failed to connect to MySQL: " . mysqli_connect_error();
	}

	mysqli_query($con,"INSERT INTO sessions (sessionID, trial, date, choice, pLeft, pRight, lastReward, reward)
	VALUES ('testID',0,0,0,0,0,0,0)");

	mysqli_close($con);
?>