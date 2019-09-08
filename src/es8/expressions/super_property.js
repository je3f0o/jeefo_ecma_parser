/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : super_property.js
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

const { MEMBER_EXPRESSION }  = require("../enums/precedence_enum");
const { is_delimiter_token } = require("../../helpers");
const {
    super_call,
    expression,
    member_expression,
} = require("../enums/states_enum");

const is_dot = token => {
    return token.id === "Operator" && token.value === '.';
};

module.exports = {
    id         : "Super property",
    type       : "Expression",
    precedence : MEMBER_EXPRESSION,

    is (token, parser) {
        if (parser.current_state === expression) {
            const next_token = parser.look_ahead(true);
            if (is_dot(next_token)) {
                return true;
            } else if (is_delimiter_token(next_token, '(')) {
                parser.current_state = super_call;
            }
        }
    },

    initialize (node, token, parser) {
        parser.change_state("keyword");
        const keyword = parser.generate_next_node();

        parser.prepare_next_state("punctuator");
        const operator = parser.generate_next_node();

        parser.prepare_next_state("identifier_name", true);
        const property = parser.generate_next_node();

        node.keyword  = keyword;
        node.operator = operator;
        node.property = property;
        node.start    = keyword.start;
        node.end      = property.end;

        parser.current_state = member_expression;
    },

    protos : {
        is_valid_simple_assignment_target () { return true; }
    }
};
