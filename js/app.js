/* Main controller: sidebar selection, tabs, playback controls, complexity tab */

function clearVizState(){
  App.playing=false; clearTimeout(App.playTimer);
  App.steps=[]; App.stepIdx=0;
  document.getElementById('btn-play').textContent='\u25B6 Play';
  document.getElementById('prog-fill').style.width='0%';
  document.getElementById('step-ctr').textContent='0 / 0';
  document.getElementById('step-msg').textContent="Press \u25B6 Play or Step to start.";
}

function selectAlgo(id){
  App.currentAlgo=id;
  document.querySelectorAll('.algo-item').forEach(el=>el.classList.toggle('active',el.dataset.algo===id));
  const m=ALGO_META[id];
  document.getElementById('page-eyebrow').textContent=(m.cat+' \u00b7 '+m.subtitle.split('\u00b7').pop().trim()).toUpperCase();
  document.getElementById('page-title').textContent=m.title;
  document.getElementById('header-badges').innerHTML=
    `<span class="hbadge time">Time: ${m.time}</span><span class="hbadge space">Space: ${m.space}</span><span class="hbadge cat">${m.cat}</span>`;
  clearVizState();
  generateSteps(id);
  renderVizStep();
  if(App.currentTab==='concept') renderConceptTab(id);
  if(App.currentTab==='code') renderCodeTab(id);
  if(App.currentTab==='cx') renderCXTab(id);
  if(App.currentTab==='input') renderInputTab(id);
}

function renderConceptTab(id){
  document.getElementById('concept-content').innerHTML = CONCEPTS[id] ||
    `<div class="concept-section"><h3>${ALGO_META[id].title}</h3><p style="color:var(--text-dim);">Watch the Visualizer tab for a full narrated walkthrough of this algorithm.</p></div>`;
}
function renderCodeTab(id){
  document.getElementById('code-content').innerHTML = PSEUDOCODES[id] ||
    `<div class="concept-section"><h3>Pseudocode</h3><p style="color:var(--text-dim);">See the Visualizer tab \u2014 each step narrates the exact operation being performed.</p></div>`;
}

const CX_TABLE=[
  ['Bubble Sort','O(n)','O(n\u00b2)','O(n\u00b2)','O(1)','Stable'],
  ['Selection Sort','O(n\u00b2)','O(n\u00b2)','O(n\u00b2)','O(1)','Unstable'],
  ['Heap Sort','O(n log n)','O(n log n)','O(n log n)','O(1)','Unstable'],
  ['Merge Sort','O(n log n)','O(n log n)','O(n log n)','O(n)','Stable'],
  ['Quick Sort (Rand.)','O(n log n)','O(n log n)','O(n\u00b2) rare','O(log n)','Unstable'],
  ['Linear Search','O(1)','O(n)','O(n)','O(1)','\u2014'],
  ['Binary Search','O(1)','O(log n)','O(log n)','O(1)','\u2014'],
  ['KMP','O(n+m)','O(n+m)','O(n+m)','O(m)','\u2014'],
  ['Rabin-Karp','O(n+m)','O(n+m)','O(nm)','O(1)','\u2014'],
  ['Kruskal\u2019s MST','\u2014','O(E log E)','O(E log E)','O(V)','\u2014'],
  ['Prim\u2019s MST','\u2014','O(E log V)','O(V\u00b2)','O(V)','\u2014'],
  ['Dijkstra\u2019s','\u2014','O((V+E)log V)','O(V\u00b2)','O(V)','\u2014'],
  ['0/1 Knapsack','\u2014','O(nW)','O(nW)','O(nW)','\u2014'],
  ['LCS','\u2014','O(mn)','O(mn)','O(mn)','\u2014'],
  ['Floyd-Warshall','\u2014','O(V\u00b3)','O(V\u00b3)','O(V\u00b2)','\u2014'],
  ['N-Queens','\u2014','\u2014','O(N!)','O(N)','\u2014'],
];
function renderCXTab(id){
  const m=ALGO_META[id];
  const rows=CX_TABLE.map(r=>`<tr>${r.map((v,i)=>`<td class="${i>0?'mono-cell':''}" style="${v.includes('n\u00b2')||v.includes('nm')||v.includes('V\u00b3')||v.includes('N!')?'color:var(--signal-coral) !important;':''}">${v}</td>`).join('')}</tr>`).join('');
  document.getElementById('cx-content').innerHTML=`<div class="concept-section"><h3>${m.title} \u2014 Complexity</h3>
  <div class="cx-stat-grid">
    <div class="cx-stat"><div class="cx-stat-label">Time Complexity</div><div class="cx-stat-val">${m.time}</div></div>
    <div class="cx-stat"><div class="cx-stat-label">Space Complexity</div><div class="cx-stat-val" style="color:var(--signal-teal);">${m.space}</div></div>
  </div>
  <h3>Full Comparison Table</h3>
  <div style="overflow-x:auto;"><table class="cx-table"><thead><tr><th>Algorithm</th><th>Best</th><th>Average</th><th>Worst</th><th>Space</th><th>Stable?</th></tr></thead><tbody>${rows}</tbody></table></div></div>`;
}

function switchTab(t){
  App.currentTab=t;
  document.querySelectorAll('.tab').forEach(el=>el.classList.toggle('active',el.dataset.tab===t));
  ['viz','input','concept','code','cx'].forEach(x=>{ document.getElementById('pane-'+x).style.display = x===t?'':'none'; });
  if(t==='concept') renderConceptTab(App.currentAlgo);
  if(t==='code') renderCodeTab(App.currentAlgo);
  if(t==='cx') renderCXTab(App.currentAlgo);
  if(t==='input') renderInputTab(App.currentAlgo);
}

function getDelay(){ return App.speedMap[App.speedIdx]; }

function togglePlay(){
  App.playing=!App.playing;
  document.getElementById('btn-play').textContent = App.playing?'\u23F8 Pause':'\u25B6 Play';
  if(App.playing) playNext();
}
function playNext(){
  if(!App.playing) return;
  if(App.stepIdx>=App.steps.length-1){ App.playing=false; document.getElementById('btn-play').textContent='\u25B6 Play'; return; }
  App.stepIdx++; renderVizStep();
  App.playTimer=setTimeout(playNext,getDelay());
}
function stepFwd(){
  clearTimeout(App.playTimer); App.playing=false;
  document.getElementById('btn-play').textContent='\u25B6 Play';
  if(App.stepIdx<App.steps.length-1){ App.stepIdx++; renderVizStep(); }
}
function resetViz(){
  clearTimeout(App.playTimer); App.playing=false;
  document.getElementById('btn-play').textContent='\u25B6 Play';
  App.stepIdx=0; renderVizStep();
}

/* ═══════ INIT / WIRING ═══════ */
window.addEventListener('DOMContentLoaded',()=>{
  buildSidebar();
  document.getElementById('search-inp').addEventListener('input',e=>filterSidebar(e.target.value));
  document.getElementById('btn-play').addEventListener('click',togglePlay);
  document.getElementById('btn-step').addEventListener('click',stepFwd);
  document.getElementById('btn-reset').addEventListener('click',resetViz);
  document.querySelectorAll('.tab').forEach(t=>t.addEventListener('click',()=>switchTab(t.dataset.tab)));

  document.getElementById('sound-btn').addEventListener('click',()=>{
    const on=Sound.toggle();
    document.getElementById('sound-btn').classList.toggle('on',on);
  });
  document.getElementById('sound-btn').classList.add('on');

  document.getElementById('speed-sl').addEventListener('input',e=>{
    App.speedIdx=+e.target.value-1;
    document.getElementById('speed-lbl').textContent=(App.speedIdx+1)+'\u00d7';
  });

  document.getElementById('mobile-toggle').addEventListener('click',()=>{
    document.getElementById('sidebar').classList.toggle('open');
  });

  document.getElementById('theme-info-btn').addEventListener('click',()=>{
    alert('Algorithm Lab \u2014 DAA Visualizer\n\nSPPU MCA 2024 Pattern \u00b7 32 algorithms across Sorting, Searching, String Matching, Divide & Conquer, Greedy, Backtracking, Dynamic Programming, Approximation and Metaheuristics, plus supporting theory.\n\nUse the "Your Data" tab on any runnable algorithm to try your own input \u2014 including a visual graph builder for MST / shortest-path algorithms.\n\nSound uses the Sa-Re-Ga-Ma-Pa scale, stepped through in Fibonacci order.');
  });

  selectAlgo('bubble');
});
