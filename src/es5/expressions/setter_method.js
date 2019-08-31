/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : setter_method.js
* Created at  : 2019-08-25
* Updated at  : 2019-08-29
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

const { SETTER_METHOD }       = require("../enums/precedence_enum");
const { is_specific_method }  = require("../helpers");
const { terminal_definition } = require("../../common");
const {
    property_set_parameter_list : property_set_parameter
} = require("../common");
const {
    is_open_curly,
    get_last_non_comment_node,
} = require("../../helpers");

module.exports = {
    id         : "Setter method",
    type       : "Expression",
    precedence : SETTER_METHOD,

    is         : is_specific_method("set"),
    initialize : (node, token, parser) => {
        parser.prev_node = get_last_non_comment_node(parser);
        const keyword = terminal_definition.generate_new_node(parser);

        // Property
        parser.change_state("property_name", true);
        const property_name = parser.generate_next_node();

        // Parameter
        parser.prepare_next_state("delimiter", true);
        const parameters = property_set_parameter.generate_new_node(parser);

        // Body
        parser.prepare_next_state("function_body", true);
        parser.expect('{', is_open_curly);
        const body = parser.generate_next_node();

        node.keyword       = keyword;
        node.property_name = property_name;
        node.parameters    = parameters;
        node.body          = body;
        node.start         = keyword.start;
        node.end           = body.end;
    }
};
