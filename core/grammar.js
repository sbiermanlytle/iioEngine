var Parser = require("jison").Parser;

var grammar = {
  "lex": {
    "rules": [
      ["\\s+",                    "/* skip whitespace */"],
      ["end\\b",                  "return 'END';"],
      ["add\\b",                  "return 'ADD';"],
      ["red\\b",                  "return 'RED';"],
      ["center\\b",               "return 'CENTER';"],
      ["[0-9]+(?:\\.[0-9]+)?\\b", "return 'NUMBER';"],
      ["$",                       "return 'EOF';"]
    ]
  },

  "bnf": {
    "expressions" :[
      [ "ADDFN EOF",   "console.log('app.add(' + $1 + ')');"  ]
    ],

    "ADDFN": [
      ["ADD POSITION COLOR NUMBER END", "$$ = '{pos: ' + $2 + ', color: ' + $3 + ', width:' + $4 + '}'"],
      ["NUMBER",      "$$ = Number(yytext);" ]
    ],

    "POSITION": [
      ["CENTER",      "$$ = 'app.center'"]
    ],

    "COLOR": [
      ["RED",         "$$ = 'red'"]
    ]
  }
}

var parser = new Parser(grammar);

console.log(parser.generate());
