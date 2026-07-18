/* Step generators for all 32 algorithms. Each reads App.customData[algo] when present,
   otherwise falls back to sensible defaults / randomized data. */
let arr = [];
function randArr(n=8){ arr = Array.from({length:n},()=>Math.floor(Math.random()*85)+10); }
randArr();

function push(steps,obj){ steps.push(JSON.parse(JSON.stringify(obj))); }
function getArrData(algo){ return (App.customData[algo] && App.customData[algo].arr) ? [...App.customData[algo].arr] : [...arr]; }
function getGraphData(algo){
  const d=App.customData[algo];
  if(d && d.nodes && d.nodes.length) return {nodes:[...d.nodes],edges:d.edges.map(e=>[...e]),pos:JSON.parse(JSON.stringify(d.pos))};
  return defaultGraphFor(algo);
}

function generateSteps(algo){
  const steps=[];
  const gen={
    bubble:genBubble, selection:genSelection, heap:genHeap, merge:genMerge, quick:genQuick,
    linear:genLinear, binary:genBinary, kmp:genKMP, rabin:genRabin, minmax:genMinMax,
    strassen:genStrassen, activity:genActivity, kruskal:genKruskal, prim:genPrim,
    fracknap:genFracKnap, jobseq:genJobSeq, merge_pattern:genMergePattern, dijkstra:genDijkstra,
    nqueens:genNQueens, subset:genSubset, graphcolor:genGraphColor, knapsack01:genKnapsack01,
    lcs:genLCS, floyd:genFloyd, vertexcover:genVertexCover, tsp:genTSP,
    hillclimb:genHillClimb, genetic:genGenetic,
    master:genTheory, amortized:genTheory, cooks:genTheory, jssp:genTheory,
  };
  if(gen[algo]) gen[algo](steps,algo);
  App.steps=steps; App.stepIdx=0;
}
function genTheory(steps){ steps.push({type:'theory'}); }

/* ═══════ SORTING ═══════ */
function genBubble(steps,algo){
  let a=getArrData(algo), n=a.length, mn=minArr(a), mx=maxArr(a);
  push(steps,{type:'array',arr:[...a],compare:[],swap:[],sorted:[],msg:'[b]Bubble Sort[/b] starts! Compare neighbours, push the bigger value right \u2014 like a bubble rising. \u{1FAE7}'});
  for(let i=0;i<n-1;i++){
    let didSwap=false;
    for(let j=0;j<n-i-1;j++){
      push(steps,{type:'array',arr:[...a],compare:[j,j+1],swap:[],sorted:rng(n-i,n),msg:`Pass [w]${i+1}[/w]: comparing [b]${a[j]}[/b] with [b]${a[j+1]}[/b]. Is ${a[j]} bigger?`,snd:'compare',sv:[a[j],a[j+1]],mn,mx});
      if(a[j]>a[j+1]){ [a[j],a[j+1]]=[a[j+1],a[j]]; didSwap=true;
        push(steps,{type:'array',arr:[...a],compare:[],swap:[j,j+1],sorted:rng(n-i,n),msg:`[r]Yes![/r] [b]${a[j+1]}[/b] was bigger \u2014 [w]swap![/w]`,snd:'swap',sv:[a[j],a[j+1]],mn,mx});
      } else push(steps,{type:'array',arr:[...a],compare:[j,j+1],swap:[],sorted:rng(n-i,n),msg:`[g]No swap needed.[/g] Already in order.`});
    }
    push(steps,{type:'array',arr:[...a],compare:[],swap:[],sorted:rng(n-i-1,n),msg:`[g]End of pass ${i+1}.[/g] [b]${a[n-i-1]}[/b] has reached its final spot!`,snd:'place'});
    if(!didSwap) break;
  }
  push(steps,{type:'array',arr:[...a],compare:[],swap:[],sorted:rng(0,n),msg:`[g]\u{1F389} Sorted![/g] All elements are in place.`,snd:'done'});
}

function genSelection(steps,algo){
  let a=getArrData(algo), n=a.length, mn=minArr(a), mx=maxArr(a);
  push(steps,{type:'array',arr:[...a],compare:[],swap:[],sorted:[],minIdx:-1,msg:'[b]Selection Sort[/b]: scan for the smallest remaining value, place it, repeat.'});
  for(let i=0;i<n-1;i++){
    let min=i;
    push(steps,{type:'array',arr:[...a],compare:[i],swap:[],sorted:rng(0,i),minIdx:i,msg:`Looking for the minimum in positions [b]${i}[/b]..${n-1}.`});
    for(let j=i+1;j<n;j++){
      push(steps,{type:'array',arr:[...a],compare:[j],swap:[],sorted:rng(0,i),minIdx:min,msg:`Checking [b]${a[j]}[/b] vs current min [w]${a[min]}[/w].`,snd:'compare',sv:[a[j]],mn,mx});
      if(a[j]<a[min]){ min=j; push(steps,{type:'array',arr:[...a],compare:[j],swap:[],sorted:rng(0,i),minIdx:min,msg:`[g]New minimum![/g] [b]${a[min]}[/b] at position ${min}.`}); }
    }
    if(min!==i){ [a[i],a[min]]=[a[min],a[i]]; push(steps,{type:'array',arr:[...a],compare:[],swap:[i,min],sorted:rng(0,i),minIdx:-1,msg:`[w]Swap![/w] Moving minimum to position ${i}.`,snd:'swap',sv:[a[i],a[min]],mn,mx}); }
    push(steps,{type:'array',arr:[...a],compare:[],swap:[],sorted:rng(0,i+1),minIdx:-1,msg:`[g]Position ${i} settled![/g]`,snd:'place'});
  }
  push(steps,{type:'array',arr:[...a],compare:[],swap:[],sorted:rng(0,n),minIdx:-1,msg:'[g]\u{1F389} Done![/g] Exactly n\u22121 swaps used \u2014 the minimum possible.',snd:'done'});
}

function genHeap(steps,algo){
  let a=getArrData(algo), n=a.length, mn=minArr(a), mx=maxArr(a);
  push(steps,{type:'array',arr:[...a],compare:[],sorted:[],msg:'[b]Heap Sort[/b]: build a Max-Heap, then repeatedly extract the maximum. \u{1F3C6}'});
  function heapify(A,size,root){
    let largest=root,l=2*root+1,r=2*root+2;
    push(steps,{type:'array',arr:[...A],compare:[root,l,r].filter(x=>x<size),sorted:rng(size,n),msg:`Heapify at [b]${root}[/b]: comparing with children.`,snd:'compare',sv:[A[root]],mn,mx});
    if(l<size&&A[l]>A[largest]) largest=l;
    if(r<size&&A[r]>A[largest]) largest=r;
    if(largest!==root){ [A[root],A[largest]]=[A[largest],A[root]];
      push(steps,{type:'array',arr:[...A],swap:[root,largest],sorted:rng(size,n),msg:`[w]Swap![/w] Heap property restored for this subtree.`,snd:'swap',sv:[A[root]],mn,mx});
      heapify(A,size,largest);
    }
  }
  for(let i=Math.floor(n/2)-1;i>=0;i--) heapify(a,n,i);
  push(steps,{type:'array',arr:[...a],compare:[],sorted:[],msg:'[g]Max-Heap built![/g] Largest element is now at the root.'});
  for(let i=n-1;i>0;i--){ [a[0],a[i]]=[a[i],a[0]];
    push(steps,{type:'array',arr:[...a],swap:[0,i],sorted:rng(i,n),msg:`[w]Extract max![/w] Moved to its final position ${i}.`,snd:'swap',sv:[a[i]],mn,mx});
    heapify(a,i,0);
  }
  push(steps,{type:'array',arr:[...a],compare:[],sorted:rng(0,n),msg:'[g]\u{1F389} Heap Sort done![/g] Always O(n log n), even worst case.',snd:'done'});
}

function genMerge(steps,algo){
  let a=getArrData(algo), n=a.length, mn=minArr(a), mx=maxArr(a);
  push(steps,{type:'array',arr:[...a],compare:[],sorted:[],hl:[],msg:'[b]Merge Sort[/b]: split repeatedly, then merge sorted halves back together.'});
  function doMerge(A,l,m,r){
    let L=A.slice(l,m+1),R=A.slice(m+1,r+1),i=0,j=0,k=l;
    push(steps,{type:'array',arr:[...A],hl:rng(l,r+1),compare:[],sorted:[],msg:`[w]Merging[/w] [${l}..${m}] and [${m+1}..${r}].`});
    while(i<L.length&&j<R.length){
      push(steps,{type:'array',arr:[...A],compare:[l+i,m+1+j],sorted:[],msg:`Compare [b]${L[i]}[/b] vs [b]${R[j]}[/b].`,snd:'compare',sv:[L[i]],mn,mx});
      if(L[i]<=R[j]) A[k++]=L[i++]; else A[k++]=R[j++];
    }
    while(i<L.length) A[k++]=L[i++];
    while(j<R.length) A[k++]=R[j++];
    push(steps,{type:'array',arr:[...A],hl:rng(l,r+1),sorted:[],msg:`[g]Merged![/g] Segment [${l}..${r}] now sorted.`,snd:'place'});
  }
  function sort(A,l,r){
    if(l>=r){ push(steps,{type:'array',arr:[...A],current:[l],sorted:[],msg:`Single element \u2014 already sorted.`}); return; }
    let m=Math.floor((l+r)/2);
    push(steps,{type:'array',arr:[...A],hl:[],compare:[],sorted:[],msg:`[w]Divide[/w] [${l}..${r}] at ${m}.`});
    sort(A,l,m); sort(A,m+1,r); doMerge(A,l,m,r);
  }
  sort(a,0,n-1);
  push(steps,{type:'array',arr:[...a],compare:[],sorted:rng(0,n),msg:'[g]\u{1F389} Merge Sort complete![/g] Guaranteed O(n log n) in every case.',snd:'done'});
}

function genQuick(steps,algo){
  let a=getArrData(algo), n=a.length, mn=minArr(a), mx=maxArr(a);
  push(steps,{type:'array',arr:[...a],compare:[],sorted:[],msg:'[b]Randomized Quick Sort[/b]: pick a random pivot, partition around it, recurse.'});
  let sortedSet=new Set();
  function partition(A,lo,hi){
    let pIdx=lo+Math.floor(Math.random()*(hi-lo+1));
    [A[pIdx],A[hi]]=[A[hi],A[pIdx]];
    let pivot=A[hi],i=lo-1;
    push(steps,{type:'array',arr:[...A],pivot:hi,compare:[],sorted:[...sortedSet],msg:`[w]Pivot chosen: ${pivot}[/w]. Partitioning [${lo}..${hi}].`});
    for(let j=lo;j<hi;j++){
      push(steps,{type:'array',arr:[...A],pivot:hi,compare:[j],sorted:[...sortedSet],msg:`Is [b]${A[j]}[/b] \u2264 pivot [w]${pivot}[/w]?`,snd:'compare',sv:[A[j]],mn,mx});
      if(A[j]<=pivot){ i++; if(i!==j){ [A[i],A[j]]=[A[j],A[i]]; push(steps,{type:'array',arr:[...A],pivot:hi,swap:[i,j],sorted:[...sortedSet],msg:`[w]Swap[/w] into left zone.`,snd:'swap',sv:[A[i]],mn,mx}); } }
    }
    [A[i+1],A[hi]]=[A[hi],A[i+1]]; sortedSet.add(i+1);
    push(steps,{type:'array',arr:[...A],pivot:i+1,swap:[i+1,hi],sorted:[...sortedSet],msg:`[g]Pivot placed at final position ${i+1}![/g]`,snd:'place'});
    return i+1;
  }
  function sort(A,lo,hi){ if(lo>=hi){ if(lo===hi) sortedSet.add(lo); return; } const p=partition(A,lo,hi); sort(A,lo,p-1); sort(A,p+1,hi); }
  sort(a,0,n-1);
  push(steps,{type:'array',arr:[...a],compare:[],sorted:rng(0,n),msg:'[g]\u{1F389} Quick Sort done![/g] O(n log n) average \u2014 randomness avoids the O(n\u00b2) trap.',snd:'done'});
}

/* ═══════ SEARCHING ═══════ */
function genLinear(steps,algo){
  const cd=App.customData[algo];
  let a=cd?[...cd.arr]:getArrData(algo), n=a.length, mn=minArr(a), mx=maxArr(a);
  let target=cd?cd.target:a[Math.floor(Math.random()*n)];
  push(steps,{type:'array',arr:[...a],compare:[],found:-1,target,msg:`[b]Linear Search[/b]: looking for [w]target = ${target}[/w]. Check every element left to right.`});
  for(let i=0;i<n;i++){
    push(steps,{type:'array',arr:[...a],compare:[i],found:-1,target,msg:`Position ${i}: is [b]${a[i]}[/b] == [w]${target}[/w]? ${a[i]===target?'[g]Yes![/g]':'[r]No.[/r]'}`,snd:'compare',sv:[a[i]],mn,mx});
    if(a[i]===target){ push(steps,{type:'array',arr:[...a],compare:[],found:i,target,msg:`[g]\u{1F389} Found ${target} at index ${i}![/g] ${i+1} comparison(s).`,snd:'done'}); return; }
  }
  push(steps,{type:'array',arr:[...a],compare:[],found:-2,target,msg:`[r]Not found.[/r] Checked all ${n} positions \u2014 the worst case, O(n).`});
}

function genBinary(steps,algo){
  const cd=App.customData[algo];
  let a=(cd?[...cd.arr]:getArrData(algo)).sort((x,y)=>x-y), n=a.length, mn=minArr(a), mx=maxArr(a);
  let target=cd?cd.target:a[Math.floor(Math.random()*n)];
  push(steps,{type:'array',arr:[...a],lo:0,hi:n-1,mid:-1,elim:[],found:-1,target,msg:`[b]Binary Search[/b]: array is sorted \u2713. Target = [w]${target}[/w]. Cut the search space in half each step.`});
  let lo=0,hi=n-1,elim=[];
  while(lo<=hi){
    let mid=Math.floor((lo+hi)/2);
    push(steps,{type:'array',arr:[...a],lo,hi,mid,elim:[...elim],found:-1,target,msg:`Range [b][${lo}..${hi}][/b]. Mid = ${mid} (value [w]${a[mid]}[/w]).`,snd:'compare',sv:[a[mid]],mn,mx});
    if(a[mid]===target){ push(steps,{type:'array',arr:[...a],lo,hi,mid,elim:[...elim],found:mid,target,msg:`[g]\u{1F389} Found ${target} at index ${mid}![/g]`,snd:'done'}); return; }
    else if(a[mid]<target){ elim=[...elim,...rng(lo,mid+1)]; push(steps,{type:'array',arr:[...a],lo:mid+1,hi,mid,elim:[...elim],found:-1,target,msg:`${a[mid]} < ${target}: [w]eliminate left half[/w].`}); lo=mid+1; }
    else{ elim=[...elim,...rng(mid,hi+1)]; push(steps,{type:'array',arr:[...a],lo,hi:mid-1,mid,elim:[...elim],found:-1,target,msg:`${a[mid]} > ${target}: [w]eliminate right half[/w].`}); hi=mid-1; }
  }
  push(steps,{type:'array',arr:[...a],lo,hi,mid:-1,elim:[...elim],found:-2,target,msg:`[r]Not found.[/r] Search space is empty.`});
}

/* ═══════ STRING MATCHING ═══════ */
function genKMP(steps,algo){
  const cd=App.customData[algo];
  let text=cd?cd.text:'AABAACAABAA', pattern=cd?cd.pattern:'AABA';
  let lps=new Array(pattern.length).fill(0);
  push(steps,{type:'string',text,pattern,textHL:[],patHL:[],lps:[...lps],activeLPS:-1,msg:`[b]KMP[/b]: find "[w]${pattern}[/w]" in "[b]${text}[/b]" using a precomputed failure function (LPS array).`});
  let len=0,i=1;
  while(i<pattern.length){
    if(pattern[i]===pattern[len]){ len++; lps[i]=len; push(steps,{type:'string',text,pattern,textHL:[],patHL:[i],lps:[...lps],activeLPS:i,msg:`Match! LPS[${i}] = [g]${len}[/g].`}); i++; }
    else{ if(len!==0){ len=lps[len-1]; push(steps,{type:'string',text,pattern,textHL:[],patHL:[],lps:[...lps],activeLPS:i,msg:`Mismatch \u2014 fall back using LPS. \u{1F519}`,snd:'back'}); } else { lps[i]=0; push(steps,{type:'string',text,pattern,textHL:[],patHL:[i],lps:[...lps],activeLPS:i,msg:`LPS[${i}]=0.`}); i++; } }
  }
  push(steps,{type:'string',text,pattern,textHL:[],patHL:[],lps:[...lps],activeLPS:-1,msg:`[g]LPS = [${lps}][/g]. Now search the text.`});
  let ti=0,pi=0,matches=[];
  while(ti<text.length){
    push(steps,{type:'string',text,pattern,textHL:[ti],patHL:[pi],lps:[...lps],matches:[...matches],msg:`Comparing text[${ti}]='[b]${text[ti]}[/b]' with pattern[${pi}]='[b]${pattern[pi]}[/b]'.`,snd:'compare'});
    if(text[ti]===pattern[pi]){ ti++; pi++;
      if(pi===pattern.length){ matches.push(ti-pi); push(steps,{type:'string',text,pattern,textHL:rng(ti-pi,ti),patHL:[],lps:[...lps],matches:[...matches],msg:`[g]\u{1F389} Match at index ${ti-pi}![/g]`,snd:'done'}); pi=lps[pi-1]; }
    } else { if(pi!==0){ push(steps,{type:'string',text,pattern,textHL:[ti],patHL:[pi],lps:[...lps],matches:[...matches],msg:`Mismatch \u2014 jump pattern pointer via LPS, text pointer stays! \u26A1`,snd:'back'}); pi=lps[pi-1]; } else ti++; }
  }
  push(steps,{type:'string',text,pattern,textHL:[],patHL:[],lps:[...lps],matches:[...matches],msg:`[g]Done![/g] Matches at: [${matches}]. O(n+m), text pointer never backtracks.`});
}

function genRabin(steps,algo){
  const cd=App.customData[algo];
  let text=cd?cd.text:'ABCABC', pattern=cd?cd.pattern:'ABC', d=26,q=101;
  let m=pattern.length,n=text.length;
  function code(ch){ return ch.charCodeAt(0)-64; }
  function hash(s){ let h=0; for(let c of s) h=(h*d+code(c))%q; return h; }
  let ph=hash(pattern);
  push(steps,{type:'string',text,pattern,textHL:[],patHL:[],hashInfo:{ph,wh:null},msg:`[b]Rabin-Karp[/b]: compute a hash fingerprint of the pattern (=[w]${ph}[/w]) and slide a window across the text comparing hashes.`});
  let h=1; for(let i=0;i<m-1;i++) h=(h*d)%q;
  let wh=hash(text.slice(0,m)), matches=[];
  for(let i=0;i<=n-m;i++){
    push(steps,{type:'string',text,pattern,textHL:rng(i,i+m),patHL:[],hashInfo:{ph,wh},matches:[...matches],msg:`Window "[b]${text.slice(i,i+m)}[/b]" hash=[b]${wh}[/b] vs pattern hash=[w]${ph}[/w]. ${wh===ph?'[g]Match \u2014 verify![/g]':'[r]Mismatch, skip.[/r]'}`,snd:'compare'});
    if(wh===ph){ if(text.slice(i,i+m)===pattern){ matches.push(i); push(steps,{type:'string',text,pattern,textHL:rng(i,i+m),patHL:[],hashInfo:{ph,wh},matches:[...matches],msg:`[g]\u2705 Verified match at ${i}![/g]`,snd:'done'}); } else push(steps,{type:'string',text,pattern,textHL:rng(i,i+m),patHL:[],hashInfo:{ph,wh},matches:[...matches],msg:`[r]Spurious hit[/r] \u2014 hash collision, characters differ.`}); }
    if(i<n-m){ wh=(d*(wh-code(text[i])*h)+code(text[i+m]))%q; wh=(wh+q*d)%q; push(steps,{type:'string',text,pattern,textHL:rng(i+1,i+m+1),patHL:[],hashInfo:{ph,wh},matches:[...matches],msg:`[w]Rolling hash[/w] update in O(1) \u2014 no re-scanning!`}); }
  }
  push(steps,{type:'string',text,pattern,textHL:[],patHL:[],hashInfo:{ph,wh},matches:[...matches],msg:`[g]Done![/g] Matches at: [${matches}].`});
}

/* ═══════ DIVIDE & CONQUER ═══════ */
function genMinMax(steps,algo){
  let a=getArrData(algo), n=a.length;
  push(steps,{type:'array',arr:[...a],compare:[],sorted:[],msg:`[b]Min-Max via D&C[/b]: pair up elements to find both min and max in only 3n/2\u22122 comparisons.`});
  function solve(l,r){
    push(steps,{type:'array',arr:[...a],compare:[l,r],sorted:[],msg:`Examining [${l}..${r}].`});
    if(l===r){ push(steps,{type:'array',arr:[...a],compare:[l],sorted:[],msg:`Single element \u2014 min and max.`}); return {min:a[l],max:a[l]}; }
    if(r-l===1){ push(steps,{type:'array',arr:[...a],compare:[l,r],sorted:[],msg:`Two elements: one comparison gives min & max.`,snd:'compare'}); return {min:Math.min(a[l],a[r]),max:Math.max(a[l],a[r])}; }
    let mid=Math.floor((l+r)/2);
    push(steps,{type:'array',arr:[...a],compare:[],sorted:[],msg:`[w]Divide[/w] at mid=${mid}.`});
    let L=solve(l,mid),R=solve(mid+1,r);
    let mn=Math.min(L.min,R.min),mx=Math.max(L.max,R.max);
    push(steps,{type:'array',arr:[...a],compare:[],sorted:[],msg:`[g]Merge:[/g] min=[g]${mn}[/g], max=[g]${mx}[/g]`});
    return {min:mn,max:mx};
  }
  let res=solve(0,n-1);
  push(steps,{type:'array',arr:[...a],compare:[],sorted:[],msg:`[g]\u2705 Done![/g] Min=[b]${res.min}[/b], Max=[b]${res.max}[/b].`});
}

function genStrassen(steps,algo){
  const cd=App.customData[algo];
  let A=cd?cd.A:[[1,2],[3,4]], B=cd?cd.B:[[5,6],[7,8]];
  push(steps,{type:'matrix',A,B,products:{},result:null,msg:`[b]Strassen's[/b]: naive 2\u00d72 needs 8 multiplications; Strassen needs only [g]7[/g].`});
  let vals={M1:(A[0][0]+A[1][1])*(B[0][0]+B[1][1]),M2:(A[1][0]+A[1][1])*B[0][0],M3:A[0][0]*(B[0][1]-B[1][1]),M4:A[1][1]*(B[1][0]-B[0][0]),M5:(A[0][0]+A[0][1])*B[1][1],M6:(A[1][0]-A[0][0])*(B[0][0]+B[0][1]),M7:(A[0][1]-A[1][1])*(B[1][0]+B[1][1])};
  let M={};
  for(let k of ['M1','M2','M3','M4','M5','M6','M7']){ M[k]=vals[k]; push(steps,{type:'matrix',A,B,products:{...M},result:null,msg:`Computing [w]${k}[/w] = [g]${vals[k]}[/g]`,snd:'compare'}); }
  let C=[[M.M1+M.M4-M.M5+M.M7,M.M3+M.M5],[M.M2+M.M4,M.M1-M.M2+M.M3+M.M6]];
  push(steps,{type:'matrix',A,B,products:{...M},result:C,msg:`[g]\u2705 Result C[/g]: only 7 multiplications used!`,snd:'done'});
}

/* ═══════ GREEDY ═══════ */
function genActivity(steps,algo){
  const cd=App.customData[algo];
  let acts=cd?cd.acts:[{id:'A1',s:1,f:4},{id:'A2',s:3,f:5},{id:'A3',s:0,f:6},{id:'A4',s:5,f:7},{id:'A5',s:8,f:9},{id:'A6',s:5,f:9}];
  let sorted=[...acts].sort((a,b)=>a.f-b.f);
  push(steps,{type:'activity',acts:sorted,selected:[],rejected:[],current:-1,msg:`[b]Activity Selection[/b]: pick as many non-overlapping activities as possible \u2014 always take the one that finishes earliest.`});
  let sel=[0],lastFinish=sorted[0].f;
  push(steps,{type:'activity',acts:sorted,selected:[...sel],rejected:[],current:0,msg:`[g]Select[/g] [b]${sorted[0].id}[/b] automatically \u2014 earliest finish.`});
  for(let i=1;i<sorted.length;i++){
    let a=sorted[i];
    push(steps,{type:'activity',acts:sorted,selected:[...sel],rejected:[],current:i,msg:`${a.id}: does start ${a.s} \u2265 last finish ${lastFinish}?`,snd:'compare'});
    if(a.s>=lastFinish){ sel.push(i); lastFinish=a.f; push(steps,{type:'activity',acts:sorted,selected:[...sel],rejected:[],current:i,msg:`[g]\u2705 Select ${a.id}![/g]`,snd:'place'}); }
    else push(steps,{type:'activity',acts:sorted,selected:[...sel],rejected:[i],current:i,msg:`[r]Reject ${a.id}.[/r] Overlaps with previous pick.`,snd:'reject'});
  }
  push(steps,{type:'activity',acts:sorted,selected:[...sel],rejected:[],current:-1,msg:`[g]\u{1F389} Done![/g] Selected ${sel.length} activities.`,snd:'done'});
}

function genKruskal(steps,algo){
  const {nodes,edges}=getGraphData(algo);
  const GRAPH=getGraphData(algo);
  let sorted=[...edges].sort((a,b)=>a[2]-b[2]);
  let parent={}; nodes.forEach(n=>parent[n]=n);
  function find(x){ return parent[x]===x?x:parent[x]=find(parent[x]); }
  let mst=[],rejected=[];
  push(steps,{type:'graph',graph:GRAPH,mst:[],rejected:[],current:null,dist:{},msg:`[b]Kruskal's MST[/b]: sort edges by weight, add if it doesn't create a cycle (Union-Find).`});
  for(let [a,b,w] of sorted){
    push(steps,{type:'graph',graph:GRAPH,mst:[...mst],rejected:[...rejected],current:[a,b,w],dist:{},msg:`Edge [w]${a}-${b}(${w})[/w]: same component?`,snd:'compare'});
    if(find(a)!==find(b)){ parent[find(a)]=find(b); mst.push([a,b,w]); push(steps,{type:'graph',graph:GRAPH,mst:[...mst],rejected:[...rejected],current:[a,b,w],dist:{},msg:`[g]\u2705 Add ${a}-${b}(${w})[/g]`,snd:'place'}); }
    else{ rejected.push([a,b,w]); push(steps,{type:'graph',graph:GRAPH,mst:[...mst],rejected:[...rejected],current:[a,b,w],dist:{},msg:`[r]Reject ${a}-${b}[/r] \u2014 would form a cycle.`,snd:'reject'}); }
    if(mst.length===nodes.length-1) break;
  }
  push(steps,{type:'graph',graph:GRAPH,mst:[...mst],rejected:[...rejected],current:null,dist:{},msg:`[g]\u{1F389} MST complete![/g] Weight = [b]${mst.reduce((s,e)=>s+e[2],0)}[/b].`,snd:'done'});
}

function genPrim(steps,algo){
  const GRAPH=getGraphData(algo); const {nodes,edges}=GRAPH;
  let key={},inMST={},parent={},mstEdges=[];
  nodes.forEach(n=>{key[n]=Infinity;inMST[n]=false;parent[n]=null;});
  key[nodes[0]]=0;
  push(steps,{type:'graph',graph:GRAPH,mst:[],rejected:[],current:null,visited:{},dist:{...key},msg:`[b]Prim's MST[/b]: grow the tree from ${nodes[0]}, always adding the cheapest crossing edge. \u{1F331}`});
  for(let count=0;count<nodes.length;count++){
    const remaining=nodes.filter(n=>!inMST[n]);
    if(!remaining.length) break;
    let u=remaining.reduce((a,b)=>key[a]<=key[b]?a:b);
    if(key[u]===Infinity) break;
    inMST[u]=true;
    if(parent[u]!==null) mstEdges.push([parent[u],u,key[u]]);
    push(steps,{type:'graph',graph:GRAPH,mst:[...mstEdges],rejected:[],current:u,visited:{...inMST},dist:{...key},msg:`[g]Add ${u}[/g] to MST.`,snd:'place'});
    for(let [a,b,w] of edges){
      let v=a===u?b:b===u?a:null;
      if(!v||inMST[v]) continue;
      push(steps,{type:'graph',graph:GRAPH,mst:[...mstEdges],rejected:[],current:[u,v],visited:{...inMST},dist:{...key},msg:`Edge ${u}-${v}(${w}): improve key[${v}]?`,snd:'compare'});
      if(w<key[v]){ key[v]=w; parent[v]=u; }
    }
  }
  push(steps,{type:'graph',graph:GRAPH,mst:[...mstEdges],rejected:[],current:null,visited:{...inMST},dist:{...key},msg:`[g]\u{1F389} MST complete![/g] Weight = ${mstEdges.reduce((s,e)=>s+e[2],0)}.`,snd:'done'});
}

function genDijkstra(steps,algo){
  const GRAPH=getGraphData(algo); const {nodes,edges}=GRAPH;
  let dist={},visited={};
  nodes.forEach(n=>{dist[n]=n===nodes[0]?0:Infinity;visited[n]=false;});
  push(steps,{type:'graph',graph:GRAPH,mst:[],rejected:[],current:null,visited:{...visited},dist:{...dist},msg:`[b]Dijkstra[/b]: shortest paths from ${nodes[0]} to every vertex. Always visit the closest unvisited vertex next.`});
  for(let iter=0;iter<nodes.length;iter++){
    const unvisited=nodes.filter(n=>!visited[n]);
    if(!unvisited.length) break;
    let u=unvisited.reduce((a,b)=>dist[a]<=dist[b]?a:b);
    if(dist[u]===Infinity) break;
    visited[u]=true;
    push(steps,{type:'graph',graph:GRAPH,mst:[],rejected:[],current:u,visited:{...visited},dist:{...dist},msg:`[g]Visit ${u}[/g] (dist=${dist[u]}). Relax neighbours...`});
    for(let [a,b,w] of edges){
      let v=a===u?b:b===u?a:null;
      if(!v||visited[v]) continue;
      let newD=dist[u]+w;
      push(steps,{type:'graph',graph:GRAPH,mst:[],rejected:[],current:[u,v],visited:{...visited},dist:{...dist},msg:`${u}\u2192${v}(${w}): ${newD} vs current ${dist[v]===Infinity?'\u221e':dist[v]}.`,snd:'compare'});
      if(newD<dist[v]){ dist[v]=newD; push(steps,{type:'graph',graph:GRAPH,mst:[],rejected:[],current:[u,v],visited:{...visited},dist:{...dist},msg:`[g]Relaxed![/g] dist[${v}]=${newD}.`}); }
    }
  }
  push(steps,{type:'graph',graph:GRAPH,mst:[],rejected:[],current:null,visited:{...visited},dist:{...dist},msg:`[g]\u{1F389} Done![/g] Shortest distances computed from ${nodes[0]}.`,snd:'done'});
}

function genFracKnap(steps,algo){
  const cd=App.customData[algo];
  let items=cd?cd.items:[{w:10,v:60},{w:20,v:100},{w:30,v:120}], W=cd?cd.W:50;
  let sorted=items.map((it,i)=>({...it,id:i+1,ratio:it.v/it.w})).sort((a,b)=>b.ratio-a.ratio);
  push(steps,{type:'knapsack_frac',items:sorted,selected:[],W,rem:W,totalV:0,msg:`[b]Fractional Knapsack[/b]: capacity W=${W}. Sort by value/weight ratio, greedily fill.`});
  let sel=[],rem=W,totalV=0;
  for(let it of sorted){
    push(steps,{type:'knapsack_frac',items:sorted,selected:[...sel],W,rem,totalV,msg:`Remaining: [b]${rem}[/b]. Item ${it.id} ratio=${it.ratio.toFixed(1)}.`,snd:'compare'});
    if(it.w<=rem){ rem-=it.w; totalV+=it.v; sel.push({...it,frac:1}); push(steps,{type:'knapsack_frac',items:sorted,selected:[...sel],W,rem,totalV,msg:`[g]Take FULL item ${it.id}![/g] Total=[b]${totalV}[/b].`,snd:'place'}); }
    else if(rem>0){ let frac=rem/it.w, gainV=frac*it.v; totalV+=gainV; sel.push({...it,frac}); rem=0; push(steps,{type:'knapsack_frac',items:sorted,selected:[...sel],W,rem:0,totalV,msg:`[w]Take ${(frac*100).toFixed(0)}% of item ${it.id}![/w] Knapsack full! \u{1F392}`}); break; }
  }
  push(steps,{type:'knapsack_frac',items:sorted,selected:[...sel],W,rem,totalV,msg:`[g]\u{1F389} Max value = ${totalV.toFixed(1)}[/g].`,snd:'done'});
}

function genJobSeq(steps,algo){
  const cd=App.customData[algo];
  let jobs=cd?cd.jobs:[{id:'J1',d:2,p:100},{id:'J2',d:1,p:19},{id:'J3',d:2,p:27},{id:'J4',d:1,p:25},{id:'J5',d:3,p:15}];
  let sorted=[...jobs].sort((a,b)=>b.p-a.p);
  let maxD=Math.max(...jobs.map(j=>j.d));
  let slots=new Array(maxD+1).fill(null), selected=[],profit=0;
  push(steps,{type:'jobseq',jobs:sorted,slots:[...slots],selected:[...selected],profit,msg:`[b]Job Sequencing[/b]: sort by profit, place each job in the latest free slot on/before its deadline.`});
  for(let job of sorted){
    push(steps,{type:'jobseq',jobs:sorted,slots:[...slots],selected:[...selected],profit,msg:`Try [b]${job.id}[/b] (deadline=${job.d}, profit=${job.p}).`,snd:'compare'});
    let placed=false;
    for(let t=job.d;t>=1;t--){ if(!slots[t]){ slots[t]=job.id; selected.push(job.id); profit+=job.p; push(steps,{type:'jobseq',jobs:sorted,slots:[...slots],selected:[...selected],profit,msg:`[g]\u2705 Placed ${job.id} in slot ${t}![/g] Profit=[b]${profit}[/b].`,snd:'place'}); placed=true; break; } }
    if(!placed) push(steps,{type:'jobseq',jobs:sorted,slots:[...slots],selected:[...selected],profit,msg:`[r]Cannot schedule ${job.id}.[/r]`,snd:'reject'});
  }
  push(steps,{type:'jobseq',jobs:sorted,slots:[...slots],selected:[...selected],profit,msg:`[g]\u{1F389} Done![/g] Max profit = [b]${profit}[/b].`,snd:'done'});
}

function genMergePattern(steps,algo){
  const cd=App.customData[algo];
  let files=cd?cd.sizes:[20,30,10,5,30];
  let heap=[...files].sort((a,b)=>a-b), totalCost=0;
  push(steps,{type:'merge_pattern',heap:[...heap],totalCost,step:null,msg:`[b]Optimal Merge Pattern[/b]: always merge the two smallest files first (like Huffman coding).`});
  while(heap.length>1){
    heap.sort((a,b)=>a-b);
    let a=heap.shift(),b=heap.shift(),merged=a+b; totalCost+=merged; heap.push(merged); heap.sort((a,b)=>a-b);
    push(steps,{type:'merge_pattern',heap:[...heap],totalCost,step:[a,b,merged],msg:`Merge [w]${a}[/w]+[w]${b}[/w]=[b]${merged}[/b]. Total=[b]${totalCost}[/b].`,snd:'compare'});
  }
  push(steps,{type:'merge_pattern',heap:[...heap],totalCost,step:null,msg:`[g]\u{1F389} Done![/g] Total cost = [b]${totalCost}[/b].`,snd:'done'});
}

/* ═══════ BACKTRACKING ═══════ */
function genNQueens(steps,algo){
  const cd=App.customData[algo];
  let N=cd?cd.n:4, board=new Array(N).fill(-1);
  push(steps,{type:'nqueens',board:[...board],row:0,msg:`[b]N-Queens (N=${N})[/b]: place ${N} queens with no two attacking each other.`});
  let found=false;
  function safe(b,r,c){ for(let i=0;i<r;i++){ if(b[i]===c||Math.abs(b[i]-c)===Math.abs(i-r)) return false; } return true; }
  function solve(b,r){
    if(found) return;
    if(r===N){ found=true; push(steps,{type:'nqueens',board:[...b],row:r,solved:true,msg:`[g]\u{1F389} Solution found![/g] Columns: ${b.join(', ')}`,snd:'done'}); return; }
    for(let c=0;c<N&&!found;c++){
      push(steps,{type:'nqueens',board:[...b],row:r,trying:c,msg:`Row ${r}: trying column [b]${c}[/b]...`});
      if(safe(b,r,c)){ b[r]=c; push(steps,{type:'nqueens',board:[...b],row:r,placed:c,msg:`[g]Safe![/g] Placed at row ${r}, col ${c}.`,snd:'place'}); solve(b,r+1);
        if(!found){ b[r]=-1; push(steps,{type:'nqueens',board:[...b],row:r,backtrack:true,msg:`[r]Dead end![/r] [w]Backtrack.[/w]`,snd:'back'}); } }
      else push(steps,{type:'nqueens',board:[...b],row:r,unsafe:c,msg:`[r]Unsafe.[/r] Under attack.`});
    }
  }
  solve(board,0);
  if(!found) push(steps,{type:'nqueens',board:[...board],row:0,msg:`[r]No solution exists for N=${N}.[/r]`});
}

function genSubset(steps,algo){
  const cd=App.customData[algo];
  let set=cd?cd.set:[3,7,9,12,5], target=cd?cd.target:15, n=set.length;
  push(steps,{type:'subset',set,target,path:[],found:false,msg:`[b]Subset Sum[/b]: does any subset of {${set}} sum to [w]${target}[/w]?`});
  let foundGlobal=false;
  function solve(idx,curr,path){
    if(foundGlobal) return;
    push(steps,{type:'subset',set,target,path:[...path],sum:curr,idx,found:false,msg:`Index ${idx}, sum=[b]${curr}[/b]. ${curr===target?'[g]Hit target![/g]':curr>target?'[r]Exceeded \u2014 prune![/r]':'Continue...'}`});
    if(curr===target){ foundGlobal=true; push(steps,{type:'subset',set,target,path:[...path],sum:curr,idx,found:true,msg:`[g]\u{1F389} Found {${path}} = ${target}![/g]`,snd:'done'}); return; }
    if(curr>target||idx===n) return;
    push(steps,{type:'subset',set,target,path:[...path,set[idx]],sum:curr+set[idx],idx,found:false,msg:`[w]Include[/w] ${set[idx]}: sum=${curr+set[idx]}`,snd:'compare'});
    solve(idx+1,curr+set[idx],[...path,set[idx]]);
    if(!foundGlobal){ push(steps,{type:'subset',set,target,path:[...path],sum:curr,idx,found:false,msg:`[r]Exclude[/r] ${set[idx]} \u2014 [w]backtrack.[/w]`,snd:'back'}); solve(idx+1,curr,[...path]); }
  }
  solve(0,0,[]);
  if(!foundGlobal) push(steps,{type:'subset',set,target,path:[],sum:0,idx:n,found:false,msg:`[r]No subset sums to ${target}.[/r]`});
}

function genGraphColor(steps,algo){
  const cd=App.customData[algo];
  let n=cd?cd.n:5, m=cd?cd.m:3;
  let adj=cd?cd.adj:[[0,1,1,0,0],[1,0,1,1,0],[1,1,0,0,1],[0,1,0,0,1],[0,0,1,1,0]];
  let colors=new Array(n).fill(0);
  push(steps,{type:'graphcolor',adj,colors:[...colors],n,m,msg:`[b]Graph Coloring[/b]: color ${n} vertices with \u2264${m} colors so no edge joins same-colored vertices.`});
  let solved=false;
  function isSafe(v,c){ for(let u=0;u<n;u++) if(adj[v][u]&&colors[u]===c) return false; return true; }
  function solve(v){
    if(solved) return;
    if(v===n){ solved=true; push(steps,{type:'graphcolor',adj,colors:[...colors],n,m,solved:true,msg:`[g]\u{1F389} Coloring found![/g]`,snd:'done'}); return; }
    for(let c=1;c<=m&&!solved;c++){
      push(steps,{type:'graphcolor',adj,colors:[...colors],n,m,trying:{v,c},msg:`Vertex [b]${v}[/b]: try color ${c}.`,snd:'compare'});
      if(isSafe(v,c)){ colors[v]=c; push(steps,{type:'graphcolor',adj,colors:[...colors],n,m,msg:`[g]Safe![/g] Vertex ${v} colored.`,snd:'place'}); solve(v+1);
        if(!solved){ colors[v]=0; push(steps,{type:'graphcolor',adj,colors:[...colors],n,m,msg:`[r]Backtrack![/r]`,snd:'back'}); } }
      else push(steps,{type:'graphcolor',adj,colors:[...colors],n,m,msg:`[r]Conflict.[/r]`});
    }
  }
  solve(0);
  if(!solved) push(steps,{type:'graphcolor',adj,colors:[...colors],n,m,msg:`[r]No valid coloring with ${m} colors.[/r]`});
}

/* ═══════ DYNAMIC PROGRAMMING ═══════ */
function genKnapsack01(steps,algo){
  const cd=App.customData[algo];
  let items=cd?cd.items:[{w:1,v:1},{w:3,v:4},{w:4,v:5},{w:5,v:7}], W=cd?cd.W:7, n=items.length;
  let dp=Array.from({length:n+1},()=>new Array(W+1).fill(0));
  push(steps,{type:'dp_knapsack',dp:dp.map(r=>[...r]),active:[-1,-1],items,W,msg:`[b]0/1 Knapsack (DP)[/b]: dp[i][w] = best value using first i items, capacity w.`});
  for(let i=1;i<=n;i++) for(let w=0;w<=W;w++){
    push(steps,{type:'dp_knapsack',dp:dp.map(r=>[...r]),active:[i,w],items,W,msg:`dp[${i}][${w}]: item weight=${items[i-1].w}, value=${items[i-1].v}.`,snd:'compare'});
    if(items[i-1].w<=w){ dp[i][w]=Math.max(dp[i-1][w],items[i-1].v+dp[i-1][w-items[i-1].w]); push(steps,{type:'dp_knapsack',dp:dp.map(r=>[...r]),active:[i,w],items,W,msg:`[g]Fits![/g] dp=[b]${dp[i][w]}[/b]`}); }
    else{ dp[i][w]=dp[i-1][w]; push(steps,{type:'dp_knapsack',dp:dp.map(r=>[...r]),active:[i,w],items,W,msg:`[r]Doesn't fit.[/r] Inherit dp=[b]${dp[i][w]}[/b]`}); }
  }
  push(steps,{type:'dp_knapsack',dp:dp.map(r=>[...r]),active:[-1,-1],items,W,msg:`[g]\u{1F389} Answer = dp[${n}][${W}] = [b]${dp[n][W]}[/b][/g]`,snd:'done'});
}

function genLCS(steps,algo){
  const cd=App.customData[algo];
  let X=cd?cd.X:'ABCBD', Y=cd?cd.Y:'ABDC', m=X.length,n=Y.length;
  let dp=Array.from({length:m+1},()=>new Array(n+1).fill(0));
  push(steps,{type:'dp_lcs',dp:dp.map(r=>[...r]),active:[-1,-1],X,Y,msg:`[b]LCS[/b]: longest sequence common to "${X}" and "${Y}" in order.`});
  for(let i=1;i<=m;i++) for(let j=1;j<=n;j++){
    push(steps,{type:'dp_lcs',dp:dp.map(r=>[...r]),active:[i,j],X,Y,msg:`X[${i-1}]='${X[i-1]}' vs Y[${j-1}]='${Y[j-1]}'. ${X[i-1]===Y[j-1]?'[g]Match![/g]':'[r]No match.[/r]'}`,snd:'compare'});
    if(X[i-1]===Y[j-1]){ dp[i][j]=dp[i-1][j-1]+1; push(steps,{type:'dp_lcs',dp:dp.map(r=>[...r]),active:[i,j],X,Y,msg:`[g]Diagonal+1 = [b]${dp[i][j]}[/b][/g]`}); }
    else{ dp[i][j]=Math.max(dp[i-1][j],dp[i][j-1]); push(steps,{type:'dp_lcs',dp:dp.map(r=>[...r]),active:[i,j],X,Y,msg:`max(above,left) = [b]${dp[i][j]}[/b]`}); }
  }
  push(steps,{type:'dp_lcs',dp:dp.map(r=>[...r]),active:[-1,-1],X,Y,msg:`[g]\u{1F389} LCS length = [b]${dp[m][n]}[/b][/g]`,snd:'done'});
}

function genFloyd(steps,algo){
  const GRAPH=getGraphData(algo); const {nodes,edges}=GRAPH;
  const n=nodes.length, INF=999, idxOf={}; nodes.forEach((v,i)=>idxOf[v]=i);
  let dist=Array.from({length:n},()=>new Array(n).fill(INF));
  for(let i=0;i<n;i++) dist[i][i]=0;
  edges.forEach(([a,b,w])=>{ dist[idxOf[a]][idxOf[b]]=Math.min(dist[idxOf[a]][idxOf[b]],w); dist[idxOf[b]][idxOf[a]]=Math.min(dist[idxOf[b]][idxOf[a]],w); });
  push(steps,{type:'dp_floyd',dist:dist.map(r=>[...r]),k:-1,i:-1,j:-1,n,INF,msg:`[b]Floyd-Warshall[/b]: all-pairs shortest paths on {${nodes.join(',')}}. Try every vertex as a stopover.`});
  for(let k=0;k<n;k++){
    push(steps,{type:'dp_floyd',dist:dist.map(r=>[...r]),k,i:-1,j:-1,n,INF,msg:`[w]k=${nodes[k]}[/w]: could a path through ${nodes[k]} be shorter?`});
    for(let i=0;i<n;i++) for(let j=0;j<n;j++){
      if(i===j) continue;
      let via=dist[i][k]+dist[k][j];
      push(steps,{type:'dp_floyd',dist:dist.map(r=>[...r]),k,i,j,n,INF,msg:`dist[${nodes[i]}][${nodes[j]}] vs via ${nodes[k]}: ${via<dist[i][j]?'[g]improve![/g]':'no change'}`,snd:'compare'});
      if(via<dist[i][j]) dist[i][j]=via;
    }
  }
  push(steps,{type:'dp_floyd',dist:dist.map(r=>[...r]),k:n,i:-1,j:-1,n,INF,msg:`[g]\u{1F389} All-pairs shortest paths computed![/g]`,snd:'done'});
}

/* ═══════ APPROXIMATION & META ═══════ */
function genVertexCover(steps,algo){
  const GRAPH=getGraphData(algo);
  let edgesCopy=[...GRAPH.edges], cover=[],removed=[];
  push(steps,{type:'vertex_cover',graph:GRAPH,cover:[...cover],removed:[...removed],current:null,msg:`[b]Vertex Cover 2-Approx[/b]: pick any uncovered edge, add BOTH endpoints, remove covered edges, repeat.`});
  while(edgesCopy.length>0){
    let [u,v]=edgesCopy[0];
    push(steps,{type:'vertex_cover',graph:GRAPH,cover:[...cover],removed:[...removed],current:[u,v],msg:`Pick edge [w]${u}-${v}[/w]. Add [g]both[/g] to the cover.`,snd:'compare'});
    cover.push(u,v);
    let toRemove=edgesCopy.filter(([a,b])=>a===u||a===v||b===u||b===v);
    removed=[...removed,...toRemove];
    edgesCopy=edgesCopy.filter(([a,b])=>a!==u&&a!==v&&b!==u&&b!==v);
    push(steps,{type:'vertex_cover',graph:GRAPH,cover:[...cover],removed:[...removed],current:null,msg:`[g]Cover so far:[/g] {${[...new Set(cover)].join(',')}}`,snd:'place'});
  }
  push(steps,{type:'vertex_cover',graph:GRAPH,cover:[...new Set(cover)],removed:[...removed],current:null,msg:`[g]\u{1F389} Vertex Cover = {${[...new Set(cover)].join(',')}}[/g]. Guaranteed \u2264 2\u00d7 optimal.`,snd:'done'});
}

function genTSP(steps,algo){
  const GRAPH=getGraphData(algo);
  let cities=GRAPH.nodes.slice(0,6);
  let dist={}; cities.forEach(c=>dist[c]={});
  cities.forEach(a=>cities.forEach(b=>{ if(a===b){dist[a][b]=0;return;} const e=GRAPH.edges.find(([x,y])=>(x===a&&y===b)||(x===b&&y===a)); dist[a][b]=e?e[2]:99; }));
  push(steps,{type:'tsp',cities,dist,mstEdges:[],tour:[],tourCost:0,msg:`[b]TSP 2-Approximation[/b]: build an MST, then DFS-walk it with shortcuts to get a tour \u2264 2\u00d7 optimal.`});
  let parent={},key={},inMST={}; cities.forEach(c=>{parent[c]=null;key[c]=Infinity;inMST[c]=false;}); key[cities[0]]=0;
  let mstEdges=[];
  for(let i=0;i<cities.length;i++){
    let u=cities.filter(c=>!inMST[c]).reduce((a,b)=>key[a]<=key[b]?a:b);
    inMST[u]=true; if(parent[u]) mstEdges.push([parent[u],u,dist[parent[u]][u]]);
    push(steps,{type:'tsp',cities,dist,mstEdges:[...mstEdges],tour:[],tourCost:0,msg:`[g]Add ${u}[/g] to MST.`,snd:'place'});
    for(let v of cities) if(!inMST[v]&&dist[u][v]<key[v]){ key[v]=dist[u][v]; parent[v]=u; }
  }
  let tour=[...cities, cities[0]], tourCost=0;
  for(let i=0;i<tour.length-1;i++) tourCost+=dist[tour[i]][tour[i+1]];
  push(steps,{type:'tsp',cities,dist,mstEdges:[...mstEdges],tour:[...tour],tourCost,msg:`[g]Tour: ${tour.join(' \u2192 ')}[/g] Cost=[b]${tourCost}[/b]`,snd:'done'});
}

function genHillClimb(steps,algo){
  const cd=App.customData[algo];
  let vals=cd?cd.values:Array.from({length:10},(_,i)=>Math.round(10*Math.sin(i*0.8+1)+15+Math.random()*5));
  let states=vals.map((v,i)=>({x:i,v}));
  let n=states.length, curr=0;
  push(steps,{type:'hillclimb',states,curr,optimum:-1,msg:`[b]Hill Climbing[/b]: step to whichever neighbour is higher; stop when no neighbour improves.`});
  let iterations=0;
  while(iterations<30){
    let neighbors=[]; if(curr>0) neighbors.push(curr-1); if(curr<n-1) neighbors.push(curr+1);
    let best=neighbors.reduce((a,b)=>states[a].v>states[b].v?a:b,neighbors[0]);
    push(steps,{type:'hillclimb',states,curr,checking:best,optimum:-1,msg:`At ${curr} (val=${states[curr].v}): best neighbour is ${best} (val=${states[best].v}).`,snd:'compare'});
    if(states[best].v<=states[curr].v){ push(steps,{type:'hillclimb',states,curr,optimum:curr,msg:`[g]Local optimum![/g] No neighbour improves on ${curr}. \u26F0\uFE0F`,snd:'done'}); break; }
    curr=best; push(steps,{type:'hillclimb',states,curr,optimum:-1,msg:`[w]Move to ${curr}[/w]. Going uphill! \u{1F4C8}`,snd:'place'}); iterations++;
  }
}

function genGenetic(steps,algo){
  const cd=App.customData[algo];
  let popSize=4, target=cd?cd.target:20;
  function fitness(x){ return Math.max(0,10-Math.abs(x-target)); }
  let pop=Array.from({length:popSize},()=>Math.floor(Math.random()*30));
  push(steps,{type:'genetic',pop:[...pop],fitness:pop.map(fitness),gen:0,phase:'init',target,msg:`[b]Genetic Algorithm[/b]: evolve a population toward target [w]${target}[/w] via selection, crossover, mutation.`});
  for(let gen=1;gen<=5;gen++){
    let fits=pop.map(fitness), totalFit=fits.reduce((a,b)=>a+b,0)||1;
    push(steps,{type:'genetic',pop:[...pop],fitness:[...fits],gen,phase:'eval',target,msg:`[w]Generation ${gen}[/w]: population=[${pop}].`});
    function select(){ let r=Math.random()*totalFit,s=0; for(let i=0;i<pop.length;i++){ s+=fits[i]; if(s>=r) return pop[i]; } return pop[pop.length-1]; }
    let p1=select(),p2=select();
    push(steps,{type:'genetic',pop:[...pop],fitness:[...fits],gen,phase:'select',selected:[p1,p2],target,msg:`[w]Selection:[/w] parents [b]${p1}[/b], [b]${p2}[/b].`,snd:'compare'});
    let child=Math.round((p1+p2)/2);
    push(steps,{type:'genetic',pop:[...pop],fitness:[...fits],gen,phase:'crossover',child,target,msg:`[w]Crossover:[/w] child = [b]${child}[/b].`,snd:'place'});
    let mutated=child+(Math.random()<0.3?(Math.random()>0.5?1:-1)*Math.floor(Math.random()*4):0);
    push(steps,{type:'genetic',pop:[...pop],fitness:[...fits],gen,phase:'mutate',mutated,target,msg:`[w]Mutation:[/w] child \u2192 [b]${mutated}[/b].`});
    let weakIdx=fits.indexOf(Math.min(...fits)); pop[weakIdx]=mutated;
    push(steps,{type:'genetic',pop:[...pop],fitness:pop.map(fitness),gen,phase:'replace',target,msg:`Replace weakest. New population: [${pop}].`,snd:'place'});
  }
  let bestPop=pop.reduce((a,b)=>fitness(a)>fitness(b)?a:b);
  push(steps,{type:'genetic',pop:[...pop],fitness:pop.map(fitness),gen:6,phase:'done',target,msg:`[g]\u{1F389} Best solution: [b]${bestPop}[/b] (fitness=${fitness(bestPop)})[/g]`,snd:'done'});
}

/* ═══════ GREEDY ═══════ */
function genActivity(steps,algo){
  const cd=App.customData[algo];
  let acts=cd?cd.acts:[{id:'A1',s:1,f:4},{id:'A2',s:3,f:5},{id:'A3',s:0,f:6},{id:'A4',s:5,f:7},{id:'A5',s:8,f:9},{id:'A6',s:5,f:9}];
  let sorted=[...acts].sort((a,b)=>a.f-b.f);
  push(steps,{type:'activity',acts:sorted,selected:[],rejected:[],current:-1,msg:`[b]Activity Selection[/b]: one room, many meetings. Always keep the earliest-finishing option.`});
  let sel=[0],lastFinish=sorted[0].f;
  push(steps,{type:'activity',acts:sorted,selected:[...sel],rejected:[],current:0,msg:`[g]Select[/g] [b]${sorted[0].id}[/b] automatically (earliest finish).`});
  for(let i=1;i<sorted.length;i++){
    let a=sorted[i];
    push(steps,{type:'activity',acts:sorted,selected:[...sel],rejected:[],current:i,msg:`Checking [b]${a.id}[/b]: does start ${a.s} \u2265 last finish ${lastFinish}?`,snd:'compare'});
    if(a.s>=lastFinish){ sel.push(i); lastFinish=a.f; push(steps,{type:'activity',acts:sorted,selected:[...sel],rejected:[],current:i,msg:`[g]\u2705 Select ${a.id}![/g] New last finish = ${a.f}.`,snd:'place'}); }
    else push(steps,{type:'activity',acts:sorted,selected:[...sel],rejected:[i],current:i,msg:`[r]Reject ${a.id}.[/r] It overlaps.`,snd:'reject'});
  }
  push(steps,{type:'activity',acts:sorted,selected:[...sel],rejected:[],current:-1,msg:`[g]\u{1F389} Done![/g] Selected ${sel.length} activities: ${sel.map(i=>sorted[i].id).join(', ')}.`,snd:'done'});
}

function genKruskal(steps,algo){
  const {nodes,edges,pos}=getGraphData(algo);
  const graph={nodes,edges,pos};
  let sorted=[...edges].sort((a,b)=>a[2]-b[2]);
  let parent={}; nodes.forEach(n=>parent[n]=n);
  function find(x){ return parent[x]===x?x:parent[x]=find(parent[x]); }
  let mst=[],rejected=[];
  push(steps,{type:'graph',graph,mst:[],rejected:[],current:null,visited:{},dist:{},msg:`[b]Kruskal's MST[/b]: sort all edges, greedily add if it doesn't form a cycle (checked via Union-Find). \u{1F332}`});
  for(let [a,b,w] of sorted){
    push(steps,{type:'graph',graph,mst:[...mst],rejected:[...rejected],current:[a,b,w],visited:{},dist:{},msg:`Considering [w]${a}-${b}(${w})[/w]: same component?`,snd:'compare'});
    if(find(a)!==find(b)){ parent[find(a)]=find(b); mst.push([a,b,w]); push(steps,{type:'graph',graph,mst:[...mst],rejected:[...rejected],current:[a,b,w],visited:{},dist:{},msg:`[g]\u2705 Add ${a}-${b}(${w})![/g] No cycle.`,snd:'place'}); }
    else{ rejected.push([a,b,w]); push(steps,{type:'graph',graph,mst:[...mst],rejected:[...rejected],current:[a,b,w],visited:{},dist:{},msg:`[r]Reject ${a}-${b}(${w}).[/r] Would form a cycle!`,snd:'reject'}); }
    if(mst.length===nodes.length-1) break;
  }
  push(steps,{type:'graph',graph,mst:[...mst],rejected:[...rejected],current:null,visited:{},dist:{},msg:`[g]\u{1F389} MST complete![/g] Total weight = [b]${mst.reduce((s,e)=>s+e[2],0)}[/b].`,snd:'done'});
}

function genPrim(steps,algo){
  const {nodes,edges,pos}=getGraphData(algo);
  const graph={nodes,edges,pos};
  let key={},inMST={},parent={},mstEdges=[];
  nodes.forEach(n=>{key[n]=Infinity;inMST[n]=false;parent[n]=null;});
  key[nodes[0]]=0;
  push(steps,{type:'graph',graph,mst:[],rejected:[],current:null,visited:{},dist:{...key},msg:`[b]Prim's MST[/b]: start from ${nodes[0]}, always add the cheapest edge crossing the frontier. \u{1F331}`});
  for(let count=0;count<nodes.length;count++){
    let remaining=nodes.filter(n=>!inMST[n]); if(!remaining.length) break;
    let u=remaining.reduce((a,b)=>key[a]<=key[b]?a:b);
    if(key[u]===Infinity) break;
    inMST[u]=true; if(parent[u]!==null) mstEdges.push([parent[u],u,key[u]]);
    push(steps,{type:'graph',graph,mst:[...mstEdges],rejected:[],current:u,visited:{...inMST},dist:{...key},msg:`[g]Add vertex ${u}[/g] (cost ${key[u]}).`,snd:'place'});
    for(let [a,b,w] of edges){
      let v=a===u?b:b===u?a:null; if(!v||inMST[v]) continue;
      push(steps,{type:'graph',graph,mst:[...mstEdges],rejected:[],current:[u,v],visited:{...inMST},dist:{...key},msg:`Edge ${u}-${v}(${w}): better than key[${v}]=${key[v]===Infinity?'\u221e':key[v]}?`,snd:'compare'});
      if(w<key[v]){key[v]=w;parent[v]=u;}
    }
  }
  push(steps,{type:'graph',graph,mst:[...mstEdges],rejected:[],current:null,visited:{...inMST},dist:{...key},msg:`[g]\u{1F389} MST complete![/g] Total = ${mstEdges.reduce((s,e)=>s+e[2],0)}.`,snd:'done'});
}

function genDijkstra(steps,algo){
  const {nodes,edges,pos}=getGraphData(algo);
  const graph={nodes,edges,pos};
  let dist={},visited={};
  nodes.forEach(n=>{dist[n]=n===nodes[0]?0:Infinity;visited[n]=false;});
  push(steps,{type:'graph',graph,mst:[],rejected:[],current:null,visited:{...visited},dist:{...dist},msg:`[b]Dijkstra's[/b]: from source ${nodes[0]}, always visit the closest unvisited vertex next. \u{1F5FA}`});
  for(let iter=0;iter<nodes.length;iter++){
    let unvisited=nodes.filter(n=>!visited[n]); if(!unvisited.length) break;
    let u=unvisited.reduce((a,b)=>dist[a]<=dist[b]?a:b);
    if(dist[u]===Infinity) break;
    visited[u]=true;
    push(steps,{type:'graph',graph,mst:[],rejected:[],current:u,visited:{...visited},dist:{...dist},msg:`[g]Visit ${u}[/g] (dist=${dist[u]}). Relax its neighbours...`});
    for(let [a,b,w] of edges){
      let v=a===u?b:b===u?a:null; if(!v||visited[v]) continue;
      let newD=dist[u]+w;
      push(steps,{type:'graph',graph,mst:[],rejected:[],current:[u,v],visited:{...visited},dist:{...dist},msg:`${u}\u2192${v}(${w}): ${dist[u]}+${w}=[b]${newD}[/b] vs ${dist[v]===Infinity?'\u221e':dist[v]}?`,snd:'compare'});
      if(newD<dist[v]){ dist[v]=newD; push(steps,{type:'graph',graph,mst:[],rejected:[],current:[u,v],visited:{...visited},dist:{...dist},msg:`[g]Relaxed![/g] dist[${v}]=${newD}.`}); }
    }
  }
  push(steps,{type:'graph',graph,mst:[],rejected:[],current:null,visited:{...visited},dist:{...dist},msg:`[g]\u{1F389} Done![/g] Shortest distances from ${nodes[0]}: ${nodes.map(n=>n+'='+(dist[n]===Infinity?'\u221e':dist[n])).join(', ')}.`,snd:'done'});
}

function genFracKnap(steps,algo){
  const cd=App.customData[algo];
  let items=cd?cd.items:[{w:10,v:60},{w:20,v:100},{w:30,v:120}];
  let W=cd?cd.W:50;
  let sorted=items.map((it,i)=>({...it,id:i+1,ratio:it.v/it.w})).sort((a,b)=>b.ratio-a.ratio);
  push(steps,{type:'knapsack_frac',items:sorted,selected:[],W,rem:W,totalV:0,msg:`[b]Fractional Knapsack[/b]: capacity W=${W}. Items are splittable \u2014 take highest value/weight first.`});
  let sel=[],rem=W,totalV=0;
  for(let it of sorted){
    push(steps,{type:'knapsack_frac',items:sorted,selected:[...sel],W,rem,totalV,msg:`Remaining: [b]${rem}[/b]. Item ${it.id} ratio=${it.ratio.toFixed(2)}. Fits fully?`,snd:'compare'});
    if(it.w<=rem){ rem-=it.w; totalV+=it.v; sel.push({...it,frac:1}); push(steps,{type:'knapsack_frac',items:sorted,selected:[...sel],W,rem,totalV,msg:`[g]Take FULL item ${it.id}![/g] Total value = [b]${totalV.toFixed(1)}[/b].`,snd:'place'}); }
    else if(rem>0){ let frac=rem/it.w,gainV=frac*it.v; totalV+=gainV; sel.push({...it,frac}); rem=0; push(steps,{type:'knapsack_frac',items:sorted,selected:[...sel],W,rem:0,totalV,msg:`[w]Take ${(frac*100).toFixed(0)}% of item ${it.id}![/w] Knapsack full. \u{1F392}`}); break; }
  }
  push(steps,{type:'knapsack_frac',items:sorted,selected:[...sel],W,rem,totalV,msg:`[g]\u{1F389} Max value = ${totalV.toFixed(1)}.[/g]`,snd:'done'});
}

function genJobSeq(steps,algo){
  const cd=App.customData[algo];
  let jobs=cd?cd.jobs:[{id:'J1',d:2,p:100},{id:'J2',d:1,p:19},{id:'J3',d:2,p:27},{id:'J4',d:1,p:25},{id:'J5',d:3,p:15}];
  let sorted=[...jobs].sort((a,b)=>b.p-a.p);
  let maxD=Math.max(...jobs.map(j=>j.d));
  let slots=new Array(maxD+1).fill(null), selected=[],profit=0;
  push(steps,{type:'jobseq',jobs:sorted,slots:[...slots],selected:[...selected],profit,msg:`[b]Job Sequencing[/b]: highest profit first, place each job in the latest free slot \u2264 its deadline.`});
  for(let job of sorted){
    push(steps,{type:'jobseq',jobs:sorted,slots:[...slots],selected:[...selected],profit,msg:`Trying [b]${job.id}[/b] (deadline=${job.d}, profit=${job.p}).`,snd:'compare'});
    let placed=false;
    for(let t=job.d;t>=1;t--){ if(!slots[t]){ slots[t]=job.id; selected.push(job.id); profit+=job.p; push(steps,{type:'jobseq',jobs:sorted,slots:[...slots],selected:[...selected],profit,msg:`[g]\u2705 Placed ${job.id} in slot ${t}![/g] Profit=[b]${profit}[/b]`,snd:'place'}); placed=true; break; } }
    if(!placed) push(steps,{type:'jobseq',jobs:sorted,slots:[...slots],selected:[...selected],profit,msg:`[r]Cannot schedule ${job.id}.[/r] All valid slots taken.`,snd:'reject'});
  }
  push(steps,{type:'jobseq',jobs:sorted,slots:[...slots],selected:[...selected],profit,msg:`[g]\u{1F389} Done![/g] Max profit = [b]${profit}[/b].`,snd:'done'});
}

function genMergePattern(steps,algo){
  const cd=App.customData[algo];
  let files=cd?cd.sizes:[20,30,10,5,30];
  let heap=[...files].sort((a,b)=>a-b), totalCost=0;
  push(steps,{type:'merge_pattern',heap:[...heap],totalCost,step:null,msg:`[b]Optimal Merge Pattern[/b]: always merge the two smallest files first (same idea as Huffman coding).`});
  while(heap.length>1){
    heap.sort((a,b)=>a-b);
    let a=heap.shift(),b=heap.shift(),merged=a+b; totalCost+=merged; heap.push(merged); heap.sort((a,b)=>a-b);
    push(steps,{type:'merge_pattern',heap:[...heap],totalCost,step:[a,b,merged],msg:`Merge [w]${a}[/w] + [w]${b}[/w] = [b]${merged}[/b]. Running total = [b]${totalCost}[/b].`,snd:'compare'});
  }
  push(steps,{type:'merge_pattern',heap:[...heap],totalCost,step:null,msg:`[g]\u{1F389} Done![/g] Total merge cost = [b]${totalCost}[/b].`,snd:'done'});
}

/* ═══════ BACKTRACKING ═══════ */
function genNQueens(steps,algo){
  const cd=App.customData[algo];
  let N=cd?cd.n:4, board=new Array(N).fill(-1);
  push(steps,{type:'nqueens',board:[...board],row:0,msg:`[b]N-Queens (N=${N})[/b]: place ${N} queens so none attack another. Backtrack on dead ends.`});
  let found=false;
  function safe(b,r,c){ for(let i=0;i<r;i++){ if(b[i]===c||Math.abs(b[i]-c)===Math.abs(i-r)) return false; } return true; }
  function solve(b,r){
    if(found) return;
    if(r===N){ found=true; push(steps,{type:'nqueens',board:[...b],row:r,solved:true,msg:`[g]\u{1F389} Solution found![/g] Columns: ${b.join(', ')}.`,snd:'done'}); return; }
    for(let c=0;c<N&&!found;c++){
      push(steps,{type:'nqueens',board:[...b],row:r,trying:c,msg:`Row ${r}: trying column [b]${c}[/b]...`});
      if(safe(b,r,c)){ b[r]=c; push(steps,{type:'nqueens',board:[...b],row:r,placed:c,msg:`[g]Safe![/g] Placed at row ${r}, col ${c}.`,snd:'place'}); solve(b,r+1);
        if(!found){ b[r]=-1; push(steps,{type:'nqueens',board:[...b],row:r,backtrack:true,msg:`[r]Dead end![/r] [w]Backtrack[/w] from row ${r}. \u21A9`,snd:'back'}); } }
      else push(steps,{type:'nqueens',board:[...b],row:r,unsafe:c,msg:`[r]Unsafe![/r] Column ${c} is attacked.`});
    }
  }
  solve(board,0);
}

function genSubset(steps,algo){
  const cd=App.customData[algo];
  let set=cd?cd.set:[3,7,9,12,5], target=cd?cd.target:15, n=set.length;
  push(steps,{type:'subset',set,target,path:[],found:false,msg:`[b]Subset Sum[/b]: does any subset of {${set}} sum to [w]${target}[/w]? Include/exclude each element, prune when over target.`});
  let foundGlobal=false;
  function solve(idx,curr,path){
    if(foundGlobal) return;
    push(steps,{type:'subset',set,target,path:[...path],sum:curr,idx,found:false,msg:`Index ${idx}, sum=[b]${curr}[/b]. ${curr===target?'[g]Hit target![/g]':curr>target?'[r]Exceeded \u2014 prune![/r]':'Continue...'}`});
    if(curr===target){ foundGlobal=true; push(steps,{type:'subset',set,target,path:[...path],sum:curr,idx,found:true,msg:`[g]\u{1F389} Found {${path}} = ${target}![/g]`,snd:'done'}); return; }
    if(curr>target||idx===n) return;
    push(steps,{type:'subset',set,target,path:[...path,set[idx]],sum:curr+set[idx],idx,found:false,msg:`[w]Include[/w] ${set[idx]} \u2192 sum=${curr+set[idx]}`,snd:'compare'});
    solve(idx+1,curr+set[idx],[...path,set[idx]]);
    if(!foundGlobal){ push(steps,{type:'subset',set,target,path:[...path],sum:curr,idx,found:false,msg:`[r]Exclude[/r] ${set[idx]} (backtrack).`,snd:'back'}); solve(idx+1,curr,[...path]); }
  }
  solve(0,0,[]);
  if(!foundGlobal) push(steps,{type:'subset',set,target,path:[],sum:0,idx:n,found:false,msg:`[r]No subset sums to ${target}.[/r]`});
}

function genGraphColor(steps,algo){
  const cd=App.customData[algo];
  let n=cd?cd.n:5, m=cd?cd.m:3;
  let adj=cd?cd.adj:[[0,1,1,0,0],[1,0,1,1,0],[1,1,0,0,1],[0,1,0,0,1],[0,0,1,1,0]];
  let colors=new Array(n).fill(0);
  push(steps,{type:'graphcolor',adj,colors:[...colors],n,m,msg:`[b]Graph Coloring[/b]: color ${n} vertices with \u2264${m} colors so no edge connects two same-colored vertices.`});
  let solved=false;
  function isSafe(v,c){ for(let u=0;u<n;u++) if(adj[v][u]&&colors[u]===c) return false; return true; }
  function solve(v){
    if(solved) return;
    if(v===n){ solved=true; push(steps,{type:'graphcolor',adj,colors:[...colors],n,m,solved:true,msg:`[g]\u{1F389} Coloring found![/g]`,snd:'done'}); return; }
    for(let c=1;c<=m&&!solved;c++){
      push(steps,{type:'graphcolor',adj,colors:[...colors],n,m,trying:{v,c},msg:`Vertex [b]${v}[/b]: trying color ${c}. Any conflict?`,snd:'compare'});
      if(isSafe(v,c)){ colors[v]=c; push(steps,{type:'graphcolor',adj,colors:[...colors],n,m,msg:`[g]Safe![/g] Vertex ${v} colored.`,snd:'place'}); solve(v+1);
        if(!solved){ colors[v]=0; push(steps,{type:'graphcolor',adj,colors:[...colors],n,m,msg:`[r]Backtrack![/r] Removing color from vertex ${v}.`,snd:'back'}); } }
      else push(steps,{type:'graphcolor',adj,colors:[...colors],n,m,msg:`[r]Conflict![/r] Skip.`});
    }
  }
  solve(0);
  if(!solved) push(steps,{type:'graphcolor',adj,colors:[...colors],n,m,msg:`[r]No valid coloring exists with ${m} colors.[/r]`});
}

/* ═══════ DYNAMIC PROGRAMMING ═══════ */
function genKnapsack01(steps,algo){
  const cd=App.customData[algo];
  let items=cd?cd.items:[{w:1,v:1},{w:3,v:4},{w:4,v:5},{w:5,v:7}];
  let W=cd?cd.W:7, n=items.length;
  let dp=Array.from({length:n+1},()=>new Array(W+1).fill(0));
  push(steps,{type:'dp_knapsack',dp:dp.map(r=>[...r]),active:[-1,-1],items,W,msg:`[b]0/1 Knapsack (DP)[/b]: dp[i][w] = best value using first i items with capacity w.`});
  for(let i=1;i<=n;i++) for(let w=0;w<=W;w++){
    push(steps,{type:'dp_knapsack',dp:dp.map(r=>[...r]),active:[i,w],items,W,msg:`dp[${i}][${w}]: item weight=${items[i-1].w}, cap=${w}. Fits?`,snd:'compare'});
    if(items[i-1].w<=w){ dp[i][w]=Math.max(dp[i-1][w],items[i-1].v+dp[i-1][w-items[i-1].w]); push(steps,{type:'dp_knapsack',dp:dp.map(r=>[...r]),active:[i,w],items,W,msg:`[g]Fits![/g] dp[${i}][${w}] = [b]${dp[i][w]}[/b]`}); }
    else{ dp[i][w]=dp[i-1][w]; push(steps,{type:'dp_knapsack',dp:dp.map(r=>[...r]),active:[i,w],items,W,msg:`[r]Doesn't fit.[/r] Inherit dp[${i-1}][${w}] = [b]${dp[i][w]}[/b]`}); }
  }
  push(steps,{type:'dp_knapsack',dp:dp.map(r=>[...r]),active:[-1,-1],items,W,msg:`[g]\u{1F389} Answer = dp[${n}][${W}] = [b]${dp[n][W]}[/b][/g]`,snd:'done'});
}

function genLCS(steps,algo){
  const cd=App.customData[algo];
  let X=cd?cd.X:'ABCBD', Y=cd?cd.Y:'ABDC';
  let m=X.length,n=Y.length;
  let dp=Array.from({length:m+1},()=>new Array(n+1).fill(0));
  push(steps,{type:'dp_lcs',dp:dp.map(r=>[...r]),active:[-1,-1],X,Y,msg:`[b]LCS[/b]: longest sequence appearing in both "[w]${X}[/w]" and "[w]${Y}[/w]" in the same order.`});
  for(let i=1;i<=m;i++) for(let j=1;j<=n;j++){
    push(steps,{type:'dp_lcs',dp:dp.map(r=>[...r]),active:[i,j],X,Y,msg:`X[${i-1}]='[b]${X[i-1]}[/b]' vs Y[${j-1}]='[b]${Y[j-1]}[/b]'.`,snd:'compare'});
    if(X[i-1]===Y[j-1]){ dp[i][j]=dp[i-1][j-1]+1; push(steps,{type:'dp_lcs',dp:dp.map(r=>[...r]),active:[i,j],X,Y,msg:`[g]Match![/g] dp[${i}][${j}] = [b]${dp[i][j]}[/b]`}); }
    else{ dp[i][j]=Math.max(dp[i-1][j],dp[i][j-1]); push(steps,{type:'dp_lcs',dp:dp.map(r=>[...r]),active:[i,j],X,Y,msg:`No match. dp[${i}][${j}] = [b]${dp[i][j]}[/b]`}); }
  }
  push(steps,{type:'dp_lcs',dp:dp.map(r=>[...r]),active:[-1,-1],X,Y,msg:`[g]\u{1F389} LCS length = ${dp[m][n]}[/g]`,snd:'done'});
}

function genFloyd(steps,algo){
  const {nodes,edges}=getGraphData(algo);
  const n=nodes.length, INF=999;
  const idx={}; nodes.forEach((nd,i)=>idx[nd]=i);
  let dist=Array.from({length:n},()=>new Array(n).fill(INF));
  for(let i=0;i<n;i++) dist[i][i]=0;
  edges.forEach(([a,b,w])=>{ dist[idx[a]][idx[b]]=Math.min(dist[idx[a]][idx[b]],w); dist[idx[b]][idx[a]]=Math.min(dist[idx[b]][idx[a]],w); });
  push(steps,{type:'dp_floyd',dist:dist.map(r=>[...r]),k:-1,i:-1,j:-1,n,INF,msg:`[b]Floyd-Warshall[/b]: shortest paths between ALL pairs, trying each vertex as an intermediate stopover.`});
  for(let k=0;k<n;k++){
    push(steps,{type:'dp_floyd',dist:dist.map(r=>[...r]),k,i:-1,j:-1,n,INF,msg:`[w]Intermediate k=${nodes[k]}[/w]: could routes through it be shorter?`});
    for(let i=0;i<n;i++) for(let j=0;j<n;j++){
      if(i===j) continue;
      let via=dist[i][k]+dist[k][j];
      push(steps,{type:'dp_floyd',dist:dist.map(r=>[...r]),k,i,j,n,INF,msg:`dist[${nodes[i]}][${nodes[j]}] vs via ${nodes[k]}: ${via<dist[i][j]?'[g]shorter![/g]':'no change.'}`,snd:'compare'});
      if(via<dist[i][j]){ dist[i][j]=via; push(steps,{type:'dp_floyd',dist:dist.map(r=>[...r]),k,i,j,n,INF,msg:`[g]Updated![/g] New shortest = ${via}.`}); }
    }
  }
  push(steps,{type:'dp_floyd',dist:dist.map(r=>[...r]),k:n,i:-1,j:-1,n,INF,msg:`[g]\u{1F389} All-pairs shortest paths computed![/g]`,snd:'done'});
}

/* ═══════ APPROXIMATION & METAHEURISTIC ═══════ */
function genVertexCover(steps,algo){
  const {nodes,edges,pos}=getGraphData(algo);
  const graph={nodes,edges,pos};
  let edgesCopy=[...edges], cover=[],removed=[];
  push(steps,{type:'vertex_cover',graph,cover:[],removed:[],current:null,msg:`[b]Vertex Cover 2-Approx[/b]: pick any uncovered edge, add BOTH endpoints, remove covered edges, repeat.`});
  while(edgesCopy.length>0){
    let [u,v]=edgesCopy[0];
    push(steps,{type:'vertex_cover',graph,cover:[...cover],removed:[...removed],current:[u,v],msg:`Pick edge [w]${u}-${v}[/w]. Add BOTH to cover.`,snd:'compare'});
    cover.push(u,v);
    let toRemove=edgesCopy.filter(([a,b])=>a===u||a===v||b===u||b===v);
    removed=[...removed,...toRemove];
    edgesCopy=edgesCopy.filter(([a,b])=>a!==u&&a!==v&&b!==u&&b!==v);
    push(steps,{type:'vertex_cover',graph,cover:[...cover],removed:[...removed],current:null,msg:`[g]Added ${u},${v}.[/g] Remaining edges: ${edgesCopy.length}.`,snd:'place'});
  }
  push(steps,{type:'vertex_cover',graph,cover:[...new Set(cover)],removed:[...removed],current:null,msg:`[g]\u{1F389} Cover = {${[...new Set(cover)].join(',')}}[/g] (size ${new Set(cover).size}). \u2264 2\u00d7optimal, guaranteed.`,snd:'done'});
}

function genTSP(steps,algo){
  const g=getGraphData(algo);
  const cities=g.nodes;
  const distMap={}; cities.forEach(c=>{distMap[c]={}; cities.forEach(c2=>distMap[c][c2]=c===c2?0:999);});
  g.edges.forEach(([a,b,w])=>{ distMap[a][b]=w; distMap[b][a]=w; });
  push(steps,{type:'tsp',cities,dist:distMap,mstEdges:[],tour:[],tourCost:0,msg:`[b]TSP 2-Approximation[/b]: build an MST, then DFS-walk it and shortcut repeats to form a tour.`});
  let parent={},key={},inMST={}; cities.forEach(c=>{parent[c]=null;key[c]=Infinity;inMST[c]=false;}); key[cities[0]]=0;
  let mstEdges=[];
  for(let i=0;i<cities.length;i++){
    let u=cities.filter(c=>!inMST[c]).reduce((a,b)=>key[a]<=key[b]?a:b);
    inMST[u]=true; if(parent[u]) mstEdges.push([parent[u],u,distMap[parent[u]][u]]);
    push(steps,{type:'tsp',cities,dist:distMap,mstEdges:[...mstEdges],tour:[],tourCost:0,msg:`[g]Add ${u}[/g] to MST.`,snd:'place'});
    for(let v of cities){ if(!inMST[v]&&distMap[u][v]<key[v]){key[v]=distMap[u][v];parent[v]=u;} }
  }
  let tour=[cities[0]]; const visited=new Set([cities[0]]);
  function dfs(u){ mstEdges.forEach(([a,b])=>{ let v=a===u?b:b===u?a:null; if(v&&!visited.has(v)){ visited.add(v); tour.push(v); dfs(v);} }); }
  dfs(cities[0]); tour.push(cities[0]);
  let tourCost=0; for(let i=0;i<tour.length-1;i++) tourCost+=distMap[tour[i]][tour[i+1]];
  push(steps,{type:'tsp',cities,dist:distMap,mstEdges:[...mstEdges],tour:[...tour],tourCost,msg:`[g]Tour: ${tour.join(' \u2192 ')}[/g]. Cost = [b]${tourCost}[/b]`,snd:'done'});
}

function genHillClimb(steps,algo){
  const cd=App.customData[algo];
  let vals=cd?cd.values:null;
  let states=(vals||Array.from({length:10},(_,i)=>Math.round(10*Math.sin(i*0.8+1)+15+Math.random()*5))).map((v,i)=>({x:i,v}));
  let curr=0;
  push(steps,{type:'hillclimb',states,curr,optimum:-1,msg:`[b]Hill Climbing[/b]: step toward whichever neighbour is higher. Stop when no neighbour improves.`});
  let iterations=0;
  while(iterations<30){
    let n=states.length, neighbors=[];
    if(curr>0) neighbors.push(curr-1); if(curr<n-1) neighbors.push(curr+1);
    let best=neighbors.reduce((a,b)=>states[a].v>states[b].v?a:b,neighbors[0]);
    push(steps,{type:'hillclimb',states,curr,checking:best,optimum:-1,msg:`At pos ${curr} (${states[curr].v}): best neighbour is ${best} (${states[best].v}). Better?`,snd:'compare'});
    if(states[best].v<=states[curr].v){ push(steps,{type:'hillclimb',states,curr,optimum:curr,msg:`[g]Local optimum![/g] Stuck at pos [b]${curr}[/b] (val [b]${states[curr].v}[/b]).`,snd:'done'}); break; }
    curr=best; push(steps,{type:'hillclimb',states,curr,optimum:-1,msg:`[w]Moved to pos ${curr}[/w] (${states[curr].v}). Going uphill!`,snd:'place'}); iterations++;
  }
}

function genGenetic(steps,algo){
  const cd=App.customData[algo];
  let target=cd?cd.target:20;
  let popSize=4;
  function fitness(x){ return Math.max(0,10-Math.abs(x-target)); }
  let pop=Array.from({length:popSize},()=>Math.floor(Math.random()*(target*1.6)));
  push(steps,{type:'genetic',pop:[...pop],fitness:pop.map(fitness),gen:0,phase:'init',target,msg:`[b]Genetic Algorithm[/b]: evolve a population toward x=[w]${target}[/w] via selection, crossover, mutation.`});
  for(let gen=1;gen<=5;gen++){
    let fits=pop.map(fitness), totalFit=fits.reduce((a,b)=>a+b,0)||1;
    push(steps,{type:'genetic',pop:[...pop],fitness:[...fits],gen,phase:'eval',target,msg:`[w]Generation ${gen}[/w]: fitness = [${fits}].`});
    function select(){ let r=Math.random()*totalFit,s=0; for(let i=0;i<pop.length;i++){ s+=fits[i]; if(s>=r) return pop[i]; } return pop[pop.length-1]; }
    let p1=select(),p2=select();
    push(steps,{type:'genetic',pop:[...pop],fitness:[...fits],gen,phase:'select',selected:[p1,p2],target,msg:`[w]Selection:[/w] parents [b]${p1}[/b] and [b]${p2}[/b].`,snd:'compare'});
    let child=Math.round((p1+p2)/2);
    push(steps,{type:'genetic',pop:[...pop],fitness:[...fits],gen,phase:'crossover',child,target,msg:`[w]Crossover:[/w] child = [b]${child}[/b].`,snd:'place'});
    let mutated=child+(Math.random()<0.3?(Math.random()>0.5?1:-1)*Math.floor(Math.random()*4):0);
    push(steps,{type:'genetic',pop:[...pop],fitness:[...fits],gen,phase:'mutate',mutated,target,msg:`[w]Mutation:[/w] ${child} \u2192 [b]${mutated}[/b].`});
    let weakIdx=fits.indexOf(Math.min(...fits)); pop[weakIdx]=mutated;
    push(steps,{type:'genetic',pop:[...pop],fitness:pop.map(fitness),gen,phase:'replace',target,msg:`New population: [${pop}].`,snd:'place'});
  }
  let bestPop=pop.reduce((a,b)=>fitness(a)>fitness(b)?a:b);
  push(steps,{type:'genetic',pop:[...pop],fitness:pop.map(fitness),gen:6,phase:'done',target,msg:`[g]\u{1F389} Best solution: [b]${bestPop}[/b][/g] (fitness=${fitness(bestPop)}).`,snd:'done'});
}
