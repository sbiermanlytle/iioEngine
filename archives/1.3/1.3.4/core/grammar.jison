%lex

%%
\s+                       /* skip whitespace */
"end"                     return 'end';
":"                       return 'delimiter_vector';
","                       return 'delimiter_list';
"="                       return 'assign';
"for"                     return 'for_keyword';
"to"                      return 'to_keyword';
"by"                      return 'by_keyword';
"var"                     return 'var_keyword';
"fn"                      return 'fn_keyword';
"return"                  return 'return_keyword';
"if"                      return 'if_keyword';
"else if"                 return 'elseif_keyword';
"else"                    return 'else_keyword';
"then"                    return 'then_keyword';

\-?(?:\d*\.)?\d+          return 'number';
"."                       return 'dot';
"!"                       return 'not';
"*"                       return '*';
"/"                       return '/';
"-"                       return '-';
"+"                       return '+';
"^"                       return '^';
"("                       return '(';
")"                       return ')';
"PI"                      return 'PI';
"E"                       return 'E';

(red|blue|black|white)    return 'color_constant';
"random color"            return 'color_random';
"random"                  return 'random_keyword';
"color"                   return 'color_keyword';

"alert"                   return 'alert';

"add"                     return 'add';
"set"                     return 'set';
"draw"                    return 'draw';
"clear"                   return 'clear';
"onresize"                return 'onresize';

"obj"                     return 'obj_keyword';

"pos"                     return 'pos_keyword';
"size"                    return 'size_keyword';
"color"                   return 'color_keyword';
"outline"                 return 'outline_keyword';
"alpha"                   return 'alpha_keyword';
"vel"                     return 'vel_keyword';
"acc"                     return 'acc_keyword';
"shrink"                  return 'shrink_keyword';
"click"                   return 'click_keyword';

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

/* operator associations and precedence */

%left '+' '-'
%left '*' '/'
%left '^'
%left UMINUS

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
  | if_statement
    {$$ = $1;}
  | expression
    {$$ = $1;}
  | iio_cmd
    {$$ = $1;}
  ;

definition
  : var_keyword assignment
    {$$ = 'var ' + $2 + '\n' }
  | assignment
    {$$ = $1 + '\n'}
  ;

declaration
  : var_keyword variable
    {$$ = 'var ' + $2 + ';\n' }
  ;

assignment
  : variable assign expression
    {$$ = $1 + ' = ' + $3 + ';' }
  ;

anon_fn
  : fn_keyword '(' variables ')' statements end
    {$$ = 'function(' + $3 + '){ \n' + $5 + '\n\t}\n' }
  | fn_keyword '(' ')' statements end
    {$$ = 'function(){ \n' + $4 + '\n\t}\n' }
  ;

fn_call
  : variable '(' expressions ')'
    {$$ = '\t\t' + $1 + '(' +$3 + ');\n' }
  | variable '(' ')'
    {$$ = '\t\t' + $1 + '();\n' }
  | iio_fn
    {$$ = 'app.' + $1}
  | variable dot iio_fn
    {$$ = $1 + '.' + $3}
  ;

variables
  : variable
    {$$ = $1}
  | variables variable
    {$$ = $1 + ", " + $2}
  ;

expression
  : value
    {$$ = $1}
  | not value
    {$$ = '!' + $2;}
  | fn_call
    {$$ = $1}
  | anon_fn
    {$$ = $1}
  | return
    {$$ = $1}
  | random_property
    {$$ = $1}
  ;

iio_cmd
  : clear
    {$$ = "app.objs = [];\n" }
  | draw
    {$$ = "app.draw();" }
  | onresize expression
    {$$ = "this.resize = " + $2 + ";\n" }
  | obj_keyword dot obj_property expression
    {$$ = 'o.' + $3 + ' = ' + $4 + ';' }
  | obj_keyword dot color_keyword color_property
    {$$ = 'o.' + $3 + ' = ' + $4 + ';' }
  ;

obj_property
  : width
    {$$ = $1;}
  | height
    {$$ = $1;}
  | color_keyword
    {$$ = $1;}
  | size_keyword
    {$$ = $1;}
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
  : for_keyword var_keyword variable assign expression to_keyword expression statements end
    {$$ = '\t\tfor(var ' + $3 + ' = ' + $5 + '; '+$3+'<'+$7+';'+$3+'++) {\n' + $8 + '\t\t}\n'}
  | for_keyword var_keyword variable assign expression to_keyword expression by_keyword expression statements end
    {$$ = '\t\tfor(var ' + $3 + ' = ' + $5 + '; '+$3+'<'+$7+';'+$3+'+=' + $9 + ') {\n' + $10 + '\t\t}\n'}
  ;

if_statement
  : if_keyword expression statements end
    {$$ = "\t\tif(" + $2 + "){\n" + $3 + "\t\t}\n"}
  | if_keyword expression statements else_keyword statements end
    {$$ = "\t\tif(" + $2 + "){\n" + $3 + "\t\t} else {\n" + $5 + "\n}" }
  | if_keyword expression statements elseif_keyword expression statements end
    {$$ = "\t\tif(" + $2 + "){\n" + $3 + "\t\t} else if( "+ $5 +" ){\n" + $6 + "\n}" }
  | if_keyword expression statements elseif_keyword expression statements else_keyword statements end
    {$$ = "\t\tif(" + $2 + "){\n" + $3 + "\t\t} else if( "+ $5 +" ){\n" + $6 + "\n} else {\n" + $8 + "\n}" }
  ;

alert_fn
  : alert alertparam end
    {$$ = "alert(" + $2 + " );\n" }
  ;

alertparam
  : expression
    {$$ = $1 }
  | color_property
    {$$ = $1}
  ;

add_fn
  : add genparams end
    {$$ = "add({\n\t\t\t" + $2 + "\n\t\t});\n\n" }
  ;

set_fn
  : set genparams end
    {$$ = "set({\n\t\t\t" + $2 + "\n\t\t});\n\n" }
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
  | click_property
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
  : type_grid color_property expression
    {$$ = "type:iio.GRID,\n\t\t\tgridColor:" + $2 + ",\n\t\t\tC: " + $3 + ",\n\t\t\tR: " + $3 }
  ;

click_property
  : click_keyword '(' variable ')' statements end
    {$$ = "click:function(event,ePos," + $3 + "){" + $5 + "}" }
  ;

shrink_property
  : shrink_keyword expression
    {$$ = "shrink:[" + $2 + "\t\t\t]" }
  | shrink_keyword expression then_keyword statements end
    {$$ = "shrink:[" + $2 + ",function(o){" + $4 + "\t\t\t}]" }
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
  : outline_keyword expression color_property
    {$$ = "lineWidth: "+$2+", outline: "+$3 }
  | outline_keyword color_property expression
    {$$ = "outline: "+$2+", lineWidth: "+$3 }
  ;

outline_params
  : outline_param
    {$$ = $1 }
  | outline_params
    {$$ = $1 }
  ;

alpha_property
  : alpha_keyword expression
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
  : expression delimiter_vector expression
    {$$ = '{ x: ' + $1 + ', y: ' + $3 + '}' }
  | expression delimiter_vector expression delimiter_vector expression
    {$$ = '{ x: ' + $1 + ', y: ' + $3 + ', r:' + $5 + '}'}
  ;

size_property
  : expression
    {$$ = "width: " + $1 }
  | size_keyword expression
    {$$ = "width: " + $2 }
  | size_keyword expression delimiter_vector expression
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
  : random_keyword expression to_keyword expression
    {$$ = "iio.random.num("+$2+","+$4+")" }
  ;

value
  : number
    {$$ = $1}
  | width
    {$$ = "app.width"}
  | height
    {$$ = "app.height"}
  | variable
    {$$ = $1}
  | value '+' value
      {$$ = $1 + '+' + $3;}
  | value '-' value
      {$$ = $1 + '-' + $3;}
  | value '*' value
      {$$ = $1 + '*' + $3;}
  | value '/' value
      {$$ = $1 + '/' + $3;}
  | value '^' value
      {$$ = 'Math.pow('+ $1 + ',' + $3 + ')' }
  | E
      {$$ = 'Math.E' }
  | PI
      {$$ = 'Math.PI' }
  ;
