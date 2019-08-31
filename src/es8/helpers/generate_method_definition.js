/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : generate_method_definition.js
* Created at  : 2019-08-21
* Updated at  : 2019-08-21
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

const method_definition_def = require("../../es6/common/method_definition");

const {
    async_method,
    getter_method,
    setter_method,
} = require("../common");

module.exports = (parser, next_token) => {
    let method_definition;
    const node = parser.prev_node.name;
    const is_possible_special_method = (
        next_token.id !== "Delimiter" || next_token.value !== '('
    );

    if (is_possible_special_method && node.id === "Identifier name") {
        switch (node.value) {
            case "get"   :
                method_definition = getter_method;
                break;
            case "set"   :
                method_definition = setter_method;
                break;
            case "async" :
                method_definition = async_method;
                break;
        }

    }

    if (method_definition) {
        const prev_node   = parser.prev_node.name;
        parser.next_token = prev_node;
        parser.prev_node  = prev_node.pre_comment;
    } else {
        method_definition = method_definition_def;
    }

    return method_definition.generate_new_node(parser);
};
