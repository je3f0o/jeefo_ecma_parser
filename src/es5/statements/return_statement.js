/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : return_statement.js
* Created at  : 2017-08-17
* Updated at  : 2019-09-02
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/5.1/#sec-12.9
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const { statement }              = require("../enums/states_enum");
const { STATEMENT, TERMINATION } = require("../enums/precedence_enum");
const {
    is_terminator,
    has_no_line_terminator,
} = require("../../helpers");

const valid_return_contexts = [
    "Function body",
    "Async function body",
];

module.exports = {
	id         : "Return statement",
	type       : "Statement",
	precedence : STATEMENT,

	is (token, parser) {
        if (parser.current_state === statement) {
            const { context_stack } = parser;
            let i = context_stack.length;
            while (i--) {
                if (valid_return_contexts.includes(context_stack[i].id)) {
                    return true;
                }
            }
            parser.throw_unexpected_token("Illegal return statement");
        }
    },
    initialize (node, token, parser) {
        let expression = null, terminator = null;

        parser.change_state("delimiter");
        const keyword  = parser.generate_next_node();

        parser.prepare_next_state("expression", true);
        if (has_no_line_terminator(keyword, parser.next_token)) {
            if (! is_terminator(parser)) {
                parser.post_comment = null;
                expression = parser.parse_next_node(TERMINATION);
                if (! expression) {
                    parser.throw_unexpected_token();
                }
            }

            if (is_terminator(parser)) {
                terminator = parser.generate_next_node();
            }
        }

        node.keyword    = keyword;
        node.expression = expression;
        node.terminator = terminator;
        node.start      = keyword.start;
        node.end        = (terminator || expression || keyword).end;

        parser.terminate(node);
    }
};
