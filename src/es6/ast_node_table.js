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

const expressions  = require("./expressions");
const declarations = require("./declarations");

const defs = [
  // 12.2.5 - Array literal
  require("./literals/array_literal"),
  // 12.2.6 - Object literal
  require("./literals/object_literal"),
  // 12.2.9 - Template literal
  require("./literals/template_literal"),

  require("./expressions/method"),
  require("./expressions/method_body"),
  require("./expressions/property_definition"),
  require("./expressions/property_assignment"),
  require("./expressions/empty_parameter_list"),
  require("./expressions/cover_initialized_name"),
  require("./expressions/computed_member_access"),

  require("./part/property_name"),
  require("./part/identifier_reference"),

  require("./expressions/generator_body"),
  require("./expressions/function_expression"),

  require("./expressions/binding_identifier"),

  // Class
  require("./common/class_tail"),
  require("./common/class_body"),
  require("./expressions/static_method"),

  require("./expressions/initializer"),

  // Statements
  // Variable declarations
  require("./declarations/variable_declaration"),

  // Lexical declarations
  require("./expressions/binding_property"),
  require("./expressions/single_name_binding"),
  require("./expressions/binding_property_element"),
  require("./declarations/binding_list"),
  require("./declarations/lexical_binding"),

  // For statement
  require("./statements/for_binding"),
  require("./statements/for_declaration"),
  require("./statements/for_of_statement"),
  require("./statements/for_in_statement"),
  require("./statements/for_variable_declaration"),
  require("./statements/for_statement"),

  // 14 - Functions
  require("./expressions/concise_body"),
  require("./expressions/spread_element"),
  require("./expressions/arrow_parameters"),
  require("./expressions/arrow_function_body"),
  require("./expressions/arrow_formal_parameters"),
];

const keywords = [
  {
    keyword    : "of",
    definition : require("./statements/for_of_operator"),
  },
  {
    keyword    : "var",
    definition : require("./statements/variable_statement"),
  },
  {
    keywords   : ["let", "const"],
    definition : require("./declarations/lexical_declaration"),
  },
  {
    keyword    : "extends",
    definition : require("./common/class_heritage"),
  },
  {
    keyword    : "for",
    definition : require("./statements/for_header"),
  }
];

module.exports = ast_node_table => {
  ast_node_table.remove_node_defs([
    { expression    : "Property name",            } ,
    { expression    : "Array literal" },
    { expression    : "Object literal",           } ,
    { expression    : "Property control",         } ,
    { expression    : "Grouping expression",      } ,
    { expression    : "Formal parameter list",    } ,
    { expression    : "Function call expression", } ,
    { expression    : "Function expression", } ,
    //{ expression    : "For statement", } ,
    { reserved_word : "var"                       } ,
    { reserved_word : "let"                       } ,
    { reserved_word : "for"                       } ,
    { reserved_word : "new",                      } ,
    { reserved_word : "yield",                    } ,
    { reserved_word : "const"                     } ,
    { reserved_word : "super"                     } ,
    { reserved_word : "class"                     } ,
    { reserved_word : "static"                    } ,
    { reserved_word : "extends",                  } ,
    { reserved_word : "function"                  } ,
  ]);

  // Register declarations
  declarations(ast_node_table);

  // Register expressions
  expressions(ast_node_table);

  // TODO: refactor later
  for (const def of defs) {
    ast_node_table.register_node_definition(def);
  }

  for (const o of keywords) {
    if (o.keyword) {
      ast_node_table.register_reserved_word(o.keyword, o.definition);
    } else {
      ast_node_table.register_reserved_words(o.keywords, o.definition);
    }
  }
};