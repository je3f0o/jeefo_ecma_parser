/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : identifier_name.js
* Created at  : 2019-08-21
* Updated at  : 2019-08-27
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

const { AST_Node_Definition } = require("@jeefo/parser");
const { PRIMITIVE }           = require("../es5/enums/precedence_enum");
const { get_pre_comment }     = require("../helpers");

module.exports = new AST_Node_Definition({
    id         : "Identifier name",
    type       : "Primitive",
    precedence : PRIMITIVE,

    is         : () => {},
    initialize : (node, token, parser) => {
        node.pre_comment = get_pre_comment(parser);
        node.value       = token.value;
        node.start       = token.start;
        node.end         = token.end;
    }
});
