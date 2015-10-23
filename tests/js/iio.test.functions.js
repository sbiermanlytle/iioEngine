/*iio.Test = {
  constructor: function( canvas, test_class, custom_properties, color ){
    iio.start([ function( app, settings ){
      app.add(new test_class({
        pos: app.center,
        color: _color[settings.c].clone()
      }, custom_properties ));
    }, { c: color || iio.Color.random() } ], canvas )
  }
}*/
var iioapps;
var app_colors;
iio.test = {};
iio.test.functions = [
  [
    // Constructors
    'constructor_default',
    'constructor_no_pos',
    'constructor_res',
    // Rotation
    'rotation',
    'rotation_no_pos',
    'origin',
    // Collisions
    'quadXquad',
    'quadXpoly',
    'quadXcircle',
  ],[
    // Movement
    'vel_bounds',
    'acc_bounds',
    'vels',
    'accs',
    // Collisions
    'lineXline',
    'circleXline',
    'polyXline',
  ],[
    // Radial Movement
    'rVel_bounds',
    'rVel_bounds_no_pos',
    'rAcc_bounds',
    'rAcc_bounds_no_pos',
    // Collisions
    'circleXcircle',
    'polyXpoly',
    'polyXcircle',
  ],[
    // Display
    'hidden',
    'alpha',
    'color',
    'width',
    'outline',
    'shrink',
    // Collisions
    'rectXrect',
    'gridXgrid',
    'textXtext',
  ],[
    'lineCap',
    'dash',
    'dash_rounded',
    'gradient',
    'radial_gradient',
    'shadow',
  ],[
    // Attachemnts
    'child',
    'bezier',
    'bezierVels',
    'bezierAccs',
    'img',
    'flip',
  ]
];
iio.test.setup_master = function(doubleSize){

  // DOM container for iio apps
  iioapps = document.body;

  // color array
  app_colors = [];
  app_colors[0] = new iio.Color.random();
  app_colors[1] = app_colors[0].clone().invert();

  iio.test.C = 5;
  iio.test.R = 6;
  iio.test.size = 100;
  if(doubleSize){
    iio.test.C = 3;
    iio.test.R = 4;
    iio.test.size = 200;
  }
  iio.test.create_canvas_grid(
    iio.test.size,
    iio.test.C,
    iio.test.R
  );
}
iio.test.create_canvas_grid = function( SIZE, COLS, ROWS, ID ){
  var canvas, clear;
  for(var R=0; R<ROWS; R++){
    for(var C=0; C<COLS; C++){
      canvas = document.createElement('canvas');
      canvas.id = ID+"c"+R+""+C;
      canvas.width = SIZE;
      canvas.height = SIZE;
      //canvas.codeurl = iio.test.source_code_url(R,C,test_class);
      canvas.onclick = function(e){
        codeWindow = window.open(this.codeurl, "littleWindow", "location=no,menubar=no,toolbar=no,width=500,height=600,left=0"); 
          codeWindow.moveTo(0,0);
      }
      iioapps.appendChild(canvas);
    }
    clear = document.createElement('div');
    clear.className = "clear";
    iioapps.appendChild(clear);
  }
}
iio.test.show_tests = function( test_class, class_name, id ){

  var color = 0;
  var c = 0;

  function switch_color(){
    if(color == 0) color = 1;
    else color = 0;
  }
  function run_test(r,test_function,source_code_url){
    document.getElementById(id+'c'+r+''+c).codeurl = source_code_url;
    iio.start([test_function, { color:app_colors[color] }], id+'c'+r+''+c);
    switch_color();
    c++;
  }

  for (var row=0; row<iio.test.functions.length; row++){
    iio.test.functions[row].forEach(function(fn){
      if (test_class[fn])
        run_test(row, test_class[fn],
          'tests/source-code/'+class_name+'/'+fn.replace(/_/g,'-')+'.html');

    });
    c = 0;
  }
}
iio.test.color = function(){
  switch(this.cycle){
    case 1: 
      if(this.color.g>100)
        this.color.g--;
      else if(this.color.r>100)
        this.color.r--;
      else this.cycle = iio.randomInt(1,3);
      break;
    case 2: 
      if(this.color.b<200)
        this.color.b++;
      else if(this.color.r<200)
        this.color.r++;
      else this.cycle = iio.randomInt(1,3);
      break;
    case 3: 
      if(this.color.g>0)
        this.color.g--;
      else if(this.color.r>0)
        this.color.r--;
      else this.cycle = iio.randomInt(1,3);
      break;
    default: 
      if(this.color.r<255)
        this.color.r++;
      else if(this.color.b<255)
        this.color.b++;
      else this.cycle = iio.randomInt(1,3);
  }
}
iio.test.alpha = function(){
  if(this.fading){
    this.alpha -= this.speed;
    if(this.alpha <= .02)
      this.fading = false;
  } else {
    this.alpha += this.speed;
    if(this.alpha >= .98)
      this.fading = true;
  }
}
iio.test.width = function(){
  if(this.growing){
    this.width++;
    if(this.width > 20)
      this.growing = false;
  } else {
    this.width--;
    if(this.width < 2)
      this.growing = true;
  }
}
iio.test.outline = function(){
  if(this.growing){
    this.lineWidth++;
    if(this.lineWidth > 20)
      this.growing = false;
  } else {
    this.lineWidth--;
    if(this.lineWidth < 1)
      this.growing = true;
  }
  switch(this.cycle){
    case 1: 
      if(this.outline.g>100)
        this.outline.g--;
      else if(this.outline.r>100)
        this.outline.r--;
      else this.cycle = iio.randomInt(1,3);
      break;
    case 2: 
      if(this.outline.b<200)
        this.outline.b++;
      else if(this.outline.r<200)
        this.outline.r++;
      else this.cycle = iio.randomInt(1,3);
      break;
    case 3: 
      if(this.outline.g>0)
        this.outline.g--;
      else if(this.outline.r>0)
        this.outline.r--;
      else this.cycle = iio.randomInt(1,3);
      break;
    default: 
      if(this.outline.r<255)
        this.outline.r++;
      else if(this.outline.b<255)
        this.outline.b++;
      else this.cycle = iio.randomInt(1,3);
  }
}