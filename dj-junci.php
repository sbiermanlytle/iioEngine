<?php 
$title = 'Junci';
include('inc/preHeader2.php');
?>
<div id="player" class="ui360 ui360-vis"><a href="junci/casper[7_31_13].mp3">SM2 Visualizer</a></div>
<div style="text-align:center;margin:0 auto">
<a target="_new" href="https://soundcloud.com/junci">Soundcloud</a> | <a target="_new" href="https://soundcloud.com/junci/casper-7-31-13">Download This Mix</a>
</div>
<script type="text/javascript" src="<?php echo $homepath ?>js/SM2/berniecode-animator.js"></script>
<script type="text/javascript" src="<?php echo $homepath ?>js/SM2/soundmanager2-jsmin.js"></script>
<script type="text/javascript" src="<?php echo $homepath ?>js/SM2/360player.js"></script>
<script type="text/javascript" src="<?php echo $homepath ?>js/iioEngine.min.js"></script>
<script type="text/javascript">
  function Promo(io){
    var cs = ['#00baff','red']
    var grid = io.addObj(new iio.Grid(0,0,io.canvas,gridRes));
    var fadeSpeed=.2;

      io.setFramerate(50, box,null,function(){
        if (box.styles.alpha == 0)
          box.fadeIn(fadeSpeed)
        else if (box.styles.alpha == 1)
          box.fadeOut(fadeSpeed)
      });
  };
	soundManager.setup({
      // required: path to directory containing SM2 SWF files
      url: 'js/SM2/swf/',
      onready: function() {
      //  iio.start(Promo);
      }
    });
    threeSixtyPlayer.config.autoPlay = true;
    threeSixtyPlayer.config.scaleFont = (navigator.userAgent.match(/msie/i)?false:true);
    threeSixtyPlayer.config.showHMSTime = true;

    // enable some spectrum stuffs
    threeSixtyPlayer.config.useWaveformData = true;
    threeSixtyPlayer.config.usePeakDataOutside=false;
    threeSixtyPlayer.config.useEQData = true;
    threeSixtyPlayer.config.scaleArcWidth = .1;
    threeSixtyPlayer.config.circleRadius = 40;
    threeSixtyPlayer.config.circleDiameter = 80;
    threeSixtyPlayer.config.waveformDataColor= '#00baff';
    threeSixtyPlayer.config.eqDataColor= 'green';
    threeSixtyPlayer.config.waveformDataLineRatio=.2

    // enable this in SM2 as well, as needed
    if (threeSixtyPlayer.config.useWaveformData) {
      soundManager.flash9Options.useWaveformData = true;
    }
    if (threeSixtyPlayer.config.useEQData) {
      soundManager.flash9Options.useEQData = true;
    }
    if (threeSixtyPlayer.config.usePeakData) {
      soundManager.flash9Options.usePeakData = true;
    }

    if (threeSixtyPlayer.config.useWaveformData || threeSixtyPlayer.flash9Options.useEQData || threeSixtyPlayer.flash9Options.usePeakData) {
      // even if HTML5 supports MP3, prefer flash so the visualization features can be used.
      soundManager.preferFlash = true;
    }

    // favicon is expensive CPU-wise, but can be enabled.
    threeSixtyPlayer.config.useFavIcon = false;

    var m = window.innerHeight/2-230;
    document.getElementById('player').style.marginTop=m+"px";
</script>