/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : expression_statement.js
* Created at  : 2017-08-17
* Updated at  : 2020-09-09
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

const {statement, expression} = require("../enums/states_enum");
const {
    is_delimiter_token,
    has_no_line_terminator,
    get_last_non_comment_node,
} = require("../../helpers");
const {
    TERMINATION,
    EXPRESSION_STATEMENT,
} = require("../enums/precedence_enum");

module.exports = {
    id         : "Expression statement",
    type       : "Statement",
    precedence : EXPRESSION_STATEMENT,

    is         : (_, {current_state: s}) => s === statement,
    initialize : (node, token, parser) => {
        const {streamer} = parser.tokenizer;
        const prev_ASI = parser.ASI;
        parser.ASI = true;
        parser.change_state("expression");
        parser.context_stack.push(node.id);
        let expr;
        while (true) {
            parser.parse_next_node(TERMINATION);
            expr = get_last_non_comment_node(parser, true);
            if (parser.is_terminated) {
                const last_ch = streamer.get_current_character();
                if (last_ch === '}') {
                    const next_token = parser.look_ahead();
                    if (next_token && is_delimiter_token(next_token, ',')) {
                        parser.is_terminated = false;
                        parser.current_state = expression;
                        parser.prepare_next_node_definition();
                        continue;
                    }
                }
            }
            break;
        }
        parser.context_stack.pop();

        if (expr.id === "String literal" && expr.value === "use strict") {
            parser.context_stack.push("strict mode");
        }
        parser.ASI = prev_ASI;
        parser.end(expr);

        let   terminator = null;
        const next_token = parser.look_ahead();
        if (next_token && has_no_line_terminator(expr, next_token)) {
            parser.expect(';', is_delimiter_token(next_token, ';'));
            parser.prepare_next_state("punctuator", true);
            terminator = parser.generate_next_node();
        }

        node.expression = expr;
        node.terminator = terminator;
        node.start      = expr.start;
        node.end        = (terminator || expr).end;

        parser.terminate(node);
    }
};
