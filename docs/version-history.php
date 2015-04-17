<?php 
	chdir('../');
    include('inc/redirector.php');
    $homepath = '../';
    $title = 'Version History';
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
/* iioEngine_docs-versions */
google_ad_slot = "8683571132";
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
        <h1>Engine Version History</h1>
      <div class="docs-middle">
        <a class="anchor" name="1.2">&nbsp;</a> 
        <h2>v1.2</h2>
        <p>This version has no dependencies, and separates the rendering functions, object definitions, and kinematics functions into separate code structures.</p>
        <p>Version 1.2 has been thoroughly documented in this API, and change logs will track the updates and deprecations in future versions.</p>
        <div class="docs-inner">
        <a class="anchor inner-anchor" name="1.2.2">&nbsp;</a> 
          <h3>1.2.2</h3>
          <p>This update features several new components and classes, many new functions and bug fixes, as well as an overhauled collision detection system.</p>
          <p>A significant difference is that the prefix '<span class="kwd">io</span>' has been removed from all class names in v1.2.2.</p>
          <p>The usage License has also been changed for v1.2.2. This version has been released under the BSD 2-Clause Open Source License.</p>
        <h5 style="margin-top:25px">Download: <a onclick="_gaq.push(['_trackEvent', 'JS', 'Download', 'iioEngine-1.2.2.min']);" href="../js/iioEngine-1.2.2.min.js">iioEngine-1.2.2.min.js</a></h5>
        <h5>Download: <a onclick="_gaq.push(['_trackEvent', 'JS', 'Download', 'iioEngine-1.2.2']);" href="../js/iioEngine-1.2.2.js">iioEngine-1.2.2.js</a></h5>
      </div>
        <div class="docs-inner">
        <a class="anchor inner-anchor" name="1.2.1">&nbsp;</a> 
          <h3>1.2.1</h3>
          <p>The first version of the iio Engine released to the public.</p>
          <p>Application update timers are no longer controlled by a central structure. Each application sets its own timer in this version.</p>
        <h5 style="margin-top:25px">Download: <a onclick="_gaq.push(['_trackEvent', 'JS', 'Download', 'iioEngine-1.2.1.min']);" href="../js/iioEngine-1.2.1.min.js">iioEngine-1.2.1.min.js</a></h5>
        <h5>Download: <a onclick="_gaq.push(['_trackEvent', 'JS', 'Download', 'iioEngine-1.2.1']);" href="../js/iioEngine-1.2.1.js">iioEngine-1.2.1.js</a></h5>
      </div>
        <a class="anchor inner-anchor" name="1.2.0">&nbsp;</a> 
        <div class="docs-inner">
          <h3>1.2.0</h3>
          <p>This version features massive structural overhauls. It separates iio components into attachable frameworks, so that iio Objects never have superfluous data.</p>
          <p>Like its predecessor, this version controls Application updating through a central structure. This was found to cause lagging issues when multiple apps were active, so the framework was restructured again.</p>
          <p>This version is not available to download.</p>
        </div>
      </div>
      <div class="docs-middle">
         <a class="anchor" name="1.1">&nbsp;</a> 
        <h2>v1.1</h2>
        <p>Version 1.1 was restructured to not be dependent on the Prototype library. This version has no dependencies.</p>
        <p>This code was never documented. The source remains, but no guides to it exist.</p>
        <p>This version was released at the same time as v1.2.1.</p>
        <h5 style="margin-top:25px">Download: <a onclick="_gaq.push(['_trackEvent', 'SDK', 'Download', 'iioEngine 1.1']);" href="../js/iioEngine-1.1.zip">iioEngine-1.1 zip</a></h5>
      </div>
      <div class="docs-middle">
        <a class="anchor" name="functions">&nbsp;</a> 
        <h2>v1.0</h2>
        <p>Version 1.0 is based on the <a href="http://prototypejs.org/">Prototype 1.7.1</a> JavaScript library.</p>
        <p>It was intended to be integrated with <a href="http://box2d-js.sourceforge.net/">Box2DJS</a>, which is another JavaScript Box2D port that is also based on the <a href="http://prototypejs.org/">Prototype</a> library.</p>
        <p>This version was never documented. The source code remains, but no guides to it exist.</p>
        <p>A significant difference between this version and others is that all class names are preceded by <span class="kwd">ii</span> instead of <span class="kwd">io</span>.</p>
        <p>This version was released at the same time as v1.2.1.</p>
        <h5 style="margin-top:25px">Download: <a onclick="_gaq.push(['_trackEvent', 'SDK', 'Download', 'iioEngine 1.0']);" href="../js/iioEngine-1.0.zip">iioEngine-1.0 zip</a></h5>
        </div>
      </div>
<?php
  include('inc/footer.php');
?>
    </section>
</div>