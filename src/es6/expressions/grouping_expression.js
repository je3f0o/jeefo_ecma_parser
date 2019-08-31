/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : grouping_expression.js
* Created at  : 2019-08-18
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

const { GROUPING_EXPRESSION }  = require("../enums/precedence_enum");
const { is_expression }        = require("../../es5/helpers");
const { binding_rest_element } = require("../nodes");
const {
    is_close_parenthesis,
    get_last_non_comment_node,
    parse_asignment_expression,
} = require("../../helpers");
const { terminal_definition } = require("../../common");

function get_expressions (parser) {
    let has_rest_param;
    const delimiters  = [];
    const expressions = [];
    parser.prepare_next_state("expression", true);

    while (! is_close_parenthesis(parser)) {
        if (parser.next_token.value === "...") {
            expressions.push(binding_rest_element.generate_new_node(parser));
            if (parser.next_token.value !== ')') {
                parser.throw_unexpected_token(
                    "Rest parameter must be last formal parameter"
                );
            }
            has_rest_param = true;
        } else {
            const expr = parse_asignment_expression(parser);
            if (! expr) {
                parser.throw_unexpected_token();
            }
            expressions.push(expr);
        }

        if (parser.next_token === null) {
            parser.throw_unexpected_end_of_stream();
        } else if (parser.next_token.value === ',') {
            parser.change_state("delimiter");
            delimiters.push(parser.generate_next_node());

            parser.prepare_next_state("expression", true);
        }
    }

    if (expressions.length === 0) {
        const next_token = parser.look_ahead(true);

        if (next_token.value !== "=>") {
            parser.throw_unexpected_token("Unexpected token )");
        }
    } else if (has_rest_param) {
        const next_token = parser.look_ahead(true);
        parser.expect("=>", () => next_token.value === "=>");
    }

    return { delimiters, expressions };
}

const is_possible_group = (token, parser) => {
    if (is_expression(parser)) {
        return token.id === "Delimiter" && token.value === '(';
    }
};

module.exports = {
	id         : "Grouping expression",
    type       : "Expression",
	precedence : GROUPING_EXPRESSION,

	is : (token, parser) => {
        if (is_possible_group(token, parser)) {
            return get_last_non_comment_node(parser) === null;
        }
    },
    initialize : (node, current_token, parser) => {
        const prev_state = parser.current_state;

        parser.change_state("delimiter");
        const open = terminal_definition.generate_new_node(parser);
        const {
            delimiters, expressions
        } = get_expressions(parser);
        const close = terminal_definition.generate_new_node(parser);

        node.open_parenthesis  = open;
        node.list              = expressions;
        node.delimiters        = delimiters;
        node.close_parenthesis = close;
        node.start             = open.start;
        node.end               = close.end;

        parser.ending_index  = node.end.index;
        parser.current_state = prev_state;
    }
};
