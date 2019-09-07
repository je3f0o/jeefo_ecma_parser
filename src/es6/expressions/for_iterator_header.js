/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : for_iterator_header.js
* Created at  : 2019-08-30
* Updated at  : 2019-09-08
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

const { EXPRESSION }           = require("../enums/precedence_enum");
const { for_iterator_header }  = require("../enums/states_enum");
const { is_close_parenthesis } = require("../../helpers");

module.exports = {
    id         : "For iterator header",
    type       : "Expression",
    precedence : EXPRESSION,

    is         : (_, { current_state : s }) => s === for_iterator_header,
    initialize : (node) => {
        console.log(node.id);
        process.exit();
    },

    refine : (node, initializer, parser) => {
        switch (initializer.id) {
            case "Lexical declaration"      :
            case "For iterator initializer" :
                break;
            case "Variable statement" :
                initializer = parser.refine(
                    "variable_declaration_list_no_in",
                    initializer
                );
                break;
            default:
                parser.throw_unexpected_refine(node, initializer);
        }

        let update = null;
        parser.prepare_next_state("for_iterator_condition", true);
        const condition = parser.generate_next_node();

        parser.prepare_next_state("expression_expression", true);
        if (! is_close_parenthesis(parser)) {
            update = parser.generate_next_node();
        }

        node.initializer = initializer;
        node.condition   = condition;
        node.update      = update;
        node.start       = initializer.start;
        node.end         = (update || condition).end;
    }
};
