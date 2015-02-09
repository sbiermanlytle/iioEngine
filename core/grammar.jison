%lex

%%
\s+                       /* skip whitespace */
"end"                     return 'end';
":"                       return 'delimiter_vector';
","                       return 'delimiter_list';
"="                       return 'assign';
"("                       return 'open_paren';
")"                       return 'close_paren';
"for"                     return 'for_keyword';
"to"                      return 'to_keyword';
"var"                     return 'var_keyword';
"fn"                      return 'fn_keyword';
"return"                  return 'return_keyword';

\-?(?:\d*\.)?\d+          return 'number';
(red|blue)                return 'color_constant';
"random color"            return 'color_random';
"random"                  return 'random_keyword';
"color"                   return 'color_keyword';

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
"shrink"                  return 'shrink_keyword';

"center"                  return 'center';
"width"                   return 'width';
"height"                  return 'height';

"o"                       return 'type_circ';
"x"                       return 'type_x';
"square"                  return 'type_square';
"rectangle"               return 'type_rectangle';
"circle"                  return 'type_circle';
"ellipse"                 return 'type_ellipse';
"grid"                    return 'type_grid';

[a-zA-Z]+                 return 'variable';

<<EOF>>                   return 'eof';

/lex

%start iioscript

%%

iioscript
  : statements eof
    { return "(function() { \n\treturn function(app, settings) {\n\n" + $1 + "\t}\n})()" }
  ;

statements
  : statement
    {$$ = "\t\t"+$1;}
  | statements statement
    {$$ = $1 + $2;}
  ;

statement
  : definition
    {$$ = $1;}
  | declaration
    {$$ = $1;}
  | for_statement
    {$$ = $1;}
  | expression
    {$$ = $1;}
  ;

definition
  : var_keyword assignment
    {$$ = 'var ' + $2 + '\n' }
  | assignment
    {$$ = $1 + '\n'}

declaration
  : var_keyword variable
    {$$ = 'var ' + $2 + ';\n' }
  ;

assignment
  : variable assign expression
    {$$ = $1 + ' = ' + $3 + ';' }
  ;

anon_fn
  : fn_keyword open_paren variables close_paren statements end
    {$$ = 'function(' + $3 + '){ \n' + $5 + '\n\t}\n' }
  ;

fn_call
  : variable open_paren expressions close_paren
    {$$ = '\t\t' + $1 + '(' +$3 + ');\n' }
  | iio_fn
    {$$ = $1}
  ;

variables
  : variable
    {$$ = $1}
  | variables variable
    {$$ = $1 + ", " + $2}
  ;

expression
  : color_property
    {$$ = $1}
  | value
    {$$ = $1}
  | fn_call
    {$$ = $1}
  | anon_fn
    {$$ = $1}
  | return
    {$$ = $1}
  ;

return
  : return_keyword value
    {$$ = "\t\treturn " + $2}
  ;

expressions
  : expression
    {$$ = $1}
  | expressions expression
    {$$ = $1 + ", " + $2}
  ;

iio_fn
  : add_fn
    {$$ = $1;}
  | alert_fn
    {$$ = $1;}
  | set_fn
    {$$ = $1;}
  ;

for_statement
  : for_keyword var_keyword variable assign expression to_keyword value statements end
    {$$ = '\t\tfor(var ' + $3 + ' = ' + $5 + '; '+$3+'<'+$7+';'+$3+'++) {\n' + $8 + '\t\t}\n'}
  ;

alert_fn
  : alert alertparam end
    {$$ = "alert(" + $2 + " );\n" }
  ;

alertparam
  : value
    {$$ = $1 }
  | color_property
    {$$ = $1}
  ;

add_fn
  : add genparams end
    {$$ = "app.add({\n\t\t\t" + $2 + "\n\t\t});\n\n" }
  ;

set_fn
  : set genparams end
    {$$ = "app.set({\n\t\t\t" + $2 + "\n\t\t});\n\n" }
  ;

genparams
  : genparam
    {$$ = $1}
  | genparams genparam
    {$$ = $1 + ",\n\t\t\t" + $2 }
  ;

genparam
  : position_property
    {$$ = "pos: " + $1 }
  | size_property
    {$$ = $1 }
  | color_property
    {$$ = "color: " + $1 }
  | color_keyword color_property
    {$$ = "color: " + $2 }
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
  | shrink_property
    {$$ = $1 }
  | grid_property
    {$$ = $1 }
  ;

type
  : type_circ
    {$$ = "iio.CIRC" }
  | type_x
    {$$ = "iio.X" }
  | type_circle
    {$$ = "iio.CIRC" }
  | type_ellipse
    {$$ = "iio.CIRC" }
  | type_square
    {$$ = "iio.RECT" }
  | type_rectangle
    {$$ = "iio.RECT" }
  ;

grid_property
  : type_grid color_property value
    {$$ = "type:iio.GRID,\n\t\t\tgridColor:" + $2 + ",\n\t\t\tC: " + $3 + ",\n\t\t\tR: " + $3 }
  ;


shrink_property
  : shrink_keyword value
    {$$ = "shrink:[" + $2 + "\t\t\t]" }
  | shrink_keyword value fn_definition
    {$$ = "shrink:[" + $2 + ", " + $3 + "\t\t\t]" }
  ;

position_property
  : center
    {$$ = "app.center"}
  | vector
    {$$ = $1}
  | pos_keyword center
    {$$ = "app.center"}
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

outline_params
  : outline_param
    {$$ = $1 }
  | outline_params
    {$$ = $1 }
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
