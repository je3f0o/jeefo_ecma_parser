/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : finally.js
* Created at  : 2020-09-07
* Updated at  : 2020-09-08
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

const {STRUCTURE}           = require("../enums/precedence_enum");
const {try_statement}       = require("../enums/states_enum");
const {is_identifier_token} = require("../../helpers");

module.exports = {
    id         : "Finally",
    type       : "The try statement",
    precedence : STRUCTURE,

    is         : (_, {current_state: s}) => s === try_statement,
    initialize : (node, token, parser) => {
        parser.expect("finally", is_identifier_token(token, "finally"));
        parser.change_state("keyword");
        const keyword = parser.generate_next_node();

        parser.prepare_next_state("block_statement", true);
        const block = parser.generate_next_node();

        node.keyword = keyword;
        node.block   = block;
        node.start   = keyword.start;
        node.end     = block.end;
    }
};
