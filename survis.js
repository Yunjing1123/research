// survis.js

(function(global) {
  // Simple DOM helper
  function create(tag, props = {}, ...children) {
    const el = document.createElement(tag);
    Object.assign(el, props);
    children.forEach(c => {
      if (typeof c === 'string') c = document.createTextNode(c);
      el.appendChild(c);
    });
    return el;
  }

  function start(config) {
    const { data, element } = config;
    // Clone the entries so we don't mutate original data
    let papers = Array.isArray(data.entries) ? data.entries.slice() : [];

    // Build controls container
    const controls = create('div', { style: 'margin-bottom:10px' });
    const filterInput = create('input', {
      placeholder: 'Filter by keyword…',
      style: 'margin-right:10px;padding:4px;'
    });
    const sortSelect = create('select', { style: 'margin-right:10px;padding:4px;' },
      create('option', { value: '' }, 'Sort by year'),
      create('option', { value: 'asc' }, '↑ Oldest first'),
      create('option', { value: 'desc' }, '↓ Newest first')
    );
    controls.appendChild(filterInput);
    controls.appendChild(sortSelect);

    // Clear loading message and insert controls
    element.innerHTML = '';
    element.appendChild(controls);

    // List container
    const list = create('div');
    element.appendChild(list);

    // Render a given list of papers
    function render(items) {
      list.innerHTML = '';
      if (items.length === 0) {
        list.appendChild(create('div', {}, 'No matching papers'));
        return;
      }
      items.forEach(p => {
        const card = create('div', { className: 'node' });
        card.appendChild(create('h3', {}, p.title || 'Untitled'));
        if (p.author) {
          card.appendChild(create('div', {}, create('i', {}, p.author)));
        }
        card.appendChild(create('div', {}, 'Year: ' + (p.year || '—')));
        card.appendChild(create('div', {}, 'Keywords: ' + ((p.keywords||[]).join(', '))));
        list.appendChild(card);
      });
    }

    // Initial render
    render(papers);

    // Filtering logic
    filterInput.addEventListener('input', () => {
      const term = filterInput.value.trim().toLowerCase();
      const filtered = term
        ? papers.filter(p => (p.keywords||[]).some(k => k.toLowerCase().includes(term)))
        : papers;
      sortAndRender(filtered);
    });

    // Sorting logic
    sortSelect.addEventListener('change', () => {
      // Re-filter based on current filter value
      const term = filterInput.value.trim().toLowerCase();
      const baseList = term
        ? papers.filter(p => (p.keywords||[]).some(k => k.toLowerCase().includes(term)))
        : papers;
      sortAndRender(baseList);
    });

    // Sort helper, then render
    function sortAndRender(listToSort) {
      const order = sortSelect.value;
      if (order === 'asc') {
        listToSort.sort((a,b) => (a.year||0) - (b.year||0));
      } else if (order === 'desc') {
        listToSort.sort((a,b) => (b.year||0) - (a.year||0));
      }
      render(listToSort);
    }
  }

  // Expose SurVis API
  global.SurVis = { start };
})(window);





