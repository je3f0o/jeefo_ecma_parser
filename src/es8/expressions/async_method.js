/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : async_method.js
* Created at  : 2019-08-25
* Updated at  : 2019-09-02
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

const { ASYNC_METHOD }       = require("../enums/precedence_enum");
const { is_specific_method } = require("../../es5/helpers");

module.exports = {
    id         : "Async method",
    type       : "Expression",
    precedence : ASYNC_METHOD,

    is         : is_specific_method("async"),
    initialize : (node, token, parser) => {
        parser.change_state("async_state");
        const keyword = parser.generate_next_node();

        // Property
        parser.change_state("property_name", true);
        const property_name = parser.generate_next_node();

        // Parameter
        parser.prepare_next_state("formal_parameter_list", true);
        const parameters = parser.generate_next_node();

        // Body
        parser.prepare_next_state("function_body", true);
        const body = parser.generate_next_node();

        node.keyword       = keyword;
        node.property_name = property_name;
        node.parameters    = parameters;
        node.body          = body;
        node.start         = keyword.start;
        node.end           = body.end;
    }
};
