ColorLines = function(app,s){
    ding1 = app.loadAudio("assets/sounds/coin-1.wav");
    ding2 = app.loadAudio("assets/sounds/coin-2.wav");
    ding3 = app.loadAudio("assets/sounds/coin-3.wav");
    ding4 = app.loadAudio("assets/sounds/coin-4.wav");

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
						if(this.color.g>100) {
							this.color.g--;
              if (this.color.g % 128 === 0) ding1.play();
            } else if(this.color.r>100) {
							this.color.r--;
              if (this.color.r % 128 === 0) ding3.play();
            } else if(this.color.b>100) {
							this.color.b--;
              if (this.color.b % 128 === 0) ding4.play();
            } else this.cycle = iio.randomInt(0,3);
						break;
					case 2: 
						if(this.color.b<200) {
							this.color.b++;
              if (this.color.b % 128 === 0) ding4.play();
            } else if(this.color.g<200) {
							this.color.g++;
              if (this.color.g % 128 === 0) ding3.play();
            } else if(this.color.r<200) {
							this.color.r++;
              if (this.color.r % 128 === 0) ding2.play();
            } else this.cycle = iio.randomInt(0,3);
						break;
					case 3: 
						if(this.color.g>0) {
							this.color.g--;
              if (this.color.g % 128 === 0) ding2.play();
            } else if(this.color.r>0) {
							this.color.r--;
              if (this.color.r % 128 === 0) ding1.play();
            } else if(this.color.b>0) {
							this.color.b--;
              if (this.color.b % 128 === 0) ding4.play();
            } else this.cycle = iio.randomInt(0,3);
						break;
					default: 
						if(this.color.r<255) {
							this.color.r++;
              if (this.color.r % 128 === 0) ding3.play();
            } else if(this.color.b<255) {
							this.color.b++;
              if (this.color.b % 128 === 0) ding1.play();
            } else if(this.color.g<255) {
							this.color.g++;
              if (this.color.g % 128 === 0) ding2.play();
            } else this.cycle = iio.randomInt(0,3);
				}
			}
		}));
	}
}
