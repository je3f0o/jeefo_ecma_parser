/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : numeric_definition.js
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
    id         : "Numeric literal",
    type       : "Primitive",
    precedence : PRIMITIVE,

    is : (token, parser) => {
        return is_expression(parser) && token.id === "Number";
    },
    initialize : (node, token, parser) => {
        node.pre_comment = get_pre_comment(parser);
        node.value       = token.value;
        node.number_type = token.type;
        node.start       = token.start;
        node.end         = token.end;
    }
};
