/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : call_expression.js
* Created at  : 2019-08-27
* Updated at  : 2019-09-08
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

const { CALL_EXPRESSION }             = require("../enums/precedence_enum");
const { get_last_non_comment_node }   = require("../../helpers");
const { expression, call_expression } = require("../enums/states_enum");

module.exports = {
    id         : "Call expression",
	type       : "Expression",
	precedence : CALL_EXPRESSION,
    is         : (_, { current_state : s }) => s === call_expression,

	initialize (node, token, parser) {
        let call_expr = get_last_non_comment_node(parser);
        switch (call_expr.id) {
            case "Super call" :
            case "Function call expression" :
                break;
            case "Member operator" :
                call_expr = parser.refine("call_expression", call_expr);
                break;
            default:
                parser.throw_unexpected_token(
                    `Unexpected '${ call_expr.id }' in: '${ node.id }'`,
                    call_expr
                );
        }

        node.expression = call_expr;
        node.start      = call_expr.start;
        node.end        = call_expr.end;

        parser.ending_index  = node.end.index;
        parser.current_state = expression;
    },

    refine (node, input_node, parser) {
        switch (input_node.id) {
            case "Member operator" :
                if (input_node.object.id !== "Call expression") {
                    parser.throw_unexpected_refine(node, input_node);
                }
                break;
            default:
                parser.throw_unexpected_refine(node, input_node);
        }

        node.expression = input_node;
        node.start      = input_node.start;
        node.end        = input_node.end;
    }
};
