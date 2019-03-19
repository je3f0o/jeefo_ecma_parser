/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : for_statement.js
* Created at  : 2017-08-17
* Updated at  : 2019-03-19
* Author      : jeefo
* Purpose     :
* Description :
* Reference   : https://www.ecma-international.org/ecma-262/5.1/#sec-12.6.3
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const SymbolDefinition              = require("@jeefo/parser/src/symbol_definition"),
      states_enum                   = require("../enums/states_enum"),
      precedence_enum               = require("../enums/precedence_enum"),
      operator_definition           = require("../common/operator_definition"),
      get_pre_comment               = require("../helpers/get_pre_comment"),
      get_right_value               = require("../helpers/get_right_value"),
      get_start_position            = require("../helpers/get_start_position"),
      get_last_non_comment_symbol   = require("../helpers/get_last_non_comment_symbol"),
      get_variable_declaration_list = require("../helpers/get_variable_declaration_list");

// {{{1 for_expression_initialize_factory() helper function
function __for_expression_initialize (symbol, parser) {
    let expression = null, post_comment = null, start;

    if (parser.next_token.value !== ';') {
        parser.post_comment = null;
        expression = parser.get_next_symbol(precedence_enum.TERMINATION);

        if (expression.id === "Comment") {
            expression = get_last_non_comment_symbol(parser, true);
            post_comment = parser.current_symbol;
        } else if (parser.post_comment) {
            post_comment = parser.post_comment;
        }
    } else if (parser.current_symbol !== null) {
        if (parser.current_symbol.id === "Comment") {
            post_comment = parser.current_symbol;
            if (parser.previous_symbols.length === 2) {
                expression = parser.previous_symbols[0];
            }
        } else {
            expression = parser.current_symbol;
        }
    }

    if (expression) {
        start = expression.start;
    } else if (post_comment !== null) {
        start = post_comment.start;
    } else {
        start = parser.next_token.start;
    }

    parser.expect(';', parser => parser.next_token.value === ';');

    symbol.expression   = expression;
    symbol.post_comment = post_comment;
    symbol.start        = start;
    symbol.end          = parser.next_token.end;
}

function for_expression_initialize_factory (prepare) {
    return (symbol, current_token, parser) => {
        prepare(parser);
        __for_expression_initialize(symbol, parser);
    };
}

// {{{1 Expression no in
const expression_no_in = new SymbolDefinition({
    id         : "Expression no in",
    type       : "Expression",
    precedence : -1,

    is         : () => {},
    initialize : for_expression_initialize_factory(parser => {
        parser.change_state("expression_no_in");
    })
});

// {{{1 get_variable_declaration_list_no_in(parser, pre_comment, var_token)
const variable_declaration_list_no_in = new SymbolDefinition({
    id         : "Variable declaration list no in",
    type       : "Declaration",
    precedence : -1,

    is         : () => {},
    initialize : () => {}
});

function get_variable_declaration_list_no_in (parser, pre_comment, var_token) {
    let list = [];
    const symbol = variable_declaration_list_no_in.generate_new_symbol(parser);

    if (parser.next_token.value !== ';') {
        parser.change_state("expression_no_in");
        list = get_variable_declaration_list(parser, false);
    }
    parser.expect(';', parser => parser.next_token.value === ';');

    symbol.pre_comment_of_var = pre_comment;
    symbol.token              = var_token;
    symbol.list               = list;
    symbol.start              = var_token.start;
    symbol.end                = parser.next_token.end;

    return symbol;
}

// {{{1 for_expression_condition definition
const for_expression_condition = new SymbolDefinition({
    id         : "For expression's condition",
    type       : "Expression",
    precedence : -1,

    is         : () => {},
    initialize : for_expression_initialize_factory(parser => {
        parser.prepare_next_state("expression", true);
    })
});

// {{{1 get_for_expression_no_in(parser, var_token)
const for_expression_no_in = new SymbolDefinition({
    id         : "For expression no in",
    type       : "Expression",
    precedence : -1,

    is         : () => {},
    initialize : () => {}
});

function get_for_expression_no_in (parser, open_parenthesis, pre_comment, var_token) {
    const symbol = for_expression_no_in.generate_new_symbol(parser);

    // init
    let init = null;
    if (var_token) {
        init = get_variable_declaration_list_no_in(parser, pre_comment, var_token);
    } else {
        init = expression_no_in.generate_new_symbol(parser);
    }

    // condition
    const condition = for_expression_condition.generate_new_symbol(parser);

    // update
    let update = null;
    parser.prepare_next_state("expression", true);
    if (parser.next_token.value !== ')') {
        parser.post_comment = null;
        update = get_right_value(parser, precedence_enum.TERMINATION);
        parser.current_symbol = parser.post_comment;
    }

    // close
    parser.expect(')', parser => parser.next_token.value === ')');
    const close_parenthesis = parser.next_symbol_definition.generate_new_symbol(parser);

    symbol.open_parenthesis  = open_parenthesis;
    symbol.initializer       = init;
    symbol.condition         = condition;
    symbol.update            = update;
    symbol.close_parenthesis = close_parenthesis;
    symbol.start             = open_parenthesis.start;
    symbol.end               = close_parenthesis.end;

    return symbol;
}

// {{{1 get_for_in_expression(parser, var_token, identifier)
const for_in_expression = new SymbolDefinition({
    id         : "For in expression",
    type       : "Expression",
    precedence : -1,

    is         : () => {},
    initialize : () => {}
});

const for_in_variable_declaration = new SymbolDefinition({
    id         : "For in variable declaration",
    type       : "Declaration",
    precedence : -1,

    is         : () => {},
    initialize : () => {}
});

function get_for_in_expression (parser, open_parenthesis, pre_comment, var_token, identifier) {
    let symbol;

    if (var_token) {
        // For in variable declaration
        symbol = for_in_variable_declaration.generate_new_symbol(parser);

        const operator = operator_definition.generate_new_symbol(parser);

        parser.prepare_next_state("expression", true);
        parser.post_comment = null;
        const init = get_right_value(parser, symbol.precedence);

        symbol.open_parenthesis   = open_parenthesis;
        symbol.pre_comment_of_var = pre_comment;
        symbol.token              = var_token;
        symbol.identifier         = identifier;
        symbol.operator           = operator;
        symbol.initializer        = init;
        symbol.pre_comment        = pre_comment;
    } else {
        // For in expression
        symbol = for_in_expression.generate_new_symbol(parser);

        const operator = operator_definition.generate_new_symbol(parser);
        parser.prepare_next_state("expression", true);

        parser.post_comment = null;
        const init = get_right_value(parser, symbol.precedence);
        parser.current_symbol = parser.post_comment;

        symbol.open_parenthesis = open_parenthesis;
        symbol.identifier       = identifier;
        symbol.operator         = operator;
        symbol.initializer      = init;
    }

    parser.expect(')', parser => parser.next_token.value === ')');
    parser.current_symbol = parser.post_comment;
    const close_parenthesis = parser.next_symbol_definition.generate_new_symbol(parser);

    symbol.close_parenthesis = close_parenthesis;
    symbol.start             = open_parenthesis.start;
    symbol.end               = close_parenthesis.end;

    return symbol;
}
// }}}1

function get_for_expression (parser) {
    const open_parenthesis = parser.next_symbol_definition.generate_new_symbol(parser);
    parser.post_comment = null;
    parser.prepare_next_state("expression", true);

    const pre_comment = get_pre_comment(parser);

    const var_token = parser.next_token.value === "var" ? parser.next_token : null;

    if (var_token) {
        parser.prepare_next_state("expression", true);
    }

    if (parser.next_token.value !== ';' && parser.next_symbol_definition !== null) {
        if (parser.next_token.value === ')') {
            parser.throw_unexpected_token("Missing expression");
        }
        const first_symbol_token = parser.next_token;
        const first_symbol = parser.next_symbol_definition.generate_new_symbol(parser);
        parser.prepare_next_state("expression", true);

        if (parser.next_token.value === "in") {
            const next_token  = parser.next_token;
            parser.next_token = first_symbol_token;
            parser.expect("identifier", () => first_symbol.id === "Identifier");
            parser.next_token = next_token;

            return get_for_in_expression(parser, open_parenthesis, pre_comment, var_token, first_symbol);
        }

        parser.previous_symbols = [first_symbol];
        if (parser.current_symbol) {
            parser.previous_symbols.push(parser.current_symbol);
        } else {
            parser.current_symbol = first_symbol;
        }
    }

    return get_for_expression_no_in(parser, open_parenthesis, pre_comment, var_token);
}

module.exports = {
    id         : "For statement",
    type       : "Statement",
	precedence : 31,

    is         : (token, parser) => parser.current_state === states_enum.statement,
    initialize : (symbol, current_token, parser) => {
        const pre_comment = get_pre_comment(parser);

        parser.prepare_next_state(null, true);
        parser.expect('(', parser => parser.next_token.value === '(');
        const expression = get_for_expression(parser);

        parser.prepare_next_state(null, true);
        const statement = parser.get_next_symbol(precedence_enum.TERMINATION);

        symbol.pre_comment = pre_comment;
        symbol.token       = current_token;
        symbol.expression  = expression;
        symbol.statement   = statement;
        symbol.start       = get_start_position(pre_comment, current_token);
        symbol.end         = statement.end;
    }
};
