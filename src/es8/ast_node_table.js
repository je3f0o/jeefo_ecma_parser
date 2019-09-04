/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : ast_node_table.js
* Created at  : 2019-05-27
* Updated at  : 2019-09-04
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
    // Remove old existed expressions
    ast_node_table.remove_node_defs([
        { expression : "Identifier"        } ,
        { expression : "Delimiter"        } ,
        { expression : "Function call"        } ,
        { expression : "Binding element"      } ,
        { expression : "Binding identifier"   } ,
        { expression : "Array binding pattern"   } ,
        { expression : "Object binding pattern"      } ,
        { expression : "Expression statement" } ,
        { expression : "Member expression" } ,
        { expression : "Assignment expression" } ,
        { expression : "Function call expression" } ,
        { expression : "Formal parameter list" } ,
        { expression : "Identifier reference" } ,
        { expression : "Terminal symbol" } ,

        { reserved_word : "null" } ,
        { reserved_word : "true" } ,
        { reserved_word : "false" } ,
        { expression : "String literal" } ,
        { expression : "Numeric literal" } ,
    ]);

    // Register expressions
    require("./expressions")(ast_node_table);

    // TODO: refactor later
    [
        "./common/spread_element",

        "./expressions/call_expression",

        // 11.6.2.1 - Keywords
        "./expressions/keyword",

        // 11.7 - Punctuators
        "./terminals/punctuator",

        // 12 - ECMAScript Language: Expressions
        // 12.1 - Identifiers
        "./expressions/label_identifier",
        "./expressions/binding_identifier",
        "./expressions/identifier_reference",

        // 12.2 - Primary expressions
        "./expressions/primary_expression",

        // 12.2.4 - Literals
        "./literals/literal",
        "./literals/string_literal",
        "./literals/numeric_literal",

        // 12.2.10 - The grouping operator
        "./expressions/cover_parenthesized_expression_and_arrow_parameters",

        // 12.3 - Left hand side expressions
        "./expressions/new_expression",
        "./expressions/member_expression",
        "./binary_operators/member_operator",

        //.....
        "./expressions/binding_rest_element",

        // Assigment expression
        "./expressions/assignment_expression",
        "./binary_operators/assignment_operator",
        "./expressions/left_hand_side_expression",

        // 13.4 - Function definitions
        "./expressions/formal_parameter",
        //"./expressions/formal_parameters",

        "./expressions/function_rest_parameter",

        // Array bindings
        "./destructurings/assignment_element",
        "./destructurings/assignment_elision_element",
        "./destructurings/array_assignment_pattern",

        // Object bindings
        "./destructurings/assignment_property",
        "./destructurings/object_assignment_pattern",

        // Depricated
        "./bindings/binding_pattern",
        "./bindings/binding_element",

        "./expressions/arguments",
        "./statements/expression_statement",

        // Async functions
        "./common/async_function_body",
        "./expressions/async_function_expression",
        "./declarations/async_function_declaration",

        "./covers/cover_call_expression_and_async_arrow_head",
    ].forEach(path => {
        ast_node_table.register_node_definition(require(path));
    });

    [
        // 12.2 - Primary expressions
        {
            path    : "./expressions/this_keyword",
            keyword : "this",
        },
        // 12.2.4 - Literals
        {
            path    : "./literals/null_literal",
            keyword : "null",
        },
        // 12.3 - Left hand side expressions
        {
            path    : "./expressions/super_property",
            keyword : "super",
        },
    ].forEach(({ path, keyword }) => {
        ast_node_table.register_reserved_word(keyword, require(path));
    });

    // 12.2.4 - Literals
    ast_node_table.register_reserved_words(
        ["true", "false"], require("./literals/boolean_literal")
    );
};
