/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : ast_node_table.js
* Created at  : 2019-05-27
* Updated at  : 2019-09-03
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

    // Register literals
    require("./literals")(ast_node_table);

    // Register declarations
    require("./declarations")(ast_node_table);

    // Register expressions
    require("./expressions")(ast_node_table);

    // TODO: refactor later
    [
        "./part/property_name",
        "./part/identifier_reference",
        "./part/cover_initialized_name",
        "./part/property_control_es6",
        "./covers/binding_pattern",
        "./covers/cover_object_error",

        "./expressions/generator_body",
        "./expressions/function_expression",

        "./expressions/binding_element",
        "./expressions/binding_identifier",
        "./expressions/formal_parameter_list",

        "./common/class_tail",
        "./common/class_body",
        "./common/terminal_symbol",

        "./expressions/initializer",

        "./expressions/assignable_left_hand_side_expression",

        // Statements
        "./statements/expression_statement",

        // Variable declarations
        "./declarations/variable_declaration",

        // Lexical declarations
        "./declarations/binding_list",
        "./declarations/lexical_binding",

        // Generic helper node
        "./declarations/assignable_declaration",

        // For statement expressions
        "./expressions/for_in_header",
        "./expressions/for_of_header",
        "./expressions/for_iterator_header",
        "./expressions/for_iterator_condition",
        "./expressions/for_iterator_initializer",
        "./controllers/for_header_controller",

        // For statements declarations
        "./declarations/for_binding",
        "./declarations/for_declaration",
        "./declarations/binding_list_no_in",
        "./declarations/lexical_binding_no_in",
        "./declarations/lexical_declaration_no_in",
        "./declarations/variable_declaration_no_in",
        "./declarations/variable_declaration_list_no_in",
        "./declarations/es5_legacy_variable_declaration_no_in",
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
