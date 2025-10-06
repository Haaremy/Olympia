module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Verhindere die Verwendung von nativen <input> Elementen mit type text/password/number",
      category: "Best Practices",
      recommended: false
    },
    fixable: null, 
    schema: [],
    messages: {
      noNativeTextInput: "Verwende stattdessen die <TextInput> Komponente."
    }
  },

  create(context) {
    return {
      JSXOpeningElement(node) {
        if (node.name.type === "JSXIdentifier" && node.name.name === "input") {
          // Standard-Typ ist text, wenn kein type angegeben
          let typeAttr = node.attributes.find(attr => attr.name && attr.name.name === "type");
          let typeValue = "text"; // default
          
          if (typeAttr && typeAttr.value && typeAttr.value.type === "Literal") {
            typeValue = typeAttr.value.value;
          } else if (typeAttr && typeAttr.value && typeAttr.value.type === "JSXExpressionContainer") {
            // Dynamischer Ausdruck, kann nicht statisch geprüft werden → melden
            context.report({
              node,
              messageId: "noNativeTextInput"
            });
            return;
          }

          // Nur bestimmte Typen melden
          if (["text", "password", "number"].includes(typeValue)) {
            context.report({
              node,
              messageId: "noNativeTextInput"
            });
          }
        }
      }
    };
  }
};
