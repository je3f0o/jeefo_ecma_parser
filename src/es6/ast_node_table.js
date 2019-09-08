/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : ast_node_table.js
* Created at  : 2019-05-27
* Updated at  : 2019-09-09
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

module.exports = ast_node_table => {
    ast_node_table.remove_node_defs([
        { expression    : "Property name",            } ,
        { expression    : "Array literal" },
        { expression    : "Object literal",           } ,
        { expression    : "Property control",         } ,
        { expression    : "Grouping expression",      } ,
        { expression    : "Expression statement"      } ,
        { expression    : "Formal parameter list",    } ,
        { expression    : "Function call expression", } ,
        { expression    : "Function expression", } ,
        { reserved_word : "let"                       } ,
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
    require("./declarations")(ast_node_table);

    // Register expressions
    require("./expressions")(ast_node_table);

    // TODO: refactor later
    [
        "./expressions/contextual_keyword",

        // 12.2.5 - Array literal
        "./literals/array_literal",
        // 12.2.6 - Object literal
        "./literals/object_literal",
        // 12.2.9 - Template literal
        "./literals/template_literal",

        "./expressions/method",
        "./expressions/method_body",
        "./expressions/property_definition",
        "./expressions/property_assignment",
        "./expressions/empty_parameter_list",
        "./expressions/cover_initialized_name",
        "./expressions/computed_property_name",

        "./part/property_name",
        "./part/identifier_reference",
        "./expressions/catch_parameter",

        "./expressions/generator_body",
        "./expressions/function_expression",

        "./expressions/binding_element",
        "./expressions/binding_identifier",
        "./expressions/formal_parameter_list",

        // Class
        "./common/class_tail",
        "./common/class_body",
        "./expressions/static_method",

        "./expressions/initializer",

        "./expressions/assignable_left_hand_side_expression",

        // Statements
        "./statements/expression_statement",

        // Variable declarations
        "./declarations/variable_declaration",

        // Lexical declarations
        "./expressions/binding_property",
        "./expressions/single_name_binding",
        "./expressions/binding_property_element",
        "./declarations/binding_list",
        "./declarations/lexical_binding",

        // Generic helper node
        "./declarations/assignable_declaration",

        // For statement expressions
        "./expressions/for_header",
        "./expressions/for_in_header",
        "./expressions/for_of_header",
        "./expressions/for_iterator_header",
        "./expressions/for_iterator_condition",
        "./expressions/for_iterator_initializer",

        // For statements declarations
        "./declarations/for_binding",
        "./declarations/for_declaration",
        "./declarations/variable_declaration_no_in",
        "./declarations/variable_declaration_list_no_in",

        // 14 - Functions
        "./expressions/concise_body",
        "./expressions/spread_element",
        "./expressions/arrow_parameters",
        "./expressions/formal_parameters",
        "./expressions/arrow_function_body",
        "./expressions/arrow_formal_parameters",
    ].forEach(path => {
        ast_node_table.register_node_definition(require(path));
    });

    ast_node_table.register_reserved_words(
        ["let", "const"], require("./declarations/lexical_declaration")
    );
    ast_node_table.register_reserved_word(
        "extends", require("./common/class_heritage")
    );
};
