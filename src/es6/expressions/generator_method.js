/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : generator_method.js
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

const { GENERATOR_METHOD }  = require("../enums/precedence_enum");
const { method_definition } = require("../enums/states_enum");
const { is_asterisk_token } = require("../../helpers");

const is_generator_method = (token, { current_state }) => {
    return current_state === method_definition && is_asterisk_token(token);
};

module.exports = {
    id         : "Generator method",
    type       : "Expression",
    precedence : GENERATOR_METHOD,

    is         : is_generator_method,
    initialize : (node, token, parser) => {
        parser.change_state("punctuator");
        const asterisk = parser.generate_next_node();

        // Property
        parser.prepare_next_state("property_name", true);
        const property_name = parser.generate_next_node();

        const prev_suffixes = parser.suffixes;
        parser.suffixes = ["yield"];

        // Parameter
        parser.prepare_next_state("formal_parameters", true);
        const parameters = parser.generate_next_node();

        // Body
        parser.prepare_next_state("generator_body", true);
        const body = parser.generate_next_node();

        node.asterisk      = asterisk;
        node.property_name = property_name;
        node.parameters    = parameters;
        node.body          = body;
        node.start         = asterisk.start;
        node.end           = body.end;

        parser.suffixes     = prev_suffixes;
        parser.ending_index = node.end.index;
    }
};
