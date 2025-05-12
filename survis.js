// survis.js
var SurVis = {
  
  escapeHtml: function(str) {
    return str.replace(/[&<>"']/g, function(m) {
      return ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[m]);
    });
  },

  start: function(options) {
    var container = options.element;
    var entries = (options.data.entries || []).slice();

    
    entries.sort(function(a, b) {
      return b.year - a.year;
    });

    
    container.innerHTML = "";

    
    entries.forEach(function(entry) {
      
      var node = document.createElement("div");
      node.className = "node";

      
      var html = ""
        + "<strong>" + SurVis.escapeHtml(entry.title) + "</strong><br>"
        + "<em>" + SurVis.escapeHtml(entry.author) + "</em><br>"
        + "Year: " + SurVis.escapeHtml(String(entry.year)) + "<br>"
        + "Keywords: " + SurVis.escapeHtml(entry.keywords.join(", "));

      node.innerHTML = html;
      container.appendChild(node);
    });

    
    if (entries.length === 0) {
      var empty = document.createElement("div");
      empty.className = "node";
      empty.textContent = "No entries found.";
      container.appendChild(empty);
    }
  }
};


