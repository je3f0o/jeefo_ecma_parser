/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : assignment_expression.js
* Created at  : 2019-09-02
* Updated at  : 2019-09-22
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

const { EXPRESSION, COMMA }         = require("../enums/precedence_enum");
const { assignment_expression }     = require("../enums/states_enum");
const { get_last_non_comment_node } = require("../../helpers");

module.exports = {
    id         : "Assignment expression",
	type       : "Expression",
	precedence : EXPRESSION,

    is         : (_, { current_state : s }) => s === assignment_expression,
	initialize : (node, token, parser) => {
        parser.change_state("expression");
        let expression = parser.parse_next_node(COMMA);
        if (! expression) {
            console.log(parser);
        }
        if (expression.id === "Comment") {
            expression = get_last_non_comment_node(parser);
        }
        if (! expression) {
            parser.throw_unexpected_token();
        }

        node.expression = expression;
        node.start      = expression.start;
        node.end        = expression.end;
    },

    refine (node, expression, parser) {
        switch (expression.id) {
            case "Primary expression" :
                break;
            default:
                parser.throw_unexpected_refine(node, expression);
        }

        node.expression = expression;
        node.start      = expression.start;
        node.end        = expression.end;
    }
};
