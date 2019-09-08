/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : member_operator.js
* Created at  : 2019-09-03
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

const { MEMBER_EXPRESSION }         = require("../enums/precedence_enum");
const { get_last_non_comment_node } = require("../../helpers");
const {
    expression,
    call_expression,
    member_expression,
} = require("../enums/states_enum");

const is_dot = token => {
    return token.id === "Operator" && token.value === '.';
};

module.exports = {
    id         : "Member operator",
    type       : "Binary operator",
    precedence : MEMBER_EXPRESSION,

    is (token, parser) {
        if (parser.current_state === expression && is_dot(token)) {
            return get_last_non_comment_node(parser) !== null;
        }
    },
    initialize : (node, token, parser) => {
        // Object
        let object = get_last_non_comment_node(parser);
        let is_call_expr;
        switch (object.id) {
            case "Member expression"          :
            case "Computed member expression" :
                break;
            case "Primary expression" :
                object = parser.refine("member_expression", object);
                break;
            case "Call expression" :
                is_call_expr = true;
                break;
            default:
                parser.throw_unexpected_token(
                    `Unexpected '${ object.id }' in: '${ node.id }'`,
                    object
                );
        }

        // Operator
        parser.change_state("punctuator");
        const operator = parser.generate_next_node();

        // Property
        parser.prepare_next_state("identifier_name", true);
        const property = parser.generate_next_node();

        node.object   = object;
        node.operator = operator;
        node.property = property;
        node.start    = object.start;
        node.end      = property.end;

        if (is_call_expr) {
            parser.current_state = call_expression;
        } else {
            parser.current_state = member_expression;
        }
    },

    protos : {
        is_valid_simple_assignment_target () { return true; }
    }
};
