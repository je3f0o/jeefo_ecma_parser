/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : lexical_binding.js
* Created at  : 2019-08-24
* Updated at  : 2019-08-24
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

const { is_assign }              = require("../../helpers");
const { EXPRESSION }             = require("../enums/precedence_enum");
const { initializer_definition } = require("../common");

module.exports = {
    id         : "Lexical binding",
    type       : "Expression",
    precedence : EXPRESSION + 1,

    is : (token, parser) => {
        if (parser.prev_node && is_assign(token)) {
            return parser.prev_node.id === "Object binding pattern";
        }
    },
    initialize : (node, token, parser) => {
        const binding     = parser.prev_node;
        const initializer = initializer_definition.generate_new_node(parser);

        node.binding_pattern = binding;
        node.initializer     = initializer;
        node.start           = binding.start;
        node.end             = initializer.end;
    }
};
