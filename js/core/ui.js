/* UI: sidebar, tabs, step-log formatting, and all visualization renderers */
function rng(a,b){ return Array.from({length:b-a},(_,i)=>i+a); }
function maxArr(a){ return Math.max(...a); }
function minArr(a){ return Math.min(...a); }

function buildSidebar(){
  const el=document.getElementById('sidebar-list');
  let html='';
  CATEGORIES.forEach(cat=>{
    html+=`<div class="cat-header">${cat.name}</div>`;
    cat.items.forEach(id=>{
      const m=ALGO_META[id];
      html+=`<div class="algo-item" data-algo="${id}"><span class="algo-name">${m.title}</span><span class="algo-tag ${tagClassFor(m.time)}">${m.time}</span></div>`;
    });
  });
  el.innerHTML=html;
  el.querySelectorAll('.algo-item').forEach(it=>{
    it.addEventListener('click',()=>{ Sound.click(); selectAlgo(it.dataset.algo); if(window.innerWidth<=860) document.getElementById('sidebar').classList.remove('open'); });
  });
}

function filterSidebar(q){
  q=q.toLowerCase();
  document.querySelectorAll('.algo-item').forEach(el=>{ el.style.display = el.textContent.toLowerCase().includes(q) ? '' : 'none'; });
}

function setMsg(msg){
  document.getElementById('step-msg').innerHTML = (msg||'')
    .replace(/\[b\](.*?)\[\/b\]/g,'<span class="hl-a">$1</span>')
    .replace(/\[g\](.*?)\[\/g\]/g,'<span class="hl-g">$1</span>')
    .replace(/\[w\](.*?)\[\/w\]/g,'<span class="hl-w">$1</span>')
    .replace(/\[r\](.*?)\[\/r\]/g,'<span class="hl-r">$1</span>');
}

/* ═══════ RENDER DISPATCH ═══════ */
function renderVizStep(){
  const vc=document.getElementById('viz-content');
  const lg=document.getElementById('viz-legend');
  if(!App.steps.length){ vc.innerHTML=`<div class="empty-hint">Press <b>&#9654; Play</b> or <b>Step</b> to begin the visualization.</div>`; lg.innerHTML=''; return; }
  const s=App.steps[Math.min(App.stepIdx,App.steps.length-1)];
  if(s.type==='theory'){ vc.innerHTML=`<div class="empty-hint" style="padding:50px 10px;"><div style="font-size:38px;margin-bottom:10px;">&#128214;</div>Switch to the <b>Learn</b> or <b>Complexity</b> tab to explore this topic in depth.</div>`; lg.innerHTML=''; return; }
  const R={
    array:renderArray, string:renderString, matrix:renderMatrix, activity:renderActivity,
    graph:renderGraph, nqueens:renderQueens, subset:renderSubset, graphcolor:renderGColor,
    dp_knapsack:renderDPKnapsack, dp_lcs:renderDPLCS, dp_floyd:renderFloydMat,
    vertex_cover:renderVertexCover, tsp:renderTSPViz, hillclimb:renderHillClimb, genetic:renderGenetic,
    knapsack_frac:renderFracKnap, jobseq:renderJobSeq, merge_pattern:renderMergePat,
  };
  if(R[s.type]) R[s.type](s,vc,lg);
  const canvasEl=document.getElementById('viz-canvas');
  if(s.snd){
    const mn=s.mn!=null?s.mn:10, mx=s.mx!=null?s.mx:100;
    if(s.snd==='compare'&&s.sv) Sound.compare(s.sv[0],mn,mx);
    else if(s.snd==='swap'&&s.sv) Sound.swap(s.sv[0],s.sv[1]!=null?s.sv[1]:s.sv[0],mn,mx);
    else if(s.snd==='place') Sound.place();
    else if(s.snd==='reject') Sound.reject();
    else if(s.snd==='done'){ Sound.success(); canvasEl.classList.add('success-pulse'); setTimeout(()=>canvasEl.classList.remove('success-pulse'),1400); }
    else if(s.snd==='back') Sound.backtrack();
  }
  updateUI();
}

function updateUI(){
  const s=App.steps.length, i=App.stepIdx;
  document.getElementById('step-ctr').textContent = `${Math.min(i+1,s)} / ${s}`;
  document.getElementById('prog-fill').style.width = s>1 ? `${i/(s-1)*100}%` : '0%';
  document.getElementById('btn-step').disabled = s===0 || i>=s-1;
  document.getElementById('btn-play').disabled = s===0;
  if(App.steps[i]) setMsg(App.steps[i].msg||'');
}

/* ═══════ ARRAY ═══════ */
function renderArray(s,vc,lg){
  const a=s.arr||[], mx=maxArr(a)||1, mn2=minArr(a)||0;
  const compare=s.compare||[], swap_=s.swap||[], sorted=s.sorted||[];
  const found=s.found!=null?s.found:-99, elim=s.elim||[];
  const mid=s.mid!=null?s.mid:-1, lo=s.lo!=null?s.lo:-1, hi=s.hi!=null?s.hi:-1;
  const minIdx=s.minIdx!=null?s.minIdx:-1, pivot=s.pivot!=null?s.pivot:-1;
  const hl=s.hl||[], cur=s.current||[];
  function cls(i){
    if(found===i) return 'found';
    if(found===-2) return 'eliminated';
    if(swap_.includes(i)) return 'swapping';
    if(compare.includes(i)) return 'comparing';
    if(sorted.includes(i)) return 'sorted';
    if(pivot===i) return 'pivot';
    if(minIdx===i) return 'current';
    if(hl.includes(i)) return 'sorted';
    if(mid===i) return 'current';
    if(elim.includes(i)) return 'eliminated';
    if(cur.includes&&cur.includes(i)) return 'comparing';
    return 'default';
  }
  const maxH=120;
  let bars='',cells='',idxs='',ptrs='';
  a.forEach((v,i)=>{
    const h=Math.max(6,Math.round((v-mn2)/(mx-mn2||1)*maxH));
    const c=cls(i);
    bars+=`<div class="bar-wrap"><div class="bar ${c}" style="height:${h}px;"></div></div>`;
    cells+=`<div class="cell ${c}">${v}</div>`;
    idxs+=`<div class="idx">${i}</div>`;
    let p='';
    if(i===lo) p='lo'; if(i===hi) p=(p?p+'/':'')+'hi'; if(i===mid) p=(p?p+'/':'')+'mid';
    ptrs+=`<div class="ptr ${p}">${p}</div>`;
  });
  let targetLine='';
  if(s.target!==undefined) targetLine=`<div style="margin-top:10px;font-size:12px;color:var(--text-dim);">Target: <span style="color:var(--signal-amber);font-family:var(--font-mono);font-weight:700;">${s.target}</span>${found>=0?' &#10003; found at index '+found:found===-2?' &#10007; not found':''}</div>`;
  vc.innerHTML=`<div class="array-wrap"><div class="bar-chart">${bars}</div><div class="cell-row">${cells}</div><div class="idx-row">${idxs}</div><div class="ptr-row">${ptrs}</div>${targetLine}</div>`;
  lg.innerHTML=`<div class="legend-item"><div class="legend-dot" style="background:rgba(62,230,184,.5);border:1px solid var(--signal-teal);"></div>Sorted</div>
  <div class="legend-item"><div class="legend-dot" style="background:rgba(90,209,255,.55);border:1px solid var(--signal-cyan);"></div>Comparing</div>
  <div class="legend-item"><div class="legend-dot" style="background:rgba(255,107,122,.6);border:1px solid var(--signal-coral);"></div>Swapping</div>
  <div class="legend-item"><div class="legend-dot" style="background:rgba(255,180,84,.6);border:1px solid var(--signal-amber);"></div>Pivot</div>
  <div class="legend-item"><div class="legend-dot" style="background:rgba(180,140,255,.6);border:1px solid var(--signal-violet);"></div>Active</div>`;
}

/* ═══════ STRING ═══════ */
function renderString(s,vc,lg){
  const {text,pattern,textHL=[],patHL=[],lps=[],activeLPS=-1,matches=[],hashInfo}=s;
  function spanStr(str,hlIdxs){
    return str.split('').map((c,i)=>`<span class="str-char ${hlIdxs.includes(i)?'hl':''}">${c}</span>`).join('');
  }
  let matchHL=[]; matches.forEach(m=>{for(let k=m;k<m+pattern.length;k++)matchHL.push(k);});
  let lpsHtml='';
  if(lps.length>0) lpsHtml=`<div style="margin-top:14px;"><div style="font-size:11px;color:var(--text-dim);margin-bottom:6px;">LPS / Failure Function:</div><div style="display:flex;gap:3px;">${lps.map((v,i)=>`<div style="min-width:30px;height:30px;line-height:30px;text-align:center;border-radius:6px;font-family:var(--font-mono);font-size:12px;border:1px solid ${i===activeLPS?'var(--signal-cyan)':'var(--line)'};background:${i===activeLPS?'rgba(90,209,255,.15)':'var(--ink-800)'};color:${i===activeLPS?'var(--signal-cyan)':'var(--text)'};">${v}</div>`).join('')}</div></div>`;
  let hashHtml='';
  if(hashInfo) hashHtml=`<div style="margin-top:10px;font-size:12px;color:var(--text-dim);">Pattern hash: <span style="color:var(--signal-amber);font-family:var(--font-mono);">${hashInfo.ph}</span> | Window hash: <span style="color:var(--signal-cyan);font-family:var(--font-mono);">${hashInfo.wh??'&mdash;'}</span></div>`;
  let matchHtml='';
  if(matches.length>0) matchHtml=`<div style="margin-top:8px;font-size:12px;color:var(--signal-teal);">&#10003; Matches at indices: [${matches.join(', ')}]</div>`;
  vc.innerHTML=`<div>
    <div style="margin-bottom:12px;"><div style="font-size:11px;color:var(--text-dim);margin-bottom:5px;">Text:</div>${spanStr(text,[...textHL,...matchHL])}</div>
    <div style="margin-bottom:6px;"><div style="font-size:11px;color:var(--text-dim);margin-bottom:5px;">Pattern:</div>${spanStr(pattern,patHL)}</div>
    ${lpsHtml}${hashHtml}${matchHtml}</div>`;
  lg.innerHTML='';
}

/* ═══════ MATRIX ═══════ */
function renderMatrix(s,vc,lg){
  const {A,B,products,result}=s;
  function mat2html(m,label,color){
    if(!m) return '';
    return `<div style="display:inline-block;margin:0 12px 10px 0;text-align:center;"><div style="font-size:11px;color:var(--text-dim);margin-bottom:5px;">${label}</div><table style="border-collapse:collapse;">${m.map(r=>`<tr>${r.map(v=>`<td style="border:1px solid var(--line);padding:7px 11px;font-family:var(--font-mono);font-size:13px;color:${color};background:var(--ink-800);">${v}</td>`).join('')}</tr>`).join('')}</table></div>`;
  }
  const pKeys=Object.keys(products||{});
  const pHtml=pKeys.map(k=>`<div style="margin:3px 0;font-size:12px;font-family:var(--font-mono);color:var(--text-dim);"><span style="color:var(--signal-amber);">${k}</span> = <span style="color:var(--signal-teal);">${products[k]}</span></div>`).join('');
  vc.innerHTML=`<div style="display:flex;flex-wrap:wrap;gap:6px;align-items:flex-start;">
    ${mat2html(A,'Matrix A','#5ad1ff')}${mat2html(B,'Matrix B','#3ee6b8')}${result?mat2html(result,'Result C = A\u00d7B','#ffb454'):''}
    ${pKeys.length?`<div style="flex:1;min-width:160px;"><div style="font-size:11px;color:var(--text-dim);margin-bottom:6px;">Strassen Products:</div>${pHtml}</div>`:''}</div>`;
  lg.innerHTML='';
}

/* ═══════ ACTIVITY (interval schedule) ═══════ */
function renderActivity(s,vc,lg){
  const {acts,selected=[],rejected=[],current}=s;
  const maxT=Math.max(...acts.map(a=>a.f),1);
  const w=480,h=acts.length*28+40;
  let svg=`<svg viewBox="0 0 ${w} ${h}" style="max-width:100%;overflow:visible;">`;
  for(let t=0;t<=maxT;t++){const x=42+t*(w-56)/maxT;svg+=`<line x1="${x}" y1="18" x2="${x}" y2="${h}" stroke="var(--line-soft)" stroke-width="0.5"/><text x="${x}" y="15" text-anchor="middle" style="font-size:9px;fill:var(--text-faint);font-family:var(--font-mono);">${t}</text>`;}
  acts.forEach((a,i)=>{
    const y=22+i*28,x1=42+a.s*(w-56)/maxT,x2=42+a.f*(w-56)/maxT,bw=Math.max(2,x2-x1);
    const isCur=current===i, isSel=selected.includes(i), isRej=rejected.includes(i);
    const fill=isSel?'rgba(62,230,184,.28)':isRej?'rgba(255,107,122,.18)':isCur?'rgba(90,209,255,.28)':'var(--ink-800)';
    const stroke=isSel?'var(--signal-teal)':isRej?'var(--signal-coral)':isCur?'var(--signal-cyan)':'var(--line)';
    svg+=`<rect x="${x1}" y="${y}" width="${bw}" height="20" rx="4" fill="${fill}" stroke="${stroke}" stroke-width="${isSel||isCur?1.5:0.8}"/>`;
    svg+=`<text x="${x1+bw/2}" y="${y+13}" text-anchor="middle" style="font-size:10px;fill:${isSel?'var(--signal-teal)':isCur?'var(--signal-cyan)':'var(--text-dim)'};font-family:var(--font-body);font-weight:${isSel?'600':'400'};">${a.id}</text>`;
  });
  svg+=`</svg>`;
  const selNames=selected.map(i=>acts[i].id);
  vc.innerHTML=`<div>${svg}<div style="margin-top:8px;font-size:12px;color:var(--text-dim);">Selected: <span style="color:var(--signal-teal);font-weight:600;">${selNames.join(', ')||'None yet'}</span></div></div>`;
  lg.innerHTML=`<div class="legend-item"><div class="legend-dot" style="background:rgba(62,230,184,.3);border:1px solid var(--signal-teal);"></div>Selected</div>
  <div class="legend-item"><div class="legend-dot" style="background:rgba(90,209,255,.3);border:1px solid var(--signal-cyan);"></div>Considering</div>
  <div class="legend-item"><div class="legend-dot" style="background:rgba(255,107,122,.18);border:1px solid var(--signal-coral);"></div>Rejected</div>`;
}

/* ═══════ GRAPH ═══════ */
function renderGraph(s,vc,lg){
  const {graph,mst=[],rejected=[],current,visited={},dist={}}=s;
  const {nodes,edges,pos}=graph;
  const mstSet=new Set(mst.map(([a,b])=>a+'-'+b+'|'+b+'-'+a));
  const rejSet=new Set(rejected.map(([a,b])=>a+'-'+b+'|'+b+'-'+a));
  const w=440,h=270;
  let svg=`<svg viewBox="0 0 ${w} ${h}" style="max-width:100%;overflow:visible;">`;
  edges.forEach(([a,b,wt])=>{
    const [x1,y1]=pos[a],[x2,y2]=pos[b];
    const isMST=mstSet.has(a+'-'+b)||mstSet.has(b+'-'+a);
    const isRej=rejSet.has(a+'-'+b)||rejSet.has(b+'-'+a);
    const isCur=Array.isArray(current)&&((current[0]===a&&current[1]===b)||(current[0]===b&&current[1]===a));
    const sc=isMST?'var(--signal-teal)':isRej?'var(--signal-coral)':isCur?'var(--signal-cyan)':'var(--line)';
    const sw=isMST||isCur?2.5:1.2;
    const sd=isRej?'5,3':'none';
    svg+=`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${sc}" stroke-width="${sw}" stroke-dasharray="${sd}"/>`;
    const mx=(x1+x2)/2,my=(y1+y2)/2;
    svg+=`<text x="${mx}" y="${my-4}" text-anchor="middle" style="font-size:9px;fill:var(--text-dim);font-family:var(--font-mono);">${wt}</text>`;
  });
  nodes.forEach(n=>{
    const [x,y]=pos[n];
    const isVisited=visited[n], isCurNode=current===n, isCurEdge=Array.isArray(current)&&current.includes(n);
    const fill=isVisited?'rgba(62,230,184,.25)':isCurNode?'rgba(90,209,255,.3)':isCurEdge?'rgba(255,180,84,.2)':'var(--ink-800)';
    const stroke=isVisited?'var(--signal-teal)':isCurNode?'var(--signal-cyan)':isCurEdge?'var(--signal-amber)':'var(--line)';
    svg+=`<circle cx="${x}" cy="${y}" r="18" fill="${fill}" stroke="${stroke}" stroke-width="1.5"/>`;
    svg+=`<text x="${x}" y="${y+1}" text-anchor="middle" dominant-baseline="middle" style="font-size:12px;font-weight:600;fill:${isVisited?'var(--signal-teal)':isCurNode?'var(--signal-cyan)':'var(--text-hi)'};font-family:var(--font-body);">${n}</text>`;
    const d=dist[n];
    if(d!==undefined) svg+=`<text x="${x}" y="${y+30}" text-anchor="middle" style="font-size:9px;fill:var(--text-faint);font-family:var(--font-mono);">${d===999||d===Infinity?'\u221e':d}</text>`;
  });
  svg+=`</svg>`;
  const distRow=Object.keys(dist).length?nodes.map(n=>`<span style="font-size:11px;font-family:var(--font-mono);padding:2px 7px;background:var(--ink-800);border-radius:5px;border:1px solid var(--line);color:${visited[n]?'var(--signal-teal)':'var(--text-dim)'};">d[${n}]=${dist[n]===undefined?'?':dist[n]===999||dist[n]===Infinity?'\u221e':dist[n]}</span>`).join(''):'';
  vc.innerHTML=`<div>${svg}${distRow?`<div style="display:flex;gap:5px;flex-wrap:wrap;margin-top:8px;">${distRow}</div>`:''}${mst.length?`<div style="margin-top:6px;font-size:12px;color:var(--text-dim);">MST: <span style="color:var(--signal-teal);">${mst.map(e=>e[0]+'-'+e[1]+'('+e[2]+')').join(', ')}</span> | Weight: <span style="color:var(--signal-teal);">${mst.reduce((a,e)=>a+e[2],0)}</span></div>`:''}</div>`;
  lg.innerHTML=`<div class="legend-item"><div class="legend-dot" style="background:rgba(62,230,184,.25);border:1.5px solid var(--signal-teal);border-radius:50%;"></div>Visited</div>
  <div class="legend-item"><div class="legend-dot" style="background:rgba(90,209,255,.3);border:1.5px solid var(--signal-cyan);border-radius:50%;"></div>Current</div>
  <div class="legend-item"><div class="legend-dot" style="background:transparent;border-top:2px solid var(--signal-teal);"></div>MST/Path</div>
  <div class="legend-item"><div class="legend-dot" style="background:transparent;border-top:2px dashed var(--signal-coral);"></div>Rejected</div>`;
}

function renderQueens(s,vc,lg){
  const {board,row,trying,unsafe,solved}=s;
  const N=board.length;
  let cells='';
  for(let r=0;r<N;r++) for(let c=0;c<N;c++){
    const isDark=(r+c)%2===1, hasQueen=board[r]===c;
    const isTrying=r===row&&trying===c&&!hasQueen, isUnsafe=r===row&&unsafe===c;
    let bg=isDark?'#0f1523':'#182238';
    if(hasQueen) bg=solved?'rgba(62,230,184,.25)':'rgba(90,209,255,.2)';
    else if(isUnsafe) bg='rgba(255,107,122,.25)';
    else if(isTrying) bg='rgba(255,180,84,.15)';
    cells+=`<div class="q-cell" style="background:${bg};border:1px solid var(--line);">${hasQueen?`<span style="color:${solved?'var(--signal-teal)':'#ffd76a'};font-size:22px;">&#9819;</span>`:isTrying?'&middot;':''}</div>`;
  }
  vc.innerHTML=`<div><div class="queens-board" style="grid-template-columns:repeat(${N},42px);">${cells}</div>
  <div style="margin-top:10px;display:flex;gap:8px;font-size:12px;"><span style="color:var(--text-dim);">Row: <b style="color:var(--signal-cyan);">${row}</b></span>${solved?'<span style="color:var(--signal-teal);font-weight:600;">&#10003; Solution Found!</span>':''}</div>
  <div style="margin-top:6px;font-size:11px;color:var(--text-faint);">Board: ${board.map((c,r)=>`R${r}C${c>=0?c:'?'}`).join(' ')}</div></div>`;
  lg.innerHTML=`<div class="legend-item">&#9819; Queen placed</div><div class="legend-item"><div class="legend-dot" style="background:rgba(255,107,122,.25);border:1px solid var(--signal-coral);"></div>Under attack</div><div class="legend-item"><div class="legend-dot" style="background:rgba(255,180,84,.15);border:1px solid var(--signal-amber);"></div>Trying</div>`;
}

function renderSubset(s,vc,lg){
  const {set,target,path=[],sum=0,found}=s;
  let usedCounts={};
  let cells=set.map((v,i)=>{
    usedCounts[v]=(usedCounts[v]||0);
    const inPath = path.filter(x=>x===v).length > (set.slice(0,i).filter(x=>x===v).length - (set.slice(0,i).length - path.filter((x,j)=>set.slice(0,i).includes(x)).length));
    const active = path.includes(v);
    return `<div style="display:inline-block;padding:7px 11px;border-radius:6px;border:1px solid ${active?'var(--signal-teal)':'var(--line)'};background:${found&&active?'rgba(62,230,184,.2)':active?'rgba(90,209,255,.15)':'var(--ink-800)'};font-family:var(--font-mono);font-size:13px;margin:2px;color:var(--text);">${v}</div>`;
  }).join('');
  const pct=Math.min(100,Math.round(sum/target*100));
  vc.innerHTML=`<div><div style="margin-bottom:12px;"><div style="font-size:11px;color:var(--text-dim);margin-bottom:6px;">Set: ${cells}</div>
  <div style="font-size:12px;color:var(--text-dim);">Target: <b style="color:var(--signal-amber);">${target}</b> | Current path: <b style="color:var(--signal-cyan);">{${path.join(', ')}}</b></div></div>
  <div style="margin:10px 0;"><div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-dim);margin-bottom:4px;"><span>Progress to target</span><span style="color:${found?'var(--signal-teal)':sum>target?'var(--signal-coral)':'var(--signal-cyan)'};">${sum} / ${target}</span></div>
  <div style="height:8px;background:var(--ink-800);border-radius:4px;border:1px solid var(--line);"><div style="height:100%;border-radius:4px;background:${found?'var(--signal-teal)':sum>target?'var(--signal-coral)':'var(--signal-cyan)'};width:${pct}%;transition:width .3s;"></div></div></div>
  ${found?`<div style="padding:9px 13px;background:rgba(62,230,184,.1);border:1px solid var(--signal-teal);border-radius:6px;color:var(--signal-teal);font-size:13px;">&#10003; Found: {${path.join(' + ')} = ${target}}</div>`:''}</div>`;
  lg.innerHTML='';
}

function renderGColor(s,vc,lg){
  const {adj,colors,n,trying}=s;
  const colorMap={0:'var(--text-faint)',1:'#ff6b7a',2:'#5ad1ff',3:'#3ee6b8',4:'#ffb454'};
  const colorName={0:'Uncolored',1:'Red',2:'Blue',3:'Green',4:'Amber'};
  const pos=n<=5?[[100,50],[220,30],[340,90],[220,180],[100,160]]:[[80,50],[200,30],[320,50],[360,150],[200,190],[60,150]];
  const w=440,h=230;
  let svg=`<svg viewBox="0 0 ${w} ${h}" style="max-width:100%;overflow:visible;">`;
  for(let i=0;i<n;i++) for(let j=i+1;j<n;j++) if(adj[i][j]){const [x1,y1]=pos[i],[x2,y2]=pos[j];svg+=`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--line)" stroke-width="1.5"/>`;}
  for(let i=0;i<n;i++){
    const [x,y]=pos[i]; const isTrying=trying&&trying.v===i;
    const fill=isTrying?'rgba(255,180,84,.2)':colors[i]?colorMap[colors[i]]+'33':'var(--ink-800)';
    const stroke=isTrying?'var(--signal-amber)':colors[i]?colorMap[colors[i]]:'var(--line)';
    svg+=`<circle cx="${x}" cy="${y}" r="22" fill="${fill}" stroke="${stroke}" stroke-width="${colors[i]||isTrying?2:1.2}"/>`;
    svg+=`<text x="${x}" y="${y+1}" text-anchor="middle" dominant-baseline="middle" style="font-size:11px;font-weight:600;fill:${colors[i]?colorMap[colors[i]]:'var(--text-dim)'};font-family:var(--font-body);">V${i}</text>`;
    if(colors[i]) svg+=`<text x="${x}" y="${y+16}" text-anchor="middle" style="font-size:8px;fill:${colorMap[colors[i]]};font-family:var(--font-body);">${colorName[colors[i]]}</text>`;
  }
  svg+=`</svg>`;
  vc.innerHTML=`<div>${svg}<div style="margin-top:6px;font-size:12px;color:var(--text-dim);">Colors: ${colors.map((c,i)=>`V${i}=${colorName[c]||'?'}`).join(', ')}</div></div>`;
  lg.innerHTML=[1,2,3,4].slice(0,3).map(c=>`<div class="legend-item"><div class="legend-dot" style="background:${colorMap[c]}33;border:2px solid ${colorMap[c]};border-radius:50%;"></div>${colorName[c]}</div>`).join('');
}

function renderDPKnapsack(s,vc,lg){
  const {dp,active,items,W}=s; const [ai,aw]=active;
  let hdr=`<th>i\\w</th>`; for(let w=0;w<=W;w++) hdr+=`<th>${w}</th>`;
  let rows=dp.map((row,i)=>{
    const rowLabel=i===0?'0':(items[i-1]?`#${i}(${items[i-1].w},${items[i-1].v})`:i);
    let cells=row.map((v,w)=>{
      const isActive=ai===i&&aw===w;
      const isDone=(i<ai||(i===ai&&w<aw));
      return `<td style="${isActive?'background:rgba(90,209,255,.25);color:var(--signal-cyan);border-color:var(--signal-cyan);':isDone?'color:var(--signal-teal);':''}">${v}</td>`;
    }).join('');
    return `<tr><th style="white-space:nowrap;">${rowLabel}</th>${cells}</tr>`;
  }).join('');
  vc.innerHTML=`<div style="font-size:11px;color:var(--text-dim);margin-bottom:8px;">Items: ${items.map((it,i)=>`<span style="font-family:var(--font-mono);padding:1px 5px;background:var(--ink-800);border-radius:3px;margin:1px;">#${i+1}(w=${it.w},v=${it.v})</span>`).join(' ')}&nbsp; W=${W}</div>
  <div class="dp-table-wrap"><table class="dp-table"><thead><tr>${hdr}</tr></thead><tbody>${rows}</tbody></table></div>`;
  lg.innerHTML=`<div class="legend-item"><div class="legend-dot" style="background:rgba(90,209,255,.25);border:1px solid var(--signal-cyan);"></div>Current cell</div><div class="legend-item"><div class="legend-dot" style="background:transparent;border:1px solid var(--signal-teal);"></div>Computed</div>`;
}

function renderDPLCS(s,vc,lg){
  const {dp,active,X,Y}=s; const [ai,aj]=active;
  let hdr=`<th></th><th>&quot;&quot;</th>${Y.split('').map(c=>`<th style="color:var(--signal-cyan);">${c}</th>`).join('')}`;
  let rows=dp.map((row,i)=>{
    const rowLabel=i===0?'""':X[i-1];
    let cells=row.map((v,j)=>{
      const isActive=ai===i&&aj===j;
      return `<td style="${isActive?'background:rgba(90,209,255,.25);color:var(--signal-cyan);border-color:var(--signal-cyan);':v>0?'color:var(--signal-teal);':'color:var(--text-faint);'}">${v}</td>`;
    }).join('');
    return `<tr><th style="color:var(--signal-cyan);">${rowLabel}</th>${cells}</tr>`;
  }).join('');
  vc.innerHTML=`<div style="font-size:12px;color:var(--text-dim);margin-bottom:8px;">X = "<span style="color:var(--signal-cyan);">${X}</span>" | Y = "<span style="color:var(--signal-teal);">${Y}</span>"</div>
  <div class="dp-table-wrap"><table class="dp-table"><thead><tr>${hdr}</tr></thead><tbody>${rows}</tbody></table></div>`;
  lg.innerHTML='';
}

function renderFloydMat(s,vc,lg){
  const {dist,k,i,j,n,INF}=s;
  const labels=rng(0,n).map(String);
  let hdr=`<th></th>${labels.map(l=>`<th style="color:var(--signal-cyan);">${l}</th>`).join('')}`;
  let rows=dist.map((row,ri)=>{
    let cells=row.map((v,ci)=>{
      const isActive=ri===i&&ci===j; const isK=(ri===k||ci===k);
      return `<td style="${isActive?'background:rgba(90,209,255,.25);color:var(--signal-cyan);border-color:var(--signal-cyan);':isK&&k>=0?'background:rgba(255,180,84,.1);':''}${v===INF?'color:var(--text-faint);':''}">${v===INF?'\u221e':v}</td>`;
    }).join('');
    return `<tr><th style="color:var(--signal-teal);">${labels[ri]}</th>${cells}</tr>`;
  }).join('');
  vc.innerHTML=`<div style="font-size:12px;color:var(--text-dim);margin-bottom:10px;">Intermediate vertex: <span style="color:var(--signal-amber);font-weight:600;">${k>=0&&k<n?'k='+k:'Building...'}</span> &middot; row/col highlighted = intermediate.</div>
  <div class="dp-table-wrap"><table class="dp-table"><thead><tr>${hdr}</tr></thead><tbody>${rows}</tbody></table></div>`;
  lg.innerHTML='';
}

function renderVertexCover(s,vc,lg){
  renderGraph({...s,dist:{},visited:{}},vc,lg);
  const extra=`<div style="margin-top:8px;font-size:12px;color:var(--text-dim);">Cover: <span style="color:var(--signal-teal);">{${[...new Set(s.cover||[])].join(', ')||'&mdash;'}}</span></div>`;
  vc.innerHTML+=extra;
}

function renderTSPViz(s,vc,lg){
  const {cities,dist,mstEdges=[],tour=[]}=s;
  const pos={}; cities.forEach((c,i)=>{const ang=(i/cities.length)*2*Math.PI-Math.PI/2; pos[c]=[220+150*Math.cos(ang),120+90*Math.sin(ang)];});
  const w=460,h=240;
  let svg=`<svg viewBox="0 0 ${w} ${h}" style="max-width:100%;overflow:visible;">`;
  const tourEdges=new Set(); for(let i=0;i<tour.length-1;i++) tourEdges.add(tour[i]+'-'+tour[i+1]);
  const mstSet=new Set(mstEdges.map(([a,b])=>a+'-'+b+'|'+b+'-'+a));
  cities.forEach((c1,i)=>cities.slice(i+1).forEach(c2=>{
    const [x1,y1]=pos[c1],[x2,y2]=pos[c2];
    const isMST=mstSet.has(c1+'-'+c2)||mstSet.has(c2+'-'+c1);
    const isTour=tourEdges.has(c1+'-'+c2)||tourEdges.has(c2+'-'+c1);
    if(isTour||isMST){
      svg+=`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${isTour?'var(--signal-amber)':'var(--signal-teal)'}" stroke-width="${isTour?2.5:1.5}" stroke-dasharray="${isMST&&!isTour?'4,2':'none'}"/>`;
      svg+=`<text x="${(x1+x2)/2}" y="${(y1+y2)/2-4}" text-anchor="middle" style="font-size:9px;fill:var(--text-dim);font-family:var(--font-mono);">${dist[c1][c2]}</text>`;
    }
  }));
  cities.forEach(c=>{ const [x,y]=pos[c];
    svg+=`<circle cx="${x}" cy="${y}" r="18" fill="var(--ink-800)" stroke="${tour.includes(c)?'var(--signal-amber)':'var(--line)'}" stroke-width="${tour.includes(c)?2:1.2}"/>`;
    svg+=`<text x="${x}" y="${y+1}" text-anchor="middle" dominant-baseline="middle" style="font-size:12px;font-weight:600;fill:var(--text-hi);font-family:var(--font-body);">${c}</text>`;
  });
  svg+=`</svg>`;
  vc.innerHTML=`<div>${svg}${tour.length?`<div style="margin-top:8px;font-size:12px;color:var(--text-dim);">Tour: <span style="color:var(--signal-amber);">${tour.join(' &rarr; ')}</span></div>`:''}${s.tourCost?`<div style="font-size:13px;color:var(--text);">Tour cost: <b style="color:var(--signal-amber);">${s.tourCost}</b></div>`:''}</div>`;
  lg.innerHTML=`<div class="legend-item"><div class="legend-dot" style="background:transparent;border-top:2px solid var(--signal-teal);"></div>MST</div><div class="legend-item"><div class="legend-dot" style="background:transparent;border-top:2.5px solid var(--signal-amber);"></div>Tour</div>`;
}

function renderHillClimb(s,vc,lg){
  const {states,curr,optimum,checking}=s;
  const mx=Math.max(...states.map(x=>x.v));
  const w=460,h=160;
  let svg=`<svg viewBox="0 0 ${w} ${h}" style="max-width:100%;overflow:visible;">`;
  const pts=states.map((st,i)=>`${20+i*(w-40)/(states.length-1)},${h-10-Math.round(st.v/mx*(h-30))}`).join(' ');
  svg+=`<polyline points="${pts}" fill="none" stroke="var(--line)" stroke-width="1.5"/>`;
  states.forEach((st,i)=>{
    const x=20+i*(w-40)/(states.length-1),y=h-10-Math.round(st.v/mx*(h-30));
    const isCurr=i===curr,isOpt=i===optimum,isCheck=i===checking;
    const r=isCurr||isOpt?9:6;
    const fill=isOpt?'var(--signal-teal)':isCurr?'var(--signal-cyan)':isCheck?'var(--signal-amber)':'var(--ink-800)';
    svg+=`<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" stroke="${fill}" stroke-width="1.5"/>`;
    svg+=`<text x="${x}" y="${y-12}" text-anchor="middle" style="font-size:9px;fill:${isCurr?'var(--signal-cyan)':isOpt?'var(--signal-teal)':'var(--text-faint)'};font-family:var(--font-mono);">${st.v}</text>`;
    svg+=`<text x="${x}" y="${h}" text-anchor="middle" style="font-size:9px;fill:var(--text-faint);font-family:var(--font-body);">${i}</text>`;
  });
  svg+=`</svg>`;
  vc.innerHTML=`<div>${svg}<div style="margin-top:8px;font-size:12px;color:var(--text-dim);">Current position: <b style="color:var(--signal-cyan);">${curr}</b> (value=${states[curr]?.v}) ${optimum>=0?`| <b style="color:var(--signal-teal);">Local optimum at ${optimum}!</b>`:''}</div></div>`;
  lg.innerHTML=`<div class="legend-item"><div class="legend-dot" style="background:var(--signal-cyan);border-radius:50%;"></div>Current</div><div class="legend-item"><div class="legend-dot" style="background:var(--signal-teal);border-radius:50%;"></div>Local optimum</div>`;
}

function renderGenetic(s,vc,lg){
  const {pop,fitness,gen,phase,selected,child,mutated,target}=s;
  let cells=pop.map((v,i)=>{
    const f=fitness[i], pct=Math.round(f/10*100), isSel=selected&&selected.includes(v);
    return `<div style="background:var(--ink-800);border:1px solid ${isSel?'var(--signal-amber)':'var(--line)'};border-radius:8px;padding:9px 11px;text-align:center;min-width:72px;">
    <div style="font-size:11px;color:var(--text-dim);">Ind ${i+1}</div><div style="font-size:18px;font-weight:700;font-family:var(--font-mono);color:var(--text-hi);">${v}</div>
    <div style="font-size:10px;color:var(--text-dim);">fitness: <b style="color:${f>7?'var(--signal-teal)':f>4?'var(--signal-amber)':'var(--signal-coral)'};">${f}</b></div>
    <div style="height:4px;background:var(--line);border-radius:2px;margin-top:4px;"><div style="height:100%;width:${pct}%;background:${f>7?'var(--signal-teal)':f>4?'var(--signal-amber)':'var(--signal-coral)'};border-radius:2px;"></div></div></div>`;
  }).join('');
  let phaseHtml='';
  if(phase==='select'&&selected) phaseHtml=`<div style="margin-top:10px;font-size:12px;color:var(--signal-amber);">Selected parents: <b>${selected.join(', ')}</b></div>`;
  if(phase==='crossover'&&child!==undefined) phaseHtml=`<div style="margin-top:10px;font-size:12px;color:var(--signal-cyan);">Crossover &rarr; Child: <b>${child}</b></div>`;
  if(phase==='mutate'&&mutated!==undefined) phaseHtml=`<div style="margin-top:10px;font-size:12px;color:var(--signal-violet);">After mutation: <b>${mutated}</b></div>`;
  vc.innerHTML=`<div><div style="font-size:12px;color:var(--text-dim);margin-bottom:10px;">Generation <b style="color:var(--signal-cyan);">${gen}</b> | Target: <b style="color:var(--signal-amber);">${target}</b> | Phase: <b style="color:var(--signal-violet);">${phase}</b></div>
  <div style="display:flex;gap:8px;flex-wrap:wrap;">${cells}</div>${phaseHtml}</div>`;
  lg.innerHTML='';
}

function renderFracKnap(s,vc,lg){
  const {items,selected=[],W,rem,totalV}=s;
  const cells=items.map(it=>{
    const selObj=selected.find(x=>x.id===it.id), pct=selObj?Math.round(selObj.frac*100):0;
    return `<div style="background:${selObj?'rgba(62,230,184,.1)':'var(--ink-800)'};border:1px solid ${selObj?'var(--signal-teal)':'var(--line)'};border-radius:8px;padding:9px 13px;min-width:100px;">
    <div style="font-size:11px;color:var(--text-dim);">Item ${it.id}</div><div style="font-size:12px;font-family:var(--font-mono);color:var(--text-dim);">w=${it.w}, v=${it.v}</div>
    <div style="font-size:12px;font-family:var(--font-mono);color:var(--signal-amber);">ratio=${it.ratio.toFixed(1)}</div>${selObj?`<div style="font-size:11px;color:var(--signal-teal);">Take ${pct}%</div>`:''}</div>`;
  }).join('');
  const capPct=Math.round((W-rem)/W*100);
  vc.innerHTML=`<div><div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px;">${cells}</div>
  <div style="font-size:12px;color:var(--text-dim);margin-bottom:6px;">Capacity used: <b style="color:var(--signal-cyan);">${W-rem}/${W}</b></div>
  <div style="height:12px;background:var(--ink-800);border:1px solid var(--line);border-radius:6px;margin-bottom:8px;"><div style="height:100%;border-radius:6px;background:var(--signal-teal);width:${capPct}%;transition:width .4s;"></div></div>
  <div style="font-size:14px;color:var(--text);">Total Value: <b style="color:var(--signal-teal);">${typeof totalV==='number'?totalV.toFixed(1):totalV}</b></div></div>`;
  lg.innerHTML='';
}

function renderJobSeq(s,vc,lg){
  const {jobs,slots,selected,profit}=s;
  const slotHtml=slots.slice(1).map((job,i)=>`<div style="background:${job?'rgba(62,230,184,.12)':'var(--ink-800)'};border:1px solid ${job?'var(--signal-teal)':'var(--line)'};border-radius:8px;padding:10px 14px;text-align:center;min-width:70px;">
    <div style="font-size:10px;color:var(--text-dim);">Slot ${i+1}</div><div style="font-size:15px;font-weight:600;color:${job?'var(--signal-teal)':'var(--text-faint)'};">${job||'&mdash;'}</div></div>`).join('');
  vc.innerHTML=`<div><div style="margin-bottom:10px;font-size:12px;color:var(--text-dim);">Jobs (sorted by profit): ${jobs.map(j=>`<span style="font-family:var(--font-mono);padding:1px 5px;background:var(--ink-800);border-radius:3px;margin:1px;color:${selected.includes(j.id)?'var(--signal-teal)':'var(--text-dim)'};">${j.id}(d=${j.d},p=${j.p})</span>`).join(' ')}</div>
  <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:10px;">${slotHtml}</div><div style="font-size:14px;color:var(--text);">Total Profit: <b style="color:var(--signal-teal);">${profit}</b></div></div>`;
  lg.innerHTML='';
}

function renderMergePat(s,vc,lg){
  const {heap,totalCost,step}=s;
  const barMax=Math.max(...heap,1);
  let bars=heap.map(v=>`<div style="display:flex;flex-direction:column;align-items:center;gap:3px;"><div style="font-size:11px;color:var(--text-dim);">${v}</div><div style="width:34px;height:${Math.round(v/barMax*80)}px;background:rgba(90,209,255,.35);border:1px solid var(--signal-cyan);border-radius:4px 4px 0 0;transition:all .4s;"></div></div>`).join('');
  vc.innerHTML=`<div><div style="display:flex;gap:6px;align-items:flex-end;height:110px;margin-bottom:12px;">${bars}</div>
  ${step?`<div style="font-size:13px;color:var(--text-dim);">Merged: <b style="color:var(--signal-amber);">${step[0]}</b> + <b style="color:var(--signal-amber);">${step[1]}</b> = <b style="color:var(--signal-cyan);">${step[2]}</b></div>`:''}
  <div style="font-size:14px;margin-top:8px;">Total Cost: <b style="color:var(--signal-teal);">${totalCost}</b></div></div>`;
  lg.innerHTML='';
}
