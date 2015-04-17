AppManager.prototype.AppManager = function(app, id, w, h){
      this.cnvs = [];
      this.ctxs = [];
      if (typeof app=='undefined') throw new Error("iio.start: No app provided");
      if (typeof w=='undefined' && iio.isString(id)) 
         this.addCanvas(id);
      else {
         if (iio.isString(id)){
            if (id=='auto'){
               h = w ||'auto';
               w = id;
               id = 'body';
            } else {
               w = w || 'auto';
               h = h || 'auto';
               if (id!='body'&&!document.getElementById(id))
                  throw new Error("iio.start: Invalid element id");
            }
         } else {
            h = w || 'auto';
            w = id || 'auto';
         }
         this.addCanvas(0, w, h, id);
      }
      this.canvas = this.cnvs[0];
      this.context = this.ctxs[0];
      this.app = new app(this);
      this.addWindowListeners();
}
AppManager.prototype.addCanvas = function( zIndex, w, h, attachId, cssClasses ){
      var i=this.cnvs.length;
      if (iio.isString(zIndex)){
         if (!document.getElementById(zIndex))
            throw new Error("AppManager.addCanvas: Invalid canvas id '"+zIndex+"'");
         this.cnvs[i]=document.getElementById(zIndex);
         this.ctxs[i] = this.cnvs[i].getContext('2d');
         if (typeof this.cnvs[i].getContext=='undefined') 
            throw new Error("AppManager.addCanvas: given id did not correspond to a canvas object");
         this.setCanvasProperties(i);
         this.setCanvasFunctions(i);
         this.addFocusListeners(i);
         return i;
      }

      //should fit to element, not window
      if (w=='auto') w=window.innerWidth;
      if (h=='auto') h=window.innerHeight;

      //Create the canvas
      this.cnvs[i]=document.createElement('canvas');
      this.cnvs[i].width = w || this.cnvs[0].width;
      this.cnvs[i].height = h || this.cnvs[0].height;
      this.cnvs[i].style.zIndex = zIndex || -i;
      
      //Attach the canvas
      if (iio.isString(attachId)){
         if (attachId=='body') document.body.appendChild(this.cnvs[i])
         else document.getElementById(attachId).appendChild(this.cnvs[i])
      } 
      else if (this.cnvs.length>1) {
         this.cnvs[i].style.position="absolute";
         var offset = this.getCanvasOffset();
         this.cnvs[i].style.left = offset.x+"px";
         this.cnvs[i].style.top = offset.y+"px";
         this.cnvs[i].style.margin = 0;
         this.cnvs[i].style.padding = 0;
         this.cnvs[0].parentNode.appendChild(this.cnvs[i]);
      } else document.body.appendChild(this.cnvs[i]);
      this.cnvs[i].className += "ioCanvas";
      
      if (attachId instanceof Array)
         for (var j=0;j<attachId.length;j++) 
            this.cnvs[i].className += " "+attachId[j];
      if (cssClasses instanceof Array)
         for (var j=0;j<cssClasses.length;j++) 
            this.cnvs[i].className += " "+cssClasses[j];
      else if (iio.isString(cssClasses))
         this.cnvs[i].className += " "+cssClasses;

      //TODO define specific display options and put styles back when app is terminated
      //also make everything relative to parent element instead of directly 'body'
      if (this.cnvs[i].width==window.innerWidth && this.cnvs[i].height==window.innerHeight){
         this.cnvs[i].style.display = "block"; //remove scrollbars
         this.cnvs[i].style.position = "absolute";
         this.cnvs[i].style.top = 0;
         document.body.style.overflow = 'hidden';
      }
      if (this.cnvs[i].width==window.innerWidth){
         document.body.style.marginLeft = document.body.style.marginRight
          = document.body.style.paddingLeft = document.body.style.paddingRight = "0";
         this.fullWidth=true;
      }
      if (this.cnvs[i].height==window.innerHeight){
         document.body.style.marginTop = document.body.style.marginBottom
          = document.body.style.paddingTop = document.body.style.paddingBottom = "0";
         this.fullHeight=true;
      }
      this.ctxs[i] = this.cnvs[i].getContext('2d');
      this.setCanvasProperties(i);
      this.setCanvasFunctions(i);
      this.addFocusListeners(i);
      return i;
}

//app.add
{
   //o,t,z
   //t=string or #
   //z = #
   //o = obj || t || z
   app.add(obj)
   app.add('group1')
   app.add(10)
   app.add(obj,'group1')
   app.add(obj,10)
   app.add('group1',10)
   app.add(obj,'group1',10)
}