%lex

%%
\s+                       /* skip whitespace */
"end"                     return 'END';
"="                       return 'ASSIGN';

[0-9]+(?:\\.[0-9]+)?\b    return 'NUMBER';
"random"                  return 'NUMBER_RANDOM';

(red|blue)                return 'COLOR_CONSTANT';
#[0-9a-fA-F]+             return 'COLOR_HEX';
"random color"            return 'COLOR_RANDOM';

"alert"                   return 'ALERT';

"add"                     return 'ADD';
"set"                     return 'SET';

"outline"                 return 'OUTLINE';

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
    {$$ = $1;}
  | DEFINITION
    {$$ = $1;}
  ;

DEFINITION
  : VARIABLE ASSIGN NUMBER
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
    {$$ = app.add( $2 ); }
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
  : POSITION
    {$$ = { pos: $1} }
  | SIZE
    {$$ = { width: $1 } }
  | COLOR
    {$$ = { color:$1 } }
  | TYPE
    {$$ = $1 }
  | OUTLINEFN
    {$$ = $1 }
  ;

OUTLINEFN
  : OUTLINE OUTLINEPARAMS END
    {$$ = $2 }
  ;

OUTLINEPARAMS
  : OUTLINEPARAM
    {$$ = $1}
  | OUTLINEPARAMS OUTLINEPARAM
    {$$ = iio.merge($1,$2)}
  ;

OUTLINEPARAM
  : SIZE
    {$$ = { lineWidth: $1 } }
  | COLOR
    {$$ = { outline:$1 } }
  ;

TYPE
  : TYPE_CIRC
    {$$ = { type:iio.CIRC } }
  | TYPE_X
    {$$ = { xColor:'red' } }
  ;

POSITION
  : CENTER
    {$$ = app.center;}
  | VARIABLE
    {$$ = s.vars[$1];}
  ;

SIZE
  : NUMBER
    {$$ = Number(yytext);}
  | NUMBER_RANDOM
    {$$ = iio.random.num(40,100);}
  | WIDTH
    {$$ = app.width;}
  | HEIGHT
    {$$ = app.height;}
  | VARIABLE
    {$$ = s.vars[$1];}
  ;

COLOR
  : COLOR_CONSTANT
    {$$ = yytext;}
  | COLOR_HEX
    {$$ = yytext;}
  | COLOR_RANDOM
    {$$ = iio.random.color(); }
  | VARIABLE
    {$$ = s.vars[$1];}
  ;
