/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : function_declaration.js
* Created at  : 2019-08-22
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

const { is_asterisk }   = require("../../helpers");
const { is_expression } = require("../../es5/helpers");
const {
    statement,
    function_expression,
    generator_expression,
    generator_declaration,
} = require("../enums/states_enum");
const { id, type, precedence, initialize } = require(
    "../../es5/declarations/function_declaration"
);

module.exports = {
    id, type, precedence,
    is : (token, parser) => {
        const { current_state } = parser;

        parser.current_state = null;
        const next_token = parser.look_ahead(true);
        parser.current_state = current_state;

        if (is_asterisk(next_token)) {
            if (current_state === statement) {
                parser.prev_state    = current_state;
                parser.current_state = generator_declaration;
            } else if (is_expression(parser)) {
                parser.prev_state    = current_state;
                parser.current_state = generator_expression;
            }
        } else if (is_expression(parser)) {
            parser.prev_state    = current_state;
            parser.current_state = function_expression;
        } else {
            return current_state === statement;
        }
    },
    initialize
};
