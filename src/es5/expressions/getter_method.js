/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : getter_method.js
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

const { GETTER_METHOD }             = require("../enums/precedence_enum");
const { is_specific_method }        = require("../helpers");
const { get_last_non_comment_node } = require("../../helpers");

module.exports = {
    id         : "Getter method",
    type       : "Expression",
    precedence : GETTER_METHOD,

    is         : is_specific_method("get"),
    initialize : (node, token, parser) => {
        const get_node = get_last_non_comment_node(parser);
        const keyword  = parser.refine("contextual_keyword", get_node);

        // Property
        parser.change_state("property_name");
        const property_name = parser.generate_next_node();

        // Parameter
        parser.prepare_next_state("empty_parameter_list");
        const parameters = parser.generate_next_node();

        // Body
        parser.prepare_next_state("method_body");
        const body = parser.generate_next_node();

        node.keyword       = keyword;
        node.property_name = property_name;
        node.parameters    = parameters;
        node.body          = body;
        node.start         = keyword.start;
        node.end           = body.end;
    }
};
