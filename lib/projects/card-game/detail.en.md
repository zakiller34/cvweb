
## Studying Optimal Texas Hold'em Strategy Through Monte Carlo Simulation

---

> *Can a machine rediscover what poker players took decades to learn -- which hands to play, when to bluff, and how position shapes profit?*

This project builds a complete Texas Hold'em engine from scratch, equips it with formal correctness guarantees, and unleashes Monte Carlo simulation to answer fundamental questions about poker strategy. Twelve experiments, millions of simulated hands, and 940 passing tests converge on a single insight: **explicit probability beats intuition, every time**.

![Poker Hand Rankings](/projects/card-game/poker_hand_rankings.jpg)
*Hand rankings in Texas Hold'em -- the foundation everything else builds on. (Image: Wikimedia Commons, CC-BY-SA 4.0)*

---

## Chapter 1: Mathematical Foundations

### 1.1 Poker as a Zero-Sum Game

Texas Hold'em is a finite, zero-sum, incomplete-information game. After every hand, the total chip movement across all players sums to exactly zero. This constraint is the engine's master invariant -- verified on every single hand across every simulation. If it ever breaks, the engine has a bug.

The standard performance metric is **BB/100** (big blinds won per 100 hands). A player with BB/100 = +50 earns half a big blind per hand on average. Statistical significance requires 95% confidence intervals using per-hand standard deviation and sample size.

### 1.2 Monte Carlo Equity Estimation

The core decision in poker is: *should I put more money in?* The answer depends on **equity** -- the probability of winning the pot given your hand and the visible board.

![Monte Carlo method](/projects/card-game/pi_monte_carlo.svg)
*Monte Carlo methods estimate quantities through random sampling. Here, random points estimate pi. In poker, random board completions estimate hand equity. (Image: Wikimedia Commons, CC-BY 4.0)*

For a hand against an opponent's unknown hand, equity is the fraction of possible board completions and opponent holdings where the hand wins. Since enumerating all possibilities is expensive, we sample N random completions.

With 200 samples per decision, the standard error is below 3% -- sufficient for correct fold/call/raise decisions in the vast majority of situations.

The decision rule compares equity to pot odds:

**Call if equity > call_cost / (pot + call_cost)**

This is the mathematical foundation of the **EquityPlayer** -- and as we'll see, it crushes every heuristic approach.

### 1.3 Preflop Hand Scoring

Before the flop, a player sees only two cards. Two classical scoring systems attempt to rank starting hands:

**Bill Chen's Formula** assigns a numerical score in [-1, 20]:
- High card value: A=10, K=8, Q=7, J=6, 10 through 2 = face/2
- Pair bonus: x2 (minimum 5)
- Suited bonus: +2
- Gap penalty: 0 (connected), -1 (1-gap), -2 (2-gap), -4 (3+ gap)
- Low straight bonus: +1 if both cards < Q and gap <= 1

**David Sklansky's Groups** partition the 169 canonical hands into 9 tiers, from Group 1 (AA, KK, QQ, JJ, AKs) to Group 9 (the weakest playable hands).

How well do these heuristics approximate true equity? We computed Monte Carlo equity for all 169 hands and compared:

![Equity Heatmap](/projects/card-game/equity_heatmap_13x13.png)
*13x13 equity matrix for all canonical preflop hands. Rows = first card rank, columns = second card rank. Above diagonal = suited, below = offsuit. Pocket aces (AA) have equity ~0.85; the weakest hand (72o) sits around 0.35.*

![Chen vs Equity](/projects/card-game/chen_vs_equity_scatter.png)
*Chen score vs true MC equity. Pearson r = 0.81, meaning Chen captures about 65% of equity variance. The formula is a reasonable approximation but misses important structural features.*

Key finding: **Chen's formula leaves 35% of equity variance unexplained.** The gap is large enough that a player using Chen scores will systematically misvalue hands -- playing some weak hands too aggressively and folding some strong hands too early.

Sklansky groups, by contrast, are monotonically decreasing in equity (Group 1 has the highest mean equity, Group 9 the lowest) and incorporate position-based opening ranges -- a dimension Chen ignores entirely.

### 1.4 Variance Reduction Techniques

Poker has enormous variance. A winning player can lose money over thousands of hands due to card luck alone. For scientific measurement, we need techniques to reduce this noise.

**Duplicate Dealing**: Run the same sequence of cards with players swapped between seats. Card luck cancels out; only decision quality remains. This achieves **44% variance reduction** in head-to-head play.

**AIVAT (All-In Variance Adjusted Tournament)**: A control variate technique. Define a heuristic value function that estimates hand strength, then subtract the correlated noise. The adjusted estimator is unbiased with reduced variance. AIVAT alone achieves **45% variance reduction**. Combined with duplicate dealing: **56% reduction** -- meaning we need roughly half as many hands to reach the same confidence.

![Variance Reduction](/projects/card-game/variance_reduction_factors.png)
*Comparison of variance reduction methods. Duplicate and AIVAT each cut variance by ~45%; combined, they achieve 56%. Antithetic variates provided no measurable benefit for this application.*

**Antithetic Variates**: Sample complementary board completions to introduce negative correlation. In theory, this should reduce equity estimation variance by 25-40%. In practice, the improvement was negligible (~3%) -- the board completion distribution is too uniform for antithetic sampling to bite.

### 1.5 Reinforcement Learning: Rediscovering Hand Rankings

Can an agent learn to play poker from scratch, with no prior knowledge of hand values?

Tabular Q-learning uses the Bellman equation to iteratively estimate the value of each state-action pair, with learning rate 0.1 and discount factor 0.99.

The agent explores using epsilon-greedy: with probability epsilon it takes a random action, otherwise it follows its current best policy. Epsilon decays linearly from 1.0 to 0.05 over 50,000 training hands -- aggressive exploration early, exploitation later.

**State abstraction** is critical. Raw poker states are astronomical (>10^14), but we compress them:

- **Level 1** (preflop only): 169 canonical hands x 4 positions x 3 stack buckets ~ 2,028 states
- **Level 2** (street-aware): 4 streets x 5 hand-strength bins x 5 pot sizes x 4 positions x 3 stacks ~ 3,600 states

Action space is discretized to 5 options: fold, check, call, raise-minimum, raise-pot.

### 1.6 Neural Action Prediction

For opponent modeling, we train a neural network to predict what action an opponent will take given the game state. The feature representation is a 27-dimensional vector including stack ratios, street, position, board texture, hand strength, and opponent stats.

A two-layer MLP with architecture 27 -> 64 -> 32 -> 3 (ReLU activations, softmax output) predicts P(fold), P(check/call), P(raise).

The fold probability feeds directly into a bluff EV calculation:

**EV_bluff = P(fold) x pot - (1 - P(fold)) x raise_cost**

When EV_bluff > 0 and our equity is marginal, the neural player bluffs -- converting opponent modeling into profit.

---

## Chapter 2: Formal Verification

### 2.1 The Runtime-Axiom-Theorem Chain

A Monte Carlo poker engine runs millions of hands. A single accounting bug -- chips created from nothing, a pot miscalculated, an illegal state transition -- corrupts every result silently. Traditional unit testing catches known scenarios; formal verification catches *all* scenarios.

The verification architecture has three interlocking layers:

```
  Python Code                    Lean4 Proofs
  ----------                    ------------
  assert sum(pots)==sum(bets)  -->  axiom pot_conservation
                                        |
                                        v
                                   theorem pot_partition
                                   theorem pot_eligibility
                                   theorem pot_nonempty

  assert valid_transition(p,p') -->  axiom fsm_safety
                                        |
                                        v
                                   theorem fsm_liveness
                                   theorem fsm_determinism

  assert sum(stacks)+sum(bets)==S0 --> axiom chip_conservation
                                           |
                                           v
                                      theorem hand_chip_conservation
                                      theorem table_chip_conservation
```

(Layer 0 was my ex-wife Maïté who verified a lot from the start! ;-) 

**Layer 1 -- Python asserts**: Runtime checks that fire on *every* function call. `assert sum(pots) == sum(bets)` runs millions of times across all simulations.

**Layer 2 -- Lean4 axioms**: Each assert is formalized as a Lean4 axiom. The axiom's validity is empirically guaranteed by the assert (if it were false, the assert would have fired).

**Layer 3 -- Lean4 theorems**: Formal proofs derive stronger guarantees from axioms. If the axioms hold (guaranteed by asserts), the theorems hold universally.

This creates a **continuous verification loop**: every simulated hand exercises every assert, providing statistical confidence far beyond unit tests. The engine has processed millions of hands with zero assertion failures.

### 2.2 Key Invariants

**Chip Conservation** -- the master invariant: the sum of all stacks plus all bets equals the initial chip total at all times. This is checked after *every* FSM state transition. No chips are ever created or destroyed. All monetary values use integer arithmetic -- no floating-point rounding errors.

**FSM Safety** -- no illegal transitions. The game state machine has 9 phases (INI, DEAL, PREFLOP, FLOP, TURN, RIVER, SHOWDOWN, PAYOUT, END). Every transition is validated against an exhaustive 9x9 matrix.

**FSM Liveness** -- every hand terminates within 500 steps. A bounded step counter guarantees termination. No infinite loops, no stuck states.

**Pot Accounting** -- four properties together ensure pot correctness:
1. **Conservation**: sum of pot amounts = sum of bets (no chips lost)
2. **Eligibility**: folded players excluded from all pots
3. **Partition**: each chip in exactly one pot (no double-counting)
4. **Ordering**: main pot first, side pots by ascending bet level

### 2.3 Player Contract Verification

Every player strategy satisfies a formal contract: the returned action must be in the set of legal actions, and the bet amount must be within [min_raise, max_raise].

Individual strategies carry additional proofs:
- **CallingStation**: always checks or calls (never folds, never raises)
- **Chen formula**: score in [-1, 20] for all hands, and score(AA) = 20 (maximum)
- **Sklansky groups**: group in [1, 9] and group(AA) = 1 (strongest tier)
- **place_bet conservation**: stack' + current_bet' = stack + current_bet (chips move, never vanish)

### 2.4 Betting Structure Proofs

Three structures are supported with formally verified properties:

- **No-Limit**: min_raise <= max_raise when the player can afford the minimum raise.
- **Pot-Limit**: max_raise(PL) <= max_raise(NL) -- pot-limit is always bounded by no-limit.
- **Fixed-Limit**: min_raise = max_raise -- no sizing decisions, just raise or don't.

### 2.5 Proof Statistics

| Module | Theorems Proved | `sorry` Remaining |
|---|---|---|
| `poker_env/Theorems.lean` | 25 | 0 |
| `poker_players/Theorems.lean` | 20+ | 0 |
| **Total** | **45+** | **0** |

All proofs are complete. Zero `sorry` (Lean4's placeholder for unfinished proofs) remains in the codebase. Combined with 940 unit tests and millions of runtime assertions, this provides high confidence that the engine is correct.

---

## Chapter 3: Experimental Results

### 3.1 The Strategy Hierarchy

![Game Theory](/projects/card-game/prisoners_dilemma.svg)
*Game theory payoff matrices capture strategic interaction. In poker, we extend this to 10 strategies playing all C(10,2) = 45 possible pairings. (Image: Wikimedia Commons, CC-BY-SA 4.0)*

We ran a complete round-robin: 10 strategies, 45 head-to-head matchups, 5,000 hands each with duplicate dealing across No-Limit, Fixed-Limit, and Pot-Limit.

![Dominance Matrix](/projects/card-game/dominance_matrix_nl.png)
*Head-to-head dominance matrix (No-Limit). Blue = player (row) profits; red = player loses. EquityPlayer dominates every opponent. Note the near-antisymmetry: result[A,B] ~ -result[B,A].*

The hierarchy is remarkably consistent across structures:

| Rank | Player | NL BB/100 | FL BB/100 | PL BB/100 | Type |
|---|---|---|---|---|---|
| 1 | **Equity** | **+255** | **+251** | **+242** | MC equity |
| 2 | PotOdds | +176 | +179 | +153 | Static equity |
| 3 | Chen | +97 | +91 | +65 | Heuristic |
| 4 | LAG | +82 | +80 | +56 | Heuristic |
| 5 | TAG | +75 | +68 | +42 | Heuristic |
| 6 | Sklansky | +49 | +61 | +31 | Heuristic |
| 7 | CallingStation | -24 | -24 | -21 | Baseline |
| 8 | Fold | -29 | -29 | -29 | Baseline |
| 9 | Random | -305 | -300 | -219 | Baseline |
| 10 | AllIn | -377 | -377 | -318 | Baseline |

**Transitivity**: 86% of triples are transitive in NL (if A beats B and B beats C, then A beats C). The remaining 14% show **rock-paper-scissors dynamics** -- a player well-adapted to one style loses to another.

### 3.2 Equity Beats Everything

The defining result: **EquityPlayer wins +1,026 BB/100 in a 7-player No-Limit tournament** -- three times the runner-up (TAG at +337).

![BB/100 Comparison](/projects/card-game/bb100_comparison_bar.png)
*BB/100 across three betting structures. EquityPlayer (teal) towers above all heuristic strategies. The advantage is largest in Pot-Limit (+1,325), not No-Limit as initially expected.*

Why does explicit equity calculation dominate?

1. **Postflop accuracy**: Heuristic players use preflop scores only. EquityPlayer recalculates equity on every street, adapting to the board.
2. **Pot-odds integration**: The call/fold decision is mathematically optimal given equity and pot size.
3. **Structure sensitivity**: In Pot-Limit, EquityPlayer achieves +1,325 BB/100 -- the largest edge. PL allows enough bet sizing flexibility while preventing opponents from making profitable all-in shoves.

Sklansky's groups outperform Chen in 6-player fields (position awareness matters in multiplayer), but both are dwarfed by equity-based play.

### 3.3 Position Is Profit

Seat position creates a structural advantage. Late-position players act last, seeing opponents' actions before deciding.

![Position Heatmap](/projects/card-game/position_heatmap_nl.png)
*BB/100 by position (No-Limit). Rows = player strategies, columns = seat positions. Green = profitable, red = losing. Skilled players (Equity, TAG) profit most from late position; weak players lose everywhere.*

The positional edge for skilled players:

| Player | EARLY BB/100 | LATE BB/100 | Edge |
|---|---|---|---|
| TAG | varies | varies | +14.8 |
| Chen | varies | varies | +48.4 |
| **Equity** | varies | varies | **+28.2** |
| CallingStation | varies | varies | -43.1 |

Key insight: **position advantage is player-dependent**, not universal. CallingStation has a *negative* positional edge (loses more from late position because it calls more hands). Skilled players exploit the information advantage; unskilled players cannot.

### 3.4 Betting Structure Effects

Three structures create three different strategic environments:

| Property | No-Limit | Pot-Limit | Fixed-Limit |
|---|---|---|---|
| Max bet | All-in | Pot size | Fixed increment |
| Variance | Highest | Medium | Lowest |
| Skill amplification | High | Highest | Low |
| EquityPlayer edge | +1,026 | +1,325 | +1,093 |

**No-Limit** amplifies skill differences (high variance, big pots). **Fixed-Limit** compresses edges (CallingStation loses -461 BB/100 in FL vs -618 in NL -- bounded loss per street limits damage). **Pot-Limit** provides the sweet spot: enough sizing flexibility for skilled play, bounded enough to prevent degenerate all-in confrontations.

### 3.5 Variance Reduction in Practice

![Variance Convergence](/projects/card-game/ci_convergence_curves.png)
*95% confidence interval width vs number of hands. Duplicate dealing and AIVAT both accelerate convergence; combined, they halve the number of hands needed for statistical significance.*

| Method | CI Width (BB/100) | Variance Reduction | Computational Cost |
|---|---|---|---|
| Independent | 0.99 | baseline | 1x |
| Duplicate | 0.74 | 44% | 2x sessions |
| AIVAT | 0.74 | 45% | 1x + O(n) |
| **Combined** | **0.66** | **56%** | 2x + O(n) |

Duplicate dealing is particularly effective for **loose players** (LAG: 77-85% reduction, CallingStation: 45-52%) because their wide hand ranges create more card-dependent variance that duplicate cancels.

### 3.6 Opponent Modeling: Classification and Adaptation

Can we automatically detect an opponent's playing style? We tracked 7 statistics (VPIP, PFR, aggression factor, 3-bet%, WTSD%, fold-to-3bet, c-bet fold) and trained classifiers on 550 labeled observations.

![Feature Importance](/projects/card-game/feature_importance_style.png)
*Feature importance for opponent classification. VPIP (voluntarily put money in pot) and PFR (preflop raise) are the most discriminating features.*

| Classifier | Accuracy |
|---|---|
| **Random Forest** | **91%** |
| KNN (k=5) | 91% |
| Decision Tree | 90% |
| SVC (rbf) | 65% |

The **LOOSE_PASSIVE** archetype (CallingStation) is perfectly classifiable. The hardest distinction is LAG vs TAG: both are aggressive, differing only in hand selection width (86% precision for LAG).

**Adaptive exploitation**: An AdaptivePlayer that classifies opponents online, then selects counter-strategies, achieves **+620 BB/100** -- matching pure EquityPlayer.

### 3.7 Neural Networks and Reinforcement Learning

**Neural action prediction**: An MLP trained on 342,000 decision examples predicts opponent actions with **82.4% accuracy**. The resulting NeuralOpponentPlayer achieves **+807 BB/100** -- outperforming pure equity play by incorporating opponent modeling into bluff EV calculations.

**Q-learning**: A tabular RL agent trained from zero poker knowledge reaches remarkable performance:

![RL Training](/projects/card-game/rl_bb100_training_curves.png)
*Q-learning training curves. Level 2 (street-aware abstraction) vastly outperforms Level 1 (preflop only), demonstrating that postflop information is critical for strong play.*

| Agent | vs CallingStation | vs TAG |
|---|---|---|
| QL Level 1 (preflop) | +286 BB/100 | +16 BB/100 |
| **QL Level 2 (street-aware)** | **+928 BB/100** | **+144 BB/100** |

The street-aware agent outperforms the preflop-only agent by 3x against CallingStation -- postflop decision-making is where the real money is.

Most remarkably, the RL agent's learned policy **correlates with Sklansky hand groups**:

![Policy vs Sklansky](/projects/card-game/rl_policy_heatmap_vs_sklansky.png)
*Left: the RL agent's learned policy (13x13 preflop heatmap, brighter = more aggressive). Right: Sklansky's hand groups (lower group = stronger hand). The patterns align -- the agent independently rediscovered that pocket pairs and high suited connectors deserve aggressive play.*

The agent learned to go all-in with premium hands and fold trash -- rediscovering through trial and error what poker theorists codified decades ago.

---

## Conclusion

Three results stand out:

1. **Equity computation is king.** Explicit Monte Carlo equity calculation beats every heuristic by a factor of 3x or more. Chen scores, Sklansky groups, and rule-of-thumb play are useful approximations, but they leave ~35% of hand value on the table. In the age of computation, there is no substitute for calculating your odds.

2. **Formal verification works at scale.** 45+ Lean4 theorems with zero `sorry`, 940 unit tests, and millions of runtime assertions create a verification chain that catches bugs traditional testing misses. The runtime-axiom-theorem architecture bridges the gap between practical Python code and mathematical proof.

3. **RL converges to known poker wisdom.** A Q-learning agent starting from zero knowledge independently discovers that pocket aces are strong, position matters, and postflop play is where edges compound. When a machine arrives at the same conclusions as Sklansky and Chen through pure reward maximization, it validates both the heuristic systems and the RL approach.

The variance reduction techniques (duplicate dealing + AIVAT = 56% reduction) make this entire analysis feasible. Without them, reaching statistical significance would require roughly double the computational budget.

What remains? Full Nash equilibrium computation (beyond the scope of tabular methods), deeper RL with function approximation, and multi-table tournament strategy. The engine and verification infrastructure are ready.

---

*Built with Python, NumPy, Plotly, scikit-learn, and Lean 4.*
