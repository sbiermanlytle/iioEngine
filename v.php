<?php 
$title = 'SM2 Visualizer';
include('inc/preHeader2.php');
include('inc/header.php');
?>
<div class="ui360 ui360-vis"><a href="audio/house.mp3">SM2 Visualizer</a></div>
<script type="text/javascript" src="<?php echo $homepath ?>js/SM2/berniecode-animator.js"></script>
<script type="text/javascript" src="<?php echo $homepath ?>js/SM2/soundmanager2-jsmin.js"></script>
<script type="text/javascript" src="<?php echo $homepath ?>js/SM2/360player.js"></script>
<script type="text/javascript" src="<?php echo $homepath ?>js/iioEngine.min.js"></script>
<script type="text/javascript">
	soundManager.setup({
      // required: path to directory containing SM2 SWF files
      url: 'js/SM2/swf/',
      onready: function() {

      }
    });
    threeSixtyPlayer.config.scaleFont = (navigator.userAgent.match(/msie/i)?false:true);
    threeSixtyPlayer.config.showHMSTime = true;

    // enable some spectrum stuffs
    threeSixtyPlayer.config.useWaveformData = true;
    threeSixtyPlayer.config.useEQData = true;

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
</script>