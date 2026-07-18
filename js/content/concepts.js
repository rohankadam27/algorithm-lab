/* Story-driven explanations for all 32 algorithms.
   Each entry: Story -> How it works (steps) -> Real-World Uses -> Common Pitfall. */
const CONCEPTS = {

bubble:`<div class="concept-section"><h3>Bubble Sort</h3>
<div class="story-box"><div class="story-kicker">Story</div><p>You're a librarian re-shelving a row of mixed-up numbered books. You only ever compare two neighbours at a time: if the left book's number is bigger, you swap them. You keep walking down the shelf doing this. After one full walk, the single largest book has "bubbled" all the way to the far end &mdash; exactly like an air bubble rising to the top of a fish tank. Walk the shelf again, and the second-largest settles into place, and so on.</p></div>
<h4>How it works</h4>
<ul class="step-list">
<li><div class="step-num">1</div><div class="step-text"><strong>Compare adjacent pairs:</strong> look at a[0] and a[1]; swap if a[0] &gt; a[1].</div></li>
<li><div class="step-num">2</div><div class="step-text"><strong>Slide right:</strong> compare a[1] and a[2], then a[2] and a[3]&hellip; one pass touches every neighbour once.</div></li>
<li><div class="step-num">3</div><div class="step-text"><strong>One pass = one guarantee:</strong> the largest untouched element is now at the very end.</div></li>
<li><div class="step-num">4</div><div class="step-text"><strong>Repeat n&minus;1 times:</strong> each pass shrinks the "unsorted zone" by one, until everything sits in place.</div></li>
</ul>
<div class="usecase-box"><div class="box-kicker">Real-world uses</div><p>Rarely used in production today, but it's the go-to teaching tool for sorting, appears inside simple embedded systems with tiny memory budgets (its O(1) space is genuinely valuable there), and is used to detect "almost sorted" data cheaply (few/zero swaps in a pass = nearly sorted already).</p></div>
<div class="pitfall-box"><div class="box-kicker">Common exam pitfall</div><p>Students often forget the "no swaps &rarr; already sorted, stop early" optimization, which is exactly what gives Bubble Sort its O(n) <em>best</em> case. Also: the inner loop bound is <code>n-i-1</code>, not <code>n-1</code> &mdash; forgetting to shrink it means comparing already-sorted elements uselessly (still correct, just not the expected trace).</p></div></div>`,

selection:`<div class="concept-section"><h3>Selection Sort</h3>
<div class="story-box"><div class="story-kicker">Story</div><p>A coach is picking players for a relay team. Instead of taking whoever is standing closest, the coach scans the <em>entire</em> remaining group, finds the fastest runner, and places them first. Then scans everyone left over, finds the next fastest, places them second &mdash; and so on. Every placement is final the moment it's made; the coach never reconsiders it.</p></div>
<h4>How it works</h4>
<ul class="step-list">
<li><div class="step-num">1</div><div class="step-text">Assume position i holds the minimum. Scan i+1&hellip;n&minus;1 to find the true minimum.</div></li>
<li><div class="step-num">2</div><div class="step-text">Swap that minimum into position i &mdash; position i is now permanently correct.</div></li>
<li><div class="step-num">3</div><div class="step-text">Move to position i+1 and repeat the scan on the smaller remaining range.</div></li>
</ul>
<div class="usecase-box"><div class="box-kicker">Real-world uses</div><p>Preferred when the cost of <em>writing</em>/swapping is far higher than the cost of comparing &mdash; e.g. sorting data on flash memory or EEPROM where writes wear out the hardware, since Selection Sort does at most n&minus;1 writes total, the fewest possible.</p></div>
<div class="pitfall-box"><div class="box-kicker">Common exam pitfall</div><p>Students frequently claim Selection Sort is stable &mdash; it is <strong>not</strong> in the standard implementation, because a swap can jump a minimum element past an equal element earlier in the array, changing their relative order. Also note: unlike Bubble Sort, there's no early-exit optimization &mdash; it always runs the full O(n&sup2;) comparisons even on a sorted array.</p></div></div>`,

heap:`<div class="concept-section"><h3>Heap Sort</h3>
<div class="story-box"><div class="story-kicker">Story</div><p>Picture a company org chart shaped as a <strong>Max-Heap</strong>: every manager's "score" is higher than both people reporting to them, so the single highest score always sits at the CEO position (the root). To sort, you repeatedly "fire the CEO" &mdash; take the max, swap it to the end of the array (its final sorted spot) &mdash; then promote the best remaining employee back up to CEO and fix the chart.</p></div>
<h4>How it works</h4>
<ul class="step-list">
<li><div class="step-num">1</div><div class="step-text"><strong>Build Max-Heap:</strong> rearrange the array bottom-up so every parent &ge; its children. O(n) total.</div></li>
<li><div class="step-num">2</div><div class="step-text"><strong>Extract max:</strong> swap the root with the last unsorted element &mdash; that slot is now finished.</div></li>
<li><div class="step-num">3</div><div class="step-text"><strong>Heapify down:</strong> restore the heap property for the shrunk heap in O(log n).</div></li>
<li><div class="step-num">4</div><div class="step-text">Repeat until the heap is empty &mdash; the array is sorted in place.</div></li>
</ul>
<div class="usecase-box"><div class="box-kicker">Real-world uses</div><p>Priority queues (task schedulers, Dijkstra's/Prim's internals), and any system that needs a <em>guaranteed</em> worst-case O(n log n) sort with O(1) memory &mdash; e.g. embedded and real-time systems where Quick Sort's rare O(n&sup2;) worst case is unacceptable.</p></div>
<div class="pitfall-box"><div class="box-kicker">Common exam pitfall</div><p>Students forget that "build heap is O(n), not O(n log n)" &mdash; a very common trick question. It's O(n) because most nodes are near the bottom and need very little sifting; only a careful summation (not a naive "n nodes &times; O(log n) each") proves this.</p></div></div>`,

merge:`<div class="concept-section"><h3>Merge Sort</h3>
<div class="story-box"><div class="story-kicker">Story</div><p>Two card players each hold a sorted pile face-up. Merging them is trivial: compare the two top cards, take the smaller, repeat. Merge Sort exploits this by first splitting one messy pile in half again and again until every "pile" is a single card (trivially sorted), then merging piles back together, pair by pair, all the way up.</p></div>
<h4>How it works</h4>
<ul class="step-list">
<li><div class="step-num">1</div><div class="step-text"><strong>Divide:</strong> split the array at the midpoint, recursively, until pieces of size 1 remain.</div></li>
<li><div class="step-num">2</div><div class="step-text"><strong>Base case:</strong> a single element is already sorted &mdash; no work needed.</div></li>
<li><div class="step-num">3</div><div class="step-text"><strong>Merge:</strong> repeatedly take the smaller of the two piles' front cards into a buffer.</div></li>
<li><div class="step-num">4</div><div class="step-text"><strong>Recurse upward:</strong> merges cascade back up the recursion tree until the whole array is sorted.</div></li>
</ul>
<div class="usecase-box"><div class="box-kicker">Real-world uses</div><p>External sorting of files too big for RAM (databases, big-data pipelines) because it merges sequential chunks efficiently from disk; Java's <code>Collections.sort()</code> and Python's Timsort both borrow merge-sort's merging step; also the standard for stable sorts where the original order of equal elements must be preserved (e.g. sorting orders by price while keeping same-price orders in arrival order).</p></div>
<div class="pitfall-box"><div class="box-kicker">Common exam pitfall</div><p>Students often forget the O(n) auxiliary space requirement when comparing it to Quick Sort or Heap Sort in an exam table &mdash; Merge Sort trades that extra memory for a guarantee (always O(n log n), always stable) that in-place sorts can't match.</p></div></div>`,

quick:`<div class="concept-section"><h3>Randomized Quick Sort</h3>
<div class="story-box"><div class="story-kicker">Story</div><p>A gym teacher lines students up by height. One student is picked at random as the "pivot" and stands in the middle. Everyone shorter steps to the left, everyone taller steps to the right. The pivot is now standing in its <em>exact</em> final position. The teacher then repeats the trick separately on the left group and the right group.</p></div>
<h4>How it works</h4>
<ul class="step-list">
<li><div class="step-num">1</div><div class="step-text"><strong>Random pivot:</strong> pick a random element, swap it to the end. Randomness defeats adversarial/sorted inputs.</div></li>
<li><div class="step-num">2</div><div class="step-text"><strong>Partition:</strong> walk the range; anything &le; pivot moves into the growing "left zone".</div></li>
<li><div class="step-num">3</div><div class="step-text"><strong>Place pivot:</strong> swap it right after the left zone &mdash; it never needs to move again.</div></li>
<li><div class="step-num">4</div><div class="step-text"><strong>Recurse</strong> on the left and right sub-ranges independently.</div></li>
</ul>
<div class="usecase-box"><div class="box-kicker">Real-world uses</div><p>The default sort in most C/C++ standard libraries (introsort is Quick Sort + Heap Sort fallback), database query engines for in-memory row sorting, and anywhere average-case speed and cache-friendliness matter more than worst-case guarantees.</p></div>
<div class="pitfall-box"><div class="box-kicker">Common exam pitfall</div><p>Examiners love asking "why randomize the pivot?" &mdash; the correct answer is that it makes the O(n&sup2;) worst case depend on <em>randomness</em>, not on the <em>input</em>, so no attacker or unlucky dataset can reliably trigger it. A fixed first/last-element pivot is trivially broken by a pre-sorted array.</p></div></div>`,

linear:`<div class="concept-section"><h3>Linear Search</h3>
<div class="story-box"><div class="story-kicker">Story</div><p>You're looking for a specific song on a mixtape with no track listing. You press play, listen to track 1 &mdash; not it &mdash; skip to track 2, and so on, until you hear the one you want (or reach the end and give up). No shortcuts, no assumptions about order &mdash; just honest, exhaustive checking.</p></div>
<h4>How it works</h4>
<ul class="step-list">
<li><div class="step-num">1</div><div class="step-text">Start at index 0.</div></li>
<li><div class="step-num">2</div><div class="step-text">Compare the current element with the target. Match? Return the index.</div></li>
<li><div class="step-num">3</div><div class="step-text">No match? Move to the next index and repeat.</div></li>
<li><div class="step-num">4</div><div class="step-text">Reach the end with no match &rarr; report "not found".</div></li>
</ul>
<div class="usecase-box"><div class="box-kicker">Real-world uses</div><p>Searching unsorted or tiny lists (sorting first wouldn't pay off), linked lists (no random access, so binary search isn't even possible), and as the fallback inside <code>Array.prototype.find</code>/<code>indexOf</code> style utility functions in most languages.</p></div>
<div class="pitfall-box"><div class="box-kicker">Common exam pitfall</div><p>Students sometimes think Linear Search needs sorted data &mdash; it doesn't, that's Binary Search's requirement. Also remember: its best case is O(1) (lucky first hit) but its <em>average</em> case is still O(n), not O(n/2) with big-O notation (constants are dropped).</p></div></div>`,

binary:`<div class="concept-section"><h3>Binary Search</h3>
<div class="story-box"><div class="story-kicker">Story</div><p>Someone picks a number from 1 to 1000 and you must guess it, being told only "higher" or "lower" each time. The smart move: guess 500. Too high? Now only 1&ndash;499 remain. Guess 250. Too low? Now 251&ndash;499. Every guess eliminates half the possibilities &mdash; you'll nail it in at most 10 guesses.</p></div>
<h4>How it works</h4>
<ul class="step-list">
<li><div class="step-num">1</div><div class="step-text">Requires a <strong>sorted</strong> array. Set lo=0, hi=n&minus;1.</div></li>
<li><div class="step-num">2</div><div class="step-text">mid = (lo+hi)/2. If a[mid] == target &rarr; found!</div></li>
<li><div class="step-num">3</div><div class="step-text">If a[mid] &lt; target, the answer must be in the right half &rarr; lo = mid+1.</div></li>
<li><div class="step-num">4</div><div class="step-text">If a[mid] &gt; target, the answer must be in the left half &rarr; hi = mid&minus;1.</div></li>
<li><div class="step-num">5</div><div class="step-text">lo &gt; hi &rarr; the target isn't present.</div></li>
</ul>
<div class="usecase-box"><div class="box-kicker">Real-world uses</div><p>Dictionary/phonebook lookups, <code>git bisect</code> for finding the commit that introduced a bug, database index range queries (B-trees generalize this idea), and version-control / autocomplete systems searching sorted key ranges.</p></div>
<div class="pitfall-box"><div class="box-kicker">Common exam pitfall</div><p>The classic bug: writing <code>mid = (lo+hi)/2</code> can integer-overflow for huge lo/hi in languages with fixed-width integers; the safe form is <code>lo + (hi-lo)/2</code>. Also, students forget Binary Search <em>requires</em> sorted input &mdash; running it on unsorted data silently gives wrong answers, it doesn't error out.</p></div></div>`,

kmp:`<div class="concept-section"><h3>KMP Algorithm</h3>
<div class="story-box"><div class="story-kicker">Story</div><p>You're proof-reading and scanning for the phrase "ABAB" inside a long text. You've matched "ABA" and the next character breaks the streak. A naive reader restarts from scratch one position later. KMP is smarter: it notices the tail "A" of what it already matched is <em>also</em> a valid prefix of the pattern, so it resumes from there instead of re-reading characters it already saw. That cheat-sheet is called the <strong>failure function (LPS array)</strong>.</p></div>
<h4>How it works</h4>
<ul class="step-list">
<li><div class="step-num">1</div><div class="step-text"><strong>Build LPS array</strong> (O(m)): LPS[i] = length of the longest proper prefix of pattern[0..i] that's also a suffix.</div></li>
<li><div class="step-num">2</div><div class="step-text"><strong>Search:</strong> compare text[i] with pattern[j]. Match &rarr; advance both.</div></li>
<li><div class="step-num">3</div><div class="step-text">Mismatch with j&gt;0 &rarr; set j = LPS[j&minus;1] (text pointer never moves back!). j==0 &rarr; advance i.</div></li>
<li><div class="step-num">4</div><div class="step-text">j reaches pattern length &rarr; match found at i&minus;m; continue with j=LPS[j&minus;1].</div></li>
</ul>
<div class="usecase-box"><div class="box-kicker">Real-world uses</div><p><code>grep</code>-style text search tools, DNA/protein motif search in bioinformatics, network intrusion detection systems scanning packet payloads for signatures, and plagiarism detectors doing exact substring matching at scale.</p></div>
<div class="pitfall-box"><div class="box-kicker">Common exam pitfall</div><p>Students often confuse the LPS array with just "prefix length" &mdash; it specifically must be a prefix that is <em>also</em> a suffix, and it must be a <em>proper</em> prefix (not the whole substring itself). Miscomputing even one LPS entry cascades into wrong jumps for the rest of the search.</p></div></div>`,

rabin:`<div class="concept-section"><h3>Rabin-Karp</h3>
<div class="story-box"><div class="story-kicker">Story</div><p>Instead of reading every word of a book to find a phrase, you compute a numeric "checksum" (hash) of the phrase, then slide a window across the text comparing checksums instead of full text. Only when checksums match do you bother verifying character-by-character &mdash; and updating the checksum as the window slides is O(1) thanks to a <strong>rolling hash</strong>.</p></div>
<h4>How it works</h4>
<ul class="step-list">
<li><div class="step-num">1</div><div class="step-text">Compute hash(pattern) and hash(first text window).</div></li>
<li><div class="step-num">2</div><div class="step-text">If hashes match, verify characters (guards against rare hash collisions = "spurious hits").</div></li>
<li><div class="step-num">3</div><div class="step-text">Roll the window: new_hash = (d&times;(hash&minus;out_char&times;h) + in_char) mod q. O(1) per slide!</div></li>
<li><div class="step-num">4</div><div class="step-text">Repeat to the end of the text.</div></li>
</ul>
<div class="usecase-box"><div class="box-kicker">Real-world uses</div><p>Plagiarism / duplicate-content detection across huge document sets, searching for multiple patterns simultaneously (hash all patterns into a set, then one text pass), and rsync/rolling-checksum style file-diff tools that need to detect matching chunks even after insertions.</p></div>
<div class="pitfall-box"><div class="box-kicker">Common exam pitfall</div><p>Students forget to verify on a hash match &mdash; skipping verification silently accepts false positives from collisions. Also: pick the modulus q as a large prime; a poorly chosen q causes frequent collisions and degrades Rabin-Karp toward its O(nm) worst case.</p></div></div>`,

minmax:`<div class="concept-section"><h3>Min-Max via Divide & Conquer</h3>
<div class="story-box"><div class="story-kicker">Story</div><p>Finding both the tallest and shortest student in a class naively takes 2n comparisons. A smarter way: pair students up. In each pair, compare once &mdash; the taller goes to a "max pool", the shorter to a "min pool". You've halved the field for both competitions using only n/2 comparisons before even starting the real hunt.</p></div>
<h4>How it works</h4>
<ul class="step-list">
<li><div class="step-num">1</div><div class="step-text">Base case, 1 element: it's both min and max (0 comparisons).</div></li>
<li><div class="step-num">2</div><div class="step-text">Base case, 2 elements: 1 comparison gives min and max.</div></li>
<li><div class="step-num">3</div><div class="step-text">Divide: solve left half and right half independently.</div></li>
<li><div class="step-num">4</div><div class="step-text">Combine: 2 comparisons &mdash; overall min and overall max.</div></li>
</ul>
<div class="usecase-box"><div class="box-kicker">Real-world uses</div><p>Anywhere you need both extremes in one pass efficiently &mdash; real-time sensor monitoring (min/max temperature over a window), image processing (contrast stretching needs min/max pixel values), and as a textbook proof technique for tight comparison lower bounds.</p></div>
<div class="pitfall-box"><div class="box-kicker">Common exam pitfall</div><p>Students often just quote "3n/2 &minus; 2 comparisons" without being able to derive it &mdash; make sure you can walk through the recurrence T(n) = 2T(n/2) + 2 and solve it, since professors frequently ask for the derivation, not just the final number.</p></div></div>`,

strassen:`<div class="concept-section"><h3>Strassen's Matrix Multiplication</h3>
<div class="story-box"><div class="story-kicker">Story</div><p>Naively multiplying two 2&times;2 matrices needs 8 multiplications. Strassen found a way to get the same 4 result values using only <strong>7</strong> cleverly combined multiplications, paying with a few extra (cheap) additions. One multiplication saved per recursive level compounds into a dramatically better exponent for large matrices.</p></div>
<h4>How it works</h4>
<ul class="step-list">
<li><div class="step-num">1</div><div class="step-text">Split each matrix into four quadrants.</div></li>
<li><div class="step-num">2</div><div class="step-text">Compute 7 products M1&ndash;M7 from sums/differences of quadrants.</div></li>
<li><div class="step-num">3</div><div class="step-text">Combine M1&ndash;M7 with only addition/subtraction to get C11, C12, C21, C22.</div></li>
</ul>
<div class="usecase-box"><div class="box-kicker">Real-world uses</div><p>Large-scale scientific computing and graphics libraries where matrix multiplication dominates runtime; it's the historical ancestor of even-faster methods (Coppersmith&ndash;Winograd, and modern practical libraries occasionally switch to Strassen-like recursion for very large matrices).</p></div>
<div class="pitfall-box"><div class="box-kicker">Common exam pitfall</div><p>Students memorize the M1&ndash;M7 formulas but forget <em>why</em> it matters: the saving of one multiplication only pays off for genuinely large n, because the extra additions and recursive overhead make it slower than naive multiplication for small matrices in practice.</p></div></div>`,

activity:`<div class="concept-section"><h3>Activity Selection Problem</h3>
<div class="story-box"><div class="story-kicker">Story</div><p>You manage one meeting room and many groups want to book it. To pack in the maximum number of meetings, always accept the meeting that finishes <em>soonest</em> among the remaining valid choices &mdash; it frees the room fastest for everyone else. Picking the "shortest" meeting is the wrong intuition; picking the earliest-<em>finishing</em> one is what actually maximizes the count.</p></div>
<h4>How it works</h4>
<ul class="step-list">
<li><div class="step-num">1</div><div class="step-text">Sort activities by finish time, ascending.</div></li>
<li><div class="step-num">2</div><div class="step-text">Always accept the first (earliest-finishing) activity.</div></li>
<li><div class="step-num">3</div><div class="step-text">For each next activity, accept it only if its start &ge; the last accepted finish time.</div></li>
</ul>
<div class="usecase-box"><div class="box-kicker">Real-world uses</div><p>Classroom/conference-room booking systems, CPU job scheduling with a single processor, and satellite/antenna time-slot allocation where you want to serve the maximum number of non-overlapping requests.</p></div>
<div class="pitfall-box"><div class="box-kicker">Common exam pitfall</div><p>Students often try to sort by <em>duration</em> or by <em>start time</em> instead of finish time &mdash; both are provably suboptimal counter-examples exist. Always sort by finish time; the exchange-argument proof is a favorite viva question.</p></div></div>`,

kruskal:`<div class="concept-section"><h3>Kruskal's Algorithm</h3>
<div class="story-box"><div class="story-kicker">Story</div><p>A telecom contractor must connect several towns with fibre at minimum total cost. They have a price list for every possible cable route. Strategy: sort all routes cheapest-first, and lay cable along a route only if the two towns it connects aren't already connected through cheaper cables laid so far &mdash; otherwise it would just create a wasteful loop.</p></div>
<h4>How it works</h4>
<ul class="step-list">
<li><div class="step-num">1</div><div class="step-text">Sort all edges by weight, ascending.</div></li>
<li><div class="step-num">2</div><div class="step-text">Each vertex starts as its own component (Union-Find).</div></li>
<li><div class="step-num">3</div><div class="step-text">For each edge (u,v,w): if Find(u) &ne; Find(v), add it to the MST and Union(u,v). Otherwise skip &mdash; it would form a cycle.</div></li>
<li><div class="step-num">4</div><div class="step-text">Stop once the MST has V&minus;1 edges.</div></li>
</ul>
<div class="usecase-box"><div class="box-kicker">Real-world uses</div><p>Designing minimum-cost network cabling (LANs, electrical grids, pipelines), clustering algorithms (remove the most expensive MST edges to split data into clusters), and circuit board wire-routing.</p></div>
<div class="pitfall-box"><div class="box-kicker">Common exam pitfall</div><p>Students forget Union-Find needs <em>both</em> path compression <em>and</em> union-by-rank to hit its near-O(1) amortized time &mdash; without them, cycle checks degrade toward O(V) each, and Kruskal's stops being O(E log E).</p></div></div>`,

prim:`<div class="concept-section"><h3>Prim's Algorithm</h3>
<div class="story-box"><div class="story-kicker">Story</div><p>Rather than shopping globally like Kruskal's, Prim's grows the network like a vine from a single root town, always reaching out to whichever unconnected town is cheapest to add <em>right now</em>. The tree only ever grows outward from what's already connected &mdash; never in disconnected pieces.</p></div>
<h4>How it works</h4>
<ul class="step-list">
<li><div class="step-num">1</div><div class="step-text">key[source]=0, key[everyone else]=&infin;.</div></li>
<li><div class="step-num">2</div><div class="step-text">Repeatedly add the not-yet-included vertex with the smallest key.</div></li>
<li><div class="step-num">3</div><div class="step-text">For each of its neighbours not yet in the tree, relax: if this new edge is cheaper than their current key, update it.</div></li>
<li><div class="step-num">4</div><div class="step-text">Repeat until every vertex is included.</div></li>
</ul>
<div class="usecase-box"><div class="box-kicker">Real-world uses</div><p>Same family of problems as Kruskal's, but Prim's is preferred for dense graphs stored as adjacency matrices (e.g. real-time network topology optimization) since it doesn't need to sort all edges upfront.</p></div>
<div class="pitfall-box"><div class="box-kicker">Common exam pitfall</div><p>A frequent mix-up: Prim's picks the cheapest edge <em>touching the current tree</em>, not the globally cheapest remaining edge (that's closer to Kruskal's idea) &mdash; conflating the two leads to wrong traces in exams.</p></div></div>`,

fracknap:`<div class="concept-section"><h3>Fractional Knapsack</h3>
<div class="story-box"><div class="story-kicker">Story</div><p>You're filling a sack with gold dust, silver flakes, and sand &mdash; all pourable, all divisible. Obviously you pour in gold dust first (highest value per gram), then silver, then sand, stopping the moment the sack is full &mdash; even mid-pour on the last material. Because everything can be split, greedy-by-ratio is guaranteed optimal here.</p></div>
<h4>How it works</h4>
<ul class="step-list">
<li><div class="step-num">1</div><div class="step-text">Compute value/weight ratio per item.</div></li>
<li><div class="step-num">2</div><div class="step-text">Sort items by ratio, descending.</div></li>
<li><div class="step-num">3</div><div class="step-text">Take whole items until one doesn't fully fit; take just enough of that one item to fill remaining capacity.</div></li>
</ul>
<div class="usecase-box"><div class="box-kicker">Real-world uses</div><p>Resource allocation problems where partial use is meaningful &mdash; blending fuels/alloys to a budget, bandwidth allocation across data streams, and portfolio investment problems where you can buy fractional shares.</p></div>
<div class="pitfall-box"><div class="box-kicker">Common exam pitfall</div><p>The single most common mistake: applying this exact greedy method to <strong>0/1 Knapsack</strong>. It fails there because items can't be split &mdash; always double-check whether a knapsack question allows fractions before choosing your algorithm.</p></div></div>`,

jobseq:`<div class="concept-section"><h3>Job Sequencing with Deadlines</h3>
<div class="story-box"><div class="story-kicker">Story</div><p>You're a freelancer with a stack of one-day jobs, each with a payout and a due date. To maximize income: always take the highest-paying job first, and slot it into the <em>latest</em> free day on or before its deadline &mdash; not the earliest. Booking it late deliberately keeps early days open for jobs with tighter deadlines.</p></div>
<h4>How it works</h4>
<ul class="step-list">
<li><div class="step-num">1</div><div class="step-text">Sort jobs by profit, descending.</div></li>
<li><div class="step-num">2</div><div class="step-text">For each job, scan backward from its deadline for the first free slot.</div></li>
<li><div class="step-num">3</div><div class="step-text">Found a slot &rarr; schedule it there. No slot available &rarr; the job is dropped.</div></li>
</ul>
<div class="usecase-box"><div class="box-kicker">Real-world uses</div><p>Single-machine scheduling with deadlines and penalties, ad-slot allocation (highest-bidding ad gets priority placement before its campaign deadline), and print-job / order-fulfillment queues with due dates.</p></div>
<div class="pitfall-box"><div class="box-kicker">Common exam pitfall</div><p>Students often scan slots <em>forward</em> from 1 instead of backward from the deadline &mdash; that greedily wastes early slots on jobs that had room to be scheduled later, and can produce a suboptimal (fewer jobs completed) schedule.</p></div></div>`,

merge_pattern:`<div class="concept-section"><h3>Optimal Merge Pattern</h3>
<div class="story-box"><div class="story-kicker">Story</div><p>You need to merge several already-sorted files into one, and merging two files of size a and b costs a+b. If you carelessly merge two huge files first, that huge cost gets paid over and over as more files pile in. The fix: always merge the two <em>smallest</em> piles first &mdash; exactly the idea behind Huffman coding.</p></div>
<h4>How it works</h4>
<ul class="step-list">
<li><div class="step-num">1</div><div class="step-text">Put all file sizes into a min-heap.</div></li>
<li><div class="step-num">2</div><div class="step-text">Extract the two smallest, merge them (cost = their sum), push the result back.</div></li>
<li><div class="step-num">3</div><div class="step-text">Repeat n&minus;1 times; sum of all merge costs = total cost.</div></li>
</ul>
<div class="usecase-box"><div class="box-kicker">Real-world uses</div><p>External merge-sort file merging in databases, Huffman-coding based file compression (identical algorithm, frequencies instead of sizes), and network packet-batching where combining small batches early minimizes total transfer overhead.</p></div>
<div class="pitfall-box"><div class="box-kicker">Common exam pitfall</div><p>This is <em>the same algorithm</em> as Huffman coding &mdash; students often don't realize the connection and re-derive it from scratch instead of recognizing "smallest-two-first" as one unifying greedy idea.</p></div></div>`,

dijkstra:`<div class="concept-section"><h3>Dijkstra's Algorithm</h3>
<div class="story-box"><div class="story-kicker">Story</div><p>You're a GPS navigating from home. You keep a running "current best distance" to every intersection. You always explore the closest unvisited intersection next (greedy), and whenever you visit one, you check whether reaching it unlocks a shorter path to its neighbours &mdash; a step called <em>relaxation</em>.</p></div>
<h4>How it works</h4>
<ul class="step-list">
<li><div class="step-num">1</div><div class="step-text">dist[source]=0, dist[everyone else]=&infin;.</div></li>
<li><div class="step-num">2</div><div class="step-text">Visit the unvisited vertex with the smallest dist.</div></li>
<li><div class="step-num">3</div><div class="step-text">Relax every edge leaving it: dist[v] = min(dist[v], dist[u]+w(u,v)).</div></li>
<li><div class="step-num">4</div><div class="step-text">Repeat until all reachable vertices are visited.</div></li>
</ul>
<div class="usecase-box"><div class="box-kicker">Real-world uses</div><p>GPS and mapping software (Google Maps' underlying routing family), network routing protocols (OSPF uses a Dijkstra variant), and flight/train fare-shortest-path search engines.</p></div>
<div class="pitfall-box"><div class="box-kicker">Common exam pitfall</div><p><strong>&#9888; Negative weights break it</strong> &mdash; once a vertex is "finalized" Dijkstra never revisits it, so a later-discovered negative edge can't correct an already-finalized distance. Examiners love asking "what happens with negative weights?" &mdash; the answer is "wrong results", and the fix is Bellman-Ford.</p></div></div>`,

nqueens:`<div class="concept-section"><h3>N-Queens Problem</h3>
<div class="story-box"><div class="story-kicker">Story</div><p>You're seating N celebrities at a banquet, one per row of tables, where no two can share a column or a diagonal sightline (their "attack lines"). You seat row 0's guest in some seat, then try row 1. If row 1 has no valid seat given row 0's choice, you don't give up &mdash; you go back and move row 0's guest to a different seat. That "go back and retry" move is backtracking.</p></div>
<h4>How it works</h4>
<ul class="step-list">
<li><div class="step-num">1</div><div class="step-text">Place queens one row at a time.</div></li>
<li><div class="step-num">2</div><div class="step-text">For the current row, try each column; check it's safe (no shared column/diagonal with placed queens).</div></li>
<li><div class="step-num">3</div><div class="step-text">Safe &rarr; place and recurse to the next row.</div></li>
<li><div class="step-num">4</div><div class="step-text">No safe column anywhere in this row &rarr; <strong>backtrack</strong>: undo the previous row's queen and try its next option.</div></li>
<li><div class="step-num">5</div><div class="step-text">All N rows filled &rarr; a valid solution!</div></li>
</ul>
<div class="usecase-box"><div class="box-kicker">Real-world uses</div><p>The canonical teaching example for constraint satisfaction, which underlies real systems like Sudoku solvers, exam timetable generators, circuit layout placement, and compiler register allocation with conflict constraints.</p></div>
<div class="pitfall-box"><div class="box-kicker">Common exam pitfall</div><p>Students forget the diagonal check formula: two queens at (r1,c1) and (r2,c2) share a diagonal exactly when <code>|r1-r2| == |c1-c2|</code> &mdash; a very common off-by-formula mistake in written exams.</p></div></div>`,

subset:`<div class="concept-section"><h3>Subset Sum Problem</h3>
<div class="story-box"><div class="story-kicker">Story</div><p>You're making exact change from coins {3,7,9,12,5} to reach 15. Add 3 (sum=3). Add 7 (sum=10). Try 9 &rarr; sum=19, over target &mdash; <strong>prune</strong> that branch immediately, no point going deeper. Backtrack, remove 9, try 12 &rarr; over again, prune. Backtrack, try 5 &rarr; sum=15, exact match &mdash; found {3,7,5}!</p></div>
<h4>How it works</h4>
<ul class="step-list">
<li><div class="step-num">1</div><div class="step-text">For each element, branch into INCLUDE and EXCLUDE.</div></li>
<li><div class="step-num">2</div><div class="step-text">Current sum == target &rarr; solution found.</div></li>
<li><div class="step-num">3</div><div class="step-text">Current sum &gt; target &rarr; prune (all remaining numbers are positive, it can only get worse).</div></li>
<li><div class="step-num">4</div><div class="step-text">Ran out of elements without hitting target &rarr; backtrack.</div></li>
</ul>
<div class="usecase-box"><div class="box-kicker">Real-world uses</div><p>Budget/allocation problems (can these exact expenses sum to a fixed budget?), cryptographic knapsack-based schemes (historically, now largely broken), and as a building block in the general 0/1 Knapsack DP formulation.</p></div>
<div class="pitfall-box"><div class="box-kicker">Common exam pitfall</div><p>The pruning step only works because all numbers are assumed positive &mdash; if negative numbers are allowed, "sum exceeded target" no longer guarantees future failure, and the whole pruning strategy needs rethinking.</p></div></div>`,

graphcolor:`<div class="concept-section"><h3>Graph Coloring (m-Coloring)</h3>
<div class="story-box"><div class="story-kicker">Story</div><p>You're scheduling final exams so no student sits two exams at once. Represent each subject as a vertex; connect two subjects with an edge if any student takes both. A "color" is a time slot. Two connected subjects (shared students) can never share a color. This is exactly graph coloring &mdash; also used for map coloring and CPU register allocation.</p></div>
<h4>How it works</h4>
<ul class="step-list">
<li><div class="step-num">1</div><div class="step-text">Process vertices one at a time.</div></li>
<li><div class="step-num">2</div><div class="step-text">Try colors 1..m; a color is safe if no neighbour already has it.</div></li>
<li><div class="step-num">3</div><div class="step-text">Safe &rarr; assign and recurse to the next vertex.</div></li>
<li><div class="step-num">4</div><div class="step-text">No safe color &rarr; backtrack and try a different color on the previous vertex.</div></li>
</ul>
<div class="usecase-box"><div class="box-kicker">Real-world uses</div><p>Compiler register allocation (variables that are "live" at the same time can't share a register), exam/class timetabling, mobile network frequency assignment (nearby towers can't reuse the same frequency), and Sudoku (a coloring problem in disguise).</p></div>
<div class="pitfall-box"><div class="box-kicker">Common exam pitfall</div><p>The 4-Color Theorem (any planar map needs &le;4 colors) only applies to <em>planar</em> graphs &mdash; students often over-generalize it to any graph, but general graphs can need arbitrarily many colors.</p></div></div>`,

knapsack01:`<div class="concept-section"><h3>0/1 Knapsack</h3>
<div class="story-box"><div class="story-kicker">Story</div><p>You're packing a hiking bag with a hard weight limit. Every item is whole-or-nothing &mdash; you can't take half a stove. Greedy-by-ratio can fail here (a slightly-lower-ratio pair might fill the bag far better than one high-ratio item that leaves dead space), so we need Dynamic Programming to check every meaningful combination systematically.</p></div>
<h4>How it works</h4>
<ul class="step-list">
<li><div class="step-num">1</div><div class="step-text">Build table dp[i][w] = best value using the first i items with capacity w.</div></li>
<li><div class="step-num">2</div><div class="step-text">If item i fits (weight &le; w): dp[i][w] = max(exclude it: dp[i&minus;1][w], include it: value[i]+dp[i&minus;1][w&minus;weight[i]]).</div></li>
<li><div class="step-num">3</div><div class="step-text">If it doesn't fit: dp[i][w] = dp[i&minus;1][w].</div></li>
<li><div class="step-num">4</div><div class="step-text">Answer = dp[n][W], the bottom-right cell.</div></li>
</ul>
<div class="usecase-box"><div class="box-kicker">Real-world uses</div><p>Cargo loading and cloud-resource bin-packing (which whole VMs/containers fit a budget for max value), investment selection under a fixed budget where projects are all-or-nothing, and cutting-stock problems in manufacturing.</p></div>
<div class="pitfall-box"><div class="box-kicker">Common exam pitfall</div><p>Space-optimization question: you can reduce dp to a 1D array of size W+1, but you <strong>must iterate w from high to low</strong> in that case &mdash; iterating low-to-high with a 1D array accidentally reuses an item multiple times (turning 0/1 Knapsack into unbounded Knapsack).</p></div></div>`,

lcs:`<div class="concept-section"><h3>Longest Common Subsequence</h3>
<div class="story-box"><div class="story-kicker">Story</div><p>Two people separately describe their day. You want the longest sequence of events that happened to <em>both</em>, in the same relative order &mdash; the events don't need to be back-to-back, just ordered consistently. This is exactly how DNA sequence alignment and <code>git diff</code> find shared structure between two sequences.</p></div>
<h4>How it works</h4>
<ul class="step-list">
<li><div class="step-num">1</div><div class="step-text">Build a (m+1)&times;(n+1) table of zeros.</div></li>
<li><div class="step-num">2</div><div class="step-text">Characters match &rarr; dp[i][j] = dp[i&minus;1][j&minus;1] + 1 (extend the diagonal).</div></li>
<li><div class="step-num">3</div><div class="step-text">No match &rarr; dp[i][j] = max(dp[i&minus;1][j], dp[i][j&minus;1]).</div></li>
<li><div class="step-num">4</div><div class="step-text">Answer = dp[m][n]; trace back through the table to recover the actual subsequence.</div></li>
</ul>
<div class="usecase-box"><div class="box-kicker">Real-world uses</div><p><code>diff</code>/version-control merge tools, DNA and protein sequence alignment (bioinformatics), spell-checkers and plagiarism detectors measuring text similarity, and file-synchronization tools finding shared content between versions.</p></div>
<div class="pitfall-box"><div class="box-kicker">Common exam pitfall</div><p>LCS is <em>not</em> the same as "Longest Common Substring" &mdash; the subsequence doesn't need to be contiguous, but the substring does. Mixing up the two leads to using the wrong recurrence entirely (substring resets to 0 on a mismatch; subsequence doesn't).</p></div></div>`,

floyd:`<div class="concept-section"><h3>Floyd-Warshall</h3>
<div class="story-box"><div class="story-kicker">Story</div><p>You have a table of flight prices between every pair of cities. For every pair (i,j), Floyd-Warshall asks "could a stopover at city k make this cheaper?" &mdash; and checks that for <em>every</em> possible stopover city, updating the table whenever a cheaper route through k is found.</p></div>
<h4>How it works</h4>
<ul class="step-list">
<li><div class="step-num">1</div><div class="step-text">dist[i][j] = direct edge weight, or &infin; if none, 0 on the diagonal.</div></li>
<li><div class="step-num">2</div><div class="step-text">For each intermediate vertex k (outer loop)&hellip;</div></li>
<li><div class="step-num">3</div><div class="step-text">&hellip;for every pair (i,j): if dist[i][k]+dist[k][j] &lt; dist[i][j], update it.</div></li>
<li><div class="step-num">4</div><div class="step-text">After all k, dist[i][j] holds the true shortest path.</div></li>
</ul>
<div class="usecase-box"><div class="box-kicker">Real-world uses</div><p>Network routing tables computing all-pairs shortest paths at once, flight-fare aggregators comparing every city-pair, and transitive-closure computation in database query optimizers.</p></div>
<div class="pitfall-box"><div class="box-kicker">Common exam pitfall</div><p>The loop order matters enormously: <code>k</code> must be the <strong>outermost</strong> loop. Swapping k with i or j breaks the correctness proof (each iteration of k must fully finish before the next k begins, since later iterations depend on it).</p></div></div>`,

vertexcover:`<div class="concept-section"><h3>Vertex Cover Approximation</h3>
<div class="story-box"><div class="story-kicker">Story</div><p>You need security cameras at road intersections such that every road has a camera at (at least) one end. Finding the absolute minimum set is NP-Complete, but a simple trick guarantees you'll never use more than <strong>2&times;</strong> the true minimum: repeatedly grab any uncovered road and place cameras at <em>both</em> its ends, then remove every road that's now covered.</p></div>
<h4>How it works</h4>
<ul class="step-list">
<li><div class="step-num">1</div><div class="step-text">While uncovered edges remain, pick any one, (u,v).</div></li>
<li><div class="step-num">2</div><div class="step-text">Add both u and v to the cover.</div></li>
<li><div class="step-num">3</div><div class="step-text">Remove every edge touching u or v.</div></li>
</ul>
<div class="usecase-box"><div class="box-kicker">Real-world uses</div><p>Network monitoring placement (sensors that must observe every link), bioinformatics (protein interaction network analysis), and as a warm-up approximation before applying more expensive exact solvers on smaller residual instances.</p></div>
<div class="pitfall-box"><div class="box-kicker">Common exam pitfall</div><p>Students often think picking edges by <em>highest-degree vertex first</em> gives the 2-approximation guarantee &mdash; it doesn't (that heuristic can perform much worse). The proof only holds for the "any edge, both endpoints" matching-based method shown here.</p></div></div>`,

tsp:`<div class="concept-section"><h3>TSP 2-Approximation</h3>
<div class="story-box"><div class="story-kicker">Story</div><p>A delivery driver must visit every city once and return home as cheaply as possible &mdash; the classic (NP-Complete) Travelling Salesman Problem. A clever shortcut: build the cheapest road network connecting all cities (a Minimum Spanning Tree), walk it in a depth-first loop, and "shortcut" past any city you'd otherwise revisit. As long as the triangle inequality holds, shortcuts never make things worse.</p></div>
<h4>How it works</h4>
<ul class="step-list">
<li><div class="step-num">1</div><div class="step-text">Build MST T. Cost(T) &le; Cost(optimal tour) &mdash; removing one edge from any tour gives a spanning tree.</div></li>
<li><div class="step-num">2</div><div class="step-text">DFS-traverse T; each tree edge gets walked twice &rarr; cost &le; 2&times;MST.</div></li>
<li><div class="step-num">3</div><div class="step-text">Shortcut repeated visits using the triangle inequality &rarr; final tour cost &le; 2&times;OPT.</div></li>
</ul>
<div class="usecase-box"><div class="box-kicker">Real-world uses</div><p>Delivery/logistics route planning, PCB drilling-path optimization (minimizing drill-head travel), and DNA fragment assembly ordering &mdash; anywhere a near-optimal tour is good enough and exact TSP is computationally infeasible.</p></div>
<div class="pitfall-box"><div class="box-kicker">Common exam pitfall</div><p>The 2-approximation guarantee only holds for <strong>metric</strong> TSP (distances satisfy the triangle inequality) &mdash; students forget to check/state this assumption, and the guarantee simply doesn't apply to arbitrary distance matrices.</p></div></div>`,

hillclimb:`<div class="concept-section"><h3>Hill Climbing Algorithm</h3>
<div class="story-box"><div class="story-kicker">Story</div><p>You're blindfolded on a hilly landscape, trying to find the highest peak. You feel the slope around your feet and always step toward higher ground. You <em>will</em> reach a peak &mdash; but with no view of the wider landscape, it might just be a small local hill, not the tallest mountain around.</p></div>
<h4>How it works</h4>
<ul><li><strong>Strength:</strong> extremely fast, O(1) memory, converges quickly to <em>a</em> local optimum.</li>
<li><strong>Weakness:</strong> gets trapped at local optima, ridges, and flat plateaus.</li>
<li><strong>Fix &mdash; Random Restart:</strong> run it many times from different random starting points and keep the best result found.</li></ul>
<div class="usecase-box"><div class="box-kicker">Real-world uses</div><p>Neural network weight fine-tuning (a relative of gradient descent), the 8-puzzle and similar local-search puzzles, VLSI chip placement, and as a fast first-pass heuristic before a more expensive optimizer refines the answer.</p></div>
<div class="pitfall-box"><div class="box-kicker">Common exam pitfall</div><p>Students often describe Hill Climbing as "guaranteed to find the best solution" &mdash; it is explicitly <strong>not</strong>; it only guarantees a local optimum, and the whole point of the algorithm's limitations section is understanding when/why it fails (ridges, plateaus, local maxima).</p></div></div>`,

genetic:`<div class="concept-section"><h3>Genetic Algorithm</h3>
<div class="story-box"><div class="story-kicker">Story</div><p>Think of breeding racehorses over generations. Start with a random herd. Pair the fastest horses to breed (selection). Foals inherit traits from both parents (crossover). Occasionally a foal is born with a random trait (mutation). Repeat for many generations, and the herd gets measurably faster &mdash; without anyone ever calculating a gradient.</p></div>
<ul><li><strong>Chromosome:</strong> the encoding of one candidate solution.</li>
<li><strong>Fitness:</strong> how good a solution is (higher = better).</li>
<li><strong>Selection:</strong> fitter individuals are more likely to become parents (roulette wheel / tournament).</li>
<li><strong>Crossover:</strong> combine two parents into a child.</li>
<li><strong>Mutation:</strong> a small random tweak, preserving diversity and preventing premature convergence.</li></ul>
<div class="usecase-box"><div class="box-kicker">Real-world uses</div><p>Neural architecture search, antenna and aerodynamic shape design (NASA has flown GA-evolved antennas), automated game-level and strategy generation, and scheduling/timetabling problems too large for exact solvers.</p></div>
<div class="pitfall-box"><div class="box-kicker">Common exam pitfall</div><p>Students often forget mutation's real purpose: it's not "extra randomness for fun" &mdash; it exists specifically to maintain genetic diversity and escape premature convergence where the whole population collapses onto one mediocre solution too early.</p></div></div>`,

master:`<div class="concept-section"><h3>Master Theorem</h3>
<div class="story-box"><div class="story-kicker">Story</div><p>Every Divide & Conquer algorithm pays two kinds of cost: the work to split/combine at each level (f(n)), and the total work of all recursive sub-calls (n<sup>log_b a</sup>). The Master Theorem is a lookup table that tells you instantly which of the two costs dominates &mdash; no need to unroll the recursion by hand.</p></div>
<p>For <code>T(n) = aT(n/b) + f(n)</code>:</p>
<p><strong>Case 1</strong> &mdash; f(n) = O(n<sup>log_b a &minus; &epsilon;</sup>): recursion dominates &rarr; T(n) = &Theta;(n<sup>log_b a</sup>).</p>
<p><strong>Case 2</strong> &mdash; f(n) = &Theta;(n<sup>log_b a</sup>): equal work per level &rarr; T(n) = &Theta;(n<sup>log_b a</sup> &middot; log n).</p>
<p><strong>Case 3</strong> &mdash; f(n) = &Omega;(n<sup>log_b a + &epsilon;</sup>): combine step dominates &rarr; T(n) = &Theta;(f(n)).</p>
<pre>T(n) = 2T(n/2) + n     &rarr; Case 2 &rarr; &Theta;(n log n)   [Merge Sort]
T(n) = 7T(n/2) + n\u00b2    &rarr; Case 1 &rarr; &Theta;(n^2.81)  [Strassen's]
T(n) = T(n/2) + 1      &rarr; Case 2 &rarr; &Theta;(log n)    [Binary Search]</pre>
<div class="pitfall-box"><div class="box-kicker">Common exam pitfall</div><p>The Master Theorem doesn't apply to <em>every</em> recurrence &mdash; e.g. T(n)=2T(n/2)+n/log n has no matching case (it falls in the gap between Case 2 and Case 3) and needs the more general Akra-Bazzi method instead.</p></div></div>`,

amortized:`<div class="concept-section"><h3>Amortized Analysis</h3>
<div class="story-box"><div class="story-kicker">Story</div><p>A gym charges $0 most visits, but $100 on a "deep clean" day that happens once every 100 visits. The average cost per visit is $1 &mdash; even though individual visits differ wildly. That guaranteed average, over <em>any</em> worst-case sequence of visits, is exactly what amortized analysis computes. It's not the same as average-case (probabilistic) analysis &mdash; it's a guarantee.</p></div>
<ul>
<li><strong>Aggregate method:</strong> total cost of n ops / n. E.g. a dynamic array's n inserts cost O(n) total (doublings sum to &lt;2n) &rarr; O(1) amortized per insert.</li>
<li><strong>Accounting method:</strong> overcharge cheap operations to "pre-pay" for future expensive ones; the credit balance must never go negative.</li>
<li><strong>Potential method:</strong> define a potential function &Phi;(state); amortized cost = actual cost + &Delta;&Phi;.</li>
</ul>
<div class="usecase-box"><div class="box-kicker">Real-world uses</div><p>Justifying the O(1) amortized cost of dynamic arrays (ArrayList/Vector/list append), hash table resizing, and the union-find data structure's near-constant operations &mdash; all rely on amortized analysis to make their performance claims rigorous.</p></div>
<div class="pitfall-box"><div class="box-kicker">Common exam pitfall</div><p>Students often confuse amortized analysis with average-case analysis &mdash; amortized is a <em>worst-case</em> guarantee over a sequence of operations, with no randomness or probability involved at all.</p></div></div>`,

cooks:`<div class="concept-section"><h3>NP-Completeness & Cook's Theorem</h3>
<div class="story-box"><div class="story-kicker">Story</div><p>Some puzzles are easy to <em>check</em> but seemingly hard to <em>solve</em> &mdash; like a sudoku: verifying a finished grid is instant, but finding one from scratch can take forever. Cook's Theorem (1971) proved that SAT (Boolean satisfiability) is the "hardest" such puzzle in a precise sense &mdash; every other checkable problem can be translated into it &mdash; kicking off the entire theory of NP-completeness.</p></div>
<ul><li><strong>P:</strong> solvable in polynomial time (Sorting, Dijkstra's, MST).</li>
<li><strong>NP:</strong> a proposed solution can be verified in polynomial time (SAT, Vertex Cover, TSP).</li>
<li><strong>NP-Hard:</strong> at least as hard as every NP problem.</li>
<li><strong>NP-Complete:</strong> both in NP and NP-Hard (SAT, 3-SAT, Vertex Cover).</li></ul>
<div class="usecase-box"><div class="box-kicker">Real-world uses</div><p>Every modern cryptographic system (RSA, etc.) leans on the presumed hardness of certain problems; recognizing that a real-world problem is NP-Complete tells engineers to stop searching for an efficient exact algorithm and switch to approximations or heuristics instead.</p></div>
<div class="pitfall-box"><div class="box-kicker">Common exam pitfall</div><p><strong>Is P = NP?</strong> The most famous open question in computer science. Most believe P &ne; NP, but nobody has proven it &mdash; students sometimes state one side as "proven fact", which is incorrect either way.</p></div></div>`,

jssp:`<div class="concept-section"><h3>Job Shop Scheduling Problem</h3>
<div class="story-box"><div class="story-kicker">Story</div><p>A car factory has stations for welding, painting, and assembly. Job 1 needs Welding &rarr; Painting &rarr; Assembly. Job 2 needs Assembly &rarr; Welding. Each station handles one job at a time. What ordering finishes all cars soonest? Even with just 3 machines, the general problem is NP-Hard &mdash; there's no known polynomial formula for the optimum.</p></div>
<p><strong>Practical approaches:</strong></p>
<ul><li>Johnson's Algorithm solves the special 2-machine case optimally in O(n log n).</li>
<li>Genetic Algorithms / Simulated Annealing for good approximate schedules.</li>
<li>Branch and Bound for exact answers on small instances.</li>
<li>Mixed Integer Programming formulations for industrial solvers.</li></ul>
<div class="usecase-box"><div class="box-kicker">Real-world uses</div><p>Manufacturing plant scheduling, cloud-computing task scheduling across heterogeneous machines, and airline crew/aircraft rotation planning &mdash; all industrial-scale versions of the same NP-Hard structure.</p></div>
<div class="pitfall-box"><div class="box-kicker">Common exam pitfall</div><p>Johnson's Rule only solves the special <strong>2-machine</strong> case optimally &mdash; students sometimes try to extend it directly to 3+ machines, but the general m-machine problem is NP-Hard with no such clean polynomial rule.</p></div></div>`,
};
