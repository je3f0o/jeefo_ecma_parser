/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : identifier_definition.js
* Created at  : 2019-08-05
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

const { PRIMITIVE }        = require("../enums/precedence_enum");
const { is_expression }    = require("../helpers");
const { get_pre_comment }  = require("../../helpers");
const { expression_no_in } = require("../enums/states_enum");

const is_of_operator = (token, parser) => {
    if (parser.current_state === expression_no_in) {
        // TOOD: refactor
        return token.value === "of";
    }
};

module.exports = {
    id         : "Identifier",
    type       : "Primitive",
    precedence : PRIMITIVE,

    is : (token, parser) => {
        if (is_expression(parser) && token.id === "Identifier") {
            if (is_of_operator(token, parser)) {
                // TOOD: refactor
                return false;
            }
            /*
            if (token.value === "this") {
                return false;
            }
            */
            return ! parser.is_reserved_word(token.value);
        }
    },
    initialize : (node, token, parser) => {
        node.pre_comment = get_pre_comment(parser);
        node.value       = token.value;
        node.start       = token.start;
        node.end         = token.end;
    }
};
