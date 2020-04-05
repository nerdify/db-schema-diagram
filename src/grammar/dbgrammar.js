// Generated automatically by nearley, version 2.19.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

  const enums_list = ["user_status"]

  const flatten = d => {
    return d.reduce(
      (a, b) => {
        return a.concat(b);
      },
      []
    );
  };
var grammar = {
    Lexer: undefined,
    ParserRules: [
    {"name": "document_definition$subexpression$1", "symbols": ["table_definition"]},
    {"name": "document_definition$subexpression$1", "symbols": ["enum_definition"]},
    {"name": "document_definition$subexpression$1", "symbols": ["ref_definition"]},
    {"name": "document_definition", "symbols": ["document_definition$subexpression$1"], "postprocess": id},
    {"name": "document_definition$subexpression$2", "symbols": ["table_definition"]},
    {"name": "document_definition$subexpression$2", "symbols": ["enum_definition"]},
    {"name": "document_definition$subexpression$2", "symbols": ["ref_definition"]},
    {"name": "document_definition", "symbols": ["document_definition$subexpression$2", "NL", "document_definition"], "postprocess": (match) => {
        	return flatten([match[0],match[2]])
        }},
    {"name": "enum_definition$string$1", "symbols": [{"literal":"E"}, {"literal":"n"}, {"literal":"u"}, {"literal":"m"}, {"literal":" "}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "enum_definition$string$2", "symbols": [{"literal":" "}, {"literal":"{"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "enum_definition", "symbols": ["enum_definition$string$1", "name", "enum_definition$string$2", "NL", "enum_list", "NL", {"literal":"}"}], "postprocess":  (match) => {
        	return {
        		type: "enum",
        		name: match[1],
        		list: match[4],
        	}
        }},
    {"name": "table_definition$string$1", "symbols": [{"literal":"T"}, {"literal":"a"}, {"literal":"b"}, {"literal":"l"}, {"literal":"e"}, {"literal":" "}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "table_definition$string$2", "symbols": [{"literal":" "}, {"literal":"{"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "table_definition", "symbols": ["table_definition$string$1", "name", "table_definition$string$2", "NL", "columns", "NL", {"literal":"}"}], "postprocess": (match) => {
        	return {
        		type: "table",
        		name: match[1],
        		columns: match[4]
        	}
        }},
    {"name": "columns", "symbols": ["column_definition"]},
    {"name": "columns", "symbols": ["column_definition", "NL", "columns"], "postprocess":  (match) => {
        	return flatten([match[0],match[2]])
        }},
    {"name": "column_definition$subexpression$1$subexpression$1", "symbols": []},
    {"name": "column_definition$subexpression$1", "symbols": ["column_definition$subexpression$1$subexpression$1"]},
    {"name": "column_definition$subexpression$1$subexpression$2", "symbols": [{"literal":" "}, "modifier_list"]},
    {"name": "column_definition$subexpression$1", "symbols": ["column_definition$subexpression$1$subexpression$2"]},
    {"name": "column_definition", "symbols": ["name", {"literal":" "}, "column_type", "column_definition$subexpression$1"], "postprocess":  (match) => {
        	return {
        		name: match[0],
        		type: match[2],
        		modifiers: flatten(match[3][0]).filter(item => item !== ' ')
        	}
        }},
    {"name": "modifier_list", "symbols": ["modifier"], "postprocess": id},
    {"name": "modifier_list", "symbols": ["modifier_list", {"literal":","}, "modifier"], "postprocess":  (match) => {
        	return flatten([match[0],match[2]])
        }},
    {"name": "modifier_list", "symbols": [{"literal":"["}, "modifier_list", {"literal":"]"}], "postprocess":  (match) => {
        	return match[1];
        }},
    {"name": "column_type$string$1", "symbols": [{"literal":"v"}, {"literal":"a"}, {"literal":"r"}, {"literal":"c"}, {"literal":"h"}, {"literal":"a"}, {"literal":"r"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "column_type", "symbols": ["column_type$string$1"], "postprocess": id},
    {"name": "column_type$string$2", "symbols": [{"literal":"i"}, {"literal":"n"}, {"literal":"t"}, {"literal":"e"}, {"literal":"g"}, {"literal":"e"}, {"literal":"r"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "column_type", "symbols": ["column_type$string$2"], "postprocess": id},
    {"name": "column_type$string$3", "symbols": [{"literal":"f"}, {"literal":"l"}, {"literal":"o"}, {"literal":"a"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "column_type", "symbols": ["column_type$string$3"], "postprocess": id},
    {"name": "column_type$string$4", "symbols": [{"literal":"t"}, {"literal":"e"}, {"literal":"x"}, {"literal":"t"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "column_type", "symbols": ["column_type$string$4"], "postprocess": id},
    {"name": "column_type$string$5", "symbols": [{"literal":"d"}, {"literal":"a"}, {"literal":"t"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "column_type", "symbols": ["column_type$string$5"], "postprocess": id},
    {"name": "column_type$string$6", "symbols": [{"literal":"d"}, {"literal":"a"}, {"literal":"t"}, {"literal":"e"}, {"literal":"t"}, {"literal":"i"}, {"literal":"m"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "column_type", "symbols": ["column_type$string$6"], "postprocess": id},
    {"name": "column_type$subexpression$1$string$1", "symbols": [{"literal":"v"}, {"literal":"a"}, {"literal":"r"}, {"literal":"c"}, {"literal":"h"}, {"literal":"a"}, {"literal":"r"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "column_type$subexpression$1", "symbols": ["column_type$subexpression$1$string$1"]},
    {"name": "column_type$subexpression$1$string$2", "symbols": [{"literal":"i"}, {"literal":"n"}, {"literal":"t"}, {"literal":"e"}, {"literal":"g"}, {"literal":"e"}, {"literal":"r"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "column_type$subexpression$1", "symbols": ["column_type$subexpression$1$string$2"]},
    {"name": "column_type", "symbols": ["column_type$subexpression$1", {"literal":"("}, "number", {"literal":")"}], "postprocess":  
        (match) => `${match[0]}(${match[2][0].join('')})` 
        					},
    {"name": "column_type", "symbols": ["enum_var"], "postprocess": id},
    {"name": "modifier$string$1", "symbols": [{"literal":"n"}, {"literal":"o"}, {"literal":"t"}, {"literal":" "}, {"literal":"n"}, {"literal":"u"}, {"literal":"l"}, {"literal":"l"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "modifier", "symbols": ["modifier$string$1"], "postprocess": id},
    {"name": "modifier$string$2", "symbols": [{"literal":"u"}, {"literal":"n"}, {"literal":"i"}, {"literal":"q"}, {"literal":"u"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "modifier", "symbols": ["modifier$string$2"], "postprocess": id},
    {"name": "modifier$string$3", "symbols": [{"literal":"p"}, {"literal":"r"}, {"literal":"i"}, {"literal":"m"}, {"literal":"a"}, {"literal":"r"}, {"literal":"y"}, {"literal":" "}, {"literal":"k"}, {"literal":"e"}, {"literal":"y"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "modifier", "symbols": ["modifier$string$3"], "postprocess": id},
    {"name": "enum_list", "symbols": ["name"], "postprocess": id},
    {"name": "enum_list", "symbols": ["name", "NL", "enum_list"], "postprocess":  (match) => {
        	return flatten([match[0], match[2]]);
        }},
    {"name": "enum_var$ebnf$1", "symbols": [/[a-zA-Z_]/]},
    {"name": "enum_var$ebnf$1", "symbols": ["enum_var$ebnf$1", /[a-zA-Z_]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "enum_var", "symbols": ["enum_var$ebnf$1"], "postprocess":  (match, index, reject) => {
        	const name = match[0].join('');
        	const enums_allowed = enums_list;
        
        	if (!enums_allowed.includes(name)) return reject;
        	return name;
        }},
    {"name": "ref_definition$string$1", "symbols": [{"literal":"R"}, {"literal":"e"}, {"literal":"f"}, {"literal":":"}, {"literal":" "}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "ref_definition$string$2", "symbols": [{"literal":" "}, {"literal":">"}, {"literal":" "}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "ref_definition", "symbols": ["ref_definition$string$1", "name", {"literal":"."}, "name", "ref_definition$string$2", "name", {"literal":"."}, "name"], "postprocess":  (match) => {
        	return {
        		type: "ref",
        		foreign: {
        			table: match[1],
        			column: match[3]
        		},
        		primary: {
        			table: match[5],
        			column: match[7]
        		}
        	}
        } },
    {"name": "_$ebnf$1", "symbols": [/[\s\t]/]},
    {"name": "_$ebnf$1", "symbols": ["_$ebnf$1", /[\s\t]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "_", "symbols": ["_$ebnf$1"]},
    {"name": "NL$ebnf$1", "symbols": [/[\n]/]},
    {"name": "NL$ebnf$1", "symbols": ["NL$ebnf$1", /[\n]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "NL", "symbols": ["NL$ebnf$1"]},
    {"name": "name$ebnf$1", "symbols": [/[a-zA-Z_]/]},
    {"name": "name$ebnf$1", "symbols": ["name$ebnf$1", /[a-zA-Z_]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "name", "symbols": ["name$ebnf$1"], "postprocess":  (match, index, reject) => {
        	const name = match[0].join('');
        	const exceptions = ['varchar','integer','float','not null', 'unique', 'primary key', ' ', 'table', "}", "{", "enum"];
        	if (exceptions.includes(name.toLowerCase())) return reject;
        	return name;
        }},
    {"name": "number$ebnf$1", "symbols": [/[0-9]/]},
    {"name": "number$ebnf$1", "symbols": ["number$ebnf$1", /[0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "number", "symbols": ["number$ebnf$1"]}
]
  , ParserStart: "document_definition"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
