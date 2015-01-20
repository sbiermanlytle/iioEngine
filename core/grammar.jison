%lex

%%
\s+                       /* skip whitespace */
"end"                     return 'END';
"add"                     return 'ADD';
"red"                     return 'COLOR';
"center"                  return 'CENTER';
[0-9]+(?:\\.[0-9]+)?\\b   return 'NUMBER';
<<EOF>>                   return 'EOF';

/lex

%start expressions

%%

expressions
  : ADDFN EOF
    {$1;}

  | NUMBER
    {$$ = Number(yytext);}
  ;

ADDFN
  : ADD POSITION COLOR NUMBER END
    {$$ = iio.start(function(app, settings){ app.add({pos: $2, color: $3, width: $4}) }) }
  ;

POSITION
  : CENTER
    {$$ = app.center;}
  ;

COLOR
  : RED
    {$$ = 'red';}
  ;
