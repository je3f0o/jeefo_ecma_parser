/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : void_typeof_delete_expression.js
* Created at  : 2017-08-17
* Updated at  : 2017-08-17
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start

/* globals */
/* exported */

// ignore:end

module.exports = {
	token_type : "Identifier",

	is : function (token) {
		switch (token.name) { case "void" : case "typeof" : case "delete" :
			token.operator = token.name;
			return true;
		}
	},
	Constructor : require("./unary_expression")
};
