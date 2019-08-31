/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : unary_operators.js
* Created at  : 2019-01-28
* Updated at  : 2019-08-28
* Author      : jeefo
* Purpose     :
* Description : Prefix and postfix unary operator parsers.
* Reference   : https://www.ecma-international.org/ecma-262/5.1/#sec-11.3
* Reference   : https://www.ecma-international.org/ecma-262/5.1/#sec-11.4
.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.*/
// ignore:start
"use strict";

/* globals*/
/* exported*/

// ignore:end

const capitalize                    = require("@jeefo/utils/string/capitalize");
const { terminal_definition }       = require("../../common");
const { get_last_non_comment_node } = require("../../helpers");
const {
    UNARY_PREFIX,
    UNARY_POSTFIX,
    NEW_WITH_ARGS,
    NEW_WITHOUT_ARGS,
} = require("../enums/precedence_enum");
const {
    is_expression,
    prepare_next_expression,
    get_current_state_name,
} = require("../helpers");

module.exports = function register_unary_operators (ast_node_table) {
    const is_expression_state = (token, parser) => {
        if (is_expression(parser)) {
            return get_last_non_comment_node(parser) === null;
        }
    };

    const skeleton_def = {
        type : "Unary operator",
        is   : is_expression_state,
    };

    // New expression (18, 19)
    ast_node_table.register_reserved_word("new", {
		id         : "New operator",
        type       : "Unary operator",
        precedence : NEW_WITHOUT_ARGS,

        is         : is_expression_state,
        initialize : (node, current_token, parser) => {
            const keyword = terminal_definition.generate_new_node(parser);
            const expression_name = get_current_state_name(parser);

            parser.prepare_next_state(expression_name, true);
            const expression = parser.parse_next_node(node.precedence);
            if (expression.id === "Function call expression") {
                node.precedence = NEW_WITH_ARGS;
            }

            node.keyword    = keyword;
            node.expression = expression;
            node.start      = keyword.start;
            node.end        = expression.end;
        }
    });

    // void, typeof, delete expression (16)
    skeleton_def.precedence = UNARY_PREFIX;

    // initialize
    skeleton_def.initialize = (node, current_token, parser) => {
        const keyword = terminal_definition.generate_new_node(parser);
        prepare_next_expression(parser, true);

        node.keyword    = keyword;
        node.expression = parser.parse_next_node(node.precedence);
        node.start      = keyword.start;
        node.end        = node.expression.end;
    };

    ["void", "typeof", "delete"].forEach(keyword => {
        skeleton_def.id = `${capitalize(keyword)} operator`;
        ast_node_table.register_reserved_word(keyword, skeleton_def);
    });

    // Prefix operators (16)
    skeleton_def.initialize = (node, current_token, parser) => {
        const operator = terminal_definition.generate_new_node(parser);
        prepare_next_expression(parser, true);

        node.operator   = operator;
        node.expression = parser.parse_next_node(node.precedence);
        node.start      = operator.start;
        node.end        = node.expression.end;
    };

    const generate_definition = (id, operator) => {
        return {
            id : `${id} operator`,
            is : (token, parser) => {
                if (token.value === operator) {
                    return is_expression_state(null, parser);
                }
            }
        };
    };

    const unary_prefix_operators = [
        generate_definition("Logical not"      , '!')  ,
        generate_definition("Bitwise not"      , '~')  ,
        generate_definition("Prefix increment" , "++") ,
        generate_definition("Prefix decrement" , "--") ,
        generate_definition("Positive plus"    , '+')  ,
        generate_definition("Negation minus"   , '-')  ,
    ];

    unary_prefix_operators.forEach(operator => {
        skeleton_def.id = operator.id;
        skeleton_def.is = operator.is;
        ast_node_table.register_node_definition(skeleton_def);
    });

    // Postfix operators (17)
    const has_operand = (parser, line) => {
        const last_non_comment = get_last_non_comment_node(parser);
        return last_non_comment && last_non_comment.end.line === line;
    };
    const postfix_operators = [
        {
            id : "increment",
            is : (token, parser) => {
                if (token.value === "++" && is_expression(parser)) {
                    return has_operand(parser, token.start.line);
                }
            }
        },
        {
            id : "decrement",
            is : (token, parser) => {
                if (token.value === "--" && is_expression(parser)) {
                    return has_operand(parser, token.start.line);
                }
            }
        }
    ];

    skeleton_def.precedence = UNARY_POSTFIX;
    skeleton_def.initialize = (node, current_token, parser) => {
        node.operator   = terminal_definition.generate_new_node(parser);
        node.expression = parser.prev_node;
        node.start      = node.expression.start;
        node.end        = current_token.end;
    };

    postfix_operators.forEach(operator => {
        skeleton_def.id = `Postfix ${ operator.id } operator`;
        skeleton_def.is = operator.is;
        ast_node_table.register_node_definition(skeleton_def);
    });
};
