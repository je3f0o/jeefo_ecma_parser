/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : states_enum.js
* Created at  : 2019-08-18
* Updated at  : 2019-08-29
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

const for_each    = require("@jeefo/utils/object/for_each");
const states_enum = require("../../es5/enums/states_enum");

const next_state_value = (() => {
    let last = 0;
    for_each(states_enum, (key, value) => {
        if (value > last) {
            last = value;
        }
    });
    return last + 1;
})();

module.exports = [
    "reference_id",
    "binding_element",
    "binding_pattern",
    "binding_identifier",

    "meta_property",
    "arrow_parameters",
    "cover_initialized_name",

    "var_statement",
    "lexical_declaration",

    "for_in",
    "for_of",
    "for_expression",
    "for_in_expression",
    "for_of_expression",
    "for_expression_controller",

    "class_tail",
    "class_body",
    "class_heritage",
    "class_expression",

    "generator_expression",
    "generator_declaration",
].reduce((states, value, index) => {
    states[value] = next_state_value + index;
    return states;
}, Object.assign({}, states_enum));
