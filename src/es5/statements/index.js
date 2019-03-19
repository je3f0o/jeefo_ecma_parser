/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : index.js
* Created at  : 2019-01-29
* Updated at  : 2019-03-18
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

module.exports = function register_statement_symbol_definitions (symbol_table) {
    symbol_table.register_symbol_definition(require("./block_statement"));
    symbol_table.register_symbol_definition(require("./labelled_statement"));
    symbol_table.register_symbol_definition(require("./expression_statement"));

    symbol_table.register_reserved_word("do"       , require("./do_while_statement"));
    symbol_table.register_reserved_word("var"      , require("./variable_declaration_list_statement")),
    symbol_table.register_reserved_word("for"      , require("./for_statement"));
    symbol_table.register_reserved_word("with"     , require("./with_statement"));
    symbol_table.register_reserved_word("while"    , require("./while_statement"));
    symbol_table.register_reserved_word("throw"    , require("./throw_statement"));
    symbol_table.register_reserved_word("break"    , require("./break_statement"));
    symbol_table.register_reserved_word("return"   , require("./return_statement"));
    symbol_table.register_reserved_word("continue" , require("./continue_statement"));
    symbol_table.register_reserved_word("debugger" , require("./debugger_statement"));

    require("./if_statement")(symbol_table);
    require("./try_statement")(symbol_table);
    require("./switch_statement")(symbol_table);
};
