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

    // 🧠 渲染摘要区域
    const abstractContainer = document.getElementById('abstractResults');
    const abstractSearch = document.getElementById('abstractSearch');

    function renderAbstracts(filteredList) {
      abstractContainer.innerHTML = '';
      if (filteredList.length === 0) {
        abstractContainer.innerHTML = '<em>No matching abstracts found.</em>';
        return;
      }
      filteredList.forEach((p, idx) => {
        const authors = Array.isArray(p.authors) ? p.authors.join('; ') : (p.author || 'Unknown Author');
        const div = document.createElement('div');
        div.id = `abstract-${idx}`;
        div.style.marginBottom = '1.5rem';
        div.style.paddingBottom = '1rem';
        div.style.borderBottom = '1px solid #eee';
        div.innerHTML = `
          <h3>${p.title}</h3>
          <p><strong>Authors:</strong> ${authors}</p>
          <p><strong>Year:</strong> ${p.year}</p>
          <p><strong>Abstract:</strong><br/> ${p.abstract || 'No abstract available.'}</p>
        `;
        abstractContainer.appendChild(div);
      });
    }

    // 默认渲染所有摘要
    renderAbstracts(papers);

    // 🔍 搜索摘要区域
    abstractSearch.addEventListener('input', () => {
      const kw = abstractSearch.value.toLowerCase().trim();
      const matched = papers.filter(p =>
        (p.title || '').toLowerCase().includes(kw) ||
        (Array.isArray(p.authors) ? p.authors.join(' ') : '').toLowerCase().includes(kw) ||
        (p.keywords || []).some(k => k.toLowerCase().includes(kw))
      );
      renderAbstracts(matched);
    });

    // 🧩 渲染右侧卡片列表
    function render(items) {
      list.innerHTML = '';
      if (items.length === 0) {
        list.appendChild(create('div', {}, 'No matching papers'));
        return;
      }

      items.forEach((p, idx) => {
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

        // 📍 点击卡片自动滚动到摘要位置
        card.addEventListener('click', () => {
          const target = document.getElementById(`abstract-${idx}`);
          if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            target.style.background = '#f0f8ff';
            setTimeout(() => target.style.background = '', 1000);
          }
        });

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











