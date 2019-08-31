/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : meta_property.js
* Created at  : 2019-08-26
* Updated at  : 2019-08-26
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

const { EXPRESSION }          = require("../enums/precedence_enum");
const { meta_property }       = require("../enums/states_enum");
const { terminal_definition } = require("../../common");

const is_target = parser => {
    const { next_token:token } = parser;
    return token && token.id === "Identifier" && token.value === "target";
};

module.exports = {
    id         : "Meta property",
	type       : "Expression",
	precedence : EXPRESSION,

    is         : (token, parser) => parser.current_state === meta_property,
	initialize : (node, token, parser) => {
        const new_node = terminal_definition.generate_new_node(parser);

        parser.prepare_next_node_definition(true);
        const delimiter = terminal_definition.generate_new_node(parser);

        parser.prepare_next_state("expression", true);
        parser.expect("target", is_target);
        const target = terminal_definition.generate_new_node(parser);

        node.object    = new_node;
        node.delimiter = delimiter;
        node.property  = target;
        node.start     = new_node.start;
        node.end       = target.end;

        parser.next_token    = token;
        parser.current_state = parser.prev_state;
    },
};
