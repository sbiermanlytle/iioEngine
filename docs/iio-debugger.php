<?php 
	chdir('../');
    include('inc/redirector.php');
    $homepath = '../';
    $title = 'iio Debugger';
  include('inc/docsGlobals.php');
	include('inc/preHeader.php');
	include('inc/header.php');
  	include('docsPan.php');
?>
	<section class="container right-container top docs">
        <div id='ad-right'>
    <script type="text/javascript"><!--
if (document.body.clientWidth > 1100){
google_ad_client = "ca-pub-1234510751391763";
/* iioEngine_docs-debugger */
google_ad_slot = "3055839935";
google_ad_width = 120;
google_ad_height = 600;
}
//-->
</script>
<script type="text/javascript"
src="http://pagead2.googlesyndication.com/pagead/show_ads.js">
</script>
</div>
      <div class="docs-top">
        <a class="anchor top-anchor" name="overview">&nbsp;</a> 
        <h1>iio Debugger</h1>
        <h4>Download <a onclick="_gaq.push(['_trackEvent', 'JS', 'Download', 'iioDebugger']);" href="../js/iioDebugger.js">iioDebugger.js</a></h4>
        <p>The iio Debugger is a tool that allows you to monitor your application's framerate performance and object groups.</p>
        <p>Setup is very simple, just load an <span class="kwd">iioDebugger</span> js file directly after you load the <span class="kwd">iioEngine</span>:</p>
         <pre class="prettyprint linenums:1">
&lt;!doctype html&gt;
  &lt;body&gt;
    &lt;script type="text/javascript" src="iioEngine.js"&gt;&lt;/script&gt;
    &lt;script type="text/javascript" src="iioDebugger.js"&gt;&lt;/script&gt;
    <!-- iio application script... -->
  &lt;/body&gt;
&lt;/html&gt;</pre>
      <p>Then put the <span class="kwd">activateDebugger</span> command anywhere in your iio application script:</p>
<pre class="prettyprint linenums:1">
MainAppFunction = function(io){
 
  //start the debugger
  io.activateDebugger();

  //print debug message
  io.debugMsg('Hello Debugger!');

};</pre>
      <p>That's it, you should now see the debugger console popup on your application canvas.</p>
          <canvas id="debugger-demo"class="mid-square" style="width:100%; border:1px solid #f8f8f8" width="645px" height="400px">Please update your browser to a version that supports canvas</canvas> 
          <pre class="prettyprint linenums:1">
//Full HTML page and Application script demo
&lt;!doctype html&gt;
  &lt;body&gt;
    &lt;script type="text/javascript" src="iioEngine.js"&gt;&lt;/script&gt;
    &lt;script type="text/javascript" src="iioDebugger.js"&gt;&lt;/script&gt;
    &lt;script type="text/javascript"&gt;
      function DebuggerDemo(io){

        //activate debugger
        io.activateDebugger();
        
        //print debug message
        io.debugMsg('Hello Debugger!');
       
        //set background color and speed
        io.setBGColor('#5e3f6b');
        var backgroundSpeed = 6;

        //load images
        var imgPath = 'path-to-images'
        var backgroundSrcs = [imgPath+'Background/starBig.png', 
                          imgPath+'Background/starSmall.png', 
                          imgPath+'Background/speedLine.png', 
                          imgPath+'Background/nebula.png'];

        var asteroidSrcs = [imgPath+'meteorBig.png', 
                            imgPath+'meteorSmall.png'];

        //create background objects
        function runBgCreator(yMin, yMax){
          for (var i=0; i&lt;4; i++)
            for (var j=i*io.canvas.width/4; j&lt;(i+1)*io.canvas.width/4; j++)

                //create nebula
                if (iio.getRandomNum(0,10)&lt;.2)
                    io.addToGroup('nebulas',
                        new iio.Rect(j, iio.getRandomInt(yMin, yMax)), -20)
                        .createWithImage(backgroundSrcs[3])
                        .enableKinematics().setVel(0,backgroundSpeed)
                        .setBound('bottom',io.canvas.height+200);

                //create small stars
                else if (iio.getRandomNum(0,10)&lt;.2)
                    io.addToGroup('small stars',
                        new iio.Rect(j, iio.getRandomInt(yMin, yMax)), -30)
                        .createWithImage(backgroundSrcs[1])
                        .enableKinematics()
                        .setVel(0,Math.round(backgroundSpeed/2))
                        .setBound('bottom',io.canvas.height+100);

                //create big stars
                else if (iio.getRandomNum(0,10) &lt; .2)
                    io.addToGroup('big stars',
                        new iio.Rect(j, iio.getRandomInt(yMin, yMax)), -30)
                        .createWithImage(backgroundSrcs[0])
                        .enableKinematics()
                        .setVel(0,Math.round(backgroundSpeed/2)+.2)
                        .setBound('bottom',io.canvas.height+100);
        }

        function createLargeMeteor(){
            io.addToGroup('large meteors',
                new iio.Rect(iio.getRandomInt(30,io.canvas.width-30)
                          ,iio.getRandomInt(-800,-50)))
                .createWithImage(meteorSrcs[0])
                .enableKinematics()
                .setVel(iio.getRandomInt(-2,2)
                       ,iio.getRandomInt(10,14))
                .setBound('bottom', io.canvas.height+200)
                .setTorque(iio.getRandomNum(-.1,.1));
        }
        function createSmallMeteor(){
            io.addToGroup('small meteors',
                new iio.Rect(iio.getRandomInt(30,io.canvas.width-30)
                          ,iio.getRandomInt(-800,-50)))
                .enableKinematics()
                .setBound('bottom', io.canvas.height+200)
                .createWithImage(meteorSrcs[1])
                .setVel(iio.getRandomInt(-2,2),
                        iio.getRandomInt(10,14))
                .setTorque(iio.getRandomNum(-.1,.1));
        }

        var bgCreatorDelay = 80;
        var bgCount = 0;
        function updateBackground(){
            if (bgCount &lt; 1){
                runBgCreator(-io.canvas.height*2, 0);
                for (var i=0; i&lt;2; i++){
                    createLargeMeteor();
                    createSmallMeteor();
                }
                bgCount = bgCreatorDelay;
            } else bgCount--;
          }
       
        io.setFramerate(60, function(){
            updateBackground();
        });

      }; iio.start(DebuggerDemo,'canvasId');
    &lt;/script&gt;
  &lt;/body&gt;
&lt;/html&gt;</pre>
      </div>
<?php include('inc/footer.php'); ?>
    </section>
</div>
<script type="text/javascript" src="<?php echo $homepath ?>js/iioEngine.min.js"></script>
<script type="text/javascript" src="<?php echo $homepath ?>js/iioDebugger.js"></script>
<script type="text/javascript">
function DebuggerDemo(io){
io.setBGColor('#5e3f6b');
  io.activateDebugger();
 
        io.debugMsg('Hello Debugger!');
  var backgroundSpeed = 6;
  var imgPath = '../demo-apps/space-shooter/img/'
  var backgroundSrcs = [imgPath+'Background/starBig.png', 
                    imgPath+'Background/starSmall.png', 
                    imgPath+'Background/speedLine.png', 
                    imgPath+'Background/nebula.png'];

  var asteroidSrcs = [imgPath+'meteorBig.png', 
                      imgPath+'meteorSmall.png'];

 

  function runBgCreator(yMin, yMax){
      for (var i=0; i<4; i++)
          for (var j=i*io.canvas.width/4; j< (i+1)*io.canvas.width/4; j++)
              if (iio.getRandomNum(0,10) < .2){
                  io.addToGroup('nebulas',new iio.Rect(j, iio.getRandomInt(yMin, yMax)), -20).createWithImage(backgroundSrcs[3]).enableKinematics().setVel(0,backgroundSpeed).setBound('bottom',io.canvas.height+200);
              }
              else if (iio.getRandomNum(0,10) < .2)
                  io.addToGroup('small stars',new iio.Rect(j, iio.getRandomInt(yMin, yMax)), -30).createWithImage(backgroundSrcs[1]).enableKinematics().setVel(0,Math.round(backgroundSpeed/2)).setBound('bottom',io.canvas.height+100);
              else if (iio.getRandomNum(0,10) < .2)
                  io.addToGroup('big stars',new iio.Rect(j, iio.getRandomInt(yMin, yMax)), -30).createWithImage(backgroundSrcs[0]).enableKinematics().setVel(0,Math.round(backgroundSpeed/2)+.2).setBound('bottom',io.canvas.height+100);
  }

  function createLargeAsteroids(){
      var asteroid;
      if (iio.getRandomNum(0, 10) < 8){
          asteroid = io.addToGroup('large meteors', new iio.Rect(iio.getRandomInt(30,io.canvas.width-30), iio.getRandomInt(-800,-50))).createWithImage(asteroidSrcs[0]).enableKinematics().setVel(iio.getRandomInt(-2,2), iio.getRandomInt(10,14)).setBound('bottom', io.canvas.height+200).setTorque(iio.getRandomNum(-.1,.1));
        }
  }
  function createSmallAsteroids(){
      if (iio.getRandomNum(0, 10) < 8){
          var asteroid = io.addToGroup('small meteors', new iio.Rect(iio.getRandomInt(30,io.canvas.width-30), iio.getRandomInt(-800,-50))).enableKinematics().setBound('bottom', io.canvas.height+200).createWithImage(asteroidSrcs[1]).setVel(iio.getRandomInt(-2,2), iio.getRandomInt(10,14)).setTorque(iio.getRandomNum(-.1,.1));
      }
  }

    var bgCreatorDelay = 80;
    var bgCount = 0;
    function updateBackground(){
        if (bgCount < 1){
            runBgCreator(-io.canvas.height*2, 0);
            asteroidDensity = 3;
            for (var i=0; i<asteroidDensity; i++){
                createLargeAsteroids();
                createSmallAsteroids();
            }
            bgCount = bgCreatorDelay;
        } else bgCount--;
      }
 
  io.setFramerate(60, function(){
      updateBackground();
  });
}; iio.start(DebuggerDemo,'debugger-demo');
</script>