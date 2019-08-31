/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : getter_method.js
* Created at  : 2019-08-25
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

const { GETTER_METHOD }       = require("../enums/precedence_enum");
const { is_open_curly }       = require("../../helpers");
const is_specific_method      = require("../helpers/is_specific_method");
const { empty_parameters }    = require("../common");
const { terminal_definition } = require("../../common");

module.exports = {
    id         : "Getter method",
    type       : "Expression",
    precedence : GETTER_METHOD,

    is         : is_specific_method("get"),
    initialize : (node, token, parser) => {
        const keyword = terminal_definition.generate_new_node(parser);

        // Property
        parser.prepare_next_state("expression", true);
        const property_name = property_name_def.generate_new_node(parser);

        // Parameter
        parser.prepare_next_state("delimiter", true);
        const parameters = empty_parameters.generate_new_node(parser);

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
};
