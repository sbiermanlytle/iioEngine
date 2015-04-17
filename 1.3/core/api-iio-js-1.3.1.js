/////////////////////////////////////////////////////////////////
// iioScript 1.3.1 API
Properties
	Reference
		parent				O
		type				O A
		tag					O
	Physical
		pos 				O A
		rot 				O
		vel 				O
		acc 				O
		scale 				O A
		width 				O A
		height				O A
		radius				O
		center				O A
		origin				O
		vs					O
		bezier				O
		left				O
		right				O
		top					O
		bottom				O
	Display
		color				O A
		outline				O A
		lineWidth			O A
		lineCap				O A
		dash				O A
		round				O A
		alpha				O A
		shadow				O A
		redraw				O A
		fps					O A
		hidden
		canvas			JS	  A
		ctx				JS	  A
		partialPx		JS	O A
	Attachment
		img					O A
		mov					O A
		anims				O A
		flip				O A
		fit					O A
		sounds				O A
		objs				O A
	Action
		collision			O
		bounds				O
		fade				O
		grow				O
		shrink				O
	Text
		text				O
		font				O
		italic				O
		bold				O
		textWrap			O
		lineHeight			O
	Grid
		cells				O
		res					O
		R					O
		C					O
Functions
	General
		set					O A
		inherit				  A
	Physical
		contains			O A
	Display
		draw				O A
		clear				O A
	Action
		play				O A
		pause				O A
		loop				O A
		delay				O A
		fadeIn				O
		fadeOut				O
	Input
		onInputDown			O A
		onInputMove			O A
		onInputUp			O A
		onKeyDown			O
		onKeyUp				O
		onResize			O A
	Grid
		cellAt				O
		cellCenter			O
		resetCells			O
	Util
		loadImage			  A
		isNumber			  A
		isString			  A
		random				  A
		randomNum			  A
		randomInt			  A
		randomColor			  A
		invertColor			  A
		compare				  A
		pointsToVecs		  A