(function (global) {
  function create(tag, props = {}, ...children) {
    const el = document.createElement(tag);
    Object.assign(el, props);
    children.forEach(c => {
      if (typeof c === "string") c = document.createTextNode(c);
      el.appendChild(c);
    });
    return el;
  }

  function start(config) {
    const { data, element } = config;
    const papers = data.entries || [];

    const controls = create("div", { style: "margin-bottom: 20px;" });
    const searchBox = create("input", {
      placeholder: "Filter by keyword…",
      style: "padding: 5px; margin-right: 10px;"
    });

    controls.appendChild(searchBox);
    element.innerHTML = "";
    element.appendChild(controls);

    // Histogram
    const histo = create("div", { className: "histogram" });
    element.appendChild(histo);

    // List
    const list = create("div");
    element.appendChild(list);

    // Render histogram
    function renderHistogram(items) {
      const years = {};
      items.forEach(p => {
        const y = p.year || "Unknown";
        years[y] = (years[y] || 0) + 1;
      });

      const sorted = Object.entries(years).sort((a, b) => +a[0] - +b[0]);
      histo.innerHTML = "<h3>Histogram of Publication Years</h3>";
      sorted.forEach(([year, count]) => {
        const bar = create("div", {
          className: "bar",
          style: `width: ${count * 30}px`
        }, `${year} (${count})`);
        histo.appendChild(bar);
      });
    }

    // Render entries
    function renderList(items) {
      list.innerHTML = "";
      items.forEach(p => {
        const node = create("div", { className: "node" },
          create("h3", {}, p.title),
          create("div", {}, `Author: ${p.author}`),
          create("div", {}, `Year: ${p.year}`),
          create("div", {}, `Keywords: ${p.keywords?.join(", ")}`),
          create("div", {}, create("a", { href: `https://doi.org/${p.doi}`, target: "_blank" }, "View DOI"))
        );
        list.appendChild(node);
      });
    }

    function update() {
      const term = searchBox.value.toLowerCase();
      const filtered = term
        ? papers.filter(p => p.keywords?.some(k => k.toLowerCase().includes(term)))
        : papers;
      renderHistogram(filtered);
      renderList(filtered);
    }

    searchBox.addEventListener("input", update);
    update();
  }

  global.SurVis = { start };
})(window);






