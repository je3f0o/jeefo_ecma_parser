/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : for_expression.js
* Created at  : 2019-08-29
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

const { AST_Node_Definition }     = require("@jeefo/parser");
const { is_terminator }           = require("../../helpers");
const { for_expression }          = require("../enums/states_enum");
const { terminal_definition }     = require("../../common");
const { EXPRESSION, TERMINATION } = require("../enums/precedence_enum");

const has_terminal = (() => {
    const terminal_words = ["var", "let", "const"];

    return token => {
        if (token.id === "Identifier") {
            return terminal_words.includes(token.value);
        }
    };
})();

const for_condition = new AST_Node_Definition({
    id         : "For iterator condition",
    type       : "Expression",
    precedence : -1,

    is         : () => {},
    initialize : (node, token, parser) => {
        const expression = parser.parse_next_node(TERMINATION);

        let terminator;
        if (is_terminator(parser)) {
            terminator = terminal_definition.generate_new_node(parser);
        } else if (! parser.next_token) {
            parser.throw_unexpected_end_of_stream();
        } else {
            parser.throw_unexpected_token();
        }

        node.expression = expression;
        node.terminator = terminator;
        node.start      = (expression || terminator).start;
        node.end        = terminator.end;
    }
});

module.exports = {
    id         : "For iterator expression",
    type       : "Expression",
    precedence : EXPRESSION,

    is         : (_, parser) => parser.current_state === for_expression,
    initialize : (node, token, parser) => {
        let initializer;

        if (is_terminator(parser)) {
            initializer = terminal_definition.generate_new_node(parser);
        } else if (has_terminal(parser.next_token)) {
            //prev_node.keyword = parser.generate_next_node();
        }

        /*
        if (keyword) {
            parser.change_state("lexical_declaration");
            initializer = parser.generate_next_node();
        } else {
            initializer = for_initializer.generate_new_node(parser);
        }
        */

        parser.prepare_next_state("expression", true);
        const condition = for_condition.generate_new_node(parser);

        parser.prepare_next_state("expression", true);
        const update = parser.parse_next_node(TERMINATION);

        node.initializer = initializer;
        node.condition   = condition;
        node.update      = update;
        node.start       = initializer.start;
        node.end         = (update || condition).end;
        /*
        let initializer;
        if (keyword) {
            parser.change_state("lexical_declaration");
            initializer = parser.generate_next_node();
        } else {
            initializer = for_initializer.generate_new_node(parser);
        }

        parser.prepare_next_state("expression", true);
        const condition = for_condition.generate_new_node(parser);

        parser.prepare_next_state("expression", true);
        const update = parser.parse_next_node(TERMINATION);

        parser.expect(')', is_close_parenthesis);
        const close = terminal_definition.generate_new_node(parser);

        */
    }
};
