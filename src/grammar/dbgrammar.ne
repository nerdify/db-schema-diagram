@{%
  const enums_list = ["user_status"]

  const flatten = d => {
    return d.reduce(
      (a, b) => {
        return a.concat(b);
      },
      []
    );
  };
%}

document_definition ->	(table_definition|enum_definition|ref_definition) {%id%}
						| (table_definition|enum_definition|ref_definition) NL document_definition 
							{%(match) => {
								return flatten([match[0],match[2]])
							}%}
enum_definition ->	"Enum " name " {" NL enum_list NL "}" 
						{% (match) => {
							return {
								type: "enum",
								name: match[1],
								list: match[4],
							}
						}%}
table_definition -> "Table " name " {" NL columns NL "}" 
						{%(match) => {
							return {
								type: "table",
								name: match[1],
								columns: match[4]
							}
						}%}
columns ->	column_definition 
			| column_definition NL columns 
				{% (match) => {
					return flatten([match[0],match[2]])
				}%}
column_definition -> 	name " " column_type ((null)
						| (" " modifier_list))
							{% (match) => {
								return {
									name: match[0],
									type: match[2],
									modifiers: flatten(match[3][0]).filter(item => item !== ' ')
								}
							}%}
						| (_):+ column_definition {% (match) => {
							return match[1];
						} %}
modifier_list ->	modifier {% id %} 
					| modifier_list "," modifier 
						{% (match) => {
							return flatten([match[0],match[2]])
						}%}
					| "[" modifier_list "]" 
						{% (match) => {
							return match[1];
						}%}
column_type -> 	"varchar" {%id%} 
				| "integer" {%id%} 
				| "float" {%id%} 
				| "text" {%id%}
				| "date" {%id%}
				| "datetime" {%id%}
				| ("varchar" | "integer") "(" number ")" 
					{% 
						(match) => `${match[0]}(${match[2][0].join('')})` 
					%} 
				| enum_var {% id %}
modifier -> "not null" {%id%} 
			| "unique" {%id%} 
			| "primary key" {%id%}
enum_list -> name {%id%} 
			| name NL enum_list 
				{% (match) => {
					return flatten([match[0], match[2]]);
				}%}
enum_var -> [a-zA-Z_]:+ 
				{% (match, index, reject) => {
					const name = match[0].join('');
					const enums_allowed = enums_list;

					if (!enums_allowed.includes(name)) return reject;
					return name;
				}%}
ref_definition -> "Ref: " name "." name " > " name "." name	 {% (match) => {
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
} %}			
_ -> [\s\t]
NL -> [\n]:+
name -> [a-zA-Z_]:+ 
			{% (match, index, reject) => {
				const name = match[0].join('');
				const exceptions = ['varchar','integer','float','not null', 'unique', 'primary key', ' ', 'table', "}", "{", "enum"];
				if (exceptions.includes(name.toLowerCase())) return reject;
				return name;
			}%}
number -> [0-9]:+