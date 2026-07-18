/* Custom input builder — renders a form matching ALGO_META[algo].input,
   writes into App.customData[algo], then re-runs the generator. */

function esc(s){ return String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

function parseNums(str){
  return str.split(',').map(s=>s.trim()).filter(s=>s.length).map(Number).filter(n=>!isNaN(n));
}

function renderInputTab(algo){
  const ic=document.getElementById('input-content');
  const kind=ALGO_META[algo].input;
  const builders={
    array: buildArrayInput, search: buildSearchInput, string: buildStringInput,
    matrix: buildMatrixInput, activities: buildActivitiesInput, graph: buildGraphInput,
    items: buildItemsInput, jobs: buildJobsInput, sizes: buildSizesInput, n: buildNInput,
    setTarget: buildSetTargetInput, graphColor: buildGraphColorInput, itemsCap: buildItemsCapInput,
    twoStrings: buildTwoStringsInput, landscape: buildLandscapeInput, gaTarget: buildGaTargetInput,
    none: buildNoneInput,
  };
  ic.innerHTML = '<div class="input-panel"></div>';
  (builders[kind]||buildNoneInput)(algo, ic.querySelector('.input-panel'));
}

function applyAndRegenerate(algo){
  clearVizState();
  generateSteps(algo);
  renderVizStep();
  switchTab('viz');
  Sound.success();
}

function statusPill(container,msg,isErr){
  let el=container.querySelector('.status-pill');
  if(!el){ el=document.createElement('div'); el.className='status-pill'; container.appendChild(el); }
  el.classList.toggle('err',!!isErr);
  el.textContent=msg;
}

/* ── ARRAY (sorting / min-max) ── */
function buildArrayInput(algo, root){
  const cur = App.customData[algo]?.arr || arr;
  root.innerHTML=`
  <div class="input-group"><label class="input-label">Array values (comma separated)</label>
  <input class="input-field" id="ci-array" value="${cur.join(', ')}" placeholder="e.g. 42, 17, 8, 99, 5, 63">
  <div class="input-hint">2&ndash;16 numbers. Duplicates are fine.</div>
  <div class="input-error" id="ci-array-err"></div></div>
  <div class="chip-row">
    <span class="chip" id="ci-random">&#127922; Randomize</span>
    <span class="chip" id="ci-sorted">Preset: Already Sorted</span>
    <span class="chip" id="ci-reverse">Preset: Reverse Sorted</span>
    <span class="chip" id="ci-dup">Preset: Many Duplicates</span>
  </div>
  <button class="btn primary" id="ci-apply" style="margin-top:16px;">Run with this data</button>`;
  root.querySelector('#ci-random').onclick=()=>{ randArr(); root.querySelector('#ci-array').value=arr.join(', '); };
  root.querySelector('#ci-sorted').onclick=()=>{ root.querySelector('#ci-array').value='5, 12, 19, 27, 34, 41, 50, 58'; };
  root.querySelector('#ci-reverse').onclick=()=>{ root.querySelector('#ci-array').value='90, 78, 65, 52, 40, 28, 15, 3'; };
  root.querySelector('#ci-dup').onclick=()=>{ root.querySelector('#ci-array').value='7, 3, 7, 1, 3, 7, 9, 1'; };
  root.querySelector('#ci-apply').onclick=()=>{
    const nums=parseNums(root.querySelector('#ci-array').value);
    const err=root.querySelector('#ci-array-err');
    if(nums.length<2||nums.length>16){ err.textContent='Enter between 2 and 16 numbers.'; err.classList.add('show'); return; }
    err.classList.remove('show');
    App.customData[algo]={arr:nums};
    arr=[...nums];
    applyAndRegenerate(algo);
  };
}

/* ── SEARCH (linear / binary) ── */
function buildSearchInput(algo, root){
  const cd=App.customData[algo]||{};
  const curArr = cd.arr || arr;
  root.innerHTML=`
  <div class="input-group"><label class="input-label">Array values (comma separated)</label>
  <input class="input-field" id="ci-array" value="${curArr.join(', ')}">
  <div class="input-hint">${algo==='binary'?'Will be sorted automatically before the search runs.':'Order does not matter for Linear Search.'}</div></div>
  <div class="input-group"><label class="input-label">Target value to search for</label>
  <input class="input-field" id="ci-target" value="${cd.target!=null?cd.target:''}" placeholder="e.g. 27"></div>
  <div class="input-error" id="ci-array-err"></div>
  <button class="btn primary" id="ci-apply">Run with this data</button>`;
  root.querySelector('#ci-apply').onclick=()=>{
    const nums=parseNums(root.querySelector('#ci-array').value);
    const t=Number(root.querySelector('#ci-target').value);
    const err=root.querySelector('#ci-array-err');
    if(nums.length<2||nums.length>16||isNaN(t)){ err.textContent='Enter 2\u201316 numbers and a valid numeric target.'; err.classList.add('show'); return; }
    err.classList.remove('show');
    App.customData[algo]={arr:nums,target:t};
    applyAndRegenerate(algo);
  };
}

/* ── STRING (kmp / rabin) ── */
function buildStringInput(algo, root){
  const cd=App.customData[algo]||{};
  root.innerHTML=`
  <div class="input-group"><label class="input-label">Text</label>
  <input class="input-field" id="ci-text" value="${esc(cd.text||(algo==='kmp'?'AABAACAABAA':'ABCABC'))}"></div>
  <div class="input-group"><label class="input-label">Pattern</label>
  <input class="input-field" id="ci-pat" value="${esc(cd.pattern||(algo==='kmp'?'AABA':'ABC'))}"></div>
  <div class="input-hint">Uppercase letters recommended (A&ndash;Z). Keep text under 24 characters for a readable animation.</div>
  <div class="input-error" id="ci-str-err"></div>
  <button class="btn primary" id="ci-apply" style="margin-top:10px;">Run with this data</button>`;
  root.querySelector('#ci-apply').onclick=()=>{
    const text=root.querySelector('#ci-text').value.trim().toUpperCase();
    const pat=root.querySelector('#ci-pat').value.trim().toUpperCase();
    const err=root.querySelector('#ci-str-err');
    if(!text||!pat||pat.length>text.length||text.length>24){ err.textContent='Enter a non-empty text (\u226424 chars) and a pattern no longer than the text.'; err.classList.add('show'); return; }
    err.classList.remove('show');
    App.customData[algo]={text,pattern:pat};
    applyAndRegenerate(algo);
  };
}

/* ── MATRIX (strassen, fixed 2x2) ── */
function buildMatrixInput(algo, root){
  const cd=App.customData[algo]||{A:[[1,2],[3,4]],B:[[5,6],[7,8]]};
  function grid(id,m){
    return `<div class="input-group"><label class="input-label">Matrix ${id}</label>
    <div style="display:grid;grid-template-columns:repeat(2,70px);gap:8px;">
    ${m.flat().map((v,i)=>`<input class="input-field" data-m="${id}" data-i="${i}" value="${v}">`).join('')}</div></div>`;
  }
  root.innerHTML = grid('A',cd.A) + grid('B',cd.B) + `<button class="btn primary" id="ci-apply" style="margin-top:10px;">Run with this data</button>`;
  root.querySelector('#ci-apply').onclick=()=>{
    function read(id){ const vals=[...root.querySelectorAll(`[data-m="${id}"]`)].map(i=>Number(i.value)||0); return [[vals[0],vals[1]],[vals[2],vals[3]]]; }
    App.customData[algo]={A:read('A'),B:read('B')};
    applyAndRegenerate(algo);
  };
}

/* ── ACTIVITIES ── */
function buildActivitiesInput(algo, root){
  const cd=App.customData[algo]?.acts || [{id:'A1',s:1,f:4},{id:'A2',s:3,f:5},{id:'A3',s:0,f:6},{id:'A4',s:5,f:7},{id:'A5',s:8,f:9},{id:'A6',s:5,f:9}];
  renderEditableRows(root,'Activities (id, start, finish)',cd.map(a=>[a.id,a.s,a.f]),['ID','Start','Finish'],rows=>{
    const acts=rows.map((r,i)=>({id:r[0]||('A'+(i+1)),s:Number(r[1])||0,f:Number(r[2])||1}));
    App.customData[algo]={acts};
    applyAndRegenerate(algo);
  });
}

/* ── ITEMS (fractional knapsack) ── */
function buildItemsInput(algo, root){
  const cd=App.customData[algo]?.items || [{w:10,v:60},{w:20,v:100},{w:30,v:120}];
  const W=App.customData[algo]?.W || 50;
  const wrap=document.createElement('div');
  root.appendChild(wrap);
  renderEditableRows(wrap,'Items (weight, value)',cd.map(it=>[it.w,it.v]),['Weight','Value'],rows=>{}, true);
  const capDiv=document.createElement('div');
  capDiv.className='input-group';
  capDiv.innerHTML=`<label class="input-label">Knapsack capacity (W)</label><input class="input-field" id="ci-cap" value="${W}" style="max-width:140px;">`;
  root.appendChild(capDiv);
  const btn=document.createElement('button'); btn.className='btn primary'; btn.textContent='Run with this data'; root.appendChild(btn);
  btn.onclick=()=>{
    const rows=readEditableRows(wrap);
    const items=rows.map(r=>({w:Number(r[0])||1,v:Number(r[1])||1}));
    const W2=Number(document.getElementById('ci-cap').value)||50;
    App.customData[algo]={items,W:W2};
    applyAndRegenerate(algo);
  };
}

/* ── ITEMS + CAPACITY (0/1 knapsack) ── */
function buildItemsCapInput(algo, root){ buildItemsInput(algo, root); }

/* ── JOBS ── */
function buildJobsInput(algo, root){
  const cd=App.customData[algo]?.jobs || [{id:'J1',d:2,p:100},{id:'J2',d:1,p:19},{id:'J3',d:2,p:27},{id:'J4',d:1,p:25},{id:'J5',d:3,p:15}];
  renderEditableRows(root,'Jobs (id, deadline, profit)',cd.map(j=>[j.id,j.d,j.p]),['ID','Deadline','Profit'],rows=>{
    const jobs=rows.map((r,i)=>({id:r[0]||('J'+(i+1)),d:Number(r[1])||1,p:Number(r[2])||0}));
    App.customData[algo]={jobs};
    applyAndRegenerate(algo);
  });
}

/* ── SIZES (optimal merge pattern) ── */
function buildSizesInput(algo, root){
  const cd=App.customData[algo]?.sizes || [20,30,10,5,30];
  root.innerHTML=`<div class="input-group"><label class="input-label">File sizes (comma separated)</label>
  <input class="input-field" id="ci-sizes" value="${cd.join(', ')}"></div>
  <div class="input-error" id="ci-sizes-err"></div>
  <button class="btn primary" id="ci-apply">Run with this data</button>`;
  root.querySelector('#ci-apply').onclick=()=>{
    const nums=parseNums(root.querySelector('#ci-sizes').value);
    const err=root.querySelector('#ci-sizes-err');
    if(nums.length<2||nums.length>10){ err.textContent='Enter 2\u201310 file sizes.'; err.classList.add('show'); return; }
    err.classList.remove('show');
    App.customData[algo]={sizes:nums};
    applyAndRegenerate(algo);
  };
}

/* ── N (n-queens) ── */
function buildNInput(algo, root){
  const cd=App.customData[algo]?.n || 4;
  root.innerHTML=`<div class="input-group"><label class="input-label">Board size N</label>
  <input class="input-field" id="ci-n" value="${cd}" style="max-width:100px;">
  <div class="input-hint">4\u20136 recommended for a readable animation (larger boards = many more steps).</div></div>
  <div class="input-error" id="ci-n-err"></div>
  <button class="btn primary" id="ci-apply">Run with this data</button>`;
  root.querySelector('#ci-apply').onclick=()=>{
    const n=Number(root.querySelector('#ci-n').value);
    const err=root.querySelector('#ci-n-err');
    if(!n||n<4||n>7){ err.textContent='Choose N between 4 and 7.'; err.classList.add('show'); return; }
    err.classList.remove('show');
    App.customData[algo]={n};
    applyAndRegenerate(algo);
  };
}

/* ── SET + TARGET (subset sum) ── */
function buildSetTargetInput(algo, root){
  const cd=App.customData[algo]||{set:[3,7,9,12,5],target:15};
  root.innerHTML=`<div class="input-group"><label class="input-label">Number set (comma separated)</label>
  <input class="input-field" id="ci-set" value="${cd.set.join(', ')}"></div>
  <div class="input-group"><label class="input-label">Target sum</label>
  <input class="input-field" id="ci-target" value="${cd.target}" style="max-width:140px;"></div>
  <div class="input-error" id="ci-st-err"></div>
  <button class="btn primary" id="ci-apply">Run with this data</button>`;
  root.querySelector('#ci-apply').onclick=()=>{
    const nums=parseNums(root.querySelector('#ci-set').value);
    const t=Number(root.querySelector('#ci-target').value);
    const err=root.querySelector('#ci-st-err');
    if(nums.length<2||nums.length>8||isNaN(t)){ err.textContent='Enter 2\u20138 positive numbers and a target.'; err.classList.add('show'); return; }
    err.classList.remove('show');
    App.customData[algo]={set:nums,target:t};
    applyAndRegenerate(algo);
  };
}

/* ── LANDSCAPE (hill climbing) ── */
function buildLandscapeInput(algo, root){
  const cd=App.customData[algo]?.values || null;
  const dv=cd||Array.from({length:10},(_,i)=>Math.round(10*Math.sin(i*0.8+1)+15));
  root.innerHTML=`<div class="input-group"><label class="input-label">Landscape heights (comma separated)</label>
  <input class="input-field" id="ci-land" value="${dv.join(', ')}"></div>
  <div class="input-hint">6\u201314 values. Try a "bumpy" sequence to see hill climbing get stuck in a local peak!</div>
  <div class="input-error" id="ci-land-err"></div>
  <button class="btn primary" id="ci-apply">Run with this data</button>`;
  root.querySelector('#ci-apply').onclick=()=>{
    const nums=parseNums(root.querySelector('#ci-land').value);
    const err=root.querySelector('#ci-land-err');
    if(nums.length<6||nums.length>14){ err.textContent='Enter 6\u201314 numbers.'; err.classList.add('show'); return; }
    err.classList.remove('show');
    App.customData[algo]={values:nums};
    applyAndRegenerate(algo);
  };
}

/* ── GA TARGET ── */
function buildGaTargetInput(algo, root){
  const t=App.customData[algo]?.target || 20;
  root.innerHTML=`<div class="input-group"><label class="input-label">Target value the population should evolve toward</label>
  <input class="input-field" id="ci-gat" value="${t}" style="max-width:140px;"></div>
  <button class="btn primary" id="ci-apply">Run with this data</button>`;
  root.querySelector('#ci-apply').onclick=()=>{
    const t2=Number(root.querySelector('#ci-gat').value)||20;
    App.customData[algo]={target:t2};
    applyAndRegenerate(algo);
  };
}

/* ── NONE (theory topics) ── */
function buildNoneInput(algo, root){
  root.innerHTML=`<div class="empty-hint">This is a theory topic \u2014 no runnable dataset. Head to the <b>Learn</b> and <b>Pseudocode</b> tabs.</div>`;
}

/* ── GRAPH-COLOR (small custom adjacency via toggle grid) ── */
function buildGraphColorInput(algo, root){
  const cd=App.customData[algo]||{n:5,m:3,adj:[[0,1,1,0,0],[1,0,1,1,0],[1,1,0,0,1],[0,1,0,0,1],[0,0,1,1,0]]};
  let n=cd.n;
  function grid(){
    let html=`<div style="display:inline-block;">`;
    for(let i=0;i<n;i++){
      html+=`<div style="display:flex;">`;
      for(let j=0;j<n;j++){
        const on = i!==j && cd.adj[i][j];
        html+=`<div class="q-cell gc-cell" data-i="${i}" data-j="${j}" style="width:30px;height:30px;font-size:11px;cursor:${i===j?'default':'pointer'};background:${i===j?'var(--ink-700)':on?'rgba(90,209,255,.25)':'var(--ink-800)'};border:1px solid var(--line);color:var(--text-dim);">${i===j?'':on?'\u25CF':''}</div>`;
      }
      html+=`</div>`;
    }
    html+=`</div>`;
    return html;
  }
  root.innerHTML=`<div class="input-group"><label class="input-label">Number of vertices</label>
  <input class="input-field" id="ci-gcn" value="${n}" style="max-width:100px;"></div>
  <div class="input-group"><label class="input-label">Max colors (m)</label>
  <input class="input-field" id="ci-gcm" value="${cd.m}" style="max-width:100px;"></div>
  <div class="input-group"><label class="input-label">Click cells to toggle an edge (symmetric)</label><div id="ci-gcgrid">${grid()}</div></div>
  <button class="btn primary" id="ci-apply">Run with this data</button>`;
  function rebind(){
    root.querySelectorAll('.gc-cell').forEach(c=>{
      c.onclick=()=>{
        const i=+c.dataset.i, j=+c.dataset.j;
        if(i===j) return;
        cd.adj[i][j]=cd.adj[i][j]?0:1; cd.adj[j][i]=cd.adj[i][j];
        document.getElementById('ci-gcgrid').innerHTML=grid();
        rebind();
      };
    });
  }
  rebind();
  root.querySelector('#ci-gcn').addEventListener('change',e=>{
    const newN=Math.max(3,Math.min(6,Number(e.target.value)||5));
    const newAdj=Array.from({length:newN},(_,i)=>Array.from({length:newN},(_,j)=>i<cd.n&&j<cd.n?cd.adj[i][j]:0));
    cd.adj=newAdj; cd.n=n=newN;
    document.getElementById('ci-gcgrid').innerHTML=grid(); rebind();
  });
  root.querySelector('#ci-apply').onclick=()=>{
    const m=Math.max(2,Math.min(4,Number(root.querySelector('#ci-gcm').value)||3));
    App.customData[algo]={n:cd.n,m,adj:cd.adj};
    applyAndRegenerate(algo);
  };
}

/* ── TWO STRINGS (LCS) ── */
function buildTwoStringsInput(algo, root){
  const cd=App.customData[algo]||{X:'ABCBD',Y:'ABDC'};
  root.innerHTML=`<div class="input-group"><label class="input-label">String X</label><input class="input-field" id="ci-x" value="${esc(cd.X)}"></div>
  <div class="input-group"><label class="input-label">String Y</label><input class="input-field" id="ci-y" value="${esc(cd.Y)}"></div>
  <div class="input-hint">Keep both under 10 characters for a readable DP table.</div>
  <div class="input-error" id="ci-xy-err"></div>
  <button class="btn primary" id="ci-apply">Run with this data</button>`;
  root.querySelector('#ci-apply').onclick=()=>{
    const X=root.querySelector('#ci-x').value.trim().toUpperCase();
    const Y=root.querySelector('#ci-y').value.trim().toUpperCase();
    const err=root.querySelector('#ci-xy-err');
    if(!X||!Y||X.length>10||Y.length>10){ err.textContent='Enter two non-empty strings, each \u226410 characters.'; err.classList.add('show'); return; }
    err.classList.remove('show');
    App.customData[algo]={X,Y};
    applyAndRegenerate(algo);
  };
}

/* ── generic editable row list (activities / jobs / items) ── */
function renderEditableRows(root,label,rowsData,colLabels,onApply,skipButton){
  const wrap=document.createElement('div');
  wrap.className='input-group';
  wrap.innerHTML=`<label class="input-label">${label}</label>
  <div class="item-editor-row" style="font-size:10px;color:var(--text-faint);">${colLabels.map(c=>`<div>${c}</div>`).join('')}<div></div></div>
  <div id="rows-holder"></div>
  <span class="chip" id="add-row">+ Add row</span>`;
  root.appendChild(wrap);
  const holder=wrap.querySelector('#rows-holder');
  function addRow(vals){
    const row=document.createElement('div'); row.className='item-editor-row';
    row.innerHTML = vals.map(v=>`<input value="${v}">`).join('') + `<button class="rm-btn">&times;</button>`;
    row.querySelector('.rm-btn').onclick=()=>row.remove();
    holder.appendChild(row);
  }
  rowsData.forEach(r=>addRow(r));
  wrap.querySelector('#add-row').onclick=()=>addRow(colLabels.map(()=>''));
  if(!skipButton){
    const btn=document.createElement('button'); btn.className='btn primary'; btn.textContent='Run with this data'; btn.style.marginTop='10px';
    root.appendChild(btn);
    btn.onclick=()=>onApply(readEditableRows(wrap));
  }
  wrap._reader=()=>readEditableRows(wrap);
}
function readEditableRows(wrap){
  return [...wrap.querySelectorAll('.item-editor-row')].filter(r=>r.querySelector('.rm-btn')).map(r=>[...r.querySelectorAll('input')].map(i=>i.value));
}

/* ── VISUAL GRAPH BUILDER (kruskal/prim/dijkstra/floyd/vertexcover/tsp) ── */
function buildGraphInput(algo, root){
  const cd = App.customData[algo] || defaultGraphFor(algo);
  let mode='node'; // node | edge | delete
  let pendingNode=null;
  root.innerHTML = `
  <div class="graph-builder">
    <div class="gb-canvas-wrap">
      <div class="gb-toolbar">
        <button class="gb-mode-btn active" data-m="node">&#8853; Add Node</button>
        <button class="gb-mode-btn" data-m="edge">&#8594; Add Edge</button>
        <button class="gb-mode-btn" data-m="delete">&#10005; Delete</button>
        <span style="flex:1;"></span>
        <span class="chip" id="gb-clear">Clear</span>
        <span class="chip" id="gb-preset">Load Preset</span>
      </div>
      <svg class="gb-canvas" id="gb-svg" viewBox="0 0 600 340"></svg>
    </div>
    <div class="gb-side">
      <div class="input-hint" id="gb-hint">Click empty canvas to place a node.</div>
      <div class="input-label">Edges</div>
      <div class="gb-edge-list" id="gb-edge-list"></div>
      <button class="btn primary" id="ci-apply" style="margin-top:6px;">Run with this graph</button>
      <div class="input-error" id="gb-err"></div>
    </div>
  </div>`;

  function letterFor(i){ return String.fromCharCode(65+i); }
  function redraw(){
    const svg=root.querySelector('#gb-svg');
    let html='';
    cd.edges.forEach(([a,b,w])=>{
      const pa=cd.pos[a], pb=cd.pos[b]; if(!pa||!pb) return;
      html+=`<line x1="${pa[0]}" y1="${pa[1]}" x2="${pb[0]}" y2="${pb[1]}" class="g-edge" data-edge="${a}|${b}" style="cursor:${mode==='delete'?'pointer':'default'};stroke-width:2;"/>`;
      const mx=(pa[0]+pb[0])/2, my=(pa[1]+pb[1])/2;
      html+=`<rect x="${mx-11}" y="${my-9}" width="22" height="16" rx="4" fill="#0e131e" stroke="#22314a"/><text x="${mx}" y="${my+3}" text-anchor="middle" style="font-size:10px;fill:#ffb454;font-family:monospace;">${w}</text>`;
    });
    cd.nodes.forEach(n=>{
      const p=cd.pos[n];
      const isPending = pendingNode===n;
      html+=`<circle cx="${p[0]}" cy="${p[1]}" r="18" fill="${isPending?'rgba(255,180,84,.3)':'#121826'}" stroke="${isPending?'#ffb454':'#5ad1ff'}" stroke-width="2" data-node="${n}" style="cursor:pointer;"/>`;
      html+=`<text x="${p[0]}" y="${p[1]+4}" text-anchor="middle" style="font-size:13px;font-weight:700;fill:#eaf1fb;font-family:sans-serif;pointer-events:none;">${n}</text>`;
    });
    svg.innerHTML=html;
    svg.querySelectorAll('[data-node]').forEach(el=>el.addEventListener('click',ev=>{ev.stopPropagation();onNodeClick(el.dataset.node);}));
    svg.querySelectorAll('[data-edge]').forEach(el=>el.addEventListener('click',ev=>{ev.stopPropagation();onEdgeClick(el.dataset.edge);}));
    refreshEdgeList();
  }
  function refreshEdgeList(){
    const el=root.querySelector('#gb-edge-list');
    el.innerHTML = cd.edges.length ? cd.edges.map(([a,b,w],i)=>`<div class="gb-edge-row"><span>${a} &ndash; ${b} (${w})</span><button data-i="${i}">&times;</button></div>`).join('') : '<div style="color:var(--text-faint);font-size:11px;">No edges yet.</div>';
    el.querySelectorAll('button').forEach(b=>b.onclick=()=>{ cd.edges.splice(+b.dataset.i,1); redraw(); });
  }
  function onNodeClick(n){
    if(mode==='delete'){
      cd.nodes=cd.nodes.filter(x=>x!==n);
      cd.edges=cd.edges.filter(([a,b])=>a!==n&&b!==n);
      delete cd.pos[n]; redraw(); return;
    }
    if(mode==='edge'){
      if(!pendingNode){ pendingNode=n; redraw(); }
      else if(pendingNode!==n){
        const w=Number(prompt('Edge weight between '+pendingNode+' and '+n+':','1'))||1;
        cd.edges.push([pendingNode,n,w]);
        pendingNode=null; redraw();
      } else { pendingNode=null; redraw(); }
    }
  }
  function onEdgeClick(key){
    if(mode!=='delete') return;
    const [a,b]=key.split('|');
    cd.edges=cd.edges.filter(e=>!(e[0]===a&&e[1]===b));
    redraw();
  }
  root.querySelector('#gb-svg').addEventListener('click',ev=>{
    if(mode!=='node') return;
    const svg=root.querySelector('#gb-svg');
    const pt=svg.createSVGPoint(); pt.x=ev.clientX; pt.y=ev.clientY;
    const loc=pt.matrixTransform(svg.getScreenCTM().inverse());
    if(cd.nodes.length>=9){ return; }
    const id=letterFor(cd.nodes.length);
    cd.nodes.push(id); cd.pos[id]=[Math.round(loc.x),Math.round(loc.y)];
    redraw();
  });
  root.querySelectorAll('.gb-mode-btn').forEach(b=>b.addEventListener('click',()=>{
    root.querySelectorAll('.gb-mode-btn').forEach(x=>x.classList.remove('active'));
    b.classList.add('active'); mode=b.dataset.m; pendingNode=null;
    root.querySelector('#gb-hint').textContent = mode==='node'?'Click empty canvas to place a node.':mode==='edge'?'Click a node, then a second node, to connect them.':'Click a node or edge to delete it.';
    redraw();
  }));
  root.querySelector('#gb-clear').onclick=()=>{ cd.nodes=[]; cd.edges=[]; cd.pos={}; redraw(); };
  root.querySelector('#gb-preset').onclick=()=>{ const d=defaultGraphFor(algo); cd.nodes=[...d.nodes]; cd.edges=d.edges.map(e=>[...e]); cd.pos=JSON.parse(JSON.stringify(d.pos)); redraw(); };
  root.querySelector('#ci-apply').onclick=()=>{
    const err=root.querySelector('#gb-err');
    if(cd.nodes.length<2||cd.edges.length<1){ err.textContent='Add at least 2 nodes and 1 edge.'; err.classList.add('show'); return; }
    err.classList.remove('show');
    App.customData[algo]={nodes:[...cd.nodes],edges:cd.edges.map(e=>[...e]),pos:JSON.parse(JSON.stringify(cd.pos))};
    applyAndRegenerate(algo);
  };
  redraw();
}

function defaultGraphFor(algo){
  return {nodes:['A','B','C','D','E'],
    pos:{A:[80,150],B:[220,60],C:[220,240],D:[400,150],E:[400,290]},
    edges:[['A','B',4],['A','C',1],['C','B',2],['B','D',5],['C','D',8],['D','E',3],['C','E',10]]};
}
