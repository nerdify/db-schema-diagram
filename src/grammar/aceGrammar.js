import 'ace-builds/src-noconflict/mode-css'

export class CustomHighlightRules extends window.ace.acequire(
  'ace/mode/css_highlight_rules'
).CssHighlightRules {
  constructor() {
    super()

    this.$rules = {
      start: [
        {
          token: 'empty_line',
          regex: /^\s*$/,
          next: 'start',
        },
        {
          token: function (...defs) {
            return ['support.class', 'b', 'tablename', 'b', 'opendef', 'b']
          },
          regex: /^(table)([\s]+)([\w]+)([ ]+)({)([\s]*)$/,
          next: 'columns',
        },
        {
          token: function (...defs) {
            return ['support.class', 'b', 'tablename', 'b', 'opendef', 'b']
          },
          regex: /^(enum)([\s]+)([\w]+)([ ]+)({)([\s]*)$/,
          next: 'start',
        },
        {
          token: function (...defs) {
            return ['support.class', 'b']
          },
          regex: /^(Ref)(.*)$/,
          next: 'start',
        },
        {
          caseInsensitive: true,
        },
      ],
      columns: [
        {
          token: function (...defs) {
            return ['b', 'colname', 'b', 'string', 'b', 'modifiers']
          },
          regex: /^([\s]*)([\w_]+)([\s]+)([\w\d()]+)([\s]*)([[[\w\s,]+\]]*)$/,
          next: 'columns',
        },
        {
          token: function (...defs) {
            return ['b', 'colname', 'b', 'string']
          },
          regex: /^([\s]*)([\w_]+)([\s]+)([\w\d()]+)$/,
          next: 'columns',
        },
        {
          token: 'closedef',
          regex: '}',
          next: 'start',
        },
      ],
    }
  }
}

export default class CustomSqlMode extends window.ace.acequire('ace/mode/css')
  .Mode {
  constructor() {
    super()
    this.HighlightRules = CustomHighlightRules
  }
}
