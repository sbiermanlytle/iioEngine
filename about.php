<?php 
	include('inc/redirector.php');
  $homepath = '';
  $title = 'About';
	include('inc/preHeader.php');
	include('inc/header.php');
?>
<!-- Carousel
================================================== -->
<div id="myCarousel" class="carousel slide">
  <div id="inner-carousel" class="carousel-inner">
    <div class="item active">
      <img id="feature-0" src="img/bnr-co.png" alt="">
    </div>
  </div>
</div><!-- /.carousel -->

 <!-- Marketing messaging and featurettes
    ================================================== -->
    <!-- Wrap the rest of the page in another container to center all the content. -->

    <div class="container marketing">
    <h1 style="margin:0 auto">About iio</h1>
    <hr class="featurette-divider">

      <!-- Three columns of text below the carousel -->
      <div class="row">
        <div class="span8">
          <h2>iio is an Open Source Initiative</h2>
          <p>The iio Engine was created to streamline the process of developing HTML5 applications. The ownership of the iio Engine rests in the hands of the open source community. Contributions to the core library and additions to its collection of extension packages are always welcome. New branches and merges are managed through Github.</p>
          <p>The iio framework was designed by Sebastian Bierman-Lytle of Denver, Colorado, and he continues to maintain and advance the Engine while pursuing a Computer Science degree at Dartmouth College.</p>
        </div>
        <div class="span4">
          <h2>Contact</h2>
          <p>The best way to contact the developer or any members of the iio Community is to post on the <a href="forums/">iio Forums</a>.</p>
          <p>If you would like to reach the developer about a private matter, you can PM <a href="http://iioengine.com/forums/member.php?action=profile&amp;uid=1">Sebastian</a> or email him at <a href="mailto:sebastian@iioengine.com">sebastian@iioEngine.com</a>.</p>
        </div>
        <!--<div class="span4">
          <h2>Extensions</h2>
          <p>Free and Premium extension packages are available to augment the power of the iio Engine and provide developers with higher level design tools and professional support. These extensions may or may not be open source, and some may require a licence fee.</p>
        </div>-->
      </div>
      <footer>
  <div class="left">&copy; 2013 iio Engine | <a target="_new" href="https://github.com/sbiermanlytle/iioengine">Github</a> | <a target="_new" href="https://twitter.com/iioEngine">Twitter</a></div>
  <form id="donate" action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top">
          <input type="hidden" name="cmd" value="_donations">
          <input type="hidden" name="business" value="sbiermanlytle@gmail.com">
          <input type="hidden" name="lc" value="US">
          <input type="hidden" name="item_name" value="iio Engine">
          <input type="hidden" name="no_note" value="0">
          <input type="hidden" name="currency_code" value="USD">
          <input type="hidden" name="bn" value="PP-DonationsBF:btn_donate_SM.gif:NonHostedGuest">
          <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!">
          <img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1">
        </form>
  <div class="right">Designed by Sebastian | <a target="_new" href="mailto:sebastian@iioengine.com">Contact</a></div>
</footer>
<script src="<?php echo $homepath ?>js/jquery-1.9.1.min.js"></script>
<script src="<?php echo $homepath ?>js/bootstrap.min.js"></script>
</body>
</html>
  </div> <!-- end marketing container -->
<script>
  !function ($) {
    $(function(){
      $('#myCarousel').carousel()
    })
  }(window.jQuery)
  function addEvent(obj,evt,fn,capt){  
    if(obj.addEventListener) {  
      obj.addEventListener(evt, fn, capt);  
      return true;  
    }  
    else if(obj.attachEvent) {  
      obj.attachEvent('on'+evt, fn);  
      return true;  
    }  
    else return false;  
  }
  function setCarousal(){
    var e=document.getElementById("inner-carousel");
    var features = [];
    features[0] = document.getElementById("feature-0");
    var leftMargin;
    for (var i=0;i<features.length;i++){
      leftMargin = (window.innerWidth - features[i].clientWidth)/2;
      if (leftMargin < 0) 
        features[i].style.marginLeft = leftMargin + "px";
      else { 
        features[i].style.marginLeft = "auto";
        features[i].style.marginRight = "auto";
      }

    }
  } setCarousal();
  addEvent(window, 'resize', setCarousal, false);
</script>
</body>
</html>