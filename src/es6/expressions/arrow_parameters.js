/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : arrow_parameters.js
* Created at  : 2019-09-04
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

const { EXPRESSION }                = require("../enums/precedence_enum");
const { arrow_parameters }          = require("../enums/states_enum");
const { get_last_non_comment_node } = require("../../helpers");

module.exports = {
    id         : "Arrow parameters",
	type       : "Expression",
	precedence : EXPRESSION,

    is         : (_, { current_state : s }) => s === arrow_parameters,
	initialize : (node, token, parser) => {
        parser.throw_unexpected_token("should not be called:" + node.id);
        let expression = get_last_non_comment_node(parser);
        switch (expression.id) {
            case "Arrow formal parameters": break;
            default:
                parser.throw_unexpected_token();
        }

        node.expression = expression;
        node.start      = expression.start;
        node.end        = expression.end;
    },

    refine (node, expression, parser) {
        switch (expression.id) {
            case "Arguments":
            case "Cover parenthesized expression and arrow parameter list":
                expression = parser.refine(
                    "arrow_formal_parameters", expression
                );
                break;
            case "Primary expression":
                if (expression.expression.id !== "Identifier reference") {
                    parser.throw_unexpected_token();
                }
                expression = parser.refine(
                    "binding_identifier", expression.expression
                );
                break;
            default:
                parser.throw_unexpected_refine(node, expression);
        }

        node.expression = expression;
        node.start      = expression.start;
        node.end        = expression.end;
    }
};
