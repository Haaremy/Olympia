module.exports = {
  meta: {
    type: "problem",
    docs: {
      description: "Verhindere die Verwendung von nativen <button> Elementen",
      category: "Best Practices",
      recommended: false
    },
    fixable: null, // optional, wenn du autofix anbieten willst
    schema: [], // keine Optionen nötig
    messages: {
      noNativeButton: "Verwende stattdessen die <Button> Komponente."
    }
  },

  create(context) {
    return {
      JSXOpeningElement(node) {
        // Prüft, ob der Name "button" ist
        if (node.name && node.name.name === "button") {
          context.report({
            node,
            messageId: "noNativeButton"
          });
        }
      }
    };
  }
};
