/* Algorithm registry: metadata + sidebar categories + global mutable state */
const ALGO_META = {
  bubble:{title:'Bubble Sort',subtitle:'Sorting · Comparison-based',time:'O(n\u00b2)',space:'O(1)',cat:'Sorting',input:'array'},
  selection:{title:'Selection Sort',subtitle:'Sorting · In-place',time:'O(n\u00b2)',space:'O(1)',cat:'Sorting',input:'array'},
  heap:{title:'Heap Sort',subtitle:'Sorting · Heap-based',time:'O(n log n)',space:'O(1)',cat:'Sorting',input:'array'},
  merge:{title:'Merge Sort',subtitle:'Sorting · Divide & Conquer',time:'O(n log n)',space:'O(n)',cat:'Sorting',input:'array'},
  quick:{title:'Randomized Quick Sort',subtitle:'Sorting · Divide & Conquer',time:'O(n log n) avg',space:'O(log n)',cat:'Sorting',input:'array'},
  linear:{title:'Linear Search',subtitle:'Searching · Sequential scan',time:'O(n)',space:'O(1)',cat:'Searching',input:'search'},
  binary:{title:'Binary Search',subtitle:'Searching · Divide & Conquer',time:'O(log n)',space:'O(1)',cat:'Searching',input:'search'},
  kmp:{title:'KMP Algorithm',subtitle:'String Matching · Prefix table',time:'O(n+m)',space:'O(m)',cat:'String Matching',input:'string'},
  rabin:{title:'Rabin-Karp',subtitle:'String Matching · Rolling hash',time:'O(n+m) avg',space:'O(1)',cat:'String Matching',input:'string'},
  minmax:{title:'Min-Max Finding',subtitle:'Divide & Conquer',time:'O(n)',space:'O(log n)',cat:'Divide & Conquer',input:'array'},
  strassen:{title:'Strassen\u2019s Matrix Mult.',subtitle:'Divide & Conquer',time:'O(n^2.81)',space:'O(n\u00b2)',cat:'Divide & Conquer',input:'matrix'},
  activity:{title:'Activity Selection',subtitle:'Greedy · Interval scheduling',time:'O(n log n)',space:'O(1)',cat:'Greedy',input:'activities'},
  kruskal:{title:'Kruskal\u2019s MST',subtitle:'Greedy · Union-Find',time:'O(E log E)',space:'O(V)',cat:'Greedy',input:'graph'},
  prim:{title:'Prim\u2019s MST',subtitle:'Greedy · Priority Queue',time:'O(E log V)',space:'O(V)',cat:'Greedy',input:'graph'},
  fracknap:{title:'Fractional Knapsack',subtitle:'Greedy · Ratio sort',time:'O(n log n)',space:'O(1)',cat:'Greedy',input:'items'},
  jobseq:{title:'Job Sequencing',subtitle:'Greedy · Deadline scheduling',time:'O(n log n)',space:'O(n)',cat:'Greedy',input:'jobs'},
  merge_pattern:{title:'Optimal Merge Pattern',subtitle:'Greedy · Min-Heap',time:'O(n log n)',space:'O(n)',cat:'Greedy',input:'sizes'},
  dijkstra:{title:'Dijkstra\u2019s Algorithm',subtitle:'Greedy · Shortest Path',time:'O((V+E) log V)',space:'O(V)',cat:'Greedy',input:'graph'},
  nqueens:{title:'N-Queens',subtitle:'Backtracking · State space',time:'O(N!)',space:'O(N)',cat:'Backtracking',input:'n'},
  subset:{title:'Subset Sum',subtitle:'Backtracking · Pruning',time:'O(2\u207f)',space:'O(n)',cat:'Backtracking',input:'setTarget'},
  graphcolor:{title:'Graph Coloring',subtitle:'Backtracking · m-coloring',time:'O(m\u207f)',space:'O(n)',cat:'Backtracking',input:'graphColor'},
  knapsack01:{title:'0/1 Knapsack',subtitle:'Dynamic Programming · Table',time:'O(nW)',space:'O(nW)',cat:'Dynamic Programming',input:'itemsCap'},
  lcs:{title:'Longest Common Subsequence',subtitle:'Dynamic Programming',time:'O(mn)',space:'O(mn)',cat:'Dynamic Programming',input:'twoStrings'},
  floyd:{title:'Floyd-Warshall',subtitle:'DP · All-pairs shortest paths',time:'O(V\u00b3)',space:'O(V\u00b2)',cat:'Dynamic Programming',input:'graph'},
  vertexcover:{title:'Vertex Cover Approx.',subtitle:'2-Approximation',time:'O(V+E)',space:'O(V)',cat:'Approximation',input:'graph'},
  tsp:{title:'TSP Approximation',subtitle:'2-Approximation via MST',time:'O(V\u00b2 log V)',space:'O(V)',cat:'Approximation',input:'graph'},
  hillclimb:{title:'Hill Climbing',subtitle:'Metaheuristic · Local Search',time:'Heuristic',space:'O(1)',cat:'Metaheuristic',input:'landscape'},
  genetic:{title:'Genetic Algorithm',subtitle:'Metaheuristic · Evolutionary',time:'Heuristic',space:'O(pop)',cat:'Metaheuristic',input:'gaTarget'},
  master:{title:'Master Theorem',subtitle:'Supporting Technique · Recurrence',time:'\u2014',space:'\u2014',cat:'Theory',input:'none'},
  amortized:{title:'Amortized Analysis',subtitle:'Supporting Technique',time:'\u2014',space:'\u2014',cat:'Theory',input:'none'},
  cooks:{title:'Cook\u2019s Theorem / NP',subtitle:'Theory',time:'\u2014',space:'\u2014',cat:'Theory',input:'none'},
  jssp:{title:'Job Shop Scheduling',subtitle:'NP-Hard Scheduling',time:'NP-Hard',space:'O(n\u00b7m)',cat:'Theory',input:'none'},
};

const CATEGORIES = [
  {name:'Sorting', items:['bubble','selection','heap','merge','quick']},
  {name:'Searching', items:['linear','binary']},
  {name:'String Matching', items:['kmp','rabin']},
  {name:'Divide & Conquer', items:['minmax','strassen']},
  {name:'Greedy', items:['activity','kruskal','prim','fracknap','jobseq','merge_pattern','dijkstra']},
  {name:'Backtracking', items:['nqueens','subset','graphcolor']},
  {name:'Dynamic Programming', items:['knapsack01','lcs','floyd']},
  {name:'Approximation & Meta', items:['vertexcover','tsp','hillclimb','genetic']},
  {name:'Supporting Techniques', items:['master','amortized','cooks','jssp']},
];

const TAG_CLASS = {'O(1)':'tag-o1'};
function tagClassFor(time){
  if(time.indexOf('n\u00b2')>=0||time.indexOf('n!')>=0||time.indexOf('N!')>=0||time.indexOf('2\u207f')>=0||time.indexOf('m\u207f')>=0) return 'tag-exp';
  if(time==='\u2014'||time==='Heuristic'||time==='NP-Hard') return 'tag-th';
  if(time==='O(1)') return 'tag-o1';
  return 'tag-on';
}

const App = {
  currentAlgo:'bubble',
  steps:[],
  stepIdx:0,
  playing:false,
  playTimer:null,
  currentTab:'viz',
  speedMap:[900,600,360,200,110,50],
  speedIdx:2,
  customData:{}, // per-algo custom input, keyed by algo id
};
