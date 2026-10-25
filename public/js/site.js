/* Menu mobile, filtro da galeria e lightbox. Sem dependencias. */
(function () {
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('menu');
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      nav.classList.toggle('open', open);
    };
    toggle.addEventListener('click', function () {
      setOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setOpen(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });
  }

  var items = Array.prototype.slice.call(document.querySelectorAll('.g-item'));
  var chips = document.querySelectorAll('.chip');
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var cat = chip.getAttribute('data-filter');
      chips.forEach(function (c) { c.setAttribute('aria-pressed', String(c === chip)); });
      items.forEach(function (it) {
        it.hidden = !(cat === 'todos' || it.getAttribute('data-cat') === cat);
      });
    });
  });

  var dlg = document.getElementById('lightbox');
  if (!dlg || typeof dlg.showModal !== 'function') return;
  var img = dlg.querySelector('img');
  var cap = dlg.querySelector('figcaption');
  var current = -1;

  function visible() { return items.filter(function (it) { return !it.hidden; }); }
  function show(list, i) {
    current = (i + list.length) % list.length;
    var src = list[current].querySelector('img');
    img.src = src.currentSrc || src.src;
    img.alt = src.alt;
    cap.textContent = list[current].getAttribute('data-title') || '';
  }
  items.forEach(function (it) {
    it.addEventListener('click', function () {
      var list = visible();
      show(list, list.indexOf(it));
      dlg.showModal();
    });
  });
  dlg.querySelector('.lb-close').addEventListener('click', function () { dlg.close(); });
  dlg.querySelector('.lb-prev').addEventListener('click', function () { var l = visible(); show(l, current - 1); });
  dlg.querySelector('.lb-next').addEventListener('click', function () { var l = visible(); show(l, current + 1); });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener('keydown', function (e) {
    var l = visible();
    if (e.key === 'ArrowLeft') show(l, current - 1);
    if (e.key === 'ArrowRight') show(l, current + 1);
  });
})();
