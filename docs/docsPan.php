<div id="main-container">
	<div class="left-menu">
		<nav id="docs-nav">
			     <!-- DOCUMENTATION NAVBAR
    ================================================== -->
    <div class="accordion" id="documentation-nav">
      <h3>iio Engine API</h3>
      <!--<div class="accordion-group">
        <div class="accordion-heading">
          <a class="accordion-toggle" data-toggle="collapse" href="">
            io App Standards &amp; Best Practices
          </a>
        </div>
      </div>-->
      <div class="accordion-group">
        <div class="accordion-heading">
          <a class="accordion-toggle" data-toggle="collapse" href="#c10">
            iio App Basics
          </a>
          <div id="c10" class="accordion-body collapse <?php if(strpos(curPageURL(),'io-basics') !== false){ echo 'in'; } ?>">
            <div class="accordion-heading">
              <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/iio-basics.php#overview">Overview</a>
            </div>
            <div class="accordion-heading">
              <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/iio-basics.php#main-functions">Main App Functions</a>
            </div>
            <div class="accordion-heading">
              <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/iio-basics.php#this">this &amp; Cascading Code</a>
            </div>
            <div class="accordion-heading">
              <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/iio-basics.php#iio">iio Packages</a>
            </div>
            <div class="accordion-heading">
              <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/iio-basics.php#drawing">Drawing Objects</a>
            </div>
            <div class="accordion-heading">
              <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/iio-basics.php#kinematics">Moving Objects</a>
            </div>
            <div class="accordion-heading">
              <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/iio-basics.php#img-attachment">Attaching Images</a>
            </div>
            <div class="accordion-heading">
              <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/iio-basics.php#anim-attachment">Attaching Animations</a>
            </div>
            <div class="accordion-heading">
              <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/iio-basics.php#bounds">Object Bounds</a>
            </div>
            <div class="accordion-heading">
              <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/iio-basics.php#groups">Object Groups</a>
            </div>
            <div class="accordion-heading">
              <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/iio-basics.php#collisions">Collisions</a>
            </div>
            <div class="accordion-heading">
              <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/iio-basics.php#input">Detecting Input</a>
            </div>
            <div class="accordion-heading">
              <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/iio-basics.php#resize">Resize Events</a>
            </div>
            <div class="accordion-heading">
              <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/iio-basics.php#multiple-canvases">Multiple Canvases</a>
            </div>
          </div>
        </div>
      </div>
      <!--<div class="accordion-group">
        <div class="accordion-heading">
          <a class="accordion-toggle" data-toggle="collapse" href="#c1">
            .io Applications
          </a>
        </div>
        <div id="c1" class="accordion-body collapse <?php if(strpos(curPageURL(),'io-applications') !== false){ echo 'in'; } ?>">
      <div class="accordion-heading">
        <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/io-applications.php">Standardized Web Apps</a>
      </div>
      <div class="accordion-heading">
        <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/io-applications.php#code-structure">Code Structure</a>
      </div>
      <div class="accordion-heading">
        <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/io-applications.php">App Control</a>
      </div>
      <div class="accordion-heading">
        <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/io-applications.php">Best Practices</a>
      </div>
    </div>
      </div>-->
       <div class="accordion-group">
        <div class="accordion-heading">
          <a class="accordion-toggle" data-toggle="collapse" href="#c2">
            AppManager
          </a>
        </div>
        <div id="c2" class="accordion-body collapse <?php if(strpos(curPageURL(),'AppManager') !== false){ echo 'in'; } ?>">
      <div class="accordion-heading">
        <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/AppManager.php#overview">Overview</a>
      </div>
      <div class="accordion-heading">
        <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/AppManager.php#properties">Properties</a>
      </div>
      <div class="accordion-heading">
        <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/AppManager.php#canvas">canvas</a>
      </div>
      <div class="accordion-heading">
        <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/AppManager.php#context">context</a>
      </div>
      <div class="accordion-heading">
        <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/AppManager.php#cnvs">cnvs</a>
      </div>
      <div class="accordion-heading">
        <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/AppManager.php#ctxs">ctxs</a>
      </div>
      <div class="accordion-heading">
        <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/AppManager.php#framerates">Framerate Control</a>
      </div>
      <div class="accordion-heading">
        <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/AppManager.php#setFramerate">setFramerate</a>
      </div>
      <div class="accordion-heading">
        <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/AppManager.php#pauseFramerate">pauseFramerate</a>
      </div>
      <div class="accordion-heading">
        <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/AppManager.php#cancelFramerate">cancelFramerate</a>
      </div>
      <div class="accordion-heading">
        <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/AppManager.php#setAnimFPS">setAnimFPS</a>
      </div>
      <div class="accordion-heading">
        <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/AppManager.php#canvas-control">Canvas Control</a>
      </div>
      <div class="accordion-heading">
        <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/AppManager.php#draw">draw</a>
      </div>
      <div class="accordion-heading">
        <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/AppManager.php#addCanvas">addCanvas</a>
      </div>
      <div class="accordion-heading">
        <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/AppManager.php#getEventPosition">getEventPosition</a>
      </div>
      <div class="accordion-heading">
        <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/AppManager.php#setBGColor">setBGColor</a>
      </div>
      <div class="accordion-heading">
        <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/AppManager.php#setBGPattern">setBGPattern</a>
      </div>
      <div class="accordion-heading">
        <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/AppManager.php#setBGImage">setBGImage</a>
      </div>
      <div class="accordion-heading">
        <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/AppManager.php#object-control">Object Control</a>
      </div>
      <div class="accordion-heading">
        <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/AppManager.php#addObj">addObj</a>
      </div>
      <div class="accordion-heading">
        <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/AppManager.php#rmvObj">rmvObj</a>
      </div>
      <div class="accordion-heading">
        <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/AppManager.php#rmvAll">rmvAll</a>
      </div>
      <div class="accordion-heading">
        <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/AppManager.php#addGroup">addGroup</a>
      </div>
      <div class="accordion-heading">
        <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/AppManager.php#addToGroup">addToGroup</a>
      </div>      
      <div class="accordion-heading">
        <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/AppManager.php#rmvFromGroup">rmvFromGroup</a>
      </div>
      <div class="accordion-heading">
        <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/AppManager.php#getGroup">getGroup</a>
      </div>
      <div class="accordion-heading">
        <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/AppManager.php#setCollisionCallback">setCollisionCallback</a>
      </div>
    </div>
      </div>
      <div class="accordion-group">
        <div class="accordion-heading">
          <a class="accordion-toggle" data-toggle="collapse" href="#c4">
            Object Definitions
          </a>
        </div>
        <div id="c4" class="accordion-body collapse">
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/Vec.php">Vec</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/Obj.php">Obj</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/Shape.php">Shape</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/Circle.php">Circle</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/Poly.php">Poly</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/Rect.php">Rect</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/SimpleRect.php">SimpleRect</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/XShape.php">XShape</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/Line.php">Line</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/MultiLine.php">MultiLine</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/Grid.php">Grid</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/Text.php">Text</a>
          </div>
        </div>
      </div>
      <div class="accordion-group">
        <div class="accordion-heading">
          <a class="accordion-toggle" data-toggle="collapse" href="#c47">
            Graphics Engine
          </a>
        </div>
        <div id="c47" class="accordion-body collapse <?php if(strpos(curPageURL(),'graphics-engine') !== false){ echo 'in'; } ?>">
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/graphics-engine.php#overview">Overview</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/graphics-engine.php#primary-functions">Primary Functions</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/graphics-engine.php#draw">draw</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/graphics-engine.php#clearDraw">clearDraw</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/graphics-engine.php#style-properties">Style Properties</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/graphics-engine.php#alpha">alpha</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/graphics-engine.php#strokeStyle">strokeStyle</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/graphics-engine.php#lineWidth">lineWidth</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/graphics-engine.php#fillStyle">fillStyle</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/graphics-engine.php#shadow">shadow</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/graphics-engine.php#refLine">refLine</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/graphics-engine.php#style-functions">Style Functions</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/graphics-engine.php#setAlpha">setAlpha</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/graphics-engine.php#setStrokeStyle">setStrokeStyle</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/graphics-engine.php#setLineWidth">setLineWidth</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/graphics-engine.php#setFillStyle">setFillStyle</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/graphics-engine.php#setShadow">setShadow</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/graphics-engine.php#setShadowColor">setShadowColor</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/graphics-engine.php#setShadowBlur">setShadowBlur</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/graphics-engine.php#setShadowOffset">setShadowOffset</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/graphics-engine.php#drawReferenceLine">drawReferenceLine</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/graphics-engine.php#fx-properties">Effects Properties</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/graphics-engine.php#fxFade">fxFade</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/graphics-engine.php#fx-functions">Effects Functions</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/graphics-engine.php#fade">fade</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/graphics-engine.php#fadeIn">fadeIn</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/graphics-engine.php#fadeOut">fadeOut</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/graphics-engine.php#image-properties">Image Properties</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/graphics-engine.php#img">img</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/graphics-engine.php#image-functions">Image Functions</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/graphics-engine.php#addImage">addImage</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/graphics-engine.php#createWithImage">createWithImage</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/graphics-engine.php#flipImage">flipImage</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/graphics-engine.php#setImgOffset">setImgOffset</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/graphics-engine.php#setImgSize">setImgSize</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/graphics-engine.php#setImgScale">setImgScale</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/graphics-engine.php#setImgRotation">setImgRotation</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/graphics-engine.php#setPolyDraw">setPolyDraw</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/graphics-engine.php#anim-properties">Anim Properties</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/graphics-engine.php#anims">anims</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/graphics-engine.php#animKey">animKey</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/graphics-engine.php#animFrame">animFrame</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/graphics-engine.php#anim-functions">Anim Functions</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/graphics-engine.php#addAnim">addAnim</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/graphics-engine.php#createWithAnim">createWithAnim</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/graphics-engine.php#setAnim">setAnim</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/graphics-engine.php#setAnimKey">setAnimKey</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/graphics-engine.php#setAnimFrame">setAnimFrame</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/graphics-engine.php#nextAnimFrame">nextAnimFrame</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/graphics-engine.php#playAnim">playAnim</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/graphics-engine.php#stopAnim">stopAnim</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/graphics-engine.php#SpriteMap">SpriteMap</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/graphics-engine.php#SpriteMap-constructors">Constructors</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/graphics-engine.php#SpriteMap-getSprite">getSprite</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/graphics-engine.php#SpriteMap-setSpriteRes">setSpriteRes</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/graphics-engine.php#Sprite">Sprite</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/graphics-engine.php#Sprite-constructor">Constructor</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/graphics-engine.php#Sprite-properties">Properties</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/graphics-engine.php#Sprite-addFrame">addFrame</a>
          </div>
        </div>
      </div>
      <div class="accordion-group">
        <div class="accordion-heading">
          <a class="accordion-toggle" data-toggle="collapse" href="#c49">
            Kinematics Engine
          </a>
        </div>
        <div id="c49" class="accordion-body collapse <?php if(strpos(curPageURL(),'kinematics-engine') !== false){ echo 'in'; } ?>">
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/kinematics-engine.php#overview">Overview</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/kinematics-engine.php#properties">Properties</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/kinematics-engine.php#vel">vel</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/kinematics-engine.php#acc">acc</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/kinematics-engine.php#torque">torque</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/kinematics-engine.php#bounds">bounds</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/kinematics-engine.php#functions">Functions</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/kinematics-engine.php#enable-kinematics">enableKinematics</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/kinematics-engine.php#update">update</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/kinematics-engine.php#setVel">setVel</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/kinematics-engine.php#setAcc">setAcc</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/kinematics-engine.php#setTorque">setTorque</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/kinematics-engine.php#setBound">setBound</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/kinematics-engine.php#setBounds">setBounds</a>
          </div>
        </div>
      </div>
      <div class="accordion-group">
        <div class="accordion-heading">
          <a class="accordion-toggle" data-toggle="collapse" href="#c3">
            iio Core Functions
          </a>
        </div>
        <div id="c3" class="accordion-body collapse <?php if(strpos(curPageURL(),'iio-functions') !== false){ echo 'in'; } ?>">
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/iio-functions.php#overview">Overview</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/iio-functions.php#object-extension">Object Extension</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/iio-functions.php#inherit">inherit</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/iio-functions.php#start">Start Functions</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/iio-functions.php#start1">Full Screen Mode</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/iio-functions.php#start2">Attach to Canvas</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/iio-functions.php#start3">Create New Canvas</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/iio-functions.php#start4">New Canvas w/ Options</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/iio-functions.php#utility">Utility Functions</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/iio-functions.php#getRandomNum">getRandomNum</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/iio-functions.php#getRandomInt">getRandomInt</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/iio-functions.php#isNumber">isNumber</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/iio-functions.php#isBetween">isBetween</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/iio-functions.php#rotatePoint">rotatePoint</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/iio-functions.php#getCentroid">getCentroid</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/iio-functions.php#getSpecVertex">getSpecVertex</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/iio-functions.php#getVecsFromPointList">getVecsFromPointList</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/iio-functions.php#hasKeyCode">hasKeyCode</a>
          </div>
          <!--<div class="accordion-heading">
            <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/iio-functions.php#matrix-functions">Matrix Functions</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/iio-functions.php#resetMatrix">resetMatrix</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/iio-functions.php#translateMatrix">translateMatrix</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/iio-functions.php#rotateMatrix">rotateMatrix</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/iio-functions.php#invertMatrix">invertMatrix</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/iio-functions.php#scaleMatrix">scaleMatrix</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/iio-functions.php#multiplyMatrices">multiplyMatrices</a>
          </div>-->
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/iio-functions.php#intersection">Intersection Functions</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/iio-functions.php#lineContains">lineContains</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/iio-functions.php#intersects">intersects</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/iio-functions.php#lineXline">lineXline</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/iio-functions.php#rectXrect">rectXrect</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/iio-functions.php#polyXpoly">polyXpoly</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/iio-functions.php#circleXcircle">circleXcircle</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-item" href="<?php echo $homepath ?>docs/iio-functions.php#polyXcircle">polyXcircle</a>
          </div>
        </div>
      </div>
      <div class="accordion-group">
        <div class="accordion-heading">
          <a class="accordion-toggle" data-toggle="collapse" href="#c24">
            Version History
          </a>
        </div>
        <div id="c24" class="accordion-body collapse <?php if(strpos(curPageURL(),'version-history') !== false){ echo 'in'; } ?>">
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/version-history.php#1.2">v1.2</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/version-history.php#1.1">v1.1</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/version-history.php#1.0">v1.0</a>
          </div>
        </div>
      </div> 
      <h3>Extensions</h3>
      <div class="accordion-group">
        <div class="accordion-heading">
          <a class="accordion-toggle toggle-link" href="<?php echo $homepath ?>docs/iio-debugger.php">
            iio Debugger
          </a>
        </div>
      </div>
       <div class="accordion-group">
        <div class="accordion-heading">
          <a class="accordion-toggle" data-toggle="collapse" href="#c22">
            Box2D
          </a>
        </div>
        <div id="c22" class="accordion-body collapse <?php if(strpos(curPageURL(),'box2d') !== false){ echo 'in'; } ?>">
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/box2d.php#overview">iio with Box2D</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-title" href="<?php echo $homepath ?>docs/box2d.php#attached-functions">Attached Functions</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-title" target="_new" href="http://www.box2dflash.org/docs/2.0.2/manual">Documentation</a>
          </div>
          <div class="accordion-heading">
            <a class="accordion-toggle inner group-title" target="_new" href="http://www.box2d.org/forum/index.php">Central Forums</a>
          </div>
        </div>
      </div>
    </div>
		</nav>
	</div>