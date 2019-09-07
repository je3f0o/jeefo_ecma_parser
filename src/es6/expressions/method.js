/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : method.js
* Created at  : 2019-09-07
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

const { method }     = require("../enums/states_enum");
const { EXPRESSION } = require("../enums/precedence_enum");

const init = (node, property_name, parser) => {
    const parameters = parser.generate_next_node();

    const prev_suffixes = parser.suffixes;
    parser.suffixes = [];

    parser.prepare_next_state("method_body", true);
    const body = parser.generate_next_node();

    parser.suffixes = prev_suffixes;

    node.property_name = property_name;
    node.parameters    = parameters;
    node.body          = body;
    node.start         = property_name.start;
    node.end           = body.end;
};

module.exports = {
    id         : "Method",
    type       : "Expression",
    precedence : EXPRESSION,

    is         : (_, { current_state : s }) => s === method,
    initialize : (node, token, parser) => {
        parser.change_state("property_name");
        const property_name = parser.generate_next_node();

        parser.prepare_next_state("formal_parameters", true);
        init(node, property_name, parser);
    },

    refine (node, property_name, parser) {
        if (property_name.id !== "Property name") {
            parser.throw_unexpected_refine(node, property_name);
        }

        parser.change_state("formal_parameters");
        init(node, property_name, parser);
    }
};
