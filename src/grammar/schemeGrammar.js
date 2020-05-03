import { createToken, Lexer, CstParser } from "chevrotain";

// ----------------- Lexer -----------------
const tableDf = createToken({ name: "TableDefinition", pattern: /TABLE/i });
const RefDf = createToken({ name: "RefDefinition", pattern: /REF[\s]*:/i });

const lBraket = createToken({ name: "lBraket", pattern: /{/ });
const rBraket = createToken({ name: "RBraket", pattern: /}/ });

const lKey = createToken({ name: "lKey", pattern: /\[/ });
const rKey = createToken({ name: "rKey", pattern: /\]/ });
const comma = createToken({ name: "comma", pattern: /,/ });

const notNull = createToken({ name: "notNull", pattern: /not null/ });
const primaryKey = createToken({ name: "primaryKey", pattern: /primary key/ });
const unique = createToken({ name: "unique", pattern: /unique/ });

const name = createToken({ name: "name", pattern: /[\w]{2,}(\(\d+\))?/ });

const NL = createToken({ name: "NL", pattern: /[\n]+/ });
const GT = createToken({ name: "GT", pattern: /\>/ });
const DOT = createToken({ name: "DOT", pattern: /\./ });
const WS = createToken({
  name: "WS",
  pattern: /[\s|\t]+/,
  group: Lexer.SKIPPED,
});

const allTokens = [
  tableDf,
  RefDf,
  lBraket,
  rBraket,
  lKey,
  rKey,
  comma,
  notNull,
  primaryKey,
  unique,
  name,
  NL,
  WS,
  DOT,
  GT,
];

const DBDefinitionLexer = new Lexer(allTokens, {
  // Less position info tracked, reduces verbosity of the playground output.
  positionTracking: "onlyStart",
});

// ----------------- parser -----------------
export class SchemeDBParser extends CstParser {
  constructor() {
    super(allTokens);
    const $ = this;

    $.RULE("elements", () => {
      $.MANY(() => {
        $.OR([
          {
            ALT: () => {
              $.SUBRULE($.table, { LABEL: "list" });
            },
          },
          {
            ALT: () => {
              $.SUBRULE($.ref, { LABEL: "list" });
            },
          },
        ]);
      });
    });

    $.RULE("ref", () => {
      $.CONSUME(RefDf);
      $.SUBRULE($.foreign_ref);
      $.CONSUME(GT);
      $.SUBRULE($.primary_ref);
      $.CONSUME(NL);
    });

    $.RULE("foreign_ref", () => {
      $.SUBRULE($.ref_table_col);
    });

    $.RULE("primary_ref", () => {
      $.SUBRULE($.ref_table_col);
    });

    $.RULE("ref_table_col", () => {
      $.SUBRULE($.ref_table);
      $.CONSUME(DOT);
      $.SUBRULE($.ref_column);
    });

    $.RULE("ref_table", () => {
      $.CONSUME(name);
    });

    $.RULE("ref_column", () => {
      $.CONSUME(name);
    });

    $.RULE("table", () => {
      $.SUBRULE($.open_table);
      $.SUBRULE($.columns);
      $.SUBRULE($.close_table);
    });

    $.RULE("open_table", () => {
      $.CONSUME(tableDf);
      $.CONSUME(name);
      $.CONSUME(lBraket);
      $.CONSUME(NL);
    });

    $.RULE("close_table", () => {
      $.CONSUME(rBraket);
      $.CONSUME(NL);
    });

    $.RULE("columns", () => {
      $.MANY(() => {
        $.SUBRULE($.column, { LABEL: "list" });
      });
    });

    $.RULE("column", () => {
      $.SUBRULE($.column_name);
      $.SUBRULE($.type);
      $.OPTION(() => {
        $.SUBRULE($.modifiers);
      });
      $.CONSUME(NL);
    });

    $.RULE("column_name", () => {
      $.CONSUME(name);
    });

    $.RULE("type", () => {
      $.CONSUME(name);
    });

    $.RULE("modifiers", () => {
      $.CONSUME(lKey);
      $.MANY_SEP({
        SEP: comma,
        DEF: () => {
          $.SUBRULE($.single_modifier, { LABEL: "list" });
        },
      });
      $.CONSUME(rKey);
    });

    $.RULE("single_modifier", () => {
      $.OR([
        {
          ALT: () => {
            $.CONSUME(notNull);
          },
        },
        {
          ALT: () => {
            $.CONSUME(primaryKey);
          },
        },
        {
          ALT: () => {
            $.CONSUME(unique);
          },
        },
      ]);
    });

    this.performSelfAnalysis();
  }
}

export { DBDefinitionLexer };
