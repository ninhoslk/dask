/* Painel de cenas agrupado por áreas, no canto superior esquerdo.
   Lê as cenas do carrossel original (#themeListScene), que fica escondido,
   e troca de cena disparando o mesmo evento "staticClick" que o carrossel usa.

   Para reorganizar o menu, edite GROUPS abaixo:
   - "scenes" usa o título da cena no Panoee (maiúsculas/acentos não importam);
   - "label" (opcional) é o nome exibido no menu.
   Cenas que não estiverem em nenhum grupo vão para "Outros". */
(function () {
  // Cenas que não aparecem no menu (continuam existindo no Panoee).
  var HIDDEN = ['panorama-lab-1793411224742-6080x3040'];

  var GROUPS = [
    { name: 'Visão Geral', icon: 'fa-drone', scenes: [{ scene: 'Imagem Aérea' }] },
    { name: 'Entrada', icon: 'fa-door-open', scenes: [
      { scene: 'recepção', label: 'Recepção' },
      { scene: 'Pátio' }
    ] },
    { name: 'Ensino Fundamental I', icon: 'fa-child', scenes: [
      { scene: 'Corredor EF I' },
      { scene: 'Sala EF I' },
      { scene: 'Parquinho' }
    ] },
    { name: 'Ensino Fundamental II', icon: 'fa-user-graduate', scenes: [
      { scene: 'corredor EF II', label: 'Corredor EF II' },
      { scene: 'corredor EF II baixo', label: 'Corredor EF II (térreo)' }
    ] },
    { name: 'Ensino Médio', icon: 'fa-graduation-cap', scenes: [{ scene: 'Sala Ensino Médio' }] },
    { name: 'Tecnologia', icon: 'fa-microscope', scenes: [
      { scene: 'sala de robótica EF', label: 'Sala de Robótica' },
      { scene: 'Sala de Informatica', label: 'Sala de Informática' }
    ] },
    { name: 'Biblioteca', icon: 'fa-book-open', scenes: [
      { scene: 'Entrada Biblioteca', label: 'Entrada' },
      { scene: 'Biblioteca', label: 'Interior' }
    ] },
    { name: 'Esportes e Lazer', icon: 'fa-futbol', scenes: [
      { scene: 'quadra', label: 'Quadra' },
      { scene: 'Campinho' },
      { scene: 'Área verde', label: 'Área Verde' }
    ] },
    { name: 'Salão Nobre', icon: 'fa-theater-masks', scenes: [
      { scene: 'Salão Nobre Frente', label: 'Entrada' },
      { scene: 'Salão Nobre', label: 'Interior' }
    ] }
  ];

  var css = `
    #themeListScene { display: none !important; }
    #themeControlbar .--mainPanel { background: #fff !important; color: #2c3e66 !important; box-shadow: 0 2px 10px rgba(0,0,0,.2); }
    #themeControlbar .--mainPanel .itemControlBtn { color: #2c3e66 !important; }
    #themeControlbar .--mainPanel .itemControlBtn.active { background: rgba(44,62,102,.12) !important; }
    #scenePanel { position: fixed; top: 16px; left: 16px; z-index: 9999; width: 290px;
      max-height: calc(100vh - 32px); display: flex; flex-direction: column;
      font-family: system-ui, -apple-system, "Segoe UI", sans-serif; }
    #scenePanel .sp-head { display: flex; align-items: center; gap: 10px; padding: 10px 14px;
      background: #2c3e66; color: #fff; border-radius: 10px; cursor: pointer; user-select: none;
      border-bottom: 3px solid #f5b800; font-weight: 600; font-size: 15px; }
    #scenePanel .sp-arrow { margin-left: auto; color: #f5b800; transition: transform .2s; }
    #scenePanel.open > .sp-head .sp-arrow, #scenePanel .sp-group.open > .sp-gbtn .sp-arrow { transform: rotate(90deg); }
    #scenePanel .sp-list { display: none; flex-direction: column; gap: 6px; margin-top: 6px;
      overflow-y: auto; padding-right: 2px; }
    #scenePanel.open .sp-list { display: flex; }
    #scenePanel button { font: inherit; color: #fff; border: 0; text-align: left; cursor: pointer; width: 100%; }
    #scenePanel .sp-gbtn { display: flex; align-items: center; gap: 12px; padding: 10px 14px;
      background: rgba(44, 62, 102, .94); border-radius: 10px; font-size: 14px; font-weight: 600;
      border-bottom: 2px solid #f5b800; transition: background .15s; }
    #scenePanel .sp-gbtn:hover { background: rgba(60, 82, 130, .96); }
    #scenePanel .sp-gbtn > i:first-child { width: 22px; text-align: center; font-size: 17px; }
    #scenePanel .sp-group.current > .sp-gbtn { background: #3a5285; }
    #scenePanel .sp-sub { display: none; flex-direction: column; gap: 4px; margin: 4px 0 2px 18px; }
    #scenePanel .sp-group.open > .sp-sub { display: flex; }
    #scenePanel .sp-item { display: flex; align-items: center; gap: 10px; padding: 5px;
      background: rgba(30, 44, 74, .92); border-radius: 8px; border-left: 4px solid transparent;
      font-size: 13px; transition: background .15s; }
    #scenePanel .sp-item:hover { background: rgba(60, 82, 130, .95); }
    #scenePanel .sp-item.active { border-left-color: #f5b800; background: #3a5285; }
    #scenePanel .sp-item img { width: 60px; height: 38px; object-fit: cover; border-radius: 4px; flex: none; }
    @media (max-width: 600px) { #scenePanel { width: calc(100vw - 32px); } }
  `;

  function norm(s) {
    return (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').trim().toLowerCase();
  }

  function findFlickity() {
    var carousel = document.querySelector('#themeListScene .carousel');
    if (!carousel) return null;
    var key = Object.keys(carousel).find(function (k) { return k.indexOf('__reactFiber') === 0; });
    var fiber = key && carousel[key];
    for (var depth = 0; fiber && depth < 30; depth++, fiber = fiber.return) {
      for (var hook = fiber.memoizedState; hook && typeof hook === 'object' && 'next' in hook; hook = hook.next) {
        var cur = hook.memoizedState && hook.memoizedState.current;
        if (cur && cur.cells && cur.emitEvent) return cur;
      }
    }
    return null;
  }

  function goTo(index) {
    var fl = findFlickity();
    if (!fl || !fl.cells[index]) return;
    fl.emitEvent('staticClick', [new Event('click'), {}, fl.cells[index].element, index]);
  }

  // Monta os grupos a partir das cenas reais; cada item guarda o índice no carrossel.
  function buildGroups(scenes) {
    var used = {};
    scenes.forEach(function (s, i) {
      if (HIDDEN.some(function (h) { return norm(h) === norm(s.name); })) used[i] = true;
    });
    var groups = GROUPS.map(function (g) {
      var items = [];
      g.scenes.forEach(function (cfg) {
        for (var i = 0; i < scenes.length; i++) {
          if (!used[i] && norm(scenes[i].name) === norm(cfg.scene)) {
            used[i] = true;
            items.push({ index: i, label: cfg.label || scenes[i].name, scene: scenes[i] });
            break;
          }
        }
      });
      return { name: g.name, icon: g.icon, items: items };
    });
    var rest = [];
    scenes.forEach(function (s, i) { if (!used[i]) rest.push({ index: i, label: s.name, scene: s }); });
    if (rest.length) groups.push({ name: 'Outros', icon: 'fa-ellipsis-h', items: rest });
    return groups.filter(function (g) { return g.items.length; });
  }

  var panel, list, lastKey = '', openGroups = {};

  function render() {
    var scenes = Array.prototype.map.call(document.querySelectorAll('#themeListScene .itemScene'), function (el) {
      var img = el.querySelector('img'), title = el.querySelector('.--sceneTitle');
      return { src: img ? img.src : '', name: title ? title.textContent : '', active: el.classList.contains('active') };
    });
    var key = JSON.stringify(scenes);
    if (key === lastKey) return;
    var firstRender = !lastKey;
    lastKey = key;

    var groups = buildGroups(scenes);
    list.innerHTML = '';
    groups.forEach(function (g) {
      var current = g.items.some(function (it) { return it.scene.active; });
      if (firstRender && current) openGroups[g.name] = true;
      var wrap = document.createElement('div');
      wrap.className = 'sp-group' + (current ? ' current' : '') + (openGroups[g.name] ? ' open' : '');

      var gbtn = document.createElement('button');
      gbtn.className = 'sp-gbtn';
      gbtn.innerHTML = '<i class="far"></i><span></span>';
      gbtn.firstChild.classList.add(g.icon);
      gbtn.lastChild.textContent = g.name;
      wrap.appendChild(gbtn);

      if (g.items.length === 1) {
        // Área com uma cena só: o próprio botão leva até ela.
        gbtn.onclick = function () { goTo(g.items[0].index); };
      } else {
        gbtn.insertAdjacentHTML('beforeend', '<i class="fas fa-chevron-right sp-arrow"></i>');
        gbtn.onclick = function () {
          openGroups[g.name] = !openGroups[g.name];
          wrap.classList.toggle('open', openGroups[g.name]);
        };
        var sub = document.createElement('div');
        sub.className = 'sp-sub';
        g.items.forEach(function (it) {
          var btn = document.createElement('button');
          btn.className = 'sp-item' + (it.scene.active ? ' active' : '');
          btn.innerHTML = '<img alt=""><span></span>';
          btn.querySelector('img').src = it.scene.src;
          btn.querySelector('span').textContent = it.label;
          btn.onclick = function () { goTo(it.index); };
          sub.appendChild(btn);
        });
        wrap.appendChild(sub);
      }
      list.appendChild(wrap);
    });
    panel.style.display = scenes.length ? '' : 'none';
  }

  function init() {
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    panel = document.createElement('div');
    panel.id = 'scenePanel';
    panel.className = window.innerWidth > 600 ? 'open' : '';
    panel.style.display = 'none';
    panel.innerHTML = '<div class="sp-head"><i class="far fa-map-marked-alt"></i>Explore a Escola<i class="fas fa-chevron-right sp-arrow"></i></div><div class="sp-list"></div>';
    list = panel.querySelector('.sp-list');
    panel.querySelector('.sp-head').onclick = function () { panel.classList.toggle('open'); };
    document.body.appendChild(panel);

    new MutationObserver(render).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ['class'] });
    render();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
