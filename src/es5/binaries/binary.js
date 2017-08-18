/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : binary.js
* Created at  : 2017-08-16
* Updated at  : 2017-08-18
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start

/* globals */
/* exported */

// ignore:end

var generic_initializer = require("../generic_initializer");

module.exports = {
	left_denotation : function (left, scope) {
		this.left  = left;
		scope.advance();
		//console.log(scope.current_token);
		this.right = scope.expression(this.precedence);
		this.start = left.start;
		this.end   = this.right.end;

//console.log(222222222, this, scope.current_expression);
//process.exit();
		return this;
	},
	make : function (type, precedence) {
		return {
			type            : type,
			precedence      : precedence,
			initialize      : generic_initializer,
			left_denotation : this.left_denotation
		};
	},
};
