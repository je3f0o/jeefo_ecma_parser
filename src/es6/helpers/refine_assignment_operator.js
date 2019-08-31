/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : refine_assignment_operator.js
* Created at  : 2019-08-25
* Updated at  : 2019-08-28
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

const {
    single_name_binding,
    initializer_definition,
} = require("../nodes");

const valid_left_nodes = [
    "Assignment expression",
    "Array binding pattern",
    "Object binding pattern",
];

module.exports = (node, parser) => {
    if (valid_left_nodes.includes(node.left.id)) { return node; }

    if (node.left.id !== "Identifier") {
        parser.throw_unexpected_token(null, node.left);
    } else if (node.operator.value !== '=') {
        parser.throw_unexpected_token(null, node.operator);
    }

    // Refine initializer
    parser.prev_node = {
        assign_operator : node.operator,
        expression      : node.right
    };
    const initializer = initializer_definition.generate_new_node(parser);

    parser.prev_node = { identifier : node.left, initializer };
    const result = single_name_binding.generate_new_node(parser);

    parser.prev_node = null;
    return result;
};
