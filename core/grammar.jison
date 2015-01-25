%lex

%%
\s+                       /* skip whitespace */
[0-9]+(?:\\.[0-9]+)?\b    return 'NUMBER';
"end"                     return 'END';
"add"                     return 'ADD';
"set"                     return 'SET';
(red|blue)                return 'COLOR_STRING';
"center"                  return 'CENTER';
<<EOF>>                   return 'EOF';

/lex

%start expressions

%%

expressions
  : FUNCTIONS EOF
    {$1;}
  ;

FUNCTIONS
  : FUNCTION
    {$$ = $1;}
  | FUNCTIONS FUNCTION
    {$$ = $1 + $2;}
  ;

FUNCTION
  : ADDFN
    {$$ = $1;}
  | SETFN
    {$$ = $1;}
  ;

ADDFN
  : ADD ADDPARAMS END
    {$$ = app.add( $2 ); }
  ;

ADDPARAMS
  : ADDPARAM
    {$$ = $1}
  | ADDPARAMS ADDPARAM
    {$$ = iio.merge($1,$2)}
  ;

ADDPARAM
  : POSITION
    {$$ = {pos: $1} }
  | SIZE
    {$$ = {width: $1} }
  | COLOR
    {$$ = {color: $1} }
  ;

SETFN
  : SET COLOR END
    {$$ = app.set( { color: $2 } ); }
  ;

POSITION
  : CENTER
    {$$ = app.center;}
  ;

SIZE
  : NUMBER
    {$$ = Number(yytext);}
  ;

COLOR
  : COLOR_STRING
    {$$ = yytext;}
  ;
