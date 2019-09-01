/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : sequence_expression.js
* Created at  : 2019-03-28
* Updated at  : 2019-09-01
* Author      : jeefo
* Purpose     :
* Description :
* Reference   :
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const { COMMA }         = require("../enums/precedence_enum");
const { is_expression } = require("../helpers");
const {
    is_delimiter_token,
    get_last_non_comment_node,
} = require("../../helpers");

module.exports = {
	id         : "Sequence expression",
    type       : "Expression",
	precedence : COMMA,

	is : (token, parser) => {
        if (is_expression(parser) && is_delimiter_token(token, ',')) {
            return get_last_non_comment_node(parser) !== null;
        }
    },
    initialize : (node, token, parser) => {
        const delimiters      = [];
        const expressions     = [get_last_non_comment_node(parser)];
        const expression_name = parser.get_current_state_name();

        parser.change_state("delimiter");
        delimiters.push(parser.generate_next_node());
        parser.prepare_next_state(expression_name, true);

        LOOP:
        while (true) {
            const expression = parser.parse_next_node(COMMA);
            if (! expression) {
                parser.throw_unexpected_token();
            }
            expressions.push(expression);

            if (parser.next_token === null) {
                break;
            } else if (parser.next_token.id === "Identifier") {
                // TODO: Refactor
                if (["in", "of"].includes(parser.next_token.value)) {
                    break;
                }
                parser.throw_unexpected_token();
            } else if (parser.next_token.id !== "Delimiter") {
                parser.throw_unexpected_token();
            }

            switch (parser.next_token.value) {
                case ',' :
                    parser.change_state("delimiter");
                    delimiters.push(parser.generate_next_node());
                    parser.prepare_next_state(expression_name, true);
                    break;
                case ';' :
                    break LOOP;
                default:
                    parser.throw_unexpected_token();
            }
        }

        node.expressions = expressions;
        node.start       = expressions[0].start;
        node.end         = expressions[expressions.length - 1].end;
    }
};
