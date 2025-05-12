// survis.js
var SurVis = {
  start: function(options) {
    
    if (!options || !options.element) {
      console.error('SurVis: missing options.element');
      return;
    }
    if (!options.data || !Array.isArray(options.data.entries)) {
      console.error('SurVis: data.entries is not an array', options.data);
      return;
    }

    const container = options.element;
    const entries = options.data.entries;

    
    container.innerHTML = "";

    
    entries.forEach(entry => {
      try {
        const node = document.createElement("div");
        node.className = "node";
        node.innerHTML = `
          <strong>${entry.title}</strong><br>
          <em>${entry.author}</em><br>
          Year: ${entry.year}<br>
          Keywords: ${Array.isArray(entry.keywords) ? entry.keywords.join(", ") : ''}
        `;
        container.appendChild(node);
      } catch (e) {
        console.error('SurVis: error rendering entry', entry, e);
      }
    });
  }
};

