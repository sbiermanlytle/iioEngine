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
"random"                  return 'random_keyword';

"alert"                   return 'alert';

"add"                     return 'add';
"set"                     return 'set';

"pos"                     return 'pos_keyword';
"size"                    return 'size_keyword';
"color"                   return 'color_keyword';
"outline"                 return 'outline_keyword';
"alpha"                   return 'alpha_keyword';
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
  ;

for_statement
  : for_keyword var_keyword variable assign expression to_keyword value statements end
    {$$ = 'for(var ' + $3 + ' = ' + $5 + '; '+$3+'<'+$7+';'+$3+'++) { ' + $8 + ' }'}
  ;

alertfn
  : alert alertparam end
    {$$ = "alert(" + $2 + " ); \n" }
  ;

alertparam
  : value
    {$$ = $1 }
  | color_property
    {$$ = $1 }
  ;

addfn
  : add genparams end
    {$$ = "app.add({" + $2 + "}); \n" }
  ;

setfn
  : set genparams end
    {$$ = "app.set({" + $2 + "}); \n" }
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
    {$$ = "type: " + $1 }
  | outline_property
    {$$ = $1 }
  | alpha_property
    {$$ = "alpha: " + $1 }
  | vel_property
    {$$ = "vel: " + $1 }
  | acc_property
    {$$ = $1 }
  ;

type
  : type_circ
    {$$ = "iio.CIRC" }
  | type_x
    {$$ = "iio.X" }
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

outline_property
  : outline_keyword value color_property
    {$$ = "lineWidth: "+$2+", outline: "+$3 }
  | outline_keyword color_property value
    {$$ = "outline: "+$2+", lineWidth: "+$3 }
  ;

alpha_property
  : alpha_keyword value
    {$$ = $2 }
  ;

vel_property
  : vel_keyword vector
    {$$ = $2}
  ;

acc_property
  : acc_keyword vector
    {$$ = $2}
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

random_property
  : random_keyword value to_keyword value
    {$$ = "iio.random.num("+$2+","+$4+")" }
  ;

value
  : number
    {$$ = $1}
  | width
    {$$ = "app.width"}
  | height
    {$$ = "app.height"}
  | random_property
    {$$ = $1}
  | variable
    {$$ = $1}
  ;