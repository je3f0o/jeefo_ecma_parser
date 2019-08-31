/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : parse_binding.js
* Created at  : 2019-08-24
* Updated at  : 2019-08-25
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

const is_binding_pattern = (() => {
    const valid_delimiters = "[{".split('');
    return token => {
        if (token.id === "Delimiter") {
            return valid_delimiters.includes(token.value);
        }
    };
})();

module.exports = parser => {
    let binding;
    if (parser.is_next_node("Identifier")) {
        binding = parser.generate_next_node();
    } else if (is_binding_pattern(parser.next_token)) {
        parser.prev_node = parser.generate_next_node();
        if (parser.current_state !== binding_pattern) {
            parser.change_state("binding_pattern");
        }
        binding = parser.generate_next_node();
        parser.prev_node = null;
    }

    if (! binding) {
        parser.throw_unexpected_token();
    }

    return binding;
};
