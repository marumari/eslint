/**
 * @fileoverview Rule to flag unescaped assignments to innerHTML
 * @author Frederik Braun
 * @copyright 2015 Mozilla Corporation. All rights reserved (but still
 */
"use strict";

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

module.exports = function(context) {

  var operators = ['+', '+='];

  // names of escaping functions that we acknowledge
  var VALID_ESCAPERS = ['Tagged.escapeHTML', 'escapeHTML'];

  var allowedExpression = function allowedExpression(node) {
    /* check the stringish-part, which is either the right-hand-side of
       an inner/outerHTML assignment or the 2nd parameter to insertAdjacentTML
      */
    if (node.right.type == "Literal") {
      /*  surely, someone could have an evil literal in there, but that's malice
          we can just check for unsafe coding practice, not outright malice
          example literal '<script>eval(location.hash.slice(1)</script>'
          (it's the task of the tagger-function to be the gateway here.)
     */
      return true; // we just assign a literal (e.g. a string, a number, a bool)
    }
    if (node.right.type == "TemplateLiteral") {
      // check for ${..} expressions
      var template = node.right;
      if (template.expressions.length == 0) {
        return true;
      }
      // else: contains expressions, but no tagged function? not cool.
      return false;
    }
    if (node.right.type == "TaggedTemplateExpression") {
      var funcName = context.getSource(node.right.tag);
      if (VALID_ESCAPERS.indexOf(funcName) !== -1) {
        return true;
      }
      else {
        return false;
      }
    }

  };
  return {
    "AssignmentExpression:exit": function(node) {
      // called when an identifier is found in the tree.
      // the "exit" prefix ensures we know all subnodes already.

      if (operators.indexOf(node.operator) !== -1) {
        var assignedTo = context.getSource(node.left);
        if ((assignedTo.indexOf('innerHTML') !== -1) || (assignedTo.indexOf('outerHTML') !== -1)) {
          if (!allowedExpression(node.right)) {
            context.report("foo"); // report error
          }
        }

      }

    },
    "CallExpression":function(node) {
      // this is for insertAdjacentHTML(position, markup)
      if (context.getSource(node.callee).indexOf("insertAdjacentHTML") !== -1) {
        if (!allowedExpression(arguments[1])) {
          context.report("insertAdjacentHTML, danger mode")
        }
      }
    }
  }

};
