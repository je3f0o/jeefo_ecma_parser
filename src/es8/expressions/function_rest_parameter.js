/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : function_rest_parameter.js
* Created at  : 2019-09-03
* Updated at  : 2020-08-26
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

const {EXPRESSION}              = require("../enums/precedence_enum");
const {function_rest_parameter} = require("../enums/states_enum");

module.exports = {
    id         : "Function rest parameter",
	type       : "Expression",
	precedence : EXPRESSION,

    is         : (_, {current_state: s}) => s === function_rest_parameter,
	initialize : (node, token, parser) => {
        parser.change_state("binding_rest_element");
        const rest = parser.generate_next_node();

        node.binding_rest_element = rest;
        node.start                = rest.start;
        node.end                  = rest.end;
    },
};
