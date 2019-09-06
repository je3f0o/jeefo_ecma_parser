/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : async_method.js
* Created at  : 2019-08-25
* Updated at  : 2019-09-06
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

const { ASYNC_METHOD }              = require("../enums/precedence_enum");
const { is_specific_method }        = require("../../es5/helpers");
const { get_last_non_comment_node } = require("../../helpers");

module.exports = {
    id         : "Async method",
    type       : "Expression",
    precedence : ASYNC_METHOD,

    is         : is_specific_method("async"),
    initialize : (node, token, parser) => {
        const async_node = get_last_non_comment_node(parser);
        const keyword    = parser.refine("contextual_keyword", async_node);

        // Property
        parser.change_state("property_name");
        const property_name = parser.generate_next_node();

        const prev_suffixes = parser.suffixes;
        parser.suffixes     = ["await"];

        // Parameter
        parser.prepare_next_state("formal_parameters", true);
        const parameters = parser.generate_next_node();

        // Body
        parser.prepare_next_state("async_method_body", true);
        const body = parser.generate_next_node();

        node.keyword       = keyword;
        node.property_name = property_name;
        node.parameters    = parameters;
        node.body          = body;
        node.start         = keyword.start;
        node.end           = body.end;

        parser.suffixes = prev_suffixes;
    }
};
