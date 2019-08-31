/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : is_specific_method.js
* Created at  : 2019-08-26
* Updated at  : 2019-08-29
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

const { method_definition } = require("../enums/states_enum");
const {
    is_delimiter_token,
    get_last_non_comment_node,
} = require("../../helpers");

const is_possible_method_factory = keyword => {
    const is_valid_keyword = node => {
        return node.id === "Identifier name" && node.value === keyword;
    };
    return (token, parser) => {
        if (parser.current_state === method_definition) {
            const last_node = get_last_non_comment_node(parser);
            if (last_node && last_node.name) {
                return is_valid_keyword(last_node.name);
            }
        }
    };
};

module.exports = keyword => {
    const is_possible_method = is_possible_method_factory(keyword);
    return (token, parser) => {
        if (is_possible_method(token, parser)) {
            return ! is_delimiter_token(token, '(');
        }
    };
};
