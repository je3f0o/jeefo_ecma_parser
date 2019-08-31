/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : identifier_definition.js
* Created at  : 2019-08-05
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

const { PRIMITIVE }       = require("../enums/precedence_enum");
const { is_expression }   = require("../helpers");
const { get_pre_comment } = require("../../helpers");

module.exports = {
    id         : "Identifier",
    type       : "Primitive",
    precedence : PRIMITIVE,

    is : (token, parser) => {
        if (is_expression(parser) && token.id === "Identifier") {
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
