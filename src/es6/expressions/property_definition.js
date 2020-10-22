/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : property_definition.js
* Created at  : 2019-09-05
* Updated at  : 2020-09-08
* Author      : jeefo
* Purpose     :
* Description :
* Reference   :
* -----------------------------------------------------------------------------
*
* Test case of PropertyDefinition
* order matter.
*
* 1. If current_token is Asterisk then it has to be GeneratorMethod
* 2. If next_token is '=' operator then it has to be CoverInitializedName
* 3. If next_token is one of ',' or '}' punctuater then it has to be
*    ReferenceIdentifier.
* 4.
*
* Otherwise it will be throw Exception.
*
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const {EXPRESSION}          = require("../enums/precedence_enum");
const {property_definition} = require("../enums/states_enum");
const {
    is_colon,
    is_assign,
    is_assign_token,
    is_asterisk_token,
    is_delimiter_token,
} = require("../../helpers");

const literal_property_names = ["Number", "String", "Identifier"];

const is_id_name = ({expression: {id}}) => id === "Identifier name";

module.exports = {
    id         : "Property definition",
    type       : "Expression",
    precedence : EXPRESSION,

    is         : (_, {current_state: s}) => s === property_definition,
    initialize : (node, token, parser) => {
        let expr;

        // Test case 1
        if (is_asterisk_token(token)) {
            parser.change_state("method_definition");
        } else {
            parser.change_state("property_name");
            const property_name = parser.generate_next_node();
            parser.set_prev_node(property_name);
            const next_token = parser.look_ahead(true);
            switch (next_token.id) {
                case "Delimiter" :
                    switch (next_token.value) {
                        case ':' :
                            parser.change_state("property_assignment");
                            break;
                        case ',' :
                        case '}' :
                            if (! is_id_name(property_name)) {
                                parser.prepare_next_node_definition();
                                parser.throw_unexpected_token();
                            }
                            expr = parser.refine(
                                "identifier_reference",
                                property_name.expression
                            );
                            break;
                        default: parser.change_state("method_definition");
                    }
                    break;
                case "Operator" :
                    parser.expect('=', next_token.value === '=');
                    parser.change_state("cover_initialized_name");
                    break;
                default: parser.change_state("method_definition");
            }
        }
        if (! expr) expr = parser.generate_next_node();

        node.expression = expr;
        node.start      = expr.start;
        node.end        = expr.end;

        parser.end(node);
    }
};
