/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : spread_element.js
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

const { EXPRESSION }     = require("../enums/precedence_enum");
const { spread_element } = require("../enums/states_enum");

module.exports = {
    id         : "Spread element",
	type       : "Expression",
	precedence : EXPRESSION,

    is         : (_, parser) => parser.current_state === spread_element,
	initialize : (node, token, parser) => {
        parser.change_state("delimiter");
        const ellipsis = parser.generate_next_node();

        parser.prepare_next_state("assignment_expression", true);
        const expression = parser.generate_next_node();

        node.ellipsis   = ellipsis;
        node.expression = expression;
        node.start      = ellipsis.start;
        node.end        = expression.end;
    },
};
