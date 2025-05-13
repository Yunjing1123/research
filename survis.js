(function(global) {
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
    const papers = Array.isArray(data.entries) ? data.entries.slice() : [];

    const filters = create('div', { style: 'margin-bottom: 20px;' });
    const keywordInput = create('input', {
      placeholder: 'Filter by keyword…', style: 'padding:5px; margin-right:10px;'
    });
    const categorySelect = create('select', { style: 'padding:5px;' });
    const allCats = Array.from(new Set(papers.map(p => p.category || 'Other')));
    categorySelect.appendChild(create('option', { value: '' }, 'All categories'));
    allCats.forEach(c => categorySelect.appendChild(create('option', { value: c }, c)));

    filters.appendChild(keywordInput);
    filters.appendChild(categorySelect);
    element.innerHTML = '';
    element.appendChild(filters);

    const list = create('div');
    element.appendChild(list);

    function render(items) {
      list.innerHTML = '';
      if (items.length === 0) {
        list.appendChild(create('div', {}, 'No matching papers'));
        return;
      }

      items.forEach(p => {
        const authors = Array.isArray(p.authors)
          ? p.authors.join('; ')
          : (p.author || 'Unknown Author');

        const titleElement = p.doi
          ? create('a', { href: 'https://doi.org/' + p.doi, target: '_blank', style: 'text-decoration: none; color: #333;' }, p.title || 'Untitled')
          : create('span', {}, p.title || 'Untitled');

        const card = create('div', { className: 'node' },
          create('h3', {}, titleElement),
          create('p', {}, authors),
          create('p', {}, 'Year: ' + (p.year || '—')),
          create('p', {}, 'Category: ' + (p.category || '—')),
          create('p', {}, 'Keywords: ' + (p.keywords || []).join(', '))
        );

        list.appendChild(card);
      });
    }

    function filterPapers() {
      const kw = keywordInput.value.toLowerCase().trim();
      const cat = categorySelect.value;
      const filtered = papers.filter(p => {
        const keywordMatch = kw ? (p.keywords || []).some(k => k.toLowerCase().includes(kw)) : true;
        const categoryMatch = cat ? p.category === cat : true;
        return keywordMatch && categoryMatch;
      });
      render(filtered);
    }

    keywordInput.addEventListener('input', filterPapers);
    categorySelect.addEventListener('change', filterPapers);
    render(papers);
  }

  global.SurVis = { start };
})(window);









