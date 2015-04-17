<html lang="en">
  <head>
  	<meta charset="utf-8">
    <title>Coming Soon</title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="iio Engine Homepage">
    <link href="../css/matrix-style.css" rel="stylesheet">
    <link rel="shortcut icon" type="favicon/png" href="../img/fav.png">
  </head>
  <body>
<?php
	echo '<div id="matrix"/>', '<script type="text/javascript" src="../js/iioMatrix.js"></script>';
	   	echo '<script type="text/javascript">', 'addLogin=true;', '</script>';
	     // The user is not logged in, Display the form
	    echo "<form id='loginForm' action='/forums/member.php' method='post'>
	    <input type=\"hidden\" name=\"my_post_key\" value=\"$mybb->post_code\" />
	    <input type='text' name='username' size='15' maxlength='30' /><br />
	    <input type='password' name='password' size='15' />
	    <input type='hidden' name='action' value='do_login'>
	    <input type='hidden' name='url' value='../index.php' />
	    <input type='submit' class='submit' name='submit' value='Login' /><br /><br />
	    </br></form><br>";
?>
</body>
</html>