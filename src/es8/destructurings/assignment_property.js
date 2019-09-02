/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : assignment_property.js
* Created at  : 2019-09-03
* Updated at  : 2019-09-03
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
const { assignment_property } = require("../enums/states_enum");

module.exports = {
    id         : "Assignment property",
	type       : "Expression",
	precedence : EXPRESSION,

    is         : (_, parser) => parser.current_state === assignment_property,
	initialize : (node, token, parser) => {
        let value     = null;
        let delimiter = null, property;

        switch (parser.prev_node.id) {
            case "Identifier" :
                parser.change_state("identifier_reference");
                property = parser.generate_next_node();
                break;
            case "Assignment expression":
                console.log("Not implemented:", node.id);
                process.exit();
                return;
            case "Array literal" :
            case "Object literal" :
                console.log("Not implemented:", node.id);
                process.exit();
                parser.prev_node = node;
                parser.previous_nodes.push(node);
                parser.change_state("binding_pattern");
                return parser.generate_next_node();
            default:
                parser.throw_unexpected_token(null, node);
        }

        node.property  = property;
        node.delimiter = delimiter;
        node.value     = value;
        node.start     = property.start;
        node.end       = (value || property).end;
    },
};
