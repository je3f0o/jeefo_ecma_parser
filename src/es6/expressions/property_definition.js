/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : property_definition.js
* Created at  : 2019-09-05
* Updated at  : 2019-09-16
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

const { EXPRESSION }          = require("../enums/precedence_enum");
const { property_definition } = require("../enums/states_enum");
const {
    is_assign_token,
    is_asterisk_token,
    is_delimiter_token,
} = require("../../helpers");

const is_possible_reference_id = (() => {
    const delimiters = [',', '}'];
    return token => {
        return token.id === "Delimiter" && delimiters.includes(token.value);
    };
})();

module.exports = {
    id         : "Property definition",
    type       : "Expression",
    precedence : EXPRESSION,

    is         : (token, { current_state : s }) => s === property_definition,
    initialize : (node, token, parser) => {
        let expression;
        if (is_asterisk_token(token)) {
            parser.change_state("method_definition");
            expression = parser.generate_next_node();
            parser.prepare_next_node_definition(true);
        } else {
            const next_token = parser.look_ahead(true);

            if (is_assign_token(next_token)) {
                parser.change_state("cover_initialized_name");
                expression = parser.generate_next_node();
            } else if (is_possible_reference_id(next_token)) {
                parser.change_state("identifier_reference");
                expression = parser.generate_next_node();
                parser.prepare_next_node_definition(true);
            } else {
                parser.change_state("property_name");
                const property_name = parser.generate_next_node();
                parser.prepare_next_node_definition(true);

                if (is_delimiter_token(parser.next_token, ':')) {
                    expression = parser.refine(
                        "property_assignment", property_name
                    );
                } else {
                    expression = parser.refine(
                        "method_definition", property_name
                    );
                    parser.prepare_next_node_definition(true);
                }
            }
        }

        node.expression = expression;
        node.start      = expression.start;
        node.end        = expression.end;
    }
};
