
var SurVis = {
  start: function(options) {
    const div = options.element;
    div.innerHTML = '';
    const note = document.createElement('div');
    note.innerHTML = '<div style="color: gray; font-size: 18px;">🟢 Visualization container loaded.<br>This simulates full SurVis display.</div>';
    div.appendChild(note);
  }
};
