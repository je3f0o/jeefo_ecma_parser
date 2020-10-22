/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : identifier_reference.js
* Created at  : 2019-08-28
* Updated at  : 2020-08-28
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

const { EXPRESSION }   = require("../enums/precedence_enum");
const { reference_id } = require("../enums/states_enum.js");
const {
    is_identifier,
    get_pre_comment,
} = require("../../helpers");

module.exports = {
    id         : "Identifier reference",
    type       : "Expression",
    precedence : EXPRESSION,

    is         : (_, parser) => parser.current_state === reference_id,
    initialize : (node, token, parser) => {
        parser.change_state("expression");
        parser.expect("IdentifierReference", is_identifier);

        node.pre_comment = get_pre_comment(parser);
        node.value       = token.value;
        node.start       = token.start;
        node.end         = token.end;
    }
};
