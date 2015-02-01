%lex

%%
\s+                       /* skip whitespace */
"end"                     return 'END';
":"                       return 'DELIMITER_VECTOR';
"="                       return 'ASSIGN';
"for"                     return 'FOR_KEYWORD';
"to"                      return 'TO_KEYWORD';
"i"                       return 'I_KEYWORD';

[0-9]+(?:\\.[0-9]+)?\b    return 'NUMBER';
(red|blue)                return 'COLOR_CONSTANT';
"random color"            return 'COLOR_RANDOM';
"random"                  return 'NUMBER_RANDOM';

"alert"                   return 'ALERT';

"add"                     return 'ADD';
"set"                     return 'SET';

"pos"                     return 'POS_KEYWORD';
"size"                    return 'SIZE_KEYWORD';
"color"                   return 'COLOR_KEYWORD';
"outline"                 return 'OUTLINE';
"vel"                     return 'VEL_KEYWORD';
"acc"                     return 'ACC_KEYWORD';

"center"                  return 'CENTER';
"width"                   return 'WIDTH';
"height"                  return 'HEIGHT';

"o"                       return 'TYPE_CIRC';
"x"                       return 'TYPE_X';

[a-zA-Z]+                 return 'VARIABLE';

<<EOF>>                   return 'EOF';

/lex

%start expressions

%%

expressions
  : STATEMENTS EOF
    {$1;}
  ;

STATEMENTS
  : STATEMENT
    {$$ = $1;}
  | STATEMENTS STATEMENT
    {$$ = $1 + $2;}
  ;

STATEMENT
  : FUNCTION
    {$$ = $1();}
  | DEFINITION
    {$$ = $1;}
  | FORFN
    {$$ = $1;}
  ;

DEFINITION
  : VARIABLE ASSIGN VALUE
    {s.vars[$1] = $3;}
  ;

FUNCTION
  : ADDFN
    {$$ = $1;}
  | ALERTFN
    {$$ = $1;}
  | SETFN
    {$$ = $1;}
  | OUTLINEFN
    {$$ = $1;}
  | VELFN
    {$$ = $1;}
  | ACCFN
    {$$ = $1;}
  ;

FORFN
  : FOR_KEYWORD I_KEYWORD ASSIGN VALUE TO_KEYWORD VALUE FUNCTION END
    {$$ = 4; for(var i=$4; i<$6; i++ ) { $7() } }
  ;


ALERTFN
  : ALERT ALERTPARAM END
    {$$ = alert( $2 ); }
  ;

ALERTPARAM
  : SIZE
    {$$ = $1 }
  | COLOR
    {$$ = $1 }
  ;

ADDFN
  : ADD GENPARAMS END
    {$$ = function() {app.add( $2 );} }
  ;

SETFN
  : SET GENPARAMS END
    {$$ = app.set( $2 ); }
  ;

GENPARAMS
  : GENPARAM
    {$$ = $1}
  | GENPARAMS GENPARAM
    {$$ = iio.merge($1,$2)}
  ;

GENPARAM
  : POSITION_PROPERTY
    {$$ = { pos: $1} }
  | SIZE_PROPERTY
    {$$ = $1 }
  | COLOR_PROPERTY
    {$$ = { color:$1 } }
  | TYPE
    {$$ = $1 }
  | OUTLINEFN
    {$$ = $1 }
  | VELFN
    {$$ = $1 }
  | ACCFN
    {$$ = $1 }
  ;

OUTLINEFN
  : OUTLINE OUTLINEPARAMS END
    {$$ = $2 }
  ;

VELFN
  : VEL_KEYWORD VECTOR END
    {$$ = { vel:$2 }}
  ;

ACCFN
  : ACC_KEYWORD VECTOR END
    {$$ = { acc:$2 } }
  ;

OUTLINEPARAMS
  : OUTLINEPARAM
    {$$ = $1}
  | OUTLINEPARAMS OUTLINEPARAM
    {$$ = iio.merge($1,$2)}
  ;

OUTLINEPARAM
  : SIZE_PROPERTY
    {$$ = { lineWidth: $1 } }
  | COLOR_PROPERTY
    {$$ = { outline:$1 } }
  ;

TYPE
  : TYPE_CIRC
    {$$ = { type:iio.CIRC } }
  | TYPE_X
    {$$ = { type:iio.X } }
  ;

POSITION_PROPERTY
  : CENTER
    {$$ = app.center}
  | VECTOR
    {$$ = $1} 
  | POS_KEYWORD VARIABLE
    {$$ = s.vars[$2];}
  ;

VECTOR
  : VALUE DELIMITER_VECTOR VALUE
    {$$ = { x:$1, y:$3 }}
  | VALUE DELIMITER_VECTOR VALUE DELIMITER_VECTOR VALUE
    {$$ = { x:$1, y:$3, r:$5 }}
  ;

SIZE_PROPERTY
  : VALUE
    {$$ = { width:$1 }}
  | WIDTH
    {$$ = { width:app.width }}
  | HEIGHT
    {$$ = { width:app.height }}
  | SIZE_KEYWORD VARIABLE
    {$$ = { width:s.vars[$2] }}    
  | SIZE_KEYWORD VALUE
    {$$ = { width: $2 }}
  | SIZE_KEYWORD VALUE DELIMITER_VECTOR VALUE
    {$$ = { width: $2, height:$4 }}
  ;

COLOR_PROPERTY
  : COLOR_CONSTANT
    {$$ = yytext;}
  | COLOR_RANDOM
    {$$ = iio.random.color(); }
  | COLOR_KEYWORD VARIABLE
    {$$ = s.vars[$2];}
  ;

VALUE
  : NUMBER
    {$$ = Number(yytext);}
  | NUMBER_RANDOM
    {$$ = Math.random();}
  ;