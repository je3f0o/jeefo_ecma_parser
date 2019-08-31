/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : for_statement.js
* Created at  : 2019-08-23
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

const { AST_Node_Definition }    = require("@jeefo/parser");
const { statement : stmt_state } = require("../enums/states_enum");
const { STATEMENT, TERMINATION } = require("../enums/precedence_enum");
const {
    is_terminator,
    is_open_parenthesis,
    is_close_parenthesis,
} = require("../../helpers");
const parse_binding           = require("../helpers/parse_binding");
const { terminal_definition } = require("../../common");

const has_terminal = (() => {
    const terminal_words = ["var", "let", "const"];

    return token => {
        if (token.id === "Identifier") {
            return terminal_words.includes(token.value);
        }
    };
})();

const for_declaration = new AST_Node_Definition({
    id         : "For declaration",
    type       : "Declaration",
    precedence : -1,

    is         : () => {},
    initialize : (node, token, parser) => {
        const { keyword, binding } = parser.prev_node;

        node.keyword = keyword;
        node.binding = binding;
        node.start   = keyword.start;
        node.end     = binding.end;
    }
});

const in_or_of_initializer = (node, token, parser) => {
    let { open, keyword, binding } = parser.prev_node;

    if (keyword) {
        binding = for_declaration.generate_new_node(parser);
    }
    keyword = terminal_definition.generate_new_node(parser);

    parser.prepare_next_state("expression", true);
    const expression = parser.parse_next_node(TERMINATION);

    parser.expect(')', is_close_parenthesis);
    const close = terminal_definition.generate_new_node(parser);

    node.open_parenthesis  = open;
    node.binding           = binding;
    node.keyword           = keyword;
    node.expression        = expression;
    node.close_parenthesis = close;
    node.start             = open.start;
    node.end               = close.start;
};

const for_in_expression = new AST_Node_Definition({
    id         : "For in expression",
    type       : "Expression",
    precedence : -1,

    is         : () => {},
    initialize : in_or_of_initializer
});

const for_of_expression = new AST_Node_Definition({
    id         : "For of expression",
    type       : "Expression",
    precedence : -1,

    is         : () => {},
    initialize : in_or_of_initializer
});

const for_initializer = new AST_Node_Definition({
    id         : "For initializer",
    type       : "Expression",
    precedence : -1,

    is         : () => {},
    initialize : (node, token, parser) => {
        parser.prev_node = parser.prev_node.binding;

        let expression = null, terminator;
        if (! is_terminator(parser)) {
            expression = parser.parse_next_node(TERMINATION);
        }

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

const for_condition = new AST_Node_Definition({
    id         : "For condition",
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

const for_expression = new AST_Node_Definition({
    id         : "For expression",
    type       : "Expression",
    precedence : -1,

    is         : () => {},
    initialize : (node, token, parser) => {
        const { open, keyword } = parser.prev_node;

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

        node.open_parenthesis  = open;
        node.initializer       = initializer;
        node.condition         = condition;
        node.update            = update;
        node.close_parenthesis = close;
        node.start             = open.start;
        node.end               = close.start;
    }
});

const parse_for_expression = parser => {
    parser.prepare_next_state("delimiter", true);
    parser.expect('(', is_open_parenthesis);
    const prev_node = {
        open    : terminal_definition.generate_new_node(parser),
        keyword : null,
        binding : null,
    };

    parser.prepare_next_state(null, true);
    if (is_terminator(parser)) {
        parser.prev_node = prev_node;
        return for_expression.generate_new_node(parser);
    } else if (has_terminal(parser.next_token)) {
        prev_node.keyword = parser.generate_next_node();
    }

    parser.change_state("expression_no_in");
    prev_node.binding = parse_binding(parser);
    parser.prepare_next_node_definition(true);

    parser.prev_node = prev_node;
    if (parser.next_token.id === "Identifier") {
        switch (parser.next_token.value) {
            case "in" :
                return for_in_expression.generate_new_node(parser);
            case "of" :
                return for_of_expression.generate_new_node(parser);
        }
    }

    if (! prev_node.keyword) {
        parser.previous_nodes.push(prev_node);
        parser.change_state("expression_no_in");
    }
    return for_expression.generate_new_node(parser);
};

module.exports = {
    id         : "For statement",
    type       : "Statement",
    precedence : STATEMENT,

    is         : (_, parser) => parser.current_state === stmt_state,
    initialize : (node, token, parser) => {
        const keyword = terminal_definition.generate_new_node(parser);

        parser.prepare_next_state("delimiter", true);
        parser.expect('(', is_open_parenthesis);
        const open = terminal_definition.generate_new_node(parser);

        parser.prepare_next_state("for_expression_controller", true);
        const expression = parser.parse_next_node(TERMINATION);

        parser.expect(')', is_close_parenthesis);
        const close = terminal_definition.generate_new_node(parser);

        parser.prepare_next_state(null, true);
        const statement = parser.parse_next_node(TERMINATION);

        node.keyword           = keyword;
        node.open_parenthesis  = open;
        node.expression        = expression;
        node.close_parenthesis = close;
        node.statement         = statement;
        node.start             = keyword.start;
        node.end               = statement.end;
    }
};
