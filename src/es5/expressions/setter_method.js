/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : setter_method.js
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

const { SETTER_METHOD }             = require("../enums/precedence_enum");
const { is_specific_method }        = require("../helpers");
const { get_last_non_comment_node } = require("../../helpers");

module.exports = {
    id         : "Setter method",
    type       : "Expression",
    precedence : SETTER_METHOD,

    is         : is_specific_method("set"),
    initialize : (node, token, parser) => {
        const get_node = get_last_non_comment_node(parser);
        const keyword  = parser.refine("contextual_keyword", get_node);

        // Property
        parser.change_state("property_name");
        const property_name = parser.generate_next_node();

        // Parameter
        parser.prepare_next_state("property_set_parameter", true);
        const parameter = parser.generate_next_node();

        // Body
        parser.prepare_next_state("method_body", true);
        const body = parser.generate_next_node();

        node.keyword       = keyword;
        node.property_name = property_name;
        node.parameter     = parameter;
        node.body          = body;
        node.start         = keyword.start;
        node.end           = body.end;
    }
};
