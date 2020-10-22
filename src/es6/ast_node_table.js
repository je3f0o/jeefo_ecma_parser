/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : ast_node_table.js
* Created at  : 2019-05-27
* Updated at  : 2020-09-09
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
    require("./declarations")(ast_node_table);

    // Register expressions
    require("./expressions")(ast_node_table);

    // TODO: refactor later
    [
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
        "./expressions/computed_member_access",

        "./part/property_name",
        "./part/identifier_reference",

        "./expressions/generator_body",
        "./expressions/function_expression",

        "./expressions/binding_identifier",

        // Class
        "./common/class_tail",
        "./common/class_body",
        "./expressions/static_method",

        "./expressions/initializer",

        // Statements
        // Variable declarations
        "./declarations/variable_declaration",

        // Lexical declarations
        "./expressions/binding_property",
        "./expressions/single_name_binding",
        "./expressions/binding_property_element",
        "./declarations/binding_list",
        "./declarations/lexical_binding",

        // For statement
        "./statements/for_binding",
        "./statements/for_declaration",
        "./statements/for_of_statement",
        "./statements/for_in_statement",
        "./statements/for_variable_declaration",
        "./statements/for_statement",

        // 14 - Functions
        "./expressions/concise_body",
        "./expressions/spread_element",
        "./expressions/arrow_parameters",
        "./expressions/arrow_function_body",
        "./expressions/arrow_formal_parameters",
    ].forEach(path => {
        ast_node_table.register_node_definition(require(path));
    });

    [
        {
            reserved_words : "of",
            path           : "./statements/for_of_operator",
        },
        {
            reserved_words : "var",
            path           : "./statements/variable_statement",
        },
        {
            reserved_words : ["let", "const"],
            path           : "./declarations/lexical_declaration",
        },
        {
            reserved_words : "extends",
            path           : "./common/class_heritage",
        },
        {
            reserved_words : "for",
            path           : "./statements/for_header",
        }
    ].forEach(({reserved_words: keyword, path}) => {
        if (Array.isArray(keyword)) {
            ast_node_table.register_reserved_words(keyword, require(path));
        } else {
            ast_node_table.register_reserved_word(keyword, require(path));
        }
    });
};
