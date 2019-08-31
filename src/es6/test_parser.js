/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : test_parser.js
* Created at  : 2019-05-27
* Updated at  : 2019-08-28
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

const parser = require("./parser");

const print_node = (node, is_expression) => {
    if (!node || ! node.start || ! node.end) {
        console.log(node);
        throw new Error(1);
    }
    console.log(`code: \`${ parser.tokenizer.streamer.substring_from_token(node) }\``);
    node.print();

    switch (node.type) {
        case "Declarator" :
            print_node(node.identifier, true);
            if (node.init) {
                print_node(node.init, true);
            }
            if (node.left_comment) {
                print_node(node.left_comment, true);
            }
            if (node.right_comment) {
                print_node(node.right_comment, true);
            }
            console.log(" NEXT ----------------------------------------");
            break;
        case "Declaration" :
            switch (node.id) {
                case "Varaible delcaration" :
                    node.declarations.forEach(declarator => {
                        print_node(declarator, true);
                    });
                    break;
            }
            break;
        case "Statement" :
            switch (node.id) {
                case "Expression statement" :
                    print_node(node.expression, true);
                    if (node.pre_comment) {
                        print_node(node.pre_comment, true);
                    }
                    if (node.post_comment) {
                        print_node(node.post_comment, true);
                    }
                    break;
                case "Return statement" :
                    if (node.argument) {
                        print_node(node.argument, true);
                    }
                    if (node.pre_comment) {
                        print_node(node.pre_comment, true);
                    }
                    break;
            }
            break;
        case "Binary operator" :
            print_node(node.left, true);
            print_node(node.right, true);
            if (node.comment) {
                print_node(node.comment, true);
            }
            break;
        case "Primitive" :
            break;
        default:
            console.log(222, node.type);
    }

    if (! is_expression) {
        console.log("\n[END] -------------------------------------------------------\n");
    }
};

const fs = require("fs");
let source;
if (process.argv.length > 2) {
    source = fs.readFileSync("./test", "utf8");
} else {
    //source = fs.readFileSync("/Users/jeefo/projects/jeefo_modules/component/src/structure_component.js", "utf8");
    //source = fs.readFileSync("/Users/jeefo/projects/jeefo_parser/index.js", "utf8");
    //source = fs.readFileSync("/Users/jeefo/projects/jeefo_modules/utils/object/assign.js", "utf8");
    source = fs.readFileSync("/Users/jeefo/projects/jeefo_parser/src/ast_node_table.js", "utf8");
}

parser.debug = true;
const nodes = parser.parse(source);
console.log("===========================");
nodes.forEach(node => print_node(node));
//console.log(parser.node_table.get_reserved_words());
