const canvas = document.getElementById('canvas');
    const draggables = document.querySelectorAll('.draggable');
    const form = document.getElementById('propertiesForm');
    const formContent = document.getElementById('formContent');

    let selectedEl = null;

    draggables.forEach(item => {
      item.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('type', e.target.dataset.type);
      });
    });

    canvas.addEventListener('dragover', e => e.preventDefault());

    canvas.addEventListener('drop', e => {
      e.preventDefault();
      const type = e.dataTransfer.getData('type');
      let el;
      if (type === 'text') {
        el = document.createElement('div');
        el.innerText = 'Edit me';
      } else if (type === 'image') {
        el = document.createElement('img');
        el.src = 'https://via.placeholder.com/100';
        el.style.width = '100px';
      } else if (type === 'button') {
        el = document.createElement('button');
        el.innerText = 'Click Me';
      }
      el.classList.add('element');
      el.setAttribute('contenteditable', type === 'text');
      el.addEventListener('click', () => selectElement(el));
      canvas.appendChild(el);
    });

    function selectElement(el) {
      selectedEl = el;
      showProperties(el);
    }

    function showProperties(el) {
      const tag = el.tagName.toLowerCase();
      let html = '';
      if (tag === 'div' || tag === 'button') {
        html += `
          <label>Text</label>
          <input type="text" id="propText" value="${el.innerText}" />
        `;
      }
      if (tag === 'img') {
        html += `
          <label>Image URL</label>
          <input type="text" id="propSrc" value="${el.src}" />
        `;
      }
      html += `
        <label>Font Size (px)</label>
        <input type="number" id="propFontSize" value="${parseInt(getComputedStyle(el).fontSize) || 16}" />

        <label>Text Color</label>
        <input type="color" id="propColor" value="${rgbToHex(getComputedStyle(el).color)}" />

        <label>Background Color</label>
        <input type="color" id="propBg" value="${rgbToHex(getComputedStyle(el).backgroundColor)}" />
      `;
      formContent.innerHTML = html;
      form.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', updateProperties);
      });
    }

    function updateProperties() {
      if (!selectedEl) return;
      if (selectedEl.tagName === 'DIV' || selectedEl.tagName === 'BUTTON') {
        selectedEl.innerText = document.getElementById('propText').value;
      }
      if (selectedEl.tagName === 'IMG') {
        selectedEl.src = document.getElementById('propSrc').value;
      }
      selectedEl.style.fontSize = document.getElementById('propFontSize').value + 'px';
      selectedEl.style.color = document.getElementById('propColor').value;
      selectedEl.style.backgroundColor = document.getElementById('propBg').value;
    }

    function rgbToHex(rgb) {
      const result = rgb.match(/\d+/g);
      if (!result) return '#000000';
      return '#' + result.map(x => (+x).toString(16).padStart(2, '0')).join('');
    }