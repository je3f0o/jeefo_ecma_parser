/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : ast_node_table.js
* Created at  : 2019-05-27
* Updated at  : 2022-05-12
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

// TODO: refactor later
const defs = [
  // 11 - Lexical grammar
  // ====================

  // 11.6 - Names and Keywords
  require("./identifiers/keyword"),
  require("./identifiers/identifier"),
  require("./identifiers/reserved_word"),
  require("./identifiers/identifier_name"),
  require("./identifiers/future_reserved_word"),

  // 11.7 - Punctuators
  require("./terminals/punctuator"),

  // 12 - ECMAScript Language: Expressions
  // =====================================

  // 12.1 - Identifiers
  require("./expressions/label_identifier"),
  require("./expressions/binding_identifier"),
  require("./expressions/identifier_reference"),

  // 12.2.4 - Literals
  require("./literals/literal"),
  require("./literals/string_literal"),
  require("./literals/numeric_literal"),

  // 12.2.10 - The grouping operator
  require("./expressions/cover_parenthesized_expression_and_arrow_parameters"),

  // 12.3 - Left hand side expressions
  //"./expressions/new_expression",
  require("./expressions/new_expression_with_args"),
  require("./operators/member_operator"),

  require("./expressions/super_call"),
  require("./expressions/computed_super_property"),
  require("./expressions/function_call_expression"),

  //.....
  require("./expressions/binding_rest_element"),

  // 12.15 - Assigment expression
  require("./expressions/assignment_expression"),
  require("./operators/assignment_operator"),

  // 12.15.5 - Destructuring assignment
  // array
  require("./expressions/assignment_element"),
  require("./expressions/assignment_pattern"),
  require("./expressions/assignment_rest_element"),
  require("./expressions/array_assignment_pattern"),
  require("./expressions/destructuring_assignment_target"),
  // object
  require("./expressions/assignment_property"),
  require("./expressions/object_assignment_pattern"),
  require("./expressions/assignment_property_element"),
  require("./expressions/assignment_property_identifier"),

  // 13.3.3 - Destructuring binding patterns
  require("./expressions/binding_pattern"),
  require("./expressions/binding_element"),
  require("./expressions/binding_element_pattern"),
  require("./expressions/array_binding_pattern"),
  require("./expressions/object_binding_pattern"),

  // 13.4 - Function definitions
  require("./expressions/formal_parameter"),
  require("./expressions/formal_parameters"),

  require("./expressions/function_rest_parameter"),

  require("./expressions/arguments"),
  //"./statements/expression_statement",

  // 13.12 The switch statement
  require("./statements/case_block"),

  // 13.15 The try statement
  require("./statements/catch_parameter"),

  // 14.3 - Method definition
  require("./expressions/method_definition"),

  // 14.6 - Async function defenitions
  require("./expressions/async_method"),
  require("./expressions/async_method_body"),
  require("./expressions/async_concise_body"),
  require("./expressions/async_function_body"),
  require("./expressions/async_function_expression"),

  // 14.7 - Async arrow function definitions
  require("./expressions/async_arrow_function"),
  require("./expressions/async_arrow_function_body"),
  require("./expressions/async_arrow_binding_identifier"),
];

const keywords = [
  // 12.2 - Primary expressions
  {
    keyword    : "this",
    definition : require("./expressions/this_keyword"),
  },
  // 12.2.4 - Literals
  {
    keyword    : "null",
    definition : require("./literals/null_literal"),
  },
  // 12.3 - Left hand side expressions
  {
    keyword    : "super",
    definition : require("./expressions/super_property"),
  },
  // 12.3 - New expression
  {
    keyword    : "new",
    definition : require("./expressions/new_expression"),
  },
  // ...
  {
    keyword    : "async",
    definition : require("./declarations/async_function_declaration"),
  },
  {
    keyword    : "await",
    definition : require("./expressions/await_experession"),
  },
  // 13.12 The switch statement
  {
    keyword    : "case",
    definition : require("./statements/case_clause"),
  },
  {
    keyword    : "default",
    definition : require("./statements/default_clause"),
  },
  // 13.15 The try statement
  {
    keyword    : "try",
    definition : require("./statements/try"),
  },
  {
    keyword    : "catch",
    definition : require("./statements/catch"),
  },
  {
    keyword    : "finally",
    definition : require("./statements/finally"),
  },
];

const boolean_literal = require("./literals/boolean_literal");

module.exports = ast_node_table => {
  const initialize = (node, token, parser) => {
    const {name} = node.constructor;
    parser.throw_unexpected_token(`${name} cannot be initialized.`);
  };

  // Remove old existed expressions
  ast_node_table.remove_node_defs([
    { expression    : "Identifier"           } ,
    { expression    : "Delimiter"            } ,
    { expression    : "Binding identifier"   } ,
    { expression    : "Member expression"    } ,
    { expression    : "Identifier reference" } ,
    { expression    : "Method definition"    } ,

    { reserved_word : "null"                 } ,
    { reserved_word : "true"                 } ,
    { reserved_word : "false"                } ,
    { reserved_word : "new"                  } ,
    { expression    : "String literal"       } ,
    { expression    : "Numeric literal"      } ,
  ]);

  for (const def of defs) {
    if (!def.initialize) def.initialize = initialize;
    ast_node_table.register_node_definition(def);
  }

  for (const {keyword, definition} of keywords) {
    ast_node_table.register_reserved_word(keyword, definition);
  }

  // 12.2.4 - Literals
  ast_node_table.register_reserved_words(["true", "false"], boolean_literal);
};