
var SurVis = {
  start: function(options) {
    const container = options.element;
    const entries = options.data.entries || [];
    container.innerHTML = "";
    entries.forEach(entry => {
      const node = document.createElement("div");
      node.className = "node";
      node.innerHTML = `<strong>${entry.title}</strong><br>
        <em>${entry.author}</em><br>
        Year: ${entry.year}<br>
        Keywords: ${entry.keywords.join(", ")}`;
      container.appendChild(node);
    });
  }
};
