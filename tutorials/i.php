<?php 
chdir('../');
	include('inc/redirector.php');
  $homepath = '../';
  $title = 'Tutorials';
	include('inc/preHeader.php');
	include('inc/header.php');
?>
<div class="container marketing tutorials">
    <hr class="featurette-divider">
    <h1 style="margin:0">Getting Started</h1>
    <hr class="featurette-divider">
    <div class="row getting-started">
      <div class="span7">
      <a href="quick-start.php" style="margin-top:0">Quick Start Guide</a>
      <p>Learn how to set up your dev environment and create your first iio Application.</p>
      <a href="html-css.php">HTML &amp; CSS Intro</a>
      <p>Learn how to create and style an HTML page to run your app on.</p>
      <a href="../docs/iio-basics.php">iio Application Basics</a>
      <p>A crash course on iio App development.</p>
    </div>
    <div class="span4" id="tuts-ad">
      <div style="margin-left:auto;margin-right:auto;width:250px;" class="square-ad">
      <script type="text/javascript"><!--
google_ad_client = "ca-pub-1234510751391763";
/* iioEngine_tuts */
google_ad_slot = "9183098734";
google_ad_width = 250;
google_ad_height = 250;
//-->
</script>
<script type="text/javascript"
src="http://pagead2.googlesyndication.com/pagead/show_ads.js">
</script>
<script type="text/javascript" src="<?php echo $homepath ?>js/jszip.min.js"></script>
<script type="text/javascript">
  function DL_TTT(){
    var zip = new JSZip();
    zip.file("Hello.txt", "Hello World\n");
    var img = zip.folder("images");
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');
    var actualImage = new Image();
    actualImage.src = "../img/arrow.png";
    actualImage.onload = function(){
      context.drawImage(actualImage, 0, 0 );
      var imgData = context.getImageData(0, 0, actualImage.width, actualImage.height);
      img.file("smile.png", imgData, {base64: true});
      var content = zip.generate();
      location.href="data:application/zip;base64,"+content;
    }
  }
</script>
</div>
    </div>
  </div>
    <hr class="featurette-divider">
    <h1>Full Application Tutorials</h1>
    <hr class="featurette-divider">
      <div class="row">
        <div class="span6">
          <h2>TicTacToe</h2>
          <p class="caption"><a href="tic-tac-toe.php">Tutorial</a> | <a onclick="_gaq.push(['_trackEvent', 'Tutorials', 'Download', 'Tic Tac Toe']); DL_TTT();">Download</a></p>
          <canvas id="ttt"class="mid-square" width="360px" height="360px">Please update your browser to a version that supports canvas</canvas> 
          <p class="caption">click the grid to play</p>
        </div>

        <div class="span6">
          <h2>Scroll Shooter</h2>
          <p class="caption"><a href="scroll-shooter.php">Tutorial</a> | <a onclick="_gaq.push(['_trackEvent', 'Tutorials', 'Download', 'Scroll Shooter']);"  href="../downloads/iio-scroll-shooter.zip">Download</a></p>
          <canvas id="space"class="mid-square" width="360px" height="360px">Please update your browser to a version that supports canvas</canvas> 
          <p class="caption">use awsd to move and space to shoot</p>
        </div>        
      </div><!-- /.row -->

      <!--<div class="row second">
        <div class="span6">
          <h2>Box2D Basics</h2>
          <p class="caption"><a href="tutorials/b2d.php">Tutorial</a> | <a href="">Download</a></p>
          <canvas id="b2d"class="mid-square" width="360px" height="360px">Please update your browser to a version that supports canvas</canvas> 
        </div>
      </div>/.row -->

  <?php include('../inc/footer.php'); ?>
  </div> <!-- end marketing container -->
<script type="text/javascript" src="<?php echo $homepath ?>js/Box2dWeb-2.1.a.3.js"></script>
<script type="text/javascript" src="<?php echo $homepath ?>js/iioEngine-1.2.1.js"></script>
<script type="text/javascript" src="<?php echo $homepath ?>js/SpaceShooter.io.js"></script>
<script type="text/javascript">
TicTacToe = function(io){
  var grid = io.addObj((new iio.ioGrid(0,0,3,3,120)).setStrokeStyle('white'));
  var xTurn=true;
  io.canvas.addEventListener('mousedown', function(event){
    event.preventDefault();
    var eventPos = io.getEventPosition(event);
    var cell = grid.getCellAt(io.getEventPosition(event),true);
    if (typeof grid.cells[cell.x][cell.y].taken == 'undefined'){
      if (xTurn) io.addObj(new iio.ioX(grid.getCellCenter(cell),80)
              .setStrokeStyle('red',2));
      else io.addObj(new iio.ioCircle(grid.getCellCenter(cell),40)
               .setStrokeStyle('#00baff',2));
      grid.cells[cell.x][cell.y].taken=true;
      xTurn=!xTurn;
    }
   });
}; iio.start(TicTacToe,'ttt');
iio.start(SpaceShooter,'space');
</script>
</body>
</html>