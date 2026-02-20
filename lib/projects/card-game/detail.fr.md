# Laboratoire de stratégie optimale pour le Texas Hold'em
## Etude de la strategie optimale au Texas Hold'em par simulation Monte Carlo

---

> *Une machine peut-elle redecouvrir ce que les joueurs de poker ont mis des decennies a apprendre -- quelles mains jouer, quand bluffer, et comment la position influence le profit ?*

Ce projet construit un moteur complet de Texas Hold'em a partir de zero, l'equipe de garanties formelles de correction, et dechaine la simulation Monte Carlo pour repondre a des questions fondamentales sur la strategie au poker. Douze experiences, des millions de mains simulees, et 940 tests reussis convergent vers un seul constat : **la probabilite explicite bat l'intuition, a chaque fois**.

![Classement des mains de poker](/projects/card-game/poker_hand_rankings.jpg)
*Classement des mains au Texas Hold'em -- la base sur laquelle tout le reste repose. (Image : Wikimedia Commons, CC-BY-SA 4.0)*

---

## Chapitre 1 : Fondements mathematiques

### 1.1 Le poker comme jeu a somme nulle

Le Texas Hold'em est un jeu fini, a somme nulle et a information incomplete. Apres chaque main, le mouvement total de jetons entre tous les joueurs est exactement nul. Cette contrainte est l'invariant principal du moteur -- verifie sur chaque main de chaque simulation. Si jamais il est viole, le moteur a un bug.

La metrique de performance standard est le **BB/100** (grosses blindes gagnees par 100 mains). Un joueur avec BB/100 = +50 gagne en moyenne une demi grosse blinde par main. La significativite statistique requiert des intervalles de confiance a 95% bases sur l'ecart-type par main et la taille de l'echantillon.

### 1.2 Estimation de l'equite par Monte Carlo

La decision centrale au poker est : *dois-je investir davantage ?* La reponse depend de **l'equite** -- la probabilite de gagner le pot etant donne votre main et le tableau visible.

![Methode Monte Carlo](/projects/card-game/pi_monte_carlo.svg)
*Les methodes Monte Carlo estiment des quantites par echantillonnage aleatoire. Ici, des points aleatoires estiment pi. Au poker, des completions aleatoires du tableau estiment l'equite d'une main. (Image : Wikimedia Commons, CC-BY 4.0)*

Pour une main contre la main inconnue d'un adversaire, l'equite est la fraction des completions possibles du tableau et des mains adverses ou la main gagne. Comme l'enumeration exhaustive est couteuse, on echantillonne N completions aleatoires.

Avec 200 echantillons par decision, l'erreur standard est inferieure a 3% -- suffisant pour des decisions correctes de fold/call/raise dans la grande majorite des situations.

La regle de decision compare l'equite aux cotes du pot :

**Suivre si equite > cout_du_call / (pot + cout_du_call)**

C'est le fondement mathematique de l'**EquityPlayer** -- et comme nous le verrons, il ecrase toute approche heuristique.

### 1.3 Evaluation des mains preflop

Avant le flop, un joueur ne voit que deux cartes. Deux systemes classiques tentent de classer les mains de depart :

**La formule de Bill Chen** attribue un score numerique dans [-1, 20] :
- Valeur de la carte haute : A=10, K=8, Q=7, J=6, 10 a 2 = face/2
- Bonus paire : x2 (minimum 5)
- Bonus assorti : +2
- Penalite d'ecart : 0 (connecte), -1 (1 ecart), -2 (2 ecarts), -4 (3+ ecarts)
- Bonus quinte basse : +1 si les deux cartes < Q et ecart <= 1

**Les groupes de David Sklansky** partitionnent les 169 mains canoniques en 9 niveaux, du Groupe 1 (AA, KK, QQ, JJ, AKs) au Groupe 9 (les mains jouables les plus faibles).

Dans quelle mesure ces heuristiques approximent-elles l'equite reelle ? Nous avons calcule l'equite Monte Carlo pour les 169 mains et compare :

![Carte thermique d'equite](/projects/card-game/equity_heatmap_13x13.png)
*Matrice d'equite 13x13 pour toutes les mains canoniques preflop. Lignes = rang de la premiere carte, colonnes = rang de la seconde. Au-dessus de la diagonale = assorties, en dessous = depareillees. La paire d'as (AA) a une equite ~0.85 ; la main la plus faible (72o) se situe autour de 0.35.*

![Chen vs Equite](/projects/card-game/chen_vs_equity_scatter.png)
*Score Chen vs equite MC reelle. Pearson r = 0.81, signifiant que Chen capture environ 65% de la variance d'equite. La formule est une approximation raisonnable mais manque des caracteristiques structurelles importantes.*

Resultat cle : **la formule de Chen laisse 35% de la variance d'equite inexpliquee.** L'ecart est suffisamment grand pour qu'un joueur utilisant les scores Chen surevalue systematiquement certaines mains faibles et couche trop tot certaines mains fortes.

Les groupes Sklansky, en revanche, sont monotoniquement decroissants en equite (le Groupe 1 a la plus haute equite moyenne, le Groupe 9 la plus basse) et integrent des ranges d'ouverture basees sur la position -- une dimension que Chen ignore completement.

### 1.4 Techniques de reduction de variance

Le poker a une variance enorme. Un joueur gagnant peut perdre de l'argent sur des milliers de mains a cause de la chance pure. Pour une mesure scientifique, nous avons besoin de techniques pour reduire ce bruit.

**Distribution duplicata** : Jouer la meme sequence de cartes avec les joueurs echanges entre les sieges. La chance aux cartes s'annule ; seule la qualite des decisions reste. Cela permet une **reduction de variance de 44%** en tete-a-tete.

**AIVAT (All-In Variance Adjusted Tournament)** : Une technique de variable de controle. On definit une fonction de valeur heuristique qui estime la force de la main, puis on soustrait le bruit correle. L'estimateur ajuste est sans biais avec une variance reduite. AIVAT seul atteint **45% de reduction de variance**. Combine avec le duplicata : **56% de reduction** -- ce qui signifie qu'on a besoin d'environ moitie moins de mains pour atteindre la meme confiance.

![Reduction de variance](/projects/card-game/variance_reduction_factors.png)
*Comparaison des methodes de reduction de variance. Le duplicata et AIVAT reduisent chacun la variance de ~45% ; combines, ils atteignent 56%. Les variables antithetiques n'ont apporte aucun benefice mesurable pour cette application.*

**Variables antithetiques** : Echantillonner des completions complementaires du tableau pour introduire une correlation negative. En theorie, cela devrait reduire la variance d'estimation d'equite de 25-40%. En pratique, l'amelioration etait negligeable (~3%) -- la distribution des completions est trop uniforme pour que l'echantillonnage antithetique soit efficace.

### 1.5 Apprentissage par renforcement : Redecouvrir le classement des mains

Un agent peut-il apprendre a jouer au poker a partir de zero, sans connaissance prealable des valeurs des mains ?

Le Q-learning tabulaire utilise l'equation de Bellman pour estimer iterativement la valeur de chaque paire etat-action, avec un taux d'apprentissage de 0.1 et un facteur d'actualisation de 0.99.

L'agent explore en epsilon-greedy : avec probabilite epsilon il prend une action aleatoire, sinon il suit sa meilleure politique courante. Epsilon decroit lineairement de 1.0 a 0.05 sur 50 000 mains d'entrainement -- exploration agressive au debut, exploitation ensuite.

**L'abstraction d'etat** est cruciale. Les etats bruts du poker sont astronomiques (>10^14), mais nous les compressons :

- **Niveau 1** (preflop seulement) : 169 mains canoniques x 4 positions x 3 tranches de tapis ~ 2 028 etats
- **Niveau 2** (avec conscience des rues) : 4 rues x 5 tranches de force de main x 5 tailles de pot x 4 positions x 3 tapis ~ 3 600 etats

L'espace d'action est discretise en 5 options : fold, check, call, relance minimum, relance pot.

### 1.6 Prediction neuronale d'action

Pour la modelisation de l'adversaire, nous entrainons un reseau de neurones a predire quelle action un adversaire prendra etant donne l'etat du jeu. La representation en features est un vecteur a 27 dimensions incluant les ratios de tapis, la rue, la position, la texture du tableau, la force de la main, et les statistiques de l'adversaire.

Un MLP a deux couches avec l'architecture 27 -> 64 -> 32 -> 3 (activations ReLU, sortie softmax) predit P(fold), P(check/call), P(relance).

La probabilite de fold alimente directement un calcul d'EV de bluff :

**EV_bluff = P(fold) x pot - (1 - P(fold)) x cout_de_relance**

Quand EV_bluff > 0 et notre equite est marginale, le joueur neuronal bluffe -- convertissant la modelisation de l'adversaire en profit.

---

## Chapitre 2 : Verification formelle

### 2.1 La chaine Runtime-Axiome-Theoreme

Un moteur de poker Monte Carlo execute des millions de mains. Un seul bug comptable -- des jetons crees a partir de rien, un pot mal calcule, une transition d'etat illegale -- corrompt silencieusement tous les resultats. Les tests unitaires traditionnels detectent les scenarios connus ; la verification formelle detecte *tous* les scenarios.

L'architecture de verification comporte trois couches imbriquees :

```
  Code Python                    Preuves Lean4
  -----------                    ------------
  assert sum(pots)==sum(bets)  -->  axiome pot_conservation
                                        |
                                        v
                                   theoreme pot_partition
                                   theoreme pot_eligibility
                                   theoreme pot_nonempty

  assert valid_transition(p,p') -->  axiome fsm_safety
                                        |
                                        v
                                   theoreme fsm_liveness
                                   theoreme fsm_determinism

  assert sum(stacks)+sum(bets)==S0 --> axiome chip_conservation
                                           |
                                           v
                                      theoreme hand_chip_conservation
                                      theoreme table_chip_conservation
```

(Couche 0 était mon ex-femme Maïté qui a beaucoup vérifié depuis le début ! ;-)

**Couche 1 -- Asserts Python** : Verifications a l'execution qui se declenchent a *chaque* appel de fonction. `assert sum(pots) == sum(bets)` s'execute des millions de fois a travers toutes les simulations.

**Couche 2 -- Axiomes Lean4** : Chaque assert est formalise comme un axiome Lean4. La validite de l'axiome est empiriquement garantie par l'assert (s'il etait faux, l'assert se serait declenche).

**Couche 3 -- Theoremes Lean4** : Des preuves formelles derivent des garanties plus fortes a partir des axiomes. Si les axiomes tiennent (garanti par les asserts), les theoremes tiennent universellement.

Cela cree une **boucle de verification continue** : chaque main simulee exerce chaque assert, fournissant une confiance statistique bien superieure aux tests unitaires. Le moteur a traite des millions de mains avec zero echec d'assertion.

### 2.2 Invariants cles

**Conservation des jetons** -- l'invariant principal : la somme de tous les tapis plus tous les mises egale le total initial de jetons a tout moment. Ceci est verifie apres *chaque* transition d'etat de la FSM. Aucun jeton n'est jamais cree ou detruit. Toutes les valeurs monetaires utilisent l'arithmetique entiere -- pas d'erreurs d'arrondi en virgule flottante.

**Securite de la FSM** -- aucune transition illegale. La machine a etats du jeu a 9 phases (INI, DEAL, PREFLOP, FLOP, TURN, RIVER, SHOWDOWN, PAYOUT, END). Chaque transition est validee contre une matrice exhaustive 9x9.

**Vivacite de la FSM** -- chaque main se termine en 500 etapes maximum. Un compteur borne garantit la terminaison. Pas de boucles infinies, pas d'etats bloques.

**Comptabilite des pots** -- quatre proprietes assurent ensemble la correction des pots :
1. **Conservation** : somme des montants des pots = somme des mises (aucun jeton perdu)
2. **Eligibilite** : les joueurs couches exclus de tous les pots
3. **Partition** : chaque jeton dans exactement un pot (pas de double comptage)
4. **Ordonnancement** : pot principal d'abord, pots secondaires par niveau de mise croissant

### 2.3 Verification des contrats des joueurs

Chaque strategie de joueur satisfait un contrat formel : l'action retournee doit etre dans l'ensemble des actions legales, et le montant de la mise doit etre dans [relance_min, relance_max].

Les strategies individuelles portent des preuves supplementaires :
- **CallingStation** : checke ou suit toujours (ne couche jamais, ne relance jamais)
- **Formule Chen** : score dans [-1, 20] pour toutes les mains, et score(AA) = 20 (maximum)
- **Groupes Sklansky** : groupe dans [1, 9] et groupe(AA) = 1 (niveau le plus fort)
- **Conservation de place_bet** : tapis' + mise_courante' = tapis + mise_courante (les jetons se deplacent, ne disparaissent jamais)

### 2.4 Preuves des structures de mise

Trois structures sont supportees avec des proprietes formellement verifiees :

- **No-Limit** : relance_min <= relance_max quand le joueur peut se permettre la relance minimum.
- **Pot-Limit** : relance_max(PL) <= relance_max(NL) -- le pot-limit est toujours borne par le no-limit.
- **Fixed-Limit** : relance_min = relance_max -- pas de decision de taille, juste relancer ou non.

### 2.5 Statistiques des preuves

| Module | Theoremes prouves | `sorry` restants |
|---|---|---|
| `poker_env/Theorems.lean` | 25 | 0 |
| `poker_players/Theorems.lean` | 20+ | 0 |
| **Total** | **45+** | **0** |

Toutes les preuves sont completes. Zero `sorry` (le placeholder de Lean4 pour les preuves inachevees) ne reste dans le code. Combine avec 940 tests unitaires et des millions d'assertions a l'execution, cela fournit une haute confiance dans la correction du moteur.

---

## Chapitre 3 : Resultats experimentaux

### 3.1 La hierarchie des strategies

![Theorie des jeux](/projects/card-game/prisoners_dilemma.svg)
*Les matrices de gain de la theorie des jeux capturent l'interaction strategique. Au poker, nous etendons cela a 10 strategies jouant tous les C(10,2) = 45 appariements possibles. (Image : Wikimedia Commons, CC-BY-SA 4.0)*

Nous avons lance un round-robin complet : 10 strategies, 45 confrontations tete-a-tete, 5 000 mains chacune avec distribution duplicata en No-Limit, Fixed-Limit et Pot-Limit.

![Matrice de dominance](/projects/card-game/dominance_matrix_nl.png)
*Matrice de dominance tete-a-tete (No-Limit). Bleu = le joueur (ligne) profite ; rouge = le joueur perd. EquityPlayer domine chaque adversaire. Notez la quasi-antisymetrie : resultat[A,B] ~ -resultat[B,A].*

La hierarchie est remarquablement coherente entre les structures :

| Rang | Joueur | NL BB/100 | FL BB/100 | PL BB/100 | Type |
|---|---|---|---|---|---|
| 1 | **Equity** | **+255** | **+251** | **+242** | Equite MC |
| 2 | PotOdds | +176 | +179 | +153 | Equite statique |
| 3 | Chen | +97 | +91 | +65 | Heuristique |
| 4 | LAG | +82 | +80 | +56 | Heuristique |
| 5 | TAG | +75 | +68 | +42 | Heuristique |
| 6 | Sklansky | +49 | +61 | +31 | Heuristique |
| 7 | CallingStation | -24 | -24 | -21 | Baseline |
| 8 | Fold | -29 | -29 | -29 | Baseline |
| 9 | Random | -305 | -300 | -219 | Baseline |
| 10 | AllIn | -377 | -377 | -318 | Baseline |

**Transitivite** : 86% des triplets sont transitifs en NL (si A bat B et B bat C, alors A bat C). Les 14% restants montrent des **dynamiques de pierre-papier-ciseaux** -- un joueur bien adapte a un style perd contre un autre.

### 3.2 L'equite bat tout

Le resultat determinant : **EquityPlayer gagne +1 026 BB/100 dans un tournoi No-Limit a 7 joueurs** -- trois fois le deuxieme (TAG a +337).

![Comparaison BB/100](/projects/card-game/bb100_comparison_bar.png)
*BB/100 a travers trois structures de mise. EquityPlayer (bleu-vert) domine toutes les strategies heuristiques. L'avantage est le plus grand en Pot-Limit (+1 325), et non en No-Limit comme initialement prevu.*

Pourquoi le calcul explicite d'equite domine-t-il ?

1. **Precision postflop** : Les joueurs heuristiques n'utilisent que les scores preflop. EquityPlayer recalcule l'equite a chaque rue, s'adaptant au tableau.
2. **Integration des cotes du pot** : La decision call/fold est mathematiquement optimale etant donne l'equite et la taille du pot.
3. **Sensibilite a la structure** : En Pot-Limit, EquityPlayer atteint +1 325 BB/100 -- le plus grand avantage. Le PL offre assez de flexibilite de taille de mise tout en empechant les adversaires de faire des all-in profitables.

Les groupes de Sklansky surpassent Chen dans les tables a 6 joueurs (la conscience positionnelle compte en multijoueur), mais les deux sont eclipses par le jeu base sur l'equite.

### 3.3 La position, c'est le profit

La position au siege cree un avantage structurel. Les joueurs en position tardive agissent en dernier, voyant les actions des adversaires avant de decider.

![Carte thermique des positions](/projects/card-game/position_heatmap_nl.png)
*BB/100 par position (No-Limit). Lignes = strategies de joueurs, colonnes = positions. Vert = profitable, rouge = perdant. Les joueurs competents (Equity, TAG) profitent le plus de la position tardive ; les joueurs faibles perdent partout.*

L'avantage positionnel pour les joueurs competents :

| Joueur | BB/100 EARLY | BB/100 LATE | Avantage |
|---|---|---|---|
| TAG | variable | variable | +14.8 |
| Chen | variable | variable | +48.4 |
| **Equity** | variable | variable | **+28.2** |
| CallingStation | variable | variable | -43.1 |

Point cle : **l'avantage positionnel depend du joueur**, il n'est pas universel. CallingStation a un avantage positionnel *negatif* (perd plus en position tardive car il suit plus de mains). Les joueurs competents exploitent l'avantage informationnel ; les joueurs incompetents ne le peuvent pas.

### 3.4 Effets de la structure de mise

Trois structures creent trois environnements strategiques differents :

| Propriete | No-Limit | Pot-Limit | Fixed-Limit |
|---|---|---|---|
| Mise max | All-in | Taille du pot | Increment fixe |
| Variance | Plus elevee | Moyenne | Plus basse |
| Amplification du skill | Haute | La plus haute | Basse |
| Avantage EquityPlayer | +1 026 | +1 325 | +1 093 |

**No-Limit** amplifie les differences de competence (haute variance, gros pots). **Fixed-Limit** compresse les avantages (CallingStation perd -461 BB/100 en FL vs -618 en NL -- la perte bornee par rue limite les degats). **Pot-Limit** offre le point ideal : assez de flexibilite pour un jeu competent, assez borne pour eviter les confrontations all-in degenerees.

### 3.5 Reduction de variance en pratique

![Convergence de la variance](/projects/card-game/ci_convergence_curves.png)
*Largeur de l'intervalle de confiance a 95% vs nombre de mains. Le duplicata et AIVAT accelerent tous deux la convergence ; combines, ils divisent par deux le nombre de mains necessaires pour la significativite statistique.*

| Methode | Largeur IC (BB/100) | Reduction de variance | Cout computationnel |
|---|---|---|---|
| Independant | 0.99 | baseline | 1x |
| Duplicata | 0.74 | 44% | 2x sessions |
| AIVAT | 0.74 | 45% | 1x + O(n) |
| **Combine** | **0.66** | **56%** | 2x + O(n) |

La distribution duplicata est particulierement efficace pour les **joueurs larges** (LAG : 77-85% de reduction, CallingStation : 45-52%) car leurs ranges larges creent plus de variance dependante des cartes que le duplicata annule.

### 3.6 Modelisation de l'adversaire : classification et adaptation

Peut-on automatiquement detecter le style de jeu d'un adversaire ? Nous avons suivi 7 statistiques (VPIP, PFR, facteur d'agression, 3-bet%, WTSD%, fold-to-3bet, c-bet fold) et entraine des classifieurs sur 550 observations etiquetees.

![Importance des features](/projects/card-game/feature_importance_style.png)
*Importance des features pour la classification de l'adversaire. VPIP (volontairement mis de l'argent dans le pot) et PFR (relance preflop) sont les features les plus discriminantes.*

| Classifieur | Precision |
|---|---|
| **Random Forest** | **91%** |
| KNN (k=5) | 91% |
| Arbre de decision | 90% |
| SVC (rbf) | 65% |

L'archetype **LOOSE_PASSIVE** (CallingStation) est parfaitement classifiable. La distinction la plus difficile est LAG vs TAG : tous deux sont agressifs, ne differant que par la largeur de selection des mains (86% de precision pour LAG).

**Exploitation adaptative** : Un AdaptivePlayer qui classifie les adversaires en ligne, puis selectionne des contre-strategies, atteint **+620 BB/100** -- egalant le pur EquityPlayer.

### 3.7 Reseaux de neurones et apprentissage par renforcement

**Prediction neuronale d'action** : Un MLP entraine sur 342 000 exemples de decisions predit les actions adverses avec **82.4% de precision**. Le NeuralOpponentPlayer resultant atteint **+807 BB/100** -- surpassant le jeu par equite pure en integrant la modelisation de l'adversaire dans les calculs d'EV de bluff.

**Q-learning** : Un agent RL tabulaire entraine a partir de zero connaissance en poker atteint des performances remarquables :

![Entrainement RL](/projects/card-game/rl_bb100_training_curves.png)
*Courbes d'entrainement Q-learning. Le Niveau 2 (abstraction avec conscience des rues) surpasse largement le Niveau 1 (preflop seulement), demontrant que l'information postflop est critique pour un jeu fort.*

| Agent | vs CallingStation | vs TAG |
|---|---|---|
| QL Niveau 1 (preflop) | +286 BB/100 | +16 BB/100 |
| **QL Niveau 2 (avec rues)** | **+928 BB/100** | **+144 BB/100** |

L'agent avec conscience des rues surpasse l'agent preflop-only par 3x contre CallingStation -- la prise de decision postflop est la ou se trouve le vrai argent.

Plus remarquable encore, la politique apprise par l'agent RL **correle avec les groupes de Sklansky** :

![Politique vs Sklansky](/projects/card-game/rl_policy_heatmap_vs_sklansky.png)
*Gauche : la politique apprise par l'agent RL (carte thermique 13x13 preflop, plus lumineux = plus agressif). Droite : les groupes de Sklansky (groupe plus bas = main plus forte). Les patterns s'alignent -- l'agent a independamment redecovert que les paires servies et les connecteurs assortis eleves meritent un jeu agressif.*

L'agent a appris a faire all-in avec les mains premium et coucher les poubelles -- redecouvrant par essai-erreur ce que les theoriciens du poker ont codifie il y a des decennies.

---

## Conclusion

Trois resultats se distinguent :

1. **Le calcul d'equite est roi.** Le calcul explicite d'equite Monte Carlo bat chaque heuristique par un facteur de 3x ou plus. Les scores Chen, les groupes Sklansky et le jeu au jugement sont des approximations utiles, mais ils laissent ~35% de la valeur des mains sur la table. A l'ere du calcul, rien ne remplace le calcul de ses cotes.

2. **La verification formelle fonctionne a grande echelle.** 45+ theoremes Lean4 avec zero `sorry`, 940 tests unitaires et des millions d'assertions a l'execution creent une chaine de verification qui detecte des bugs que les tests traditionnels manquent. L'architecture runtime-axiome-theoreme comble le fosse entre le code Python pratique et la preuve mathematique.

3. **Le RL converge vers la sagesse connue du poker.** Un agent Q-learning partant de zero connaissance decouvre independamment que les paires d'as sont fortes, que la position compte, et que le jeu postflop est la ou les avantages se composent. Quand une machine arrive aux memes conclusions que Sklansky et Chen par pure maximisation de la recompense, cela valide a la fois les systemes heuristiques et l'approche RL.

Les techniques de reduction de variance (duplicata + AIVAT = 56% de reduction) rendent toute cette analyse faisable. Sans elles, atteindre la significativite statistique necessiterait environ le double du budget de calcul.

Que reste-t-il ? Le calcul d'equilibre de Nash complet (au-dela de la portee des methodes tabulaires), le RL plus profond avec approximation de fonction, et la strategie de tournoi multi-tables. Le moteur et l'infrastructure de verification sont prets.

---

*Construit avec Python, NumPy, Plotly, scikit-learn et Lean 4.*
