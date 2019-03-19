/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : es5_parser.js
* Created at  : 2017-05-22
* Updated at  : 2019-03-19
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start
"use strict";

/* globals */
/* exported */

// ignore:end

const JeefoParser      = require("@jeefo/parser"),
      states_enum      = require("./es5/enums/states_enum"),
      es5_tokenizer    = require("./es5/tokenizer"),
      ignore_comments  = require("./es5/helpers/ignore_comments"),
      es5_symbol_table = require("./es5/symbol_table");

const parser = new JeefoParser("ECMA Script 5", es5_tokenizer, es5_symbol_table);
Object.keys(states_enum).forEach((key) => {
    parser.state.add(key, states_enum[key], key === "statement");
});

parser.onpreparation = parser => {
    if (parser.next_token.id             === "Identifier" &&
        parser.next_symbol_definition    !== null         &&
        parser.next_symbol_definition.id === "Expression statement") {
        const current_token             = parser.next_token,
              current_symbol_definition = parser.next_symbol_definition;

        parser.prepare_next_symbol_definition();

        const next_token = parser.next_token;
        parser.next_token             = current_token;
        parser.next_symbol_definition = current_symbol_definition;
        Object.assign(parser.tokenizer.streamer.cursor, current_token.end);

        if (next_token !== null && next_token.value === ':') {
            return parser.change_state("labelled_statement");
        }
    }

    let current_symbol = null;
    if (parser.current_symbol !== null && parser.current_symbol.id !== "Comment") {
        current_symbol = parser.current_symbol;
    }
    ignore_comments(parser);

    if (parser.next_token === null || current_symbol === null) { return; }

    switch (current_symbol.type) {
        case "Primitive" :
            switch (parser.next_token.id) {
                case "Number" :
                case "Identifier" :
                    if (current_symbol.end.line < parser.next_token.start.line) {
                        parser.terminate(current_symbol);
                    } else {
                        parser.throw_unexpected_token();
                    }
                    break;
            }
            break;
    }
};

module.exports = parser;

// ignore:start
if (require.main === module) {

// {{{1 print
const print_symbol = (symbol, is_expression) => {
    if (!symbol || ! symbol.start || ! symbol.end) {
        console.log(symbol);
        throw new Error(1);
    }
    console.log(`code: \`${ parser.tokenizer.streamer.substring_from_token(symbol) }\``);
    console.log(symbol.to_string());

    switch (symbol.type) {
        case "Declarator" :
            print_symbol(symbol.identifier, true);
            if (symbol.init) {
                print_symbol(symbol.init, true);
            }
            if (symbol.left_comment) {
                print_symbol(symbol.left_comment, true);
            }
            if (symbol.right_comment) {
                print_symbol(symbol.right_comment, true);
            }
            console.log(" NEXT ----------------------------------------");
            break;
        case "Declaration" :
            switch (symbol.id) {
                case "Varaible delcaration" :
                    symbol.declarations.forEach(declarator => {
                        print_symbol(declarator, true);
                    });
                    break;
            }
            break;
        case "Statement" :
            switch (symbol.id) {
                case "Expression statement" :
                    print_symbol(symbol.expression, true);
                    if (symbol.pre_comment) {
                        print_symbol(symbol.pre_comment, true);
                    }
                    if (symbol.post_comment) {
                        print_symbol(symbol.post_comment, true);
                    }
                    break;
                case "Return statement" :
                    if (symbol.argument) {
                        print_symbol(symbol.argument, true);
                    }
                    if (symbol.pre_comment) {
                        print_symbol(symbol.pre_comment, true);
                    }
                    break;
            }
            break;
        case "Binary operator" :
            print_symbol(symbol.left, true);
            print_symbol(symbol.right, true);
            if (symbol.comment) {
                print_symbol(symbol.comment, true);
            }
            break;
        case "Primitive" :
            if (symbol.id === "Primitive wrapper") {
                print_symbol(symbol.value, true);
            }
            break;
        default:
            console.log(222, symbol.type);
    }

    if (! is_expression) {
        console.log("\n[END] -------------------------------------------------------\n");
    }
};
// }}}1

/*
parser.throw_unexpected_token = function () {
console.log(parser);
console.log("throw");
process.exit();
};
*/

const fs = require("fs");
const source = fs.readFileSync("./test", "utf8");
const symbols = parser.parse(source);

console.log("===========================");
symbols.forEach(symbol => print_symbol(symbol));
//console.log(parser.symbol_table.get_reserved_words());

if (true) {
    process.exit();
}

let zz = `
var core_module = jeefo.module("jeefo_core", []),
CAMEL_CASE_REGEXP = /[A-Z]/g,
snake_case = function (str) {
    return str.replace(CAMEL_CASE_REGEXP, function (letter, pos) {
        return (pos ? '_' : '') + letter.toLowerCase();
    });
};
delete ZZ.ff;
typeof x;
throw z,a,b;
switch (tokens[i].type) {
    case "Number":
    case "Identifier":
        if (tokens[i - 1].end.index === tokens[i].start.index) {
            this.name += tokens[i].value;
        } else {
            break LOOP;
        }
        break;
    case "SpecialCharacter":
        switch (tokens[i].value) {
            case '$':
            case '_':
                if (tokens[i - 1].end.index === tokens[i].start.index) {
                    this.name += tokens[i].value;
                } else {
                    break LOOP;
                }
                break;
            default:
                break LOOP;
        }
        break;
    default:
        break LOOP;
}
for (var i = 0; i < 5; ++i) {
    zz = as, gg = aa;
}
for (;;) {
    zz = as, gg = aa;
}
for (var a in b) {
    zz = as, gg = aa;
}
{
    var a = c + b.c * d - f, z = rr;
}
++a;
a++;
o = { a_1 : 99, $b : 2 };
[1,2,3];
{};
new Fn(1.2E2,2,3);
PP.define("IS_NULL", function (x) { return x === null;   }, true);
instance.define("IS_OBJECT" , function (x) { return x !== null && typeof x === "object"; } , true);
instance.define("ARRAY_EXISTS" , function (arr, x) { return arr.indexOf(x) >= 0; } , true);

return {
    pre : (link && link.pre) ? link.pre : null,
    /**
     * Compiles and re-adds the contents
     */
    post : function(scope, element) {
        // Compile the contents
        if (! compiledContents) {
            compiledContents = $compile(contents);
        }
        // Re-add the compiled contents to the element
        compiledContents(scope, function(clone) {
            element.append(clone);
        });

        // Call the post-linking function, if any
        if (link && link.post) {
            link.post.apply(null, arguments);
        }
    }
};
var fields           = form.fields.filter(function (f) { return f; }),
    violations       = form.violations,
    oversighted_type = form.oversighted_type,
    total_fields     = fields.length + 4, // oversighted_type, violations, title, num_attachments
    counter          = 0;
(function check_condition () {
    if (is_canceled) { return; }
    var result = callback();

    if (result) {
        deferred.resolve();
    } else if ((Date.now() + interval) < end_time) {
        setTimeout(check_condition, interval);
    } else {
        deferred.reject();
    }
}());
var EXTRACT_FILENAME = /filename[^;\\n=]*=((?:['\\"]).*?\\2|[^;\\n]*)/g;
var HOST_CONSTRUCTOR_REGEX = /^\[object .+?Constructor\]$/; // 40
match    = match[0].match(/filename="([^"\\\\]*(?:\\.[^"\\\\]*)*)"/i);
filename = (match && match[1]) ? decodeURI(match[1]) : fallback_filename;
$ngRedux.connect(function () {
    var state = $ngRedux.getState();
    if (state.backdrop) {
        $element.css({
            bottom  : 0,
            opacity : 0.6,
        });
    } else {
        $element.css({
            bottom  : "100%",
            opacity : 0,
        });
    }

    return { backdrop : state.backdrop };
})(dumb_state);
return {
    'collapse-handler-right'          : ! folder.is_loading && ! folder.is_collapsed,
    'icon-spin4 animate-spin'         : folder.is_loading,
    'icon-right-dir collapse-handler' : ! folder.is_loading
};
size = (size / divider);

define([], function () {
    function compare_by_id (a, b) {
        var result = 0;
        if (a.conclusion_id < b.conclusion_id) {
            result = -1;
        } else if (a.conclusion_id > b.conclusion_id) {
            result = 1;
        }
        return result;
    }
    function compare_by_string (a, b) { return a.rate.localeCompare(b.rate); }
});

this.REGEX_FLAGS.indexOf(flags_value.charAt(i)) !== -1 && flags.indexOf(flags_value.charAt(i)) === -1;
`;
zz = 1;
}
// ignore:end
