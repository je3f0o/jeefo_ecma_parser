/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : generator_method.js
* Created at  : 2019-08-25
* Updated at  : 2019-08-28
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

const { GENERATOR_METHOD }    = require("../enums/precedence_enum");
const { method_definition }   = require("../enums/states_enum");
const { terminal_definition } = require("../../common");
const {
    is_asterisk,
    is_open_curly,
} = require("../../helpers");

const is_generator_method = (token, { current_state }) => {
    return current_state === method_definition && is_asterisk(token);
};

module.exports = {
    id         : "Generator method",
    type       : "Expression",
    precedence : GENERATOR_METHOD,

    is         : is_generator_method,
    initialize : (node, token, parser) => {
        const asterisk = terminal_definition.generate_new_node(parser);

        // Property
        parser.prepare_next_state("property_name", true);
        const property_name = parser.generate_next_node();

        // Parameter
        parser.prepare_next_state("formal_parameter_list", true);
        const parameters = parser.generate_next_node();

        // Body
        parser.prepare_next_state("function_body", true);
        parser.expect('{', is_open_curly);
        const body = parser.generate_next_node();

        node.asterisk      = asterisk;
        node.property_name = property_name;
        node.parameters    = parameters;
        node.body          = body;
        node.start         = asterisk.start;
        node.end           = body.end;

        parser.ending_index = node.end.index;
    }
};
