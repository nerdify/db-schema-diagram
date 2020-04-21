// Generated automatically by nearley, version 2.19.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

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
    {"name": "document_definition$subexpression$3", "symbols": ["document_definition"]},
    {"name": "document_definition", "symbols": ["document_definition$subexpression$2", "NL", "document_definition$subexpression$3"], "postprocess": (match) => {
        	return flatten([match[0],flatten(match[2])])
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
    {"name": "table_definition$subexpression$1$ebnf$1", "symbols": []},
    {"name": "table_definition$subexpression$1$ebnf$1$subexpression$1", "symbols": [{"literal":" "}]},
    {"name": "table_definition$subexpression$1$ebnf$1", "symbols": ["table_definition$subexpression$1$ebnf$1", "table_definition$subexpression$1$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "table_definition$subexpression$1$subexpression$1$string$1", "symbols": [{"literal":"T"}, {"literal":"a"}, {"literal":"b"}, {"literal":"l"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "table_definition$subexpression$1$subexpression$1", "symbols": ["table_definition$subexpression$1$subexpression$1$string$1"]},
    {"name": "table_definition$subexpression$1$subexpression$1$string$2", "symbols": [{"literal":"t"}, {"literal":"a"}, {"literal":"b"}, {"literal":"l"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "table_definition$subexpression$1$subexpression$1", "symbols": ["table_definition$subexpression$1$subexpression$1$string$2"]},
    {"name": "table_definition$subexpression$1$subexpression$1$string$3", "symbols": [{"literal":"T"}, {"literal":"A"}, {"literal":"B"}, {"literal":"L"}, {"literal":"E"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "table_definition$subexpression$1$subexpression$1", "symbols": ["table_definition$subexpression$1$subexpression$1$string$3"]},
    {"name": "table_definition$subexpression$1", "symbols": ["table_definition$subexpression$1$ebnf$1", "table_definition$subexpression$1$subexpression$1"]},
    {"name": "table_definition$ebnf$1$subexpression$1", "symbols": ["_"]},
    {"name": "table_definition$ebnf$1", "symbols": ["table_definition$ebnf$1$subexpression$1"]},
    {"name": "table_definition$ebnf$1$subexpression$2", "symbols": ["_"]},
    {"name": "table_definition$ebnf$1", "symbols": ["table_definition$ebnf$1", "table_definition$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "table_definition$ebnf$2", "symbols": []},
    {"name": "table_definition$ebnf$2$subexpression$1", "symbols": ["_"]},
    {"name": "table_definition$ebnf$2", "symbols": ["table_definition$ebnf$2", "table_definition$ebnf$2$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "table_definition$ebnf$3", "symbols": []},
    {"name": "table_definition$ebnf$3$subexpression$1", "symbols": ["_"]},
    {"name": "table_definition$ebnf$3", "symbols": ["table_definition$ebnf$3", "table_definition$ebnf$3$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "table_definition$ebnf$4", "symbols": []},
    {"name": "table_definition$ebnf$4$subexpression$1", "symbols": ["_"]},
    {"name": "table_definition$ebnf$4", "symbols": ["table_definition$ebnf$4", "table_definition$ebnf$4$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "table_definition$ebnf$5", "symbols": []},
    {"name": "table_definition$ebnf$5$subexpression$1", "symbols": ["_"]},
    {"name": "table_definition$ebnf$5", "symbols": ["table_definition$ebnf$5", "table_definition$ebnf$5$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "table_definition", "symbols": ["table_definition$subexpression$1", "table_definition$ebnf$1", "name", "table_definition$ebnf$2", {"literal":"{"}, "table_definition$ebnf$3", "NL", "columns", "NL", "table_definition$ebnf$4", {"literal":"}"}, "table_definition$ebnf$5"], "postprocess": (match) => {
        	return {
        		type: "table",
        		name: match[2],
        		columns: match[7]
        	}
        }},
    {"name": "columns", "symbols": ["column_definition"]},
    {"name": "columns", "symbols": ["column_definition", "NL", "columns"], "postprocess":  (match) => {
        	return flatten([match[0],match[2]])
        }},
    {"name": "column_definition$ebnf$1", "symbols": []},
    {"name": "column_definition$ebnf$1$subexpression$1", "symbols": ["_"]},
    {"name": "column_definition$ebnf$1", "symbols": ["column_definition$ebnf$1", "column_definition$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "column_definition$ebnf$2", "symbols": []},
    {"name": "column_definition$ebnf$2$subexpression$1", "symbols": ["_"]},
    {"name": "column_definition$ebnf$2", "symbols": ["column_definition$ebnf$2", "column_definition$ebnf$2$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "column_definition$subexpression$1$subexpression$1", "symbols": []},
    {"name": "column_definition$subexpression$1", "symbols": ["column_definition$subexpression$1$subexpression$1"]},
    {"name": "column_definition$subexpression$1$subexpression$2", "symbols": ["modifier_list"]},
    {"name": "column_definition$subexpression$1", "symbols": ["column_definition$subexpression$1$subexpression$2"]},
    {"name": "column_definition", "symbols": ["column_definition$ebnf$1", "name", {"literal":" "}, "column_type", "column_definition$ebnf$2", "column_definition$subexpression$1"], "postprocess":  (match) => {
        	return {
        		name: match[1],
        		type: match[3],
        		modifiers: flatten(match[5][0]).filter(item => item !== ' ')
        	}
        }},
    {"name": "modifier_list", "symbols": ["modifier"], "postprocess": id},
    {"name": "modifier_list$ebnf$1", "symbols": []},
    {"name": "modifier_list$ebnf$1$subexpression$1", "symbols": ["_"]},
    {"name": "modifier_list$ebnf$1", "symbols": ["modifier_list$ebnf$1", "modifier_list$ebnf$1$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "modifier_list$subexpression$1", "symbols": []},
    {"name": "modifier_list$subexpression$1", "symbols": [{"literal":","}]},
    {"name": "modifier_list$ebnf$2", "symbols": []},
    {"name": "modifier_list$ebnf$2$subexpression$1", "symbols": ["_"]},
    {"name": "modifier_list$ebnf$2", "symbols": ["modifier_list$ebnf$2", "modifier_list$ebnf$2$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "modifier_list", "symbols": ["modifier_list", "modifier_list$ebnf$1", "modifier_list$subexpression$1", "modifier_list$ebnf$2", "modifier"], "postprocess":  (match) => {
        	return flatten([match[0],match[4]])
        }},
    {"name": "modifier_list$ebnf$3", "symbols": []},
    {"name": "modifier_list$ebnf$3$subexpression$1", "symbols": ["_"]},
    {"name": "modifier_list$ebnf$3", "symbols": ["modifier_list$ebnf$3", "modifier_list$ebnf$3$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "modifier_list$ebnf$4", "symbols": []},
    {"name": "modifier_list$ebnf$4$subexpression$1", "symbols": [{"literal":" "}]},
    {"name": "modifier_list$ebnf$4", "symbols": ["modifier_list$ebnf$4", "modifier_list$ebnf$4$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "modifier_list$ebnf$5", "symbols": []},
    {"name": "modifier_list$ebnf$5$subexpression$1", "symbols": ["_"]},
    {"name": "modifier_list$ebnf$5", "symbols": ["modifier_list$ebnf$5", "modifier_list$ebnf$5$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "modifier_list", "symbols": [{"literal":"["}, "modifier_list$ebnf$3", "modifier_list", "modifier_list$ebnf$4", {"literal":"]"}, "modifier_list$ebnf$5"], "postprocess":  (match) => {
        	return match[2];
        }},
    {"name": "modifier$string$1", "symbols": [{"literal":"n"}, {"literal":"o"}, {"literal":"t"}, {"literal":" "}, {"literal":"n"}, {"literal":"u"}, {"literal":"l"}, {"literal":"l"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "modifier", "symbols": ["modifier$string$1"], "postprocess": id},
    {"name": "modifier$string$2", "symbols": [{"literal":"u"}, {"literal":"n"}, {"literal":"i"}, {"literal":"q"}, {"literal":"u"}, {"literal":"e"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "modifier", "symbols": ["modifier$string$2"], "postprocess": id},
    {"name": "modifier$string$3", "symbols": [{"literal":"p"}, {"literal":"r"}, {"literal":"i"}, {"literal":"m"}, {"literal":"a"}, {"literal":"r"}, {"literal":"y"}, {"literal":" "}, {"literal":"k"}, {"literal":"e"}, {"literal":"y"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "modifier", "symbols": ["modifier$string$3"], "postprocess": id},
    {"name": "column_type$ebnf$1", "symbols": []},
    {"name": "column_type$ebnf$1", "symbols": ["column_type$ebnf$1", /[A-Za-z_()0-9]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "column_type", "symbols": ["column_type$ebnf$1"], "postprocess": (match) => {return match[0].join('')}},
    {"name": "enum_list", "symbols": ["name"], "postprocess": id},
    {"name": "enum_list", "symbols": ["name", "NL", "enum_list"], "postprocess":  (match) => {
        	return flatten([match[0], match[2]]);
        }},
    {"name": "enum_var$ebnf$1", "symbols": [/[a-zA-Z_]/]},
    {"name": "enum_var$ebnf$1", "symbols": ["enum_var$ebnf$1", /[a-zA-Z_]/], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "enum_var", "symbols": ["enum_var$ebnf$1"], "postprocess":  (match) => {
        	return match[0].join('');
        }},
    {"name": "ref_definition$subexpression$1$string$1", "symbols": [{"literal":"R"}, {"literal":"e"}, {"literal":"f"}, {"literal":":"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "ref_definition$subexpression$1", "symbols": ["ref_definition$subexpression$1$string$1"]},
    {"name": "ref_definition$subexpression$1$string$2", "symbols": [{"literal":"R"}, {"literal":"E"}, {"literal":"F"}, {"literal":":"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "ref_definition$subexpression$1", "symbols": ["ref_definition$subexpression$1$string$2"]},
    {"name": "ref_definition$subexpression$1$string$3", "symbols": [{"literal":"r"}, {"literal":"e"}, {"literal":"f"}, {"literal":":"}], "postprocess": function joiner(d) {return d.join('');}},
    {"name": "ref_definition$subexpression$1", "symbols": ["ref_definition$subexpression$1$string$3"]},
    {"name": "ref_definition$ebnf$1$subexpression$1", "symbols": ["_"]},
    {"name": "ref_definition$ebnf$1", "symbols": ["ref_definition$ebnf$1$subexpression$1"]},
    {"name": "ref_definition$ebnf$1$subexpression$2", "symbols": ["_"]},
    {"name": "ref_definition$ebnf$1", "symbols": ["ref_definition$ebnf$1", "ref_definition$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ref_definition$ebnf$2", "symbols": []},
    {"name": "ref_definition$ebnf$2$subexpression$1", "symbols": ["_"]},
    {"name": "ref_definition$ebnf$2", "symbols": ["ref_definition$ebnf$2", "ref_definition$ebnf$2$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ref_definition$ebnf$3", "symbols": []},
    {"name": "ref_definition$ebnf$3$subexpression$1", "symbols": ["_"]},
    {"name": "ref_definition$ebnf$3", "symbols": ["ref_definition$ebnf$3", "ref_definition$ebnf$3$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ref_definition$ebnf$4", "symbols": []},
    {"name": "ref_definition$ebnf$4$subexpression$1", "symbols": ["_"]},
    {"name": "ref_definition$ebnf$4", "symbols": ["ref_definition$ebnf$4", "ref_definition$ebnf$4$subexpression$1"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "ref_definition", "symbols": ["ref_definition$subexpression$1", "ref_definition$ebnf$1", "name", {"literal":"."}, "name", "ref_definition$ebnf$2", {"literal":">"}, "ref_definition$ebnf$3", "name", {"literal":"."}, "name", "ref_definition$ebnf$4"], "postprocess":  (match) => {
        	return {
        		type: "ref",
        		foreign: {
        			table: match[2],
        			column: match[4]
        		},
        		primary: {
        			table: match[8],
        			column: match[10]
        		}
        	}
        } },
    {"name": "_", "symbols": [/[\s]/]},
    {"name": "NL", "symbols": [/[\n]/]},
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
