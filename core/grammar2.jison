%lex

%%
\s+                       /* skip whitespace */
[0-9]+(?:\\.[0-9]+)?\b   return 'NUMBER';
"end"                     return 'END';
"add"                     return 'ADD';
"red"                     return 'RED';
"blue"                    return 'BLUE';
"center"                  return 'CENTER';
<<EOF>>                   return 'EOF';

/lex

%start expressions

%%

expressions
  : ADDFN EOF
    {$1;}
  ;

ADDFN
  : ADD POSITION COLOR SIZE END
    {$$ = obj = {color: $3, width: $4}; if ($2 === 'center') obj.pos = app.center; app.add(obj) }) }
  ;

POSITION
  : CENTER
    {$$ = $1;}
  ;

COLOR
  : RED
    {$$ = 'red';}
  | BLUE
    {$$ = 'blue';}
  ;

SIZE
  : NUMBER
    {$$ = Number(yytext);}
  ;
