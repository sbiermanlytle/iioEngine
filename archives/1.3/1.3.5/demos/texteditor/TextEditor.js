TextEdit = function(app,s){

	app.set('black');

	var text = app.add({
		pos: app.center,
		text: "edit this text",
		color: '#00baff',
		font: 'Consolas',
		width: 60,
		align: 'center',
		showCursor:true
	});

	this.onKeyDown=function(e,k){
		text.keyDown(k);
	}

	this.onKeyUp=function(e,k){
		text.keyUp(k);
	}

}