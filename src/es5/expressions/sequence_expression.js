/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : sequence_expression.js
* Created at  : 2019-03-28
* Updated at  : 2019-08-28
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

const { COMMA }               = require("../enums/precedence_enum");
const { terminal_definition } = require("../../common");
const {
    is_expression,
    get_expression,
    get_current_state_name,
} = require("../helpers");
const {
    is_comma,
    get_last_non_comment_node,
} = require("../../helpers");

module.exports = {
	id         : "Sequence expression",
    type       : "Expression",
	precedence : COMMA,

	is : (token, parser) => {
        if (is_expression(parser) && is_comma(parser.next_token)) {
            return get_last_non_comment_node(parser) !== null;
        }
    },
    initialize : (node, token, parser) => {
        const delimiters      = [];
        const expressions     = [get_last_non_comment_node(parser, true)];
        const expression_name = get_current_state_name(parser);

        delimiters.push(terminal_definition.generate_new_node(parser));
        parser.prepare_next_state(expression_name, true);

        LOOP:
        while (true) {
            const expression = get_expression(parser, COMMA);
            if (! expression) {
                parser.throw_unexpected_token();
            }
            expressions.push(expression);

            if (parser.next_token === null) {
                break;
            } else if (parser.next_token.id !== "Delimiter") {
                parser.throw_unexpected_token();
            }

            switch (parser.next_token.value) {
                case ',' :
                    delimiters.push(
                        terminal_definition.generate_new_node(parser)
                    );
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
