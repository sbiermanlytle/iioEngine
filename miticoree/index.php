<?php 
chdir('../');
	include('inc/redirector.php');
  $homepath = '../';
  $title = 'Quick Start Guide';
	include('inc/preHeader.php');
	include('inc/header.php');
?>
<script type="text/javascript" src="<?php echo $homepath ?>js/iioEngine.min.js"></script>
<script type="text/javascript" src="<?php echo $homepath ?>js/iioDebugger.js"></script>
<script type="text/javascript">
        Helloiio = function(io){
          io.activateDebugger();
          io.addObj(new iio.Text('Welcome to the Team!', io.canvas.center)
              .setFont('30px Consolas')
              .setTextAlign('center')
              .setFillStyle('white'));
 
        }; iio.start(Helloiio);
</script>
</body>
</html>