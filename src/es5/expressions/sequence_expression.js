/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : sequence_expression.js
* Created at  : 2019-03-28
* Updated at  : 2020-08-27
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

const {COMMA}      = require("../enums/precedence_enum");
const {expression} = require("../enums/states_enum");
const {
    is_comma,
    is_delimiter_token,
    get_last_non_comment_node,
} = require("../../helpers");

module.exports = {
	id         : "Sequence expression",
    type       : "Expression",
	precedence : COMMA,

	is : (token, parser) => {
        if (parser.current_state !== expression) { return; }

        if (is_delimiter_token(token, ',')) {
            return get_last_non_comment_node(parser) !== null;
        }
    },
    initialize : (node, token, parser) => {
        let last_node = get_last_non_comment_node(parser);
        last_node = parser.refine("assignment_expression", {
            id: node.id, last_node
        });

        const delimiters  = [];
        const expressions = [last_node];

        parser.change_state("punctuator");
        delimiters.push(parser.generate_next_node());

        parser.prepare_next_state("assignment_expression", true);
        LOOP:
        while (true) {
            expressions.push(parser.generate_next_node());

            if (parser.next_token === null) {
                break;
            } else if (is_comma(parser)) {
                parser.change_state("punctuator");
                delimiters.push(parser.generate_next_node());
                parser.prepare_next_state("assignment_expression", true);
            } else {
                break;
            }
        }

        node.expressions = expressions;
        node.delimiters  = delimiters;
        node.start       = expressions[0].start;
        node.end         = expressions[expressions.length - 1].end;
    }
};
