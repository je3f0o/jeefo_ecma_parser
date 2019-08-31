/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : for_statement.js
* Created at  : 2017-08-17
* Updated at  : 2019-08-28
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/5.1/#sec-12.6.3
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const { AST_Node_Definition }    = require("@jeefo/parser");
const { statement }              = require("../enums/states_enum");
const { terminal_definition }    = require("../../common");
const { STATEMENT, TERMINATION } = require("../enums/precedence_enum");

const {
    get_right_value,
    get_last_non_comment_node,
    get_variable_declaration_list
} = require("../helpers");

// Expression no in
const expression_no_in = new AST_Node_Definition({
    id         : "Expression no in",
    type       : "Expression",
    precedence : -1,

    is         : () => {},
    initialize : (node, current_token, parser) => {
        let expression = null;

        if (parser.prev_node && parser.prev_node.first_node) {
            const first_node = parser.prev_node.first_node;
            parser.terminate(first_node);

            parser.prev_node      = first_node;
            parser.previous_nodes = [first_node];
            parser.is_terminated  = false;
            parser.prepare_next_node_definition();
            parser.change_state("expression_no_in");

            expression = parser.parse_next_node(TERMINATION);
            if (expression.id === "Comment") {
                expression = get_last_non_comment_node(parser, true);
            }
        }

        parser.expect(';', parser => parser.next_token.value === ';');
        const terminator = parser.generate_next_node();

        node.expression = expression;
        node.terminator = terminator;
        node.start      = expression ? expression.start : terminator.start;
        node.end        = terminator.end;
    }
});

// Variable declaration list no in
const variable_declaration_list_no_in = new AST_Node_Definition({
    id         : "Variable declaration list no in",
    type       : "Declaration",
    precedence : -1,

    is         : () => {},
    initialize : (node, current_token, parser) => {
        const var_token = parser.prev_node.var_token;

        parser.terminate(var_token);
        parser.is_terminated = false;
        parser.prepare_next_node_definition();
        parser.change_state("expression_no_in");
        const list = get_variable_declaration_list(parser, false);

        parser.expect(';', parser => parser.next_token.value === ';');
        const terminator = parser.generate_next_node();

        node.keyword    = var_token;
        node.list       = list;
        node.terminator = terminator;
        node.start      = var_token.start;
        node.end        = terminator.end;
    }
});

// For expression's condition
const for_expression_condition = new AST_Node_Definition({
    id         : "For expression's condition",
    type       : "Expression",
    precedence : -1,

    is         : () => {},
    initialize : (node, current_token, parser) => {
        parser.prepare_next_state("expression", true);
        let expression = parser.parse_next_node(TERMINATION);
        if (expression !== null && expression.id === "Comment") {
            expression = get_last_non_comment_node(parser);
        }

        parser.expect(';', parser => parser.next_token.value === ';');
        const terminator = parser.generate_next_node();

        node.expression = expression;
        node.terminator = terminator;
        node.start      = expression ? expression.start : terminator.start;
        node.end        = terminator.end;
    }
});

// For expression no in
const for_expression_no_in = new AST_Node_Definition({
    id         : "For expression no in",
    type       : "Expression",
    precedence : -1,

    is         : () => {},
    initialize : (node, current_token, parser) => {
        // init
        let init = null;
        if (parser.prev_node && parser.prev_node.var_token) {
            init = variable_declaration_list_no_in.generate_new_node(parser);
        } else {
            init = expression_no_in.generate_new_node(parser);
        }

        // condition
        const condition = for_expression_condition.generate_new_node(parser);

        // update
        let update = null;
        parser.prepare_next_state("expression", true);
        if (parser.next_token.value !== ')') {
            parser.post_comment = null;
            update = get_right_value(parser, TERMINATION);
            parser.prev_node = parser.post_comment;
        }

        node.initializer = init;
        node.condition   = condition;
        node.update      = update;
        node.start       = init.start;
        node.end         = update ? update.end : condition.end;
    }
});

// For in expression
const for_in_expression = new AST_Node_Definition({
    id         : "For in expression",
    type       : "Expression",
    precedence : -1,

    is         : () => {},
    initialize : (node, current_token, parser) => {
        const { operator, identifier } = parser.prev_node;

        parser.prepare_next_state("expression", true);
        parser.post_comment = null;
        const init = get_right_value(parser, TERMINATION);
        parser.prev_node = parser.post_comment;

        node.identifier  = identifier;
        node.in_operator = operator;
        node.initializer = init;
        node.start       = identifier.start;
        node.end         = init.end;
    }
});

// For in variable declaration
const for_in_variable_declaration = new AST_Node_Definition({
    id         : "For in variable declaration",
    type       : "Declaration",
    precedence : -1,

    is         : () => {},
    initialize : (node, current_token, parser) => {
        const { keyword, operator, identifier } = parser.prev_node;

        parser.prepare_next_state("expression", true);
        parser.post_comment = null;
        const init = get_right_value(parser, TERMINATION);
        parser.prev_node = parser.post_comment;

        node.keyword     = keyword;
        node.identifier  = identifier;
        node.in_operator = operator;
        node.initializer = init;
        node.start       = keyword.start;
        node.end         = init.end;
    }
});

function get_for_expression (parser) {
    parser.prepare_next_state("expression", true);
    const var_token = parser.next_token.value === "var"
        ? terminal_definition.generate_new_node(parser)
        : null;

    if (var_token) {
        parser.prepare_next_state("expression", true);
    }

    if (parser.next_token.value !== ';' && parser.next_node_definition) {
        if (parser.next_token.value === ')') {
            parser.throw_unexpected_token("Missing expression");
        }
        const first_node = parser.generate_next_node();

        parser.prepare_next_state("expression", true);

        if (parser.next_token.value === "in") {
            if (first_node.id !== "Identifier") {
                parser.throw_unexpected_token("Invalid left-hand side in for-loop");
            }

            parser.prev_node = {
                keyword    : var_token,
                operator   : terminal_definition.generate_new_node(parser),
                identifier : first_node,
            };

            // For in variable declaration
            if (var_token) {
                return for_in_variable_declaration.generate_new_node(parser);
            }

            return for_in_expression.generate_new_node(parser);
        }

        parser.prev_node = { first_node, var_token };
    }

    return for_expression_no_in.generate_new_node(parser);
}

module.exports = {
    id         : "For statement",
    type       : "Statement",
	precedence : STATEMENT,

	is         : (token, parser) => parser.current_state === statement,
    initialize : (node, current_token, parser) => {
        const keyword = terminal_definition.generate_new_node(parser);

        parser.prepare_next_state("delimiter", true);
        parser.expect('(', parser => parser.next_token.value === '(');
        const open_parenthesis = parser.generate_next_node();

        const expression = get_for_expression(parser);

        parser.expect(')', parser => parser.next_token.value === ')');
        const close_parenthesis = parser.generate_next_node();

        parser.prepare_next_state(null, true);
        const statement = parser.parse_next_node(TERMINATION);

        node.keyword           = keyword;
        node.open_parenthesis  = open_parenthesis;
        node.expression        = expression;
        node.close_parenthesis = close_parenthesis;
        node.statement         = statement;
        node.start             = keyword.start;
        node.end               = statement.end;
    }
};
