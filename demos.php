<?php 
	include('inc/redirector.php');
  $homepath = '';
  $title = 'Demos';
	include('inc/preHeader.php');
	include('inc/header.php');
?>
    <script type="text/javascript">
function popup(url){
  codeWindow = window.open(url, "littleWindow", "location=no,menubar=no,toolbar=no,width=600,height=600,left=0"); 
  codeWindow.moveTo(0,0);
}
</script>
<div class="container marketing demos">
    <hr class="featurette-divider">
    <h1 style="margin:0">iio Engine Demos</h1>
    <hr class="featurette-divider">

    <h4><span class="kwd">Dynamics &amp; Images</span> | click a canvas to get the code</h4>
        <div class="demo-wrapper offset-demos">
            <div class="med-appWrapper">
                <h5>Box2D</h5>
                    <a href="javascript:popup('demo-code/Box2dDemo.php')">
                    <canvas id="b2d" width="306px" height="455px"/>
                    </a>
            </div>
            <div class="med-appWrapper">
                <h5>Collisions</h5>
                    <a href="javascript:popup('demo-code/CollisionsDemo.php')">
                    <canvas id="collisions" width="306px" height="455px"/>
                    </a>
            </div>
            <div class="appWrapper">
                <h5>Animation</h5>
                <a href="javascript:popup('demo-code/AnimDemo.php')">
                    <canvas id="c1" width="200px" height="200px"/>
                </a>
            </div>
            <div class="appWrapper">
                <h5>Kinematics</h5>
                <a href="javascript:popup('demo-code/KinematicsDemo.php')">
                <canvas id="c2" width="200px" height="200px"/> 
                </a>
            </div>
            <div class="appWrapper">
                <h5>Polygonal Images</h5>
                <a href="javascript:popup('demo-code/ImageDemo.php')">
                <canvas id="c3" width="200px" height="200px"/> 
                </a>
            </div>
            <div class="appWrapper">
                <h5>Circular Images</h5>
                <a href="javascript:popup('demo-code/CircleImageDemo.php')">
                <canvas id="c4" width="200px" height="200px"/>
                </a>
            </div> 
        <div class="clearfix"></div>
        </div>
    <hr class="featurette-divider">
    <h4 id="interactive-demos-title"><span class="kwd">Interactive Demos</span> | Full application demos are available in <a href="tutorials.php">Tutorials</a></h4>
        <div class="demo-wrapper">
            <div class="large-appWrapper">
                <h5>Turret Defender | <a href="https://github.com/sbiermanlytle/iioengine/blob/master/demos/turret-defender/js/TurretDefender.io.js">See Code</a></h5>
                    <canvas style="cursor:crosshair" id="turret-defender" width="518px" height="310px"></canvas>
                <p>Click to shoot</p>
            </div>
            <div class="large-appWrapper">
                <h5>Scroll Shooter | <a href="https://github.com/sbiermanlytle/iioengine/blob/master/demos/scroll-shooter/SpaceShooter+.io.js">See Code</a> | <a href="http://iioengine.com/tutorials/scroll-shooter">Tutorial</a></h5>
                    <canvas style="" id="space-shooter" width="518px" height="310px"></canvas>
                <p>Move with ASWD, shoot with Space</p>
            </div>
            <div class="large-appWrapper">
                <h5>Grid App | <a href="https://github.com/sbiermanlytle/iioengine/blob/master/demos/grid-demo.htm">See Code</a></h5>
                    <canvas id="grid-app" width="518px" height="310px"></canvas>
                <p>Use the arrow keys to interact</p>
            </div>
            <div class="large-appWrapper">
                <h5>Drag &amp; Drop | <a href="https://github.com/sbiermanlytle/iioengine/blob/master/demos/drag-and-drop.htm">See Code</a></h5>
                    <canvas id="DnD" width="518px" height="310px"></canvas>
                <p>Click and hold to drag objects</p>
            </div>
        <div class="clearfix"></div>
        </div>
    <hr class="featurette-divider">
    <h4><span class="kwd">iio Objects</span> | Click a canvas to get the code</h4>
        <div class="demo-wrapper offset-demos">
            <div class="appWrapper">
                <h5>Lines</h5>
                <a href="javascript:popup('demo-code/LineDemo.php')">
                <canvas id="c9" width="200px" height="200px"/>
                </a>
            </div> 
             <div class="appWrapper">
                <h5>Rectangles</h5>
                <a href="javascript:popup('demo-code/RectanglesDemo.php')">
                <canvas id="c14" width="200px" height="200px"/> 
                </a>
            </div>
            <div class="appWrapper">
                <h5>Circles</h5>
                <a href="javascript:popup('demo-code/CirclesDemo.php')">
                <canvas id="c15" width="200px" height="200px"/> 
                </a>
            </div>
            <div class="appWrapper">
                <h5>Polygons</h5>
                <a href="javascript:popup('demo-code/PolyDemo.php')">
                <canvas id="c16" width="200px" height="200px"/> 
                </a>
            </div>
            <div class="appWrapper">
                <h5>Text</h5>
                <a href="javascript:popup('demo-code/TextDemo.php')">
                    <canvas id="c5" width="200px" height="200px"/>
                </a>
            </div>
            <div class="appWrapper">
                <h5>Text Shadow</h5>
                <a href="javascript:popup('demo-code/TextShadowDemo.php')">
                <canvas id="c12" width="200px" height="200px"/> 
                </a>
            </div>
            <div class="appWrapper">
                <h5>Multi-Line</h5>
                <a href="javascript:popup('demo-code/MultiLineDemo.php')">
                    <canvas id="c7" width="200px" height="200px"/> 
                </a>
            </div>
            <div class="appWrapper">
                <h5>Line Shadow</h5>
                <a href="javascript:popup('demo-code/LineShadowDemo.php')">
                    <canvas id="c77" width="200px" height="200px"/> 
                </a>
            </div>
            <div class="appWrapper">
                <h5>Grids</h5>
                <a href="javascript:popup('demo-code/GridsDemo.php')">
                <canvas id="c19" width="200px" height="200px"/> 
                </a>
            </div>
            <div class="appWrapper">
                <h5>X Shape</h5>
                <a href="javascript:popup('demo-code/XDemo.php')">
                <canvas id="c8" width="200px" height="200px"/> 
                </a>
            </div>
        <div style="margin-bottom:40px" class="clearfix"></div>
        </div>
    <hr class="featurette-divider">
        <h4><span class="kwd">Background Control</span> | click a canvas to get the code</h4>
        <div class="demo-wrapper offset-demos">
            <div class="appWrapper">
                <h5>Background Image</h5>
                <a href="javascript:popup('demo-code/BGImageDemo.php')">
                <canvas id="c21" width="200px" height="200px"/> 
                </a>
            </div>
            <div class="appWrapper">
                <h5>Background Pattern</h5>
                <a href="javascript:popup('demo-code/BGPatternDemo.php')">
                <canvas id="c18" width="200px" height="200px"/> 
                </a>
            </div>
            <div class="appWrapper">
                <h5>Opaque Background</h5>
                <a href="javascript:popup('demo-code/BGOpaqueDemo.php')">
                <canvas id="c17" width="200px" height="200px"/> 
                </a>
            </div>
            <div class="appWrapper">
                <h5>Background Color</h5>
                <a href="javascript:popup('demo-code/BGColorDemo.php')">
                <canvas id="c20" width="200px" height="200px"/> 
                </a>
            </div>
        <div class="clearfix"></div>
        </div>
    <hr class="featurette-divider">
<?php include('inc/footer.php'); ?>
</div>
<!-- Load Libs -->
<script type="text/javascript" src="<?php echo $homepath ?>js/SM2/soundmanager2-jsmin.js"></script>
<script type="text/javascript" src="<?php echo $homepath ?>js/Box2dWeb-2.1.a.3.js"></script>
<script type="text/javascript" src="<?php echo $homepath ?>js/iioEngine.min.js"></script>
<!-- Load applications -->
<script type="text/javascript" src="<?php echo $homepath ?>js/QuickDemos.js"></script>
<script type="text/javascript" src="<?php echo $homepath ?>js/TurretDefender.io.js"></script>
<script type="text/javascript" src="<?php echo $homepath ?>js/SpaceShooter+.io.js"></script>
<script type="text/javascript" src="<?php echo $homepath ?>js/GridApp.io.js"></script>
<script type="text/javascript" src="<?php echo $homepath ?>js/DragnDrop.io.js"></script>
<script type="text/javascript" src="<?php echo $homepath ?>js/Collisions.io.js"></script>
<script type="text/javascript">
    //iio.start(CollisionApp, 'collisionsApp');
    soundManager.setup({
      // required: path to directory containing SM2 SWF files
      url: 'js/SM2/swf/',
      onready: function() {
        iio.start(TurretDefender,'turret-defender');
        iio.start(SpaceShooter,'space-shooter');
      }
    });
    iio.start(GridApp, 'grid-app');
    iio.start(DragAndDropApp, 'DnD');
</script>
</body>
</html>