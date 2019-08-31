/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : async_method.js
* Created at  : 2019-08-25
* Updated at  : 2019-08-26
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
const { ASYNC_METHOD }        = require("../enums/precedence_enum");
const { terminal_definition } = require("../../common");
const {
    function_body,
    parameters_definition,
    property_name_definition : property_name_def,
} = require("../../es6/common");
const { is_open_curly }  = require("../../helpers");
const is_specific_method = require("../../es6/helpers/is_specific_method");

module.exports = new AST_Node_Definition({
    id         : "Async method",
    type       : "Expression",
    precedence : ASYNC_METHOD,

    is         : is_specific_method("async"),
    initialize : (node, token, parser) => {
        const keyword = terminal_definition.generate_new_node(parser);

        // Property
        parser.prepare_next_state("expression", true);
        const property_name = property_name_def.generate_new_node(parser);

        // Parameter
        parser.prepare_next_state("delimiter", true);
        const parameters = parameters_definition.generate_new_node(parser);

        // Body
        parser.prepare_next_state("delimiter", true);
        parser.expect('{', is_open_curly);
        const body = function_body.generate_new_node(parser);

        node.keyword       = keyword;
        node.property_name = property_name;
        node.parameters    = parameters;
        node.body          = body;
        node.start         = keyword.start;
        node.end           = body.end;
    }
});
