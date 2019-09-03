/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : member_operator.js
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
const { get_last_non_comment_node }     = require("../../helpers");
const { expression, member_expression } = require("../enums/states_enum");

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
        if (object.id !== "Member expression") {
            parser.change_state("member_expression", false);
            object = parser.next_node_definition.refine(object, parser);
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

        parser.current_state = member_expression;
    },
};
