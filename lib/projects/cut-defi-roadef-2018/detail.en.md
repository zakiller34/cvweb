
In 2018, I participated to this Operations Research challenge:
https://roadef.org/challenge/2018/en/sujet.php

I am happy to have been ranked 6th as the S6 team among all research and industrial teams. Here is the results page:
https://roadef.org/challenge/2018/en/finalResults.php

## Problem

**Saint-Gobain Glass France** produces flat glass via the float process: powders are melted, spread over a tin bath, cooled into an infinite ribbon, then cut into large sheets called **jumbos** (typically 3m x 6m). Jumbos are recut into smaller rectangular pieces for customers. The cutting must satisfy guillotine constraints (cracks propagate edge-to-edge) and avoid defects mapped by scanners at the exit of the float process.

64 teams from 24 countries. Two tracks: 180s (sprint) and 3600s (final).

### Inputs

- **Item** *i*: glass piece to cut, characterized by (w_i, h_i)
- **Stack** *s = (i_1, i_2, ..., i_j)*: ordered sequence where i_1 must be cut before i_2, etc. (scheduling/delivery constraints)
- **Batch** *I*: all items to cut, partitioned into *n* stacks: I = s_1 U s_2 U ... U s_n
- **Bin** *b*: a jumbo with width W_b, height H_b, and defect set D_b. Bins are ordered and used sequentially. All bins have the same standardized size; they differ only in defects
- **Defect** *d*: tuple (x_d, y_d, w_d, h_d) — position and dimensions on a specific bin

### Guillotine cutting

A **guillotine cut** on a plate goes from one edge to the opposite edge, producing two rectangles. This is mandatory for glass — non-guillotine cuts produce cracks.

![Non-guillotine vs guillotine patterns](/projects/cut-defi-roadef-2018/fig1-guillotine-vs-non.png)
*Fig 1: (a) Non-guillotine pattern — invalid. (b) Guillotine pattern — valid. All cuts go edge-to-edge.*

A **cutting pattern** is a 2D plan of guillotine cuts on a bin. An **alpha-cut** denotes a guillotine cut at depth alpha. The pattern below is 3-stage: i1 needs 2 cuts, i2 and i3 need 3 cuts. Hatched areas are waste, the black dot is a defect.

![Cutting pattern with cut levels](/projects/cut-defi-roadef-2018/fig2-cutting-pattern.png)
*Fig 2: (a) Initial pattern with 1-cut, 2-cut, 3-cuts and a defect. (b-d) Progressive cuts revealing items.*

A cutting pattern can be represented as a **tree**: the root is the plate, leaves are items or waste, and children at each level are the sub-plates obtained after a cut.

![Tree representation](/projects/cut-defi-roadef-2018/fig3-tree-representation.png)
*Fig 3: Tree representation of the cutting pattern from Fig 2. Depth-first traversal gives the item cutting order: i1, i2, i3.*

### Objective

Minimize geometrical loss. Glass leftover (residual) on the last bin can be reused. The residual is the waste at right of the last 1-cut in the last pattern.

For a feasible solution P = {p_1, ..., p_m} with residual r_m on last pattern p_m:

```
min  H * W * m  -  H * r_m  -  SUM(w_i * h_i)  for all i in I        (1)
```

### Constraints

**Item & bin constraints:**

- Only 90-degree rotation of items allowed (horizontal or vertical)
- All items in batch I must be cut — no omissions
- No overproduction — only items in I, no duplicates
- Each item belongs to its given stack; stack assignment is fixed
- Items within each stack must be cut in sequence order (depth-first traversal of the cutting tree gives the cut order)
- No ordering between items of different stacks
- Bins are always horizontal (W > H), no bin rotation
- Bins must be used in given order: patterns p_1,...,p_m use bins b_1,...,b_m

**Cutting pattern constraints:**

- No overlapping of items
- No overlapping of items with defects — items must be defect-free
- **Forbidden to cut through a defect**
- Guillotine cuts only — each cut goes edge-to-edge, producing two rectangles
- Max 3 cuts to obtain an item (1,2,3-cuts). However, one **4-cut (trimming)** is allowed per sub-plate obtained after a 3-cut — only to separate an item from waste or two items, not for further subdivision. Items can also be obtained in fewer than 3 cuts.

![Trimming 4-cut examples](/projects/cut-defi-roadef-2018/fig4-trimming-4cut.png)
*Fig 4: (a) Valid — one 4-cut removes waste to get i4. (b) Valid — two 4-cuts in separate 3-cut sub-plates. (c) Forbidden — two 4-cuts in the same 3-cut sub-plate.*

- **1-cuts are always vertical**
- Min width between consecutive 1-cuts: **100** (except wastes)
- Max width between consecutive 1-cuts: **3500** (except residual)
- Each pattern must contain at least one 1-cut
- Min height between consecutive 2-cuts: **100** (except wastes)
- **Min waste size: (20, 20)** — every waste fragment must be at least 20 in both dimensions

---

## Result

**Team S6 — Zakaria Teffah — Individual — France**
**6th place out of 64 teams — 155 points**

---

## Solution Approach

The solver combines constructive heuristics, a multi-strategy portfolio, and simulated annealing metaheuristic. All algorithms respect the time budget enforced by the competition (180s or 3600s).

### 1. Three-level constructive heuristic

The core idea builds a solution **plate by plate**, filling each plate through 3 nested levels of guillotine cuts that mirror the physical cutting process:

1. **Level 1 — vertical strips**: divide the plate into vertical strips (1-cuts, left to right). For each strip, choose a "pilot item" — the item that determines the strip width.
2. **Level 2 — horizontal rows**: within each strip, divide it into horizontal rows (2-cuts, bottom to top). Each row height is driven by the tallest item placed in it.
3. **Level 3 — vertical items**: within each row, place items side by side (3-cuts, left to right), optionally with a trimming 4-cut.

At each level, the heuristic must decide **which item to place next**. This is controlled by a scoring criterion applied to the items available from the stacks (respecting FIFO order). Several criteria were designed:
- Largest dimension first (fill tall/wide spaces efficiently)
- Diagonal-based scoring (balance width and height)
- Sum of dimensions
- Area-based ranking

Defects are handled by **shifting**: when an item would overlap a defect, it is moved past it, leaving waste in the defect zone. Both item orientations (original and 90-degree rotation) are tried.

After a plate is filled, the last plate is optionally **reconstructed** to improve the objective — trying different item arrangements to reduce the residual.

### 2. Best-ratio greedy selection

Instead of committing to the first feasible item at each cut level, this strategy **enumerates all feasible placements** at a given level and selects the one that minimizes the waste-to-useful-area ratio.

This can be applied at any level of the cut tree:
- At level 2 (horizontal cuts): evaluate all possible row compositions and pick the best ratio
- At level 3 (vertical cuts): evaluate all item placements within a row and pick the tightest fit

The greedy ratio selection significantly reduces waste compared to simple heuristic placement but is more expensive computationally.

### 3. Multi-heuristic portfolio

The main solver runs **multiple constructive heuristic variants** and keeps the best solution found. Each variant uses a different combination of:
- Item-choice criterion (8 variants)
- Cut-level strategy (which levels use best-ratio vs. simple placement)
- Sub-list strategies (which stacks to prioritize)

This produces ~24+ distinct configurations. Running them all is affordable because each constructive heuristic is fast (sub-second). The portfolio approach exploits the fact that different heuristic configurations work better on different instance structures.

### 4. Randomized multi-start

A randomized variant of the constructive heuristic replaces deterministic item selection with **random selection** at each cut level. Running many times with different random seeds explores diverse regions of the solution space.

This acts as a simple multi-start procedure: generate many random feasible solutions, keep the best. It is particularly useful when the deterministic heuristics get stuck in a local pattern.

### 5. Simulated annealing

Starting from the best constructive solution, simulated annealing (SA) iteratively improves it:

- **Neighborhood moves**: perturb the current solution by modifying item placements — reorganizing strips, swapping items between rows, changing the order in which stacks are consumed. Multiple neighborhood types of varying size were implemented, from small local changes to large restructurings.
- **Acceptance criterion**: Metropolis rule — always accept improvements, accept degradations with probability exp(-delta/T) where T is the temperature.
- **Cooling schedule**: geometric cooling (T = T * 0.99 at each step), starting from a high temperature to allow exploration, gradually freezing into a good solution.
- **Aggressiveness levels**: the SA can be configured to use random heuristic restarts (explore broadly), always restart from the best known solution (exploit locally), or a mix.

### 6. Parallel C++ implementation

The time-critical heuristics were reimplemented in C++ with OpenMP parallelism. This allowed running significantly more heuristic evaluations and SA iterations within the competition time budget, which directly translates to better solutions.

The figure below shows a complete feasible solution for one plate, illustrating how items (blue), waste (grey), and defects (red dots) are arranged within the dimension bounds.

![Dimension bounds](/projects/cut-defi-roadef-2018/fig5-bounds.png)
*A feasible cutting pattern for one plate. 1-cut strips: 100 <= width <= 3500. 2-cut rows: height >= 100. Waste: >= 20 in both dimensions. Red dots = defects, always placed in waste zones.*

---

## References

- [ROADEF/EURO 2018 Challenge](https://roadef.org/challenge/2018/en/index.php)
- [Problem Description PDF](https://roadef.org/challenge/2018/files/Challenge_ROADEF_EURO_SG_Description.pdf)
- [Final Results](https://roadef.org/challenge/2018/en/finalResults.php)
