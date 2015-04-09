ColorLines = function(app,s){

	for(var offset=-app.width; offset<app.width; offset+=s.w){
		app.add(new iio.Line({
			color: iio.Color.random(),
			width: s.w,
			vs:[
				[ 0+offset, 0-s.w ],
				[ app.width+s.w, app.height-offset ]
			],
			cycle: 0,
			onUpdate: function(){
				switch(this.cycle){
					case 1: 
						if(this.color.g>100)
							this.color.g--;
						else if(this.color.r>100)
							this.color.r--;
						else if(this.color.b>100)
							this.color.b--;
						else this.cycle = iio.randomInt(0,3);
						break;
					case 2: 
						if(this.color.b<200)
							this.color.b++;
						else if(this.color.g<200)
							this.color.g++;
						else if(this.color.r<200)
							this.color.r++;
						else this.cycle = iio.randomInt(0,3);
						break;
					case 3: 
						if(this.color.g>0)
							this.color.g--;
						else if(this.color.r>0)
							this.color.r--;
						else if(this.color.b>0)
							this.color.b--;
						else this.cycle = iio.randomInt(0,3);
						break;
					default: 
						if(this.color.r<255)
							this.color.r++;
						else if(this.color.b<255)
							this.color.b++;
						else if(this.color.g<255)
							this.color.g++;
						else this.cycle = iio.randomInt(0,3);
				}
			}
		}));
	}
}