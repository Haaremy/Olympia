module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Verhindere die Verwendung von nativen <main> Elementen",
      category: "Best Practices",
      recommended: false
    },
    fixable: null, // optional, wenn du autofix anbieten willst
    schema: [], // keine Optionen nötig
    messages: {
      noNativeMain: "Verwende stattdessen die <Main> Komponente."
    }
  },

  create(context) {
    return {
      JSXOpeningElement(node) {
        // Prüft, ob der Name "button" ist
        if (node.name && node.name.name === "main") {
          context.report({
            node,
            messageId: "noNativeMain"
          });
        }
      }
    };
  }
};
