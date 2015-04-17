<?php 
chdir('../');
	include('inc/redirector.php');
  $homepath = '../';
  $title = 'HTML & CSS Tutorial';
	include('inc/preHeader.php');
	include('inc/header.php');
?>
<section class="container tuts tutorial-container top">
    <div id='ad-right'>
  <script type="text/javascript"><!--
  if (document.body.clientWidth > 1000){
google_ad_client = "ca-pub-1234510751391763";
/* iioEngine_tuts-hc_skyscraper */
google_ad_slot = "6100364739";
google_ad_width = 120;
google_ad_height = 600;
}
//-->
</script>
<script type="text/javascript"
src="http://pagead2.googlesyndication.com/pagead/show_ads.js">
</script>
</div>
  <div class="span3 page-anchors" style="margin-left:-180px">
  <ul class="nav nav-list affix">
    <li>
      <a href="#overview">
        <i class="icon-chevron-right"></i>
        Overview
      </a>
    </li>
    <li>
      <a href="#html">
        <i class="icon-chevron-right"></i>
        Basic HTML
      </a>
    </li>
    <li>
      <a href="#css">
        <i class="icon-chevron-right"></i>
        Basic CSS
      </a>
    </li>
  </ul>
</div>
  <a class="anchor top-anchor" name="overview">&nbsp;</a> 
  <h1>HTML and CSS Basics</h1>
  <hr class="featurette-divider">
  <p>This tutorial is intended to provide you with an overview of HTML and CSS coding so that you can understand how to control the foundation of your application.</p>
  <p>This is not a Web Design 101 tutorial, we will only cover the aspects that are relevant to iio Application development.</p>  
  <p>To follow this tutorial, you'll need a <a href="quick-start.php">text editor</a> and a <span class="kwd">web browser</span>.</p>

  <a class="anchor inner-anchor" name="html">&nbsp;</a> 
  <h2>The Basic HTML Page Structure</h2>
  <p>HTML browser applications are the platform of all iio Applications. These browsers can operate on the web or offline, and the number of devices that have HTML5 compatible browsers is rapidly growing.</p>
  <p>HTML pages are documents that define any number of elements, which can each contain more elements or content.</p>
  <p>HTML5 defines a special type of element called a <span class="kwd">canvas</span> Element.</p>
  <p>The iio Engine takes control of one or more <span class="kwd">canvas</span> Elements and allows you to work with high level design constructs that make coding interactive HTML applications much easier.</p>
  <p>You can code your entire iio Application in JavaScript, but you always need an HTML page to hold the <span class="kwd">canvas</span>(s).</p>
 <p>You don't actually need to create a <span class="kwd">canvas</span> yourself - iio can do that for you with its <a href="">start</a> functions - but for the sake of transparency in this tutorial, we will define a <span class="kwd">canvas</span> ourselves on an HTML page.</p>
  <p>Create a new file and name it <span class="kwd">html-tutorial.htm</span>, then open it up in a text editor and input this code:</p>
  <pre class="prettyprint linenums:1">
&lt;!doctype html&gt;
  &lt;body&gt;
    &lt;canvas id="myCanvas" width="600px" height="600px"/&gt;
  &lt;/body&gt;
&lt;/html&gt;</pre>
  <p>This is the simplest valid html page we can create. The first line declares that the page is an html document and the second marks the beginning of the <span class="kwd">body</span> element, which is where all the content on our page goes.</p>
  <p>The third line defines a 600x600 <span class="kwd">canvas</span> element with the id <span class="kwd">myCanvas</span>.</p>
  <p>You can open this file in any web browser and it will run without error. It looks like a blank white page, but if you inspect it with your browsers page inspect tool, you can see that our <span class="kwd">canvas</span> element does exist and is positioned in the top left corner.</p>
  <p>It would be nice if we could see the <span class="kwd">canvas</span> though, so let's put a border around it.</p>

  <a class="anchor inner-anchor" name="css">&nbsp;</a> 
  <h2>Using CSS to Specify Styles</h2>
  <p>HTML only contains information about page structure and element hierarchies - it doesn't control layout and doesn't define very much about what the page actually looks like.</p>
  <p>All of a pages colors, fonts, text formatting, borders, underlines, etc. are defined in a language called <span class="kwd">CSS</span>, which stands for <span class="kwd">Cascading Style Sheets</span>.</p>
  <p>We can use <span class="kwd">CSS</span> in two different ways to define an elements style. Coming back to our HTML page and canvas border example, we could replace the canvas definition we used before with this:</p>
    <pre class="prettyprint linenums:1">
  &lt;canvas id="myCanvas" 
             style="border:1px solid black" 
             width="600px" 
             height="600px"/&gt;</pre>
  <p>See the new 'style' property added on line 2? That's <span class="kwd">CSS</span> code inside its quotations.</p>
  <p>If you refresh your HTML page in your browser, you should now see that your canvas is outlined with a 1px solid black line.</p>
  <p>It doesn't look very good sitting up in the top left corner though, so let's use another <span class="kwd">CSS</span> rule to center the canvas and give it some padding on top.</p>
  <p>We're going to do this with the second <span class="kwd">CSS</span> option that I alluded to earlier: by creating an actual stylesheet.</p>
  <p>Change your HTML page's code to this:</p>
    <pre class="prettyprint linenums:1">
&lt;!doctype html&gt;
  &lt;head&gt;
    &lt;style&gt;
      canvas{ border: 1px solid black }
    &lt;/style&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;canvas id="myCanvas" width="600px" height="600px"/&gt;
  &lt;/body&gt;
&lt;/html&gt;</pre>
<p>This will give you the exact same result as before.</p>
<p>The <span class="kwd">head</span> is an element where you can define meta information, JS and style scipts, and load external files.</p>
<p>We can define a stylesheet that effects the entire HTML page in the <span class="kwd">head</span> element.</p>
<p>We could also save our stylesheet as an external <span class="kwd">.css</span> file, and load it into our document like this:</p>
    <pre class="prettyprint linenums:1">
&lt;!doctype html&gt;
  &lt;head&gt;
    &lt;link rel="stylesheet" type="text/css" href="myCSSFileName.css"&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;canvas id="myCanvas" width="600px" height="600px"/&gt;
  &lt;/body&gt;
&lt;/html&gt;</pre>
  <p>Since we're not working with a huge set of styles or multiple pages, we will keep our style sheet directly defined in the <span class="kwd">head</span>.</p>
  <p>Centering the canvas with styles is easy by using the <span class="kwd">auto margin</span> rule. We also have to set the <span class="kwd">display</span> mode to <span class="kwd">block</span> in order for this to work:</p>
      <pre class="prettyprint linenums:1">
&lt;!doctype html&gt;
  &lt;head&gt;
    &lt;style&gt;
      canvas{
           margin: 20px auto;
           border: 1px solid black;
           display: block;
        }
    &lt;/style&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;canvas id="myCanvas" width="600px" height="600px"/&gt;
  &lt;/body&gt;
&lt;/html&gt;</pre>
<p>This stylesheet gives our canvas 20 pixels of padding on the top and bottom, centers it on the screen, and adds our border like before.</p>
<p>If we want to invert the color scheme (as I always like to do), we can use this code:</p>
      <pre class="prettyprint linenums:1">
&lt;!doctype html&gt;
  &lt;head&gt;
    &lt;style&gt;
      html{
         background-color: black;
      }
      canvas{
         margin: 20px auto;
         border: 1px solid white;
         display: block;
      }
    &lt;/style&gt;
  &lt;/head&gt;
  &lt;body&gt;
    &lt;canvas id="myCanvas" width="600px" height="600px"/&gt;
  &lt;/body&gt;
&lt;/html&gt;</pre>
  <p>That's all I'm going to show you when it comes to HTML and CSS. There are a lot of other tutorials out there if you need assistance, but I've always found that once you have the basics down, the best way to learn these languages is to just google whatever specific challenge you're currently facing.</p>
<?php include('inc/footer.php'); ?>
</section>
</body>
</html>