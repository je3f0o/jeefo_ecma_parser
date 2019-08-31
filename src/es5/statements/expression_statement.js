/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : expression_statement.js
* Created at  : 2017-08-17
* Updated at  : 2019-08-28
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/5.1/#sec-12.4
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const { is_delimiter_token }     = require("../../helpers");
const { terminal_definition }    = require("../../common");
const { STATEMENT, TERMINATION } = require("../enums/precedence_enum");
const {
    statement,
    labelled_statement,
} = require("../enums/states_enum");

const expression_delimiters = ['[', '('];
const expression_keywords = [
    "new",
    "void",
    "delete",
    "typeof",

    "null",
    "true",
    "false",
    "undefined",
];
const unary_expressions = [ "~", "!", "+", "-", "++", "--" ];

module.exports = {
    id         : "Expression statement",
    type       : "Statement",
    precedence : STATEMENT,

    is : (token, parser) => {
        if (parser.current_state !== statement) { return; }

        switch (token.id) {
            case "Slash"  :
            case "String" :
            case "Number" :
                return true;
            case "Identifier" :
                if (expression_keywords.includes(token.value)) {
                    return true;
                } else if (! parser.is_reserved_word(token.value)) {
                    const next_token = parser.look_ahead();
                    if (next_token && is_delimiter_token(next_token, ':')) {
                        parser.current_state = labelled_statement;
                        return;
                    }

                    return true;
                }
                break;
            case "Delimiter" :
                return expression_delimiters.includes(token.value);
            case "Operator" :
                return unary_expressions.includes(token.value);
        }
    },

    initialize : (node, current_token, parser) => {
        let terminator      = null;
        parser.post_comment = null;

        parser.change_state("expression");
        const expression = parser.parse_next_node(TERMINATION);

        if (parser.next_token && parser.next_token.value === ';') {
            if (parser.post_comment !== null) {
                parser.prev_node = parser.post_comment;
            }
            terminator = terminal_definition.generate_new_node(parser);
        }

        node.expression = expression;
        node.terminator = terminator;
        node.start      = expression.start;
        node.end        = (terminator || expression).end;

        parser.terminate(node);
    }
};
