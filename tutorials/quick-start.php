<?php 
chdir('../');
	include('inc/redirector.php');
  $homepath = '../';
  $title = 'Quick Start Guide';
	include('inc/preHeader.php');
	include('inc/header.php');
?>

<section class="container tuts tutorial-container top">
  <div id='ad-right'>
    <script type="text/javascript"><!--
if (document.body.clientWidth > 1000){
  google_ad_client = "ca-pub-1234510751391763";
  /* iioEngine_tuts-qs_skyscraper */
  google_ad_slot = "7577097935";
  google_ad_width = 120;
  google_ad_height = 600;
}
//-->
</script>
<script type="text/javascript"
src="http://pagead2.googlesyndication.com/pagead/show_ads.js">
</script>
</div>
  <div class="span3 page-anchors" style="margin-left:-200px">
  <ul class="nav nav-list affix">
    <li>
      <a href="#overview">
        <i class="icon-chevron-right"></i>
        Get the Tools
      </a>
    </li>
    <li>
      <a href="#hello-iio">
        <i class="icon-chevron-right"></i>
        Hello iio
      </a>
    </li>
    <li>
      <a href="#next-steps">
        <i class="icon-chevron-right"></i>
        Next Steps
      </a>
    </li>
  </ul>
</div>
  <a class="anchor top-anchor" name="overview">&nbsp;</a> 
  <h1>iio Quick Start Guide</h1>
  <hr class="featurette-divider">
  <h2>Get the Development Tools</h2>
  <p>Before you get started developing HTML5 apps with iio, you'll need:</p>
  <h4>The iio Engine JS File</h4>
  <p>Download right here: <a onclick="_gaq.push(['_trackEvent', 'JS', 'Download', 'iioEngine.min']);" href="../js/iioEngine.min.js">iioEngine.min.js</a> (also included in the SDK)</p>
  <h4>A Solid Text Editor</h4>
  <p>I would recommend <a target="_new" href="http://www.sublimetext.com/2">Sublime Text 2</a>. Its free until you decide to buy it, has code hinting, and it can make your whole monitor look like this:</p>
  <a href="../img/sublime.jpg"><img src="../img/sublime.jpg" alt="SublimeText2" height="auto" width="100%"></a>
  <p>Another good option is <a href="http://notepad-plus-plus.org/">Notepad++</a>. It's also free (and you never have to buy it), and it also has some pretty cool skins.</p>
  <h4>A Web Browser</h4>
  <p>You already have one of these, you are using it right now. Any modern (HTML5 compatible) web browser will do.</p>
  <h4>That's it. Lets make an app.</h4>

  <a class="anchor inner-anchor" name="hello-iio">&nbsp;</a> 
  <h1>Hello iio</h1>
  <hr class="featurette-divider">
  <p>We're going to make our first iio Application. We'll create an app that draws "Hello iio" onto the middle of our screen.</p>
  <p>Create a new folder somewhere called <span class="kwd">Hello iio</span> and put the <span class="kwd">iioEngine</span> JavaScript file into it.</p>
  <p>Now create a new HTML file called <span class="kwd">hello-iio.htm</span> in that folder.</p>
  <p>Open this new file in your text editor and input this code:</p>
  <pre class="prettyprint linenums:1">
&lt;!doctype html&gt;
  &lt;body&gt;
    &lt;script type="text/javascript" src="iioEngine.min.js"&gt;&lt;/script&gt;
    &lt;script type="text/javascript"&gt;
        //application script...
    &lt;/script&gt;
  &lt;/body&gt;
&lt;/html&gt;</pre>
<p>This code defines an HTML document, loads the iio Engine, and then opens up the script area where we will code our app.</p>
<p>We now need to define a main application function. Put this line where the 'application script' comment is now:</p>
  <pre class="prettyprint linenums:1">
Helloiio = function(io){
  //application code...
};</pre>
<p>This is an iio App main function. The parameter <span class="kwd">io</span> refers to our <a href="../docs/AppManager.php">AppManager</a>, which is a structure that will help us manage all of our application's assets.</p>
<p>Creating a Text object can be done in two simple steps: create the object, then give it to our AppManager.</p>
<p>These steps can be written in the same line of code. Replace the 'application code' comment in the previous sample with this:</p>
  <pre class="prettyprint linenums:1">
//Give our AppManager a new text object
io.addObj(new iio.Text('Hello iio!!', io.canvas.center)
    .setFont('30px Consolas')
    .setTextAlign('center')
    .setFillStyle('black'));</pre>
<p>All thats left to do is to start our app. Put this code after the closing bracket of the <span class="red">Helloiio</span> function:</p>
  <pre class="prettyprint linenums:1">
iio.start(Helloiio);</pre>
<p>Now open the HTML file in a web browser.</p>
<p>Hello, and welcome to iio Engine development.</p>
<p>The full HTML file:</p>
  <pre class="prettyprint linenums:1">
&lt;!doctype html&gt;
  &lt;body&gt;
    &lt;script type="text/javascript" src="iioEngine.min.js"&gt;&lt;/script&gt;
    &lt;script type="text/javascript"&gt;

        Helloiio = function(io){

          io.addObj(new iio.Text('Hello iio!!', io.canvas.center)
              .setFont('30px Consolas')
              .setTextAlign('center')
              .setFillStyle('black'));

        }; iio.start(Helloiio);

    &lt;/script&gt;
  &lt;/body&gt;
&lt;/html&gt;</pre>
<canvas id="c" style="background-color:white; margin-top:30px" width="450px" height="450px"></canvas>
<a class="anchor inner-anchor" name="next-steps">&nbsp;</a> 
  <h1>Next Steps</h1>
  <hr class="featurette-divider">
  <p>If you've never coded before or aren't too familiar with HTML and CSS, I'd recommend reading through the <a href="html-css.php">HTML &amp; CSS Tutorial</a>.</p>
  <p>If you are new to JavaScript programming, or want a step-by-step walk through of the development of a full iio Application, you should check out the <a href="tic-tac-toe.php">Tic Tac Toe Tutorial</a>.</p>
  <p>If you have some JS experience and want to jump right in to a more complex application example, check out the <a href="scroll-shooter.php">Scroll Shooter Tutorial</a>.</p>
  <p>If you have an app in mind already and want to just get started working on it, read through the <a href="../docs/iio-basics.php">iio Basics</a> documentation page, or just check out the <a href="../demos.php">demos</a> for some quick code samples.</p>
<script type="text/javascript" src="<?php echo $homepath ?>js/iioEngine-1.2.1.js"></script>
<script type="text/javascript">
Helloiio = function(io){
  io.addObj(new iio.ioText('Hello iio!!', io.canvas.center)
    .setFont('30px Consolas')
    .setTextAlign('center')
    .setFillStyle('black'));

}; iio.start(Helloiio, 'c');
    </script>
  <?php include('inc/footer.php'); ?>
</section>
</body>
</html>