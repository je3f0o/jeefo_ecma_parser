/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : new_operator_expression.js
* Created at  : 2020-08-22
* Updated at  : 2020-08-23
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

const { NEW_OPERATOR_EXPRESSION }   = require("../enums/precedence_enum");
const { get_last_non_comment_node } = require("../../helpers");
const {
    expression,
    new_member_expression,
} = require("../enums/states_enum");

const parse_member_expression = parser => {
    let expr;
    while (parser.next_token) {
        switch (parser.next_token.id) {
            case "Identifier" :
                switch (parser.next_token.value) {
                    case "this" :
                    case "class" :
                    case "function" :
                    case "async" :
                        console.log("Unimplemented");
                        process.exit(1);
                        break;
                    case "new" :
                        break;
                    case "super" :
                        break;
                    default:
                        parser.change_state("identifier_reference");
                        expr = parser.generate_next_node();
                        expr = parser.refine("primary_expression", expr);
                        expr = parser.refine("member_expression", expr);
                        parser.set_prev_node(expr);
                }
                break;
            case "Delimiter":
                /*
                if (!expr || expr.id !== "Member expression") {
                    parser.throw_unexpected_token(
                        `Invalid expression in new_operator_expression: ${
                            expression.id
                        }`, expression
                    );
                }
                */
                switch (parser.next_token.value) {
                    case '.' :
                        break;
                    case '[' :
                        break;
                    case '`' :
                        break;
                    case '(' :
                        parser.current_state = new_member_expression;
                        return expr;
                    default:
                        parser.throw_unexpected_token();
                }
                break;
            default:
        }
        parser.prepare_next_node_definition();
    }
};

module.exports = {
    id         : "New operator expression",
    type       : "Expression",
    precedence : NEW_OPERATOR_EXPRESSION,
    is         : (_, {current_state:s}) => s === expression,

    initialize (node, token, parser) {
        parser.change_state("keyword");
        const keyword = parser.generate_next_node();

        parser.prepare_next_state("member_expression", true);
        const expression = parse_member_expression(parser);

        node.keyword    = keyword;
        node.expression = expression;
        node.start      = keyword.start;
        node.end        = expression.end;

        parser.end(node);
    },

    refine (node, expression, parser) {
        console.log(expression);
        console.log("HELLOO new OP ?????");
        process.exit();
        switch (expression.id) {
            case "Meta property"      :
            case "Super property"     :
            case "Primary expression" :
                expression = parser.refine("member_expression", expression);
                break;
            case "Member expression" : break;
            default:
                parser.throw_unexpected_refine(node, expression);
        }

        node.expression = expression;
        node.start      = expression.start;
        node.end        = expression.end;
    },

    protos : {
        is_valid_simple_assignment_target (parser) {
            return this.expression.is_valid_simple_assignment_target(parser);
        }
    }
};
