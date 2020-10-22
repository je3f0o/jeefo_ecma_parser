/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : member_operator.js
* Created at  : 2019-09-03
* Updated at  : 2020-09-10
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

const {expression}        = require("../enums/states_enum");
const {MEMBER_EXPRESSION} = require("../enums/precedence_enum");
const {
    is_dot,
    get_last_non_comment_node,
} = require("../../helpers");

module.exports = {
    id         : "Member operator",
    type       : "Member expression",
    precedence : MEMBER_EXPRESSION,

    is (token, parser) {
        if (parser.current_state !== expression || ! is_dot(parser)) return;
        const object = get_last_non_comment_node(parser);
        if (! object) return;
        switch (object.type) {
            case "Call expression"  :
            case "Member expression"  :
            case "Primary expression" :
                return true;
            case "Literal":
                return object.id !== "Null literal";
        }
        parser.log(object);
        debugger
    },
    initialize : (node, token, parser) => {
        const object = get_last_non_comment_node(parser, true);

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

        parser.end(node);
        parser.current_state = expression;
    },

    protos : {
        is_valid_simple_assignment_target () { return true; }
    }
};
