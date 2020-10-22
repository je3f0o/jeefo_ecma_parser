/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : generator_method.js
* Created at  : 2019-08-25
* Updated at  : 2020-08-31
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

const array_remove       = require("@jeefo/utils/array/remove");
const {EXPRESSION}       = require("../enums/precedence_enum");
const {generator_method} = require("../enums/states_enum");

module.exports = {
    id         : "Generator method",
    type       : "Method definitions",
    precedence : EXPRESSION,

    is         : (_, {current_state: s}) => s === generator_method,
    initialize : (node, token, parser) => {
        parser.change_state("punctuator");
        const asterisk = parser.generate_next_node();

        // Property
        parser.prepare_next_state("property_name", true);
        const property_name = parser.generate_next_node();

        // Parameter
        const has_yeild = parser.suffixes.includes("yield");
        if (! has_yeild) parser.suffixes.push("yield");
        parser.prepare_next_state("formal_parameters", true);
        const parameters = parser.generate_next_node();
        if (! has_yeild) array_remove(parser.suffixes, "yield");

        // Body
        parser.prepare_next_state("generator_body", true);
        const body = parser.generate_next_node();

        node.asterisk      = asterisk;
        node.property_name = property_name;
        node.parameters    = parameters;
        node.body          = body;
        node.start         = asterisk.start;
        node.end           = body.end;
    }
};
