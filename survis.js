// survis.js

(function(global) {

  function $(tag, props = {}, ...children) {
    const el = document.createElement(tag);
    Object.assign(el, props);
    children.forEach(c => {
      if (typeof c === 'string') c = document.createTextNode(c);
      el.appendChild(c);
    });
    return el;
  }

  
  function start(config) {
    const { data, element, sortField, sortDescending } = config;

    let papers = Array.isArray(data.entries) ? data.entries.slice() : [];


    if (sortField) {
      papers.sort((a, b) => {
        const da = a[sortField] || 0;
        const db = b[sortField] || 0;
        return sortDescending ? db - da : da - db;
      });
    }

 
    const filterInput = $('input', {
      placeholder: 'Filter by keyword…',
      style: 'margin-bottom:10px;padding:4px;width:200px;'
    });
    element.innerHTML = ''; 
    element.appendChild(filterInput);

 
    const list = $('div');
    element.appendChild(list);

   
    function render(items) {
      list.innerHTML = '';
      if (items.length === 0) {
        list.appendChild($('div', {}, 'No papers found.'));
        return;
      }
      items.forEach(p => {
        const box = $('div', { className: 'node' });
        box.appendChild($('h3', {}, p.title));
        box.appendChild($('div', {}, $('i', {}, p.author || '' )));
        box.appendChild($('div', {}, 'Year: ' + (p.year || '—')));
        box.appendChild($('div', {}, 'Keywords: ' + (p.keywords || []).join(', ')));
        list.appendChild(box);
      });
    }

 
    render(papers);

  
    filterInput.addEventListener('input', () => {
      const kw = filterInput.value.trim().toLowerCase();
      if (!kw) return render(papers);
      render(papers.filter(p => (p.keywords||[]).some(t => t.toLowerCase().includes(kw))));
    });
  }

  global.SurVis = { start };

})(window);



