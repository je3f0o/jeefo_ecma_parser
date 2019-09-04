/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : formal_parameter.js
* Created at  : 2019-09-03
* Updated at  : 2019-09-04
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

const { EXPRESSION }       = require("../enums/precedence_enum");
const { formal_parameter } = require("../enums/states_enum");

module.exports = {
    id         : "Formal parameter",
	type       : "Expression",
	precedence : EXPRESSION,

    is         : (_, parser) => parser. current_state === formal_parameter,
	initialize : (node, token, parser) => {
        parser.change_state("binding_element");
        this.init(node, parser.generate_next_node());
    },

    refine (node, expression, parser) {
        this.init(node, parser.refine("binding_element", expression));
    },

    init (node, element) {
        node.binding_element = element;
        node.start           = element.start;
        node.end             = element.end;
    }
};
