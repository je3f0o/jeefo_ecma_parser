/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : for_header.js
* Created at  : 2019-08-29
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

const { EXPRESSION } = require("../enums/precedence_enum");
const { for_header } = require("../enums/states_enum");
const {
    is_terminator,
    is_identifier_token,
} = require("../../helpers");

const report_multiple_declaration_error = (parser, list) => {
    parser.throw_unexpected_token(`Invalid left-hand side in for-${
        parser.next_token.value
    } loop: Must have a single binding.`, {
        start : list[0].start,
        end   : list[list.length - 1].end
    });
};

module.exports = {
    id         : "For header",
    type       : "Expression",
    precedence : EXPRESSION,
    is         : (_, { current_state : s }) => s === for_header,

    initialize : (node) => {
        console.log(node.id);
        process.exit();
    },

    parse (parser) {
        if (is_terminator(parser)) {
            parser.change_state("for_iterator_initializer");
            const initializer = parser.generate_next_node();
            return parser.refine("for_iterator_header", initializer);
        }

        parser.context_stack.push("for_header");
        parser.change_state("statement");

        let result, list, header_name, output, has_declaration;
        switch (parser.next_node_definition.id) {
            case "Lexical declaration" :
                output = parser.generate_next_node();
                list = output.binding_list;
                has_declaration = true;
                break;
            case "Variable statement" :
                output = parser.generate_next_node();
                list = output.declaration_list;
                has_declaration = true;
                break;
            case "Expression statement" :
                parser.change_state("expression_expression");
                output = parser.generate_next_node();
                list = output.list;
                break;
            default:
                parser.throw_unexpected_token();
        }

        if (output.terminator) {
            header_name = "for_iterator_header";
        } else if (! parser.next_token) {
            parser.prepare_next_state("expression", true);
        }

        const { next_token } = parser;
        if (is_identifier_token(next_token)) {
            switch (next_token.value) {
                case "in" :
                case "of" :
                    if (list.length > 1) {
                        if (has_declaration) {
                            report_multiple_declaration_error(parser, list);
                        } else {
                            parser.throw_unexpected_token(
                                "Invalid left-hand side in for-loop",
                                output
                            );
                        }
                    }
                    header_name = `for_${ next_token.value }_header`;
                    break;
                default:
                    parser.throw_unexpected_token();
            }
        } else {
            header_name = "for_iterator_header";
            if (has_declaration) {
                if (! output.terminator) {
                    parser.throw_unexpected_token();
                }
            } else {
                output = parser.refine("for_iterator_initializer", output);
            }
        }

        result = parser.refine(header_name, output);
        parser.context_stack.pop();

        return result;
    }
};
