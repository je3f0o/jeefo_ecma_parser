/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : return_statement.js
* Created at  : 2017-08-17
* Updated at  : 2019-09-25
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

const { statement } = require("../enums/states_enum");
const { STATEMENT } = require("../enums/precedence_enum");
const {
    is_terminator,
    has_no_line_terminator,
} = require("../../helpers");

const valid_return_contexts = [
    "Method body",
    "Function body",
    "Async method body",
    "Async function body",
    "Arrow function body",
    "Async arrow function body",
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
                if (valid_return_contexts.includes(context_stack[i])) {
                    return true;
                }
            }
            parser.throw_unexpected_token("Illegal return statement");
        }
    },
    initialize (node, token, parser) {
        let expression = null, terminator = null;

        parser.change_state("keyword");
        const keyword  = parser.generate_next_node();

        parser.prepare_next_state("expression_expression", true);
        if (has_no_line_terminator(keyword, parser.next_token)) {
            if (! is_terminator(parser)) {
                expression = parser.generate_next_node();
            }

            if (is_terminator(parser)) {
                parser.change_state("punctuator");
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
