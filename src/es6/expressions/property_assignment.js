/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : property_assignment.js
* Created at  : 2019-09-06
* Updated at  : 2019-09-07
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

const { EXPRESSION }          = require("../enums/precedence_enum");
const { property_assignment } = require("../enums/states_enum");

const init = (node, property_name, parser) => {
    parser.change_state("punctuator");
    const colon = parser.generate_next_node();

    // Property
    parser.prepare_next_state("assignment_expression", true);
    const expression = parser.generate_next_node();

    node.property_name = property_name;
    node.colon         = colon;
    node.expression    = expression;
    node.start         = property_name.start;
    node.end           = expression.end;
};

module.exports = {
    id         : "Property assignment",
    type       : "Expression",
    precedence : EXPRESSION,

    is         : (_, { current_state : s }) => s === property_assignment,
    initialize : (node, token, parser) => {
        parser.throw_unexpected_token(`'${
            node.id
        }' initialize should not be called.`);
    },

    refine (node, property_name, parser) {
        if (property_name.id !== "Property name") {
            parser.throw_unexpected_refine(node, property_name);
        }

        init(node, property_name, parser);
    }
};
