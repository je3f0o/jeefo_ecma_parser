/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : ast_node_table.js
* Created at  : 2019-05-27
* Updated at  : 2019-12-14
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
	const initialize = (node, token, parser) => {
        parser.throw_unexpected_token(
            `${ node.constructor.name } cannot be initialized.`
        );
    };

    // Remove old existed expressions
    ast_node_table.remove_node_defs([
        { expression : "Identifier"        } ,
        { expression : "Delimiter"        } ,
        { expression : "Binding element"      } ,
        { expression : "Binding identifier"   } ,
        { expression : "Array binding pattern"   } ,
        { expression : "Object binding pattern"      } ,
        { expression : "Member expression" } ,
        { expression : "Function call expression" } ,
        { expression : "Formal parameter list" } ,
        { expression : "Identifier reference" } ,
        { expression : "Method definition" } ,

        { reserved_word : "null" } ,
        { reserved_word : "true" } ,
        { reserved_word : "false" } ,
        { expression : "String literal" } ,
        { expression : "Numeric literal" } ,
    ]);

    // TODO: refactor later
    [
        // 11.6.2.1 - Keywords
        "./terminals/keyword",
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
        "./expressions/left_hand_side_expression",

        // 12.3.4 Function calls
        "./expressions/super_call",
        "./expressions/call_expression",
        "./expressions/function_call_expression",

        //.....
        "./expressions/binding_rest_element",

        // 12.15 - Assigment expression
        "./expressions/assignment_expression",
        "./binary_operators/assignment_operator",

        // 12.15.5 - Destructuring assignment
        // array
        "./expressions/assignment_element",
        "./expressions/assignment_pattern",
        "./expressions/assignment_rest_element",
        "./expressions/array_assignment_pattern",
        "./expressions/destructuring_assignment_target",
        // object
        "./expressions/assignment_property",
        "./expressions/object_assignment_pattern",
        "./expressions/assignment_property_element",
        "./expressions/assignment_property_identifier",

        // 13.3.3 - Destructuring binding patterns
        "./expressions/binding_pattern",
        "./expressions/binding_element",
        "./expressions/binding_element_pattern",
        "./expressions/array_binding_pattern",
        "./expressions/object_binding_pattern",

        // 13.4 - Function definitions
        "./expressions/formal_parameter",
        //"./expressions/formal_parameters",

        "./expressions/function_rest_parameter",

        "./expressions/arguments",
        //"./statements/expression_statement",

        // 14.3 - Method definition
        "./expressions/method_definition",

        // 14.6 - Async function defenitions
        "./common/async_function_body",
        "./expressions/async_method",
        "./expressions/async_method_body",
        "./expressions/async_concise_body",
        "./expressions/async_function_expression",
        "./declarations/async_function_declaration",

        // 14.7 - Async arrow function definitions
        "./expressions/async_arrow_function",
        "./expressions/async_arrow_function_body",
        "./expressions/async_arrow_binding_identifier",
    ].forEach(path => {
        const def = require(path);
        if (! def.initialize) {
            def.initialize = initialize;
        }
        ast_node_table.register_node_definition(def);
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
        // ...
        {
            path    : "./expressions/await_experession",
            keyword : "await",
        },
    ].forEach(({ path, keyword }) => {
        ast_node_table.register_reserved_word(keyword, require(path));
    });

    // 12.2.4 - Literals
    ast_node_table.register_reserved_words(
        ["true", "false"], require("./literals/boolean_literal")
    );
};
