/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : binding_pattern.js
* Created at  : 2019-08-28
* Updated at  : 2019-09-05
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

const { binding_pattern } = require("../enums/states_enum");
const { BINDING_PATTERN } = require("../enums/precedence_enum");
const {
    is_assign_token,
    get_last_non_comment_node,
} = require("../../helpers");

const valid_nodes = ["Array literal", "Object literal"];

module.exports = {
    id         : "Binding pattern",
    type       : "Expression",
    precedence : BINDING_PATTERN + 20,

    is : (token, parser) => {
console.log("Binding pattern");
process.exit();
        if (is_assign_token(token)) {
            const last_node = get_last_non_comment_node(parser);
            if (last_node && valid_nodes.includes(last_node.id)) {
                parser.prev_state    = parser.current_state;
                parser.current_state = binding_pattern;
            }
        }
    },
    initialize : (node) => {
        console.log(node.id);
        process.exit();
    }
};
