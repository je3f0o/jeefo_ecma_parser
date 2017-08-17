/* -.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.-.
* File Name   : comment.js
* Created at  : 2017-08-17
* Updated at  : 2017-08-17
* Author      : jeefo
* Purpose     :
* Description :
_._._._._._._._._._._._._._._._._._._._._.*/
// ignore:start

/* globals -Comment */
/* exported */

// ignore:end

var Comment = function () {};
Comment.prototype = {
	type       : "Comment",
	precedence : 40,
	initialize : function (token) {
		this.type         = "Comment";
		this.comment      = token.comment;
		this.is_multiline = token.is_multiline;
		this.start        = token.start;
		this.end          = token.end;
	},
	left_denotation : function (left, scope) {
		while (scope.current_expression && scope.current_expression.type === "Comment") {
			scope.advance_binary();
		}
		return left;
	},
	statement_denotation : function () { return this; }
};

module.exports = {
	token_type  : "Comment",
	Constructor : Comment
};
