/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : method_definition.js
* Created at  : 2019-08-25
* Updated at  : 2019-09-06
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

const { METHOD_DEFINITION }         = require("../enums/precedence_enum");
const { method_definition }         = require("../enums/states_enum");
const { get_last_non_comment_node } = require("../../helpers");

module.exports = {
    id         : "Method definition",
    type       : "Expression",
    precedence : METHOD_DEFINITION,

    is         : (_, { current_state : s }) => s === method_definition,
    initialize : (node, token, parser) => {
        const property_name = get_last_non_comment_node(parser);

        const prev_suffixes = parser.suffixes;
        parser.suffixes = [];

        parser.change_state("formal_parameters");
        const parameters = parser.generate_next_node();

        parser.prepare_next_state("method_body", true);
        const body = parser.generate_next_node();

        node.property_name = property_name;
        node.parameters    = parameters;
        node.body          = body;
        node.start         = property_name.start;
        node.end           = body.end;

        parser.suffixes = prev_suffixes;
    }
};
