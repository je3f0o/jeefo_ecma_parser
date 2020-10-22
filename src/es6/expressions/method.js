/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : method.js
* Created at  : 2019-09-07
* Updated at  : 2020-09-07
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

const {method}                    = require("../enums/states_enum");
const {EXPRESSION}                = require("../enums/precedence_enum");
const {get_last_non_comment_node} = require("../../helpers");

module.exports = {
    id         : "Method",
    type       : "Expression",
    precedence : EXPRESSION,

    is         : (_, {current_state: s}) => s === method,
    initialize : (node, token, parser) => {
        const property_name = get_last_non_comment_node(parser, true);
        parser.expect("PropertyName", property_name.id === "Property name");

        parser.prepare_next_state("formal_parameters", true);
        const parameters = parser.generate_next_node();

        parser.prepare_next_state("method_body", true);
        const body = parser.generate_next_node();

        node.property_name = property_name;
        node.parameters    = parameters;
        node.body          = body;
        node.start         = property_name.start;
        node.end           = body.end;
    },
};
