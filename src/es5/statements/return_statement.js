/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : return_statement.js
* Created at  : 2017-08-17
* Updated at  : 2020-09-08
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

const {statement}              = require("../enums/states_enum");
const {STATEMENT, TERMINATION} = require("../enums/precedence_enum");
const {
    is_delimiter_token,
    is_identifier_token,
    has_no_line_terminator,
    get_last_non_comment_node,
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
	is         : (_, {current_state: s}) => s === statement,

    initialize (node, token, parser) {
        const {context_stack: cs} = parser;
        let i = cs.length;
        let is_valid = false;
        while (i--) if (valid_return_contexts.includes(cs[i])) {
            is_valid = true;
            break;
        }
        if (! is_valid) {
            parser.throw_unexpected_token("Illegal return statement");
        }
        parser.expect("return", is_identifier_token(token, "return"));
        parser.change_state("keyword");
        const keyword = parser.generate_next_node();

        let expr       = null;
        let terminator = null;
        let next_token = parser.look_ahead(true);
        if (has_no_line_terminator(keyword, next_token)) {
            if (is_delimiter_token(next_token, ';')) {
                parser.prepare_next_state("punctuator", true);
                terminator = parser.generate_next_node();
            } else {
                parser.prepare_next_state("expression", true);
                parser.parse_next_node(TERMINATION);
                expr = get_last_non_comment_node(parser, true);
                parser.end(expr);

                next_token = parser.look_ahead(true);
                if (has_no_line_terminator(expr, next_token)) {
                    parser.prepare_next_state("punctuator", true);
                    terminator = parser.generate_next_node();
                }
            }
        }

        node.keyword    = keyword;
        node.expression = expr;
        node.terminator = terminator;
        node.start      = keyword.start;
        node.end        = (terminator || expr || keyword).end;

        parser.terminate(node);
    }
};
