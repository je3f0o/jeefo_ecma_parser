/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : formal_parameter.js
* Created at  : 2019-09-02
* Updated at  : 2019-09-02
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
        console.log(node.id);
        let binding_element;

        if (parser.prev_node) {
            parser.change_state("binding_element");
            binding_element = parser.generate_next_node();
        } else {
            console.log("Not implemented");
        }

        node.binding_element = binding_element;
        node.start           = binding_element.start;
        node.end             = binding_element.end;
    },
};
