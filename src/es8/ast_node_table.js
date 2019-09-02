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
    // Remove old existed expressions
    ast_node_table.remove_node_defs([
        { expression : "Function call"        } ,
        { expression : "Binding element"      } ,
        { expression : "Binding identifier"   } ,
        { expression : "Array binding pattern"   } ,
        { expression : "Object binding pattern"      } ,
        { expression : "Expression statement" } ,
        { expression : "Assignment expression" } ,
        { expression : "Function call expression" } ,
        { expression : "Identifier reference" } ,
    ]);

    // Register expressions
    require("./expressions")(ast_node_table);

    // TODO: refactor later
    [
        "./primitives/binding_identifier",
        "./primitives/identifier_reference",

        "./common/spread_element",

        "./expressions/call_expression",

        // Expressions
        "./expressions/assignment_expression",

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

        // Parameters
        "./common/formal_parameter",
        "./expressions/arrow_formal_parameters",

        "./expressions/arguments",
        "./statements/expression_statement",

        // Async functions
        "./common/async_function_body",
        "./expressions/async_function_expression",
        "./declarations/async_function_declaration",

        "./covers/cover_call_expression_and_async_arrow_head",
        "./covers/cover_parenthesized_expression_and_arrow_parameters",
    ].forEach(path => {
        ast_node_table.register_node_definition(require(path));
    });
};
