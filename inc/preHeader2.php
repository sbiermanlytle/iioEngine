<!doctype html>
<?php
function curPageURL() {
 $pageURL = 'http';
 if ($_SERVER["HTTPS"] == "on") {$pageURL .= "s";}
 $pageURL .= "://";
 if ($_SERVER["SERVER_PORT"] != "80") {
  $pageURL .= $_SERVER["SERVER_NAME"].":".$_SERVER["SERVER_PORT"].$_SERVER["REQUEST_URI"];
 } else {
  $pageURL .= $_SERVER["SERVER_NAME"].$_SERVER["REQUEST_URI"];
 }
 return $pageURL;
}
?>
<html lang="en">
  <head>
  	<meta charset="utf-8">
    <title>iio Engine &middot; <?php echo $title ?></title>
    <meta name="description" content="The iio Engine is an extensive HTML5 framework for interactive web application development.">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <!-- Le styles -->
    <link href="<?php  echo $homepath; ?>css/bootstrap.min.css" rel="stylesheet">
    <link href="<?php  echo $homepath; ?>css/bootstrap-responsive.min.css" rel="stylesheet">
    <link href="<?php  echo $homepath; ?>css/prettify.css" type="text/css" rel="stylesheet" />
    <script type="text/javascript" src="<?php  echo $homepath; ?>js/prettify.js"></script>
    <link href="<?php  echo $homepath; ?>css/style.css" rel="stylesheet">
    <!-- required -->
    <link rel="stylesheet" type="text/css" href="js/SM2/flashblock.css" />
    <link rel="stylesheet" type="text/css" href="js/SM2/360player.css" />
    <link rel="stylesheet" type="text/css" href="js/SM2/360player-visualization.css" />
    <link rel="stylesheet" type="text/css" href="css/rave.css" />

    <!-- HTML5 shim, for IE6-8 support of HTML5 elements -->
    <!--[if lt IE 9]>
      <script src="js/html5shiv.js"></script>
    <![endif]-->

    <!-- Fav and touch icons -->
    <!--<link rel="apple-touch-icon-precomposed" sizes="144x144" href="ico/apple-touch-icon-144-precomposed.png">
    <link rel="apple-touch-icon-precomposed" sizes="114x114" href="ico/apple-touch-icon-114-precomposed.png">
      <link rel="apple-touch-icon-precomposed" sizes="72x72" href="ico/apple-touch-icon-72-precomposed.png">
                    <link rel="apple-touch-icon-precomposed" href="ico/apple-touch-icon-57-precomposed.png">-->
    <link rel="shortcut icon" type="favicon/png" href="<?php  echo $homepath; ?>favicon.ico">
      <script type="text/javascript">
  var _gaq = _gaq || [];
  _gaq.push(['_setAccount', 'UA-39314134-1']);
  _gaq.push(['_trackPageview']);
  (function() {
    var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
    ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
  })();
</script>
  </head>
  <body onload="prettyPrint()">