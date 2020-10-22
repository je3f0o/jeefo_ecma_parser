/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : formal_parameter.js
* Created at  : 2019-09-03
* Updated at  : 2020-09-09
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

const {EXPRESSION}       = require("../enums/precedence_enum");
const {formal_parameter} = require("../enums/states_enum");

const init = (node, element) => {
    node.binding_element = element;
    node.start           = element.start;
    node.end             = element.end;
};

module.exports = {
    id         : "Formal parameter",
	type       : "Expression",
	precedence : EXPRESSION,

    is         : (_, {current_state: s}) => s === formal_parameter,
	initialize : (node, token, parser) => {
        parser.change_state("binding_element");
        init(node, parser.generate_next_node());
        parser.end(node);
    },

    refine (node, expression, parser) {
        init(node, parser.refine("binding_element", expression));
    },
};
