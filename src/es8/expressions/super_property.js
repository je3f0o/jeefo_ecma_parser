/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : super_property.js
* Created at  : 2019-09-03
* Updated at  : 2019-09-03
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

const { MEMBER_EXPRESSION }             = require("../enums/precedence_enum");
const { expression, member_expression } = require("../enums/states_enum");

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
            return is_dot(next_token);
        }
    },

    initialize (node, token, parser) {
        parser.change_state("keyword");
        const object = parser.generate_next_node();

        parser.prepare_next_state("punctuator");
        const operator = parser.generate_next_node();

        parser.prepare_next_state("identifier_name", true);
        const property = parser.generate_next_node();

        node.object   = object;
        node.operator = operator;
        node.property = property;
        node.start    = object.start;
        node.end      = property.end;

        parser.current_state = member_expression;
    },

    protos : {
        is_valid_simple_assignment_target () { return true; }
    }
};
