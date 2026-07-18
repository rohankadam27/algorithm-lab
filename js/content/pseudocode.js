const PSEUDOCODES = {
bubble:`<div class="concept-section"><h3>Bubble Sort</h3><pre><span class="kw">BUBBLE-SORT</span>(A, n):
  <span class="kw">for</span> i = 0 <span class="kw">to</span> n-2:
    <span class="kw">for</span> j = 0 <span class="kw">to</span> n-i-2:
      <span class="kw">if</span> A[j] > A[j+1]:
        <span class="fn">SWAP</span>(A[j], A[j+1])
  <span class="cm">// if a pass makes zero swaps, array is sorted -> break early</span></pre></div>`,

selection:`<div class="concept-section"><h3>Selection Sort</h3><pre><span class="kw">SELECTION-SORT</span>(A, n):
  <span class="kw">for</span> i = 0 <span class="kw">to</span> n-2:
    min_idx = i
    <span class="kw">for</span> j = i+1 <span class="kw">to</span> n-1:
      <span class="kw">if</span> A[j] < A[min_idx]: min_idx = j
    <span class="fn">SWAP</span>(A[i], A[min_idx])</pre></div>`,

heap:`<div class="concept-section"><h3>Heap Sort</h3><pre><span class="kw">MAX-HEAPIFY</span>(A, i, n):
  l=2i+1, r=2i+2, largest=i
  <span class="kw">if</span> l<n and A[l]>A[largest]: largest=l
  <span class="kw">if</span> r<n and A[r]>A[largest]: largest=r
  <span class="kw">if</span> largest != i:
    <span class="fn">SWAP</span>(A[i], A[largest]); <span class="fn">MAX-HEAPIFY</span>(A, largest, n)

<span class="kw">HEAP-SORT</span>(A, n):
  <span class="kw">for</span> i = n/2-1 <span class="kw">downto</span> 0: <span class="fn">MAX-HEAPIFY</span>(A, i, n)
  <span class="kw">for</span> i = n-1 <span class="kw">downto</span> 1:
    <span class="fn">SWAP</span>(A[0], A[i]); <span class="fn">MAX-HEAPIFY</span>(A, 0, i)</pre></div>`,

merge:`<div class="concept-section"><h3>Merge Sort</h3><pre><span class="kw">MERGE-SORT</span>(A, l, r):
  <span class="kw">if</span> l >= r: <span class="kw">return</span>
  m = (l+r)/2
  <span class="fn">MERGE-SORT</span>(A, l, m)
  <span class="fn">MERGE-SORT</span>(A, m+1, r)
  <span class="fn">MERGE</span>(A, l, m, r)

<span class="kw">MERGE</span>(A, l, m, r):
  L = A[l..m];  R = A[m+1..r]
  i=0, j=0, k=l
  <span class="kw">while</span> i<len(L) and j<len(R):
    <span class="kw">if</span> L[i] <= R[j]: A[k++]=L[i++]
    <span class="kw">else</span>: A[k++]=R[j++]
  copy remaining L, then remaining R into A</pre></div>`,

quick:`<div class="concept-section"><h3>Randomized Quick Sort</h3><pre><span class="kw">RAND-QUICKSORT</span>(A, lo, hi):
  <span class="kw">if</span> lo >= hi: <span class="kw">return</span>
  p = <span class="fn">RANDOM-PARTITION</span>(A, lo, hi)
  <span class="fn">RAND-QUICKSORT</span>(A, lo, p-1)
  <span class="fn">RAND-QUICKSORT</span>(A, p+1, hi)

<span class="kw">RANDOM-PARTITION</span>(A, lo, hi):
  r = random(lo, hi);  <span class="fn">SWAP</span>(A[r], A[hi])
  pivot = A[hi];  i = lo-1
  <span class="kw">for</span> j = lo <span class="kw">to</span> hi-1:
    <span class="kw">if</span> A[j] <= pivot: i++; <span class="fn">SWAP</span>(A[i], A[j])
  <span class="fn">SWAP</span>(A[i+1], A[hi]);  <span class="kw">return</span> i+1</pre></div>`,

linear:`<div class="concept-section"><h3>Linear Search</h3><pre><span class="kw">LINEAR-SEARCH</span>(A, n, key):
  <span class="kw">for</span> i = 0 <span class="kw">to</span> n-1:
    <span class="kw">if</span> A[i] == key: <span class="kw">return</span> i
  <span class="kw">return</span> -1  <span class="cm">// not found</span></pre></div>`,

binary:`<div class="concept-section"><h3>Binary Search</h3><pre><span class="kw">BINARY-SEARCH</span>(A, lo, hi, key):
  <span class="kw">while</span> lo <= hi:
    mid = (lo+hi)/2
    <span class="kw">if</span> A[mid]==key: <span class="kw">return</span> mid
    <span class="kw">elif</span> A[mid]<key: lo = mid+1
    <span class="kw">else</span>: hi = mid-1
  <span class="kw">return</span> -1</pre></div>`,

kmp:`<div class="concept-section"><h3>KMP Algorithm</h3><pre><span class="kw">BUILD-LPS</span>(P, m):
  lps[0]=0;  len=0;  i=1
  <span class="kw">while</span> i<m:
    <span class="kw">if</span> P[i]==P[len]: len++; lps[i]=len; i++
    <span class="kw">elif</span> len!=0: len = lps[len-1]
    <span class="kw">else</span>: lps[i]=0; i++
  <span class="kw">return</span> lps

<span class="kw">KMP-SEARCH</span>(T, P):
  lps = <span class="fn">BUILD-LPS</span>(P, len(P));  i=0, j=0
  <span class="kw">while</span> i<len(T):
    <span class="kw">if</span> T[i]==P[j]: i++; j++
      <span class="kw">if</span> j==len(P): report match at i-j; j=lps[j-1]
    <span class="kw">elif</span> j!=0: j = lps[j-1]
    <span class="kw">else</span>: i++</pre></div>`,

rabin:`<div class="concept-section"><h3>Rabin-Karp</h3><pre><span class="kw">RABIN-KARP</span>(T, P, d, q):
  n=len(T), m=len(P);  h = d^(m-1) mod q
  p_hash=0; t_hash=0
  <span class="kw">for</span> i=0 <span class="kw">to</span> m-1:
    p_hash=(d*p_hash+P[i]) mod q
    t_hash=(d*t_hash+T[i]) mod q
  <span class="kw">for</span> i=0 <span class="kw">to</span> n-m:
    <span class="kw">if</span> p_hash==t_hash <span class="kw">and</span> T[i..i+m-1]==P: report match at i
    <span class="kw">if</span> i<n-m:
      t_hash = (d*(t_hash - T[i]*h) + T[i+m]) mod q
      <span class="kw">if</span> t_hash<0: t_hash += q</pre></div>`,

minmax:`<div class="concept-section"><h3>Min-Max (Divide & Conquer)</h3><pre><span class="kw">MAX-MIN</span>(A, low, high):
  <span class="kw">if</span> high-low==0: <span class="kw">return</span> (A[low],A[low])
  <span class="kw">if</span> high-low==1: <span class="kw">return</span> (min(A[low],A[high]), max(A[low],A[high]))
  mid=(low+high)/2
  (min1,max1) = <span class="fn">MAX-MIN</span>(A, low, mid)
  (min2,max2) = <span class="fn">MAX-MIN</span>(A, mid+1, high)
  <span class="kw">return</span> (min(min1,min2), max(max1,max2))
<span class="cm">// comparisons = 3n/2 - 2</span></pre></div>`,

strassen:`<div class="concept-section"><h3>Strassen's Matrix Multiplication</h3><pre><span class="kw">STRASSEN</span>(A, B):
  M1=(A11+A22)*(B11+B22);  M2=(A21+A22)*B11
  M3=A11*(B12-B22);        M4=A22*(B21-B11)
  M5=(A11+A12)*B22;        M6=(A21-A11)*(B11+B12)
  M7=(A12-A22)*(B21+B22)
  C11=M1+M4-M5+M7;  C12=M3+M5
  C21=M2+M4;        C22=M1-M2+M3+M6
  <span class="kw">return</span> [[C11,C12],[C21,C22]]
<span class="cm">// T(n)=7T(n/2)+O(n\u00b2) -> O(n^2.81)</span></pre></div>`,

activity:`<div class="concept-section"><h3>Activity Selection</h3><pre><span class="kw">ACTIVITY-SELECT</span>(s, f, n):
  sort activities by finish time f[] ascending
  result=[0];  last=f[0]
  <span class="kw">for</span> i=1 <span class="kw">to</span> n-1:
    <span class="kw">if</span> s[i] >= last: result.add(i); last=f[i]
  <span class="kw">return</span> result <span class="cm">// O(n log n)</span></pre></div>`,

kruskal:`<div class="concept-section"><h3>Kruskal's MST</h3><pre><span class="kw">KRUSKAL</span>(G):
  sort edges by weight ascending
  <span class="kw">for each</span> vertex v: <span class="fn">MAKE-SET</span>(v)
  mst=[]
  <span class="kw">for each</span> edge (u,v,w) <span class="kw">in</span> sorted order:
    <span class="kw">if</span> <span class="fn">FIND</span>(u) != <span class="fn">FIND</span>(v):
      mst.append((u,v,w));  <span class="fn">UNION</span>(u,v)
    <span class="kw">if</span> |mst|==|V|-1: <span class="kw">break</span>
  <span class="kw">return</span> mst</pre></div>`,

prim:`<div class="concept-section"><h3>Prim's MST</h3><pre><span class="kw">PRIM</span>(G, src):
  key[v]=INF <span class="kw">for all</span> v;  key[src]=0
  inMST[v]=false <span class="kw">for all</span> v
  <span class="kw">for</span> count=1 <span class="kw">to</span> |V|:
    u = min-key vertex <span class="kw">not in</span> MST
    inMST[u]=true
    <span class="kw">for each</span> neighbor v <span class="kw">of</span> u:
      <span class="kw">if</span> !inMST[v] <span class="kw">and</span> w(u,v)<key[v]:
        key[v]=w(u,v); parent[v]=u
  <span class="kw">return</span> parent[]</pre></div>`,

fracknap:`<div class="concept-section"><h3>Fractional Knapsack</h3><pre><span class="kw">FRACTIONAL-KNAPSACK</span>(items, W):
  compute ratio = v[i]/w[i]
  sort items by ratio descending
  total=0; rem=W
  <span class="kw">for each</span> item <span class="kw">in</span> order:
    <span class="kw">if</span> w[i] <= rem: total+=v[i]; rem-=w[i]
    <span class="kw">else</span>: total += (rem/w[i])*v[i]; <span class="kw">break</span>
  <span class="kw">return</span> total</pre></div>`,

jobseq:`<div class="concept-section"><h3>Job Sequencing with Deadlines</h3><pre><span class="kw">JOB-SEQUENCING</span>(jobs):
  sort jobs by profit descending
  slot[1..maxDeadline] = empty
  <span class="kw">for each</span> job <span class="kw">in</span> sorted order:
    <span class="kw">for</span> t = job.deadline <span class="kw">downto</span> 1:
      <span class="kw">if</span> slot[t] empty: slot[t]=job; <span class="kw">break</span>
  <span class="kw">return</span> slot</pre></div>`,

merge_pattern:`<div class="concept-section"><h3>Optimal Merge Pattern</h3><pre><span class="kw">OPTIMAL-MERGE</span>(files):
  H = <span class="fn">MIN-HEAP</span>(files);  total=0
  <span class="kw">while</span> H.size > 1:
    a = <span class="fn">EXTRACT-MIN</span>(H);  b = <span class="fn">EXTRACT-MIN</span>(H)
    merged = a+b;  total += merged
    <span class="fn">INSERT</span>(H, merged)
  <span class="kw">return</span> total <span class="cm">// same idea as Huffman coding</span></pre></div>`,

dijkstra:`<div class="concept-section"><h3>Dijkstra's Algorithm</h3><pre><span class="kw">DIJKSTRA</span>(G, source):
  dist[v]=INF <span class="kw">for all</span> v;  dist[source]=0
  visited[v]=false <span class="kw">for all</span> v
  <span class="kw">for</span> count=1 <span class="kw">to</span> |V|:
    u = unvisited vertex with min dist[u]
    visited[u]=true
    <span class="kw">for each</span> neighbor v <span class="kw">of</span> u:
      <span class="kw">if</span> !visited[v] <span class="kw">and</span> dist[u]+w(u,v) < dist[v]:
        dist[v] = dist[u] + w(u,v)
  <span class="kw">return</span> dist[]</pre></div>`,

nqueens:`<div class="concept-section"><h3>N-Queens</h3><pre><span class="kw">N-QUEENS</span>(board, row, N):
  <span class="kw">if</span> row==N: <span class="fn">PRINT-SOLUTION</span>(board); <span class="kw">return</span> true
  <span class="kw">for</span> col=0 <span class="kw">to</span> N-1:
    <span class="kw">if</span> <span class="fn">SAFE</span>(board,row,col):
      board[row]=col
      <span class="kw">if</span> <span class="fn">N-QUEENS</span>(board,row+1,N): <span class="kw">return</span> true
      board[row]=-1  <span class="cm">// backtrack</span>
  <span class="kw">return</span> false

<span class="kw">SAFE</span>(board,row,col):
  <span class="kw">for</span> i=0 <span class="kw">to</span> row-1:
    <span class="kw">if</span> board[i]==col <span class="kw">or</span> |board[i]-col|==|i-row|: <span class="kw">return</span> false
  <span class="kw">return</span> true</pre></div>`,

subset:`<div class="concept-section"><h3>Subset Sum</h3><pre><span class="kw">SUBSET-SUM</span>(set, n, T, i, curr, path):
  <span class="kw">if</span> curr==T: print(path); <span class="kw">return</span>
  <span class="kw">if</span> curr>T <span class="kw">or</span> i==n: <span class="kw">return</span>  <span class="cm">// prune</span>
  path.add(set[i])
  <span class="fn">SUBSET-SUM</span>(set,n,T,i+1,curr+set[i],path)
  path.remove(set[i])                 <span class="cm">// backtrack</span>
  <span class="fn">SUBSET-SUM</span>(set,n,T,i+1,curr,path)</pre></div>`,

graphcolor:`<div class="concept-section"><h3>Graph Coloring (m-coloring)</h3><pre><span class="kw">GRAPH-COLOR</span>(G, m, color, v, n):
  <span class="kw">if</span> v==n: <span class="kw">return</span> true
  <span class="kw">for</span> c=1 <span class="kw">to</span> m:
    <span class="kw">if</span> <span class="fn">SAFE</span>(G,color,v,c):
      color[v]=c
      <span class="kw">if</span> <span class="fn">GRAPH-COLOR</span>(G,m,color,v+1,n): <span class="kw">return</span> true
      color[v]=0                     <span class="cm">// backtrack</span>
  <span class="kw">return</span> false
<span class="kw">SAFE</span>(G,color,v,c): <span class="kw">no</span> neighbor <span class="kw">of</span> v <span class="kw">has</span> color c</pre></div>`,

knapsack01:`<div class="concept-section"><h3>0/1 Knapsack</h3><pre><span class="kw">KNAPSACK-01</span>(items, n, W):
  dp[0..n][0..W] = 0
  <span class="kw">for</span> i=1 <span class="kw">to</span> n:
    <span class="kw">for</span> w=0 <span class="kw">to</span> W:
      <span class="kw">if</span> weight[i] <= w:
        dp[i][w] = max(dp[i-1][w], value[i]+dp[i-1][w-weight[i]])
      <span class="kw">else</span>:
        dp[i][w] = dp[i-1][w]
  <span class="kw">return</span> dp[n][W]</pre></div>`,

lcs:`<div class="concept-section"><h3>Longest Common Subsequence</h3><pre><span class="kw">LCS</span>(X, Y, m, n):
  dp[0..m][0..n] = 0
  <span class="kw">for</span> i=1 <span class="kw">to</span> m:
    <span class="kw">for</span> j=1 <span class="kw">to</span> n:
      <span class="kw">if</span> X[i-1]==Y[j-1]: dp[i][j] = dp[i-1][j-1]+1
      <span class="kw">else</span>: dp[i][j] = max(dp[i-1][j], dp[i][j-1])
  <span class="kw">return</span> dp[m][n]</pre></div>`,

floyd:`<div class="concept-section"><h3>Floyd-Warshall</h3><pre><span class="kw">FLOYD-WARSHALL</span>(W, n):
  dist = copy of W  <span class="cm">// INF for no edge, 0 diagonal</span>
  <span class="kw">for</span> k=0 <span class="kw">to</span> n-1:
    <span class="kw">for</span> i=0 <span class="kw">to</span> n-1:
      <span class="kw">for</span> j=0 <span class="kw">to</span> n-1:
        <span class="kw">if</span> dist[i][k]+dist[k][j] < dist[i][j]:
          dist[i][j] = dist[i][k]+dist[k][j]
  <span class="cm">// dist[i][i] < 0 for any i -> negative cycle</span></pre></div>`,

vertexcover:`<div class="concept-section"><h3>Vertex Cover (2-Approximation)</h3><pre><span class="kw">APPROX-VERTEX-COVER</span>(G):
  C = {}
  E' = copy of G.edges
  <span class="kw">while</span> E' not empty:
    (u,v) = any edge from E'
    C = C + {u, v}
    remove all edges touching u or v from E'
  <span class="kw">return</span> C  <span class="cm">// |C| <= 2*|OPT| guaranteed</span></pre></div>`,

tsp:`<div class="concept-section"><h3>TSP 2-Approximation</h3><pre><span class="kw">APPROX-TSP</span>(G):
  T = <span class="fn">MST</span>(G)
  H = preorder DFS walk of T
  <span class="kw">return</span> Hamiltonian cycle from H (shortcut repeats)
<span class="cm">// Cost(tour) <= 2*Cost(MST) <= 2*OPT (needs triangle inequality)</span></pre></div>`,

hillclimb:`<div class="concept-section"><h3>Hill Climbing</h3><pre><span class="kw">HILL-CLIMB</span>(problem):
  curr = initial state
  <span class="kw">loop</span>:
    best_nbr = best of neighbors(curr)
    <span class="kw">if</span> value(best_nbr) <= value(curr): <span class="kw">return</span> curr
    curr = best_nbr
<span class="cm">// fix: random restarts to escape local optima</span></pre></div>`,

genetic:`<div class="concept-section"><h3>Genetic Algorithm</h3><pre><span class="kw">GENETIC-ALGORITHM</span>(problem):
  pop = <span class="fn">INIT-POPULATION</span>(popSize)
  <span class="kw">for</span> gen=1 <span class="kw">to</span> maxGen:
    fit[] = <span class="fn">EVALUATE</span>(pop)
    <span class="kw">if</span> <span class="fn">GOOD-ENOUGH</span>(fit): <span class="kw">break</span>
    new_pop = []
    <span class="kw">while</span> |new_pop| < popSize:
      p1 = <span class="fn">SELECT</span>(pop, fit)
      p2 = <span class="fn">SELECT</span>(pop, fit)
      c  = <span class="fn">CROSSOVER</span>(p1, p2)
      c  = <span class="fn">MUTATE</span>(c, rate)
      new_pop.add(c)
    pop = new_pop
  <span class="kw">return</span> best individual in pop</pre></div>`,

master:`<div class="concept-section"><h3>Master Theorem — Quick Reference</h3><pre>T(n) = a\u00b7T(n/b) + f(n)
compare f(n) with n^(log_b a):

Case 1: f(n) = O(n^(log_b a - \u03b5))    -> T(n) = \u0398(n^(log_b a))
Case 2: f(n) = \u0398(n^(log_b a))        -> T(n) = \u0398(n^(log_b a) \u00b7 log n)
Case 3: f(n) = \u03a9(n^(log_b a + \u03b5))    -> T(n) = \u0398(f(n))
        (needs regularity condition: a\u00b7f(n/b) \u2264 c\u00b7f(n) for some c<1)</pre></div>`,

amortized:`<div class="concept-section"><h3>Amortized Analysis — Dynamic Array Example</h3><pre><span class="kw">DYNAMIC-ARRAY-INSERT</span>(A, x):
  <span class="kw">if</span> A.size == A.capacity:
    A.capacity *= 2         <span class="cm">// costly resize, O(n)</span>
    reallocate and copy all elements
  A[A.size] = x;  A.size += 1

<span class="cm">// n inserts: total copy work = 1+2+4+...+n < 2n</span>
<span class="cm">// amortized cost per insert = O(1)</span></pre></div>`,

cooks:`<div class="concept-section"><h3>NP-Completeness — Reduction Sketch</h3><pre><span class="cm">// To prove problem X is NP-Complete:</span>
1. Show X <span class="kw">is in</span> NP        (a solution can be verified in poly time)
2. Pick a known NP-Complete problem Y (e.g. 3-SAT)
3. Construct a poly-time reduction  Y \u2264p X
   (any Y-instance can be transformed into an X-instance
    such that Y is a YES-instance  <=>  X is a YES-instance)
4. Therefore X is at least as hard as Y  =>  X is NP-Hard
5. NP-Hard + in NP  =>  NP-Complete</pre></div>`,

jssp:`<div class="concept-section"><h3>Job Shop Scheduling — Johnson's Rule (2-machine case)</h3><pre><span class="kw">JOHNSON-2-MACHINE</span>(jobs):
  <span class="cm">// each job has processing time on M1 and M2</span>
  split jobs into Set A (M1 time < M2 time) and Set B (otherwise)
  sort Set A by M1 time ascending
  sort Set B by M2 time descending
  sequence = Set A followed by Set B
  <span class="kw">return</span> sequence   <span class="cm">// optimal for 2 machines, O(n log n)</span>
<span class="cm">// General m-machine case: NP-Hard, no known poly formula</span></pre></div>`,
};
