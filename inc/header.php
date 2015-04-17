<!-- NAVBAR
================================================== -->
 <div class="navbar navbar-inverse navbar-fixed-top">
  <div class="navbar-inner">
    <div class="nav-container">
      <a id="activeBrand" class="brand" href="/">iio</a>
      <button id="nav-btn" type="button" class="btn btn-navbar" data-toggle="collapse" data-target=".nav-collapse">
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <div class="nav-user-drop dropdown">
        <li class="dropdown">
          <button id="drop1" type="button" class="btn btn-navbar btn-user dropdown-toggle" data-toggle="dropdown">
            <i class="icon-user icon-white"></i>
          </button>
          <ul class="dropdown-menu" role="menu" aria-labelledby="drop1">
            <?php 
            if(!$mybb->user['uid']){
              echo '<li role="presentation"><a role="menuitem" tabindex="-1" href="http://iioengine.com/forums/member.php?action=login">Login</a></li>';
              echo '<li role="presentation" class="divider"></li>';
              echo '<li role="presentation"><a role="menuitem" tabindex="-1" href="http://iioengine.com/forums/member.php?action=register">Register</a></li>';
            } else {
              echo '<li role="presentation"><a role="menuitem" tabindex="-1" href="/forums/member.php?action=profile&amp;uid='.$mybb->user['uid'].'">'.$mybb->user['username'].'</a></li>';
              echo '<li role="presentation"><a role="menuitem" tabindex="-1" href="/forums/usercp.php">Control Panel</a></li>';
              echo '<li role="presentation"><a role="menuitem" tabindex="-1" href="/forums/private.php">Messages</a></li>';
              echo '<li role="presentation" class="divider"></li>';
              echo '<li role="presentation"><a role="menuitem" tabindex="-1" '."href='/forums/member.php?action=logout&amp;logoutkey={$mybb->user['logoutkey']}'>".'Logout</a></li>';
            }?>
          </ul>
        </li>
      </div>
      <div class="center">
        <div class="nav-collapse collapse">
          <ul class="nav">
            <li class="">
              <a href="<?php echo $homepath ?>docs/iio-basics.php">Documentation</a>
            </li>
            <li class="">
              <a href="<?php echo $homepath ?>extensions.php">Extensions</a>
            </li>
            <li class="">
              <a href="<?php echo $homepath ?>demos.php">Demos</a>
            </li>
            <li class="">
              <a href="<?php echo $homepath ?>tutorials.php">Tutorials</a>
            </li>
            <li class="">
              <a href="<?php echo $homepath ?>forums/">Forums</a>
            </li>
            <li class="">
              <a href="<?php echo $homepath ?>about.php">About</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>
<img id="bg-gradient" src="<?php echo $homepath ?>img/bg_glow.jpg"/>
