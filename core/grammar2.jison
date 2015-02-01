%lex

%%
\s+                       /* skip whitespace */
"end"                     return 'end';
":"                       return 'delimiter_vector';
"="                       return 'assign';
"for"                     return 'for_keyword';
"to"                      return 'to_keyword';
"var"                     return 'var_keyword';

[0-9]+(?:\\.[0-9]+)?\b    return 'number';
(red|blue)                return 'color_constant';
"random color"            return 'color_random';
"random"                  return 'number_random';

"alert"                   return 'alert';

"add"                     return 'add';
"set"                     return 'set';

"pos"                     return 'pos_keyword';
"size"                    return 'size_keyword';
"color"                   return 'color_keyword';
"outline"                 return 'outline';
"vel"                     return 'vel_keyword';
"acc"                     return 'acc_keyword';

"center"                  return 'center';
"width"                   return 'width';
"height"                  return 'height';

"o"                       return 'type_circ';
"x"                       return 'type_x';

[a-zA-Z]+                 return 'variable';

<<EOF>>                   return 'eof';

/lex

%start iioscript

%%

iioscript
  : statements eof
    { return "(function() { return function(app, settings) {\n" + $1 + "\n}})()" }
  ;

statements
  : statement
    {$$ = $1;}
  | statements statement
    {$$ = $1 + $2;}
  ;

statement
  : function
    {$$ = $1;}
  | definition
    {$$ = $1;}
  | for_statement
    {$$ = $1;}
  ;

definition
  : var_keyword variable assign expression
    {$$ = 'var ' + $2 + ' = ' + $4 + ';\n' }
  ;

expression
  : value
    {$$ = $1}
  ;

function
  : addfn
    {$$ = $1;}
  | alertfn
    {$$ = $1;}
  | setfn
    {$$ = $1;}
  | outlinefn
    {$$ = $1;}
  | velfn
    {$$ = $1;}
  | accfn
    {$$ = $1;}
  ;

for_statement
  : for_keyword var_keyword variable assign expression to_keyword value statements end
    {$$ = 'for(var ' + $3 + ' = ' + $5 + '; '+$3+'<'+$7+';'+$3+'++) { ' + $8 + ' }'}
  ;


alertfn
  : alert alertparam end
    {$$ = alert( $2 ); }
  ;

alertparam
  : size
    {$$ = $1 }
  | color
    {$$ = $1 }
  ;

addfn
  : add genparams end
    {$$ = "app.add({" + $2 + "}); \n" }
  ;

setfn
  : set genparams end
    {$$ = app.set( $2 ); }
  ;

genparams
  : genparam
    {$$ = $1}
  | genparams genparam
    {$$ = $1 + ", " + $2 }
  ;

genparam
  : position_property
    {$$ = "pos: " + $1 }
  | size_property
    {$$ = $1 }
  | color_property
    {$$ = "color: " + $1 }
  | type
    {$$ = $1 }
  | outlinefn
    {$$ = $1 }
  | velfn
    {$$ = "vel: " + $1 }
  | accfn
    {$$ = $1 }
  ;

outlinefn
  : outline outlineparams end
    {$$ = $2 }
  ;

velfn
  : vel_keyword vector end
    {$$ = $2 }
  ;

accfn
  : acc_keyword vector end
    {$$ = { acc:$2 } }
  ;

outlineparams
  : outlineparam
    {$$ = $1}
  | outlineparams outlineparam
    {$$ = iio.merge($1,$2)}
  ;

outlineparam
  : size
    {$$ = { linewidth: $1 } }
  | color_property
    {$$ = { outline:$1 } }
  ;

type
  : type_circ
    {$$ = { type:iio.CIRC } }
  | type_x
    {$$ = { type:iio.X } }
  ;

position_property
  : center
    {$$ = "app.center"}
  | vector
    {$$ = $1}
  | pos_keyword variable
    {$$ = $2;}
  | pos_keyword vector
    {$$ = $2;}
  ;

vector
  : value delimiter_vector value
    {$$ = '{ x: ' + $1 + ', y: ' + $3 + '}' }
  | value delimiter_vector value delimiter_vector value
    {$$ = '{ x: ' + $1 + ', y: ' + $3 + ', r:' + $5 + '}'}
  ;

size_property
  : value
    {$$ = "width: " + $1 }
  | width
    {$$ = "width: app.width" }
  | height
    {$$ = "width: app.height" }
  | size_keyword value
    {$$ = "width: " + $2 }
  | size_keyword value delimiter_vector value
    {$$ = "width: " + $2+ ", height: " + $4 }
  ;

color_property
  : color_constant
    {$$ = "'" + $1 + "'" }
  | color_random
    {$$ = "iio.random.color()" }
  | color_keyword variable
    {$$ = $2 }
  ;

value
  : number
    {$$ = $1}
  | number_random
    {$$ = "iio.random.num(0,200)"}
  | variable
    {$$ = $1}
  ;
