# Estimation de la dérive des glaces de mer : MCC vs CMCC

## Introduction

Suite à ma publication de 2010 avec M. Thomas Lavergne, j'ai décidé de reprendre ce projet et de le coder afin d'en réaliser une étude globale. En effet, cette étude évalue deux méthodes de corrélation croisée pour estimer la dérive des glaces de mer arctiques à partir d'imagerie satellite : la corrélation croisée maximale (MCC, pixel entier discret) et la MCC continue (CMCC, raffinement sous-pixellaire). Suivant la méthodologie de Lavergne et al. (2010, JGR), nous comparons les deux méthodes sur trois configurations de capteurs — micro-ondes passives AMSR2 à 36 GHz et 89 GHz, et diffusiomètre ASCAT en bande C — en progressant d'expériences synthétiques contrôlées au suivi réaliste de trajectoires multi-capteurs sur l'océan Arctique. La validation utilise les traces GPS des bouées dérivantes IABP comme vérité terrain.

## Méthodologie

### Estimation de la dérive

MCC estime le déplacement de la glace en extrayant un patch modèle d'une image de référence et en le faisant glisser sur une zone de recherche dans une image ultérieure. À chaque décalage en pixel entier, la corrélation croisée normalisée (NCC) est calculée. Le déplacement correspond au décalage qui maximise la NCC. Cela limite la résolution à 1 pixel — sur la grille de 12,5 km d'AMSR2, un plancher d'erreur de 12,5 km.

CMCC affine le pic entier de MCC en ajustant une surface d'interpolation cubique au voisinage 7×7 du maximum NCC, puis en appliquant l'optimisation de Nelder-Mead sur la surface continue. Cela récupère la vraie position du pic sous-pixellaire, éliminant le bruit de quantification.

Pour l'estimation multi-canal (JGR Éq. 2), les surfaces NCC individuelles de chaque canal sont sommées avant l'optimisation sous-pixellaire : ρ_total = Σ ρ_c. Cela exploite la texture complémentaire provenant de différentes polarisations ou fréquences.

### Prétraitement

Un filtre Laplacien de Gaussienne (σ ajustable) est appliqué aux champs de température de brillance avant la corrélation. Le filtre agit comme un opérateur passe-haut, rehaussant les bords, les chenaux, les zones de déformation et les limites de types de glace tout en supprimant les gradients à grande échelle. Cela affine les pics NCC, améliorant à la fois l'appariement de caractéristiques MCC et la localisation sous-pixellaire CMCC. Empiriquement, le filtrage laplacien est l'étape de traitement la plus impactante — réduisant le RMSE de 60 % sur données réelles, dépassant largement l'amélioration MCC-vers-CMCC.

### Capteurs

| Capteur | Canal | Fréquence | Taille pixel | Observable | Qualité de texture |
|---|---|---|---|---|---|
| AMSR2 | 36H | 36,5 GHz | 12,5 km | Température de brillance (Tb) | Faible — lisse, pénétration profonde |
| AMSR2 | 89H | 89,0 GHz | 12,5 km | Température de brillance (Tb) | Modérée — rugosité de surface |
| AMSR2 | 89V | 89,0 GHz | 12,5 km | Température de brillance (Tb) | Modérée-élevée — gradients d'émissivité |
| ASCAT | σ0 | 5,255 GHz (bande C) | 12,5 km | Coefficient de rétrodiffusion | Faible — texture de glace faible |

Tous les canaux sont sur la grille stéréographique polaire NSIDC de 12,5 km (produit AU_SI12). La résolution native d'AMSR2 à 89 GHz (~5 km) est dégradée par ce rééchantillonnage — un facteur significatif dans l'écart par rapport à la précision de niveau JGR.

### Validation

La vérité terrain provient des bouées dérivantes suivies par GPS de l'IABP (International Arctic Buoy Programme) déployées à travers l'Arctique. Les positions des bouées sont interpolées aux temps d'acquisition des images satellites et projetées sur la grille stéréographique polaire NSIDC. Le déplacement observé de chaque bouée est comparé au vecteur de dérive estimé le plus proche. Des filtres de qualité éliminent les appariements peu fiables : corrélation NCC < 0,5 (mauvais appariement), atteinte des bords du rayon de recherche (déplacement à la limite de la zone de recherche) et contraintes de proximité spatiale. Après filtrage, il reste typiquement 28 à 40 bouées par paire d'images (sur ~70 bouées arctiques brutes).

Métriques : le RMSE et le MAE mesurent l'erreur de magnitude du déplacement en km. L'erreur de direction mesure la déviation angulaire. L'erreur de position finale (FPE) mesure la précision du point d'arrivée après un suivi lagrangien multi-étapes.

---

## Validation synthétique

Les expériences synthétiques utilisent des images de bruit blanc filtré par Gaussienne avec des déplacements sous-pixellaires connus, isolant la précision intrinsèque de l'algorithme de la qualité des données.

### Précision sur une paire (Scénario A)

Un balayage 2D de déplacement sur [0, 2] × [0, 2] px (pas de 0,1, 441 points de test) révèle la structure d'erreur fondamentale de chaque méthode :

| Métrique | MCC | CMCC |
|---|---|---|
| RMSE | 0,40 px | 0,012 px |
| Ratio | — | **33× meilleur** |
| Seuil (< 0,1 px) | ÉCHEC | **RÉUSSI** (marge 7,5×) |

L'erreur de MCC suit un motif en damier (gauche) : maximum aux déplacements demi-pixel (~0,7 px), zéro aux entiers. C'est un bruit de quantification irréductible — une propriété de la recherche discrète, indépendante du RSB ou de la taille du modèle. CMCC (droite) montre une erreur uniformément faible (~0,01 px) quel que soit le déplacement.

![Cartes d'erreur — damier MCC vs CMCC uniforme](/projects/sea-ice-drift/fig_A_error_heatmaps.png)

À la résolution AMSR2 (12,5 km/px) : plancher de quantification MCC = 5,0 km ; précision CMCC = 150 m.

### Accumulation d'erreur sur les trajectoires (Scénario B)

Le suivi d'un point sur 15 étapes à vitesse constante (1,3 ; 0,7) px/étape révèle des croissances d'erreur fondamentalement différentes :

| Métrique | MCC | CMCC |
|---|---|---|
| Erreur de position finale | 6,36 px | 0,026 px |
| Ratio | — | **248×** |
| Modèle de croissance | linéaire (0,42 px/étape) | √N (0,004 px/√étape) |
| Physique (AMSR2, 30 jours) | 79,5 km | 0,3 km |

Le biais de quantification systématique de MCC se compose linéairement — la même erreur d'arrondi à chaque étape. Les erreurs aléatoires de moyenne nulle de CMCC suivent une marche aléatoire (croissance en √N). Sur 15 étapes, cette différence s'amplifie de 33× (paire unique) à 248×.

![Croissance de l'erreur — linéaire (MCC) vs √N (CMCC)](/projects/sea-ice-drift/fig_B_error_growth.png)

**Implication physique :** Pour un suivi arctique de 30 jours à cadence de 48h (15 paires), MCC accumule ~80 km d'erreur de position par la seule quantification. CMCC maintient cette contribution en dessous de 0,3 km. Cela rend CMCC essentiel pour les produits de trajectoires lagrangiennes — mais seulement si le capteur fournit une texture suffisante pour un ajustement sous-pixellaire fiable.

---

## Données réelles mono-capteur (AMSR2 36 GHz)

### Validation sur deux images (Scénario C)

Appliqué à AMSR2 36,5 GHz en polarisation horizontale (15-17 nov. 2016, base temporelle de 48h), validé contre 37-38 bouées IABP :

| Métrique | MCC | CMCC | Réf. JGR (85 GHz) |
|---|---|---|---|
| RMSE | 15,4 km | 14,6 km | 2,5 km |
| MAE | 10,9 km | 10,5 km | — |
| Erreur de direction | 15,7° | 32,9° | — |
| Amélioration | — | **+5 %** | +40 % |

Le filtre laplacien domine tous les autres facteurs. La température de brillance brute donne un RMSE de 37 km ; le laplacien σ=1,0 réduit cela à 15 km — une **amélioration de 60 %**. Le gain MCC-vers-CMCC n'est que de 5 %, bien en dessous des 40 % rapportés par JGR à 85 GHz.

![Température de brillance AMSR2 36H brute vs filtrée par Laplacien](/projects/sea-ice-drift/fig_C_raw_vs_laplace.png)

La comparaison en quatre panneaux des champs de dérive révèle la différence qualitative : les vecteurs MCC sont quantifiés et anguleux ; CMCC avec Laplacien produit des motifs lisses, physiquement cohérents avec des zones de cisaillement visibles.

![Champs de dérive — MCC/CMCC × brut/Laplacien](/projects/sea-ice-drift/fig_C_drift_fields.png)

**Paradoxe de l'erreur de direction :** CMCC atteint un RMSE de magnitude plus faible (14,6 vs 15,4 km) mais une erreur de direction *pire* (33° vs 16°). Aux petits déplacements (~1,65 px en moyenne), des corrections sous-pixellaires de ~0,2 px peuvent faire pivoter significativement le vecteur de déplacement tout en changeant à peine sa magnitude. Ce paradoxe se résoudrait à des fréquences plus élevées où les déplacements sont plus grands par rapport aux corrections sous-pixellaires.

**Pourquoi l'amélioration CMCC est marginale à 36 GHz :** Le canal 36,5 GHz pénètre profondément dans le volume neige/glace, produisant des champs Tb lisses avec un faible contraste de texture spatiale. Les pics NCC sont larges et arrondis, laissant la surface d'interpolation cubique mal contrainte pour la localisation sous-pixellaire. La correction sous-pixellaire moyenne n'est que de ~0,2 px — minimale comparée à l'erreur géophysique de ~50 km par étape.

### Trajectoires sur un mois (Scénario D)

Étendu au 1-29 nov. 2016 (14 paires, cadence 48h), suivi de 67 bouées sur 28 jours :

| Métrique | MCC | CMCC |
|---|---|---|
| FPE moyen | 94,2 km | 98,1 km |
| Ratio MCC/CMCC | — | **1,0×** |

L'avantage synthétique de 248× **disparaît complètement**. Les deux méthodes sont identiques sur les données réelles à 36 GHz. Le ratio d'erreur reste à 1,0 tout au long de la période de 28 jours.

![Croissance de l'erreur sur 28 jours — MCC et CMCC indiscernables](/projects/sea-ice-drift/fig_D_error_growth.png)

**Cause principale :** Le bruit géophysique (~50 km par étape) est 8× plus grand que le biais de quantification de MCC (~6 km). La déformation de la glace, l'ouverture de chenaux, la contamination atmosphérique et la décorrélation du modèle dominent le budget d'erreur. Le raffinement sous-pixellaire de CMCC corrige une source de bruit négligeable comparée à ces facteurs réels à 36 GHz.

---

## Résultats multi-canaux et multi-capteurs

### Multi-canal 89 GHz (Scénario E)

Passage à AMSR2 89 GHz polarisation H+V (mêmes dates, mêmes bouées) avec sommation NCC multi-canal :

| Méthode | RMSE (km) | N bouées |
|---|---|---|
| 36H CMCC (référence) | 15,03 | 38 |
| 89V CMCC (meilleur mono) | 12,12 | 29 |
| **Multi CMCC (89H+89V)** | **11,55** | **29** |

**89 GHz améliore le RMSE de 23 % par rapport à 36 GHz** — la plus grande amélioration depuis le filtre laplacien. Malgré le rééchantillonnage AU_SI12 dégradant la résolution native 89 GHz de ~5 km à 12,5 km, suffisamment de texture de surface (gradients d'émissivité aux frontières de types de glace, signatures de chenaux) survit pour produire des pics NCC plus nets.

89V surpasse 89H : les gradients d'émissivité en polarisation verticale aux frontières de types de glace (première année/pluriannuelle, glace/eau) créent une texture spatiale plus forte que les signatures de rugosité en polarisation horizontale.

La fusion multi-canal ajoute un modeste +4,7 % supplémentaire. Le gain est limité car les canaux H et V du même passage et de la même fréquence partagent un bruit partiellement corrélé — l'amélioration √2 du RSB attendue de canaux parfaitement indépendants n'est pas atteinte.

![Comparaison RMSE — toutes les méthodes avec ligne de référence JGR](/projects/sea-ice-drift/fig_E_rmse_comparison.png)

### Fusion multi-capteurs avec ASCAT (Scénario F)

Ajout du diffusiomètre ASCAT bande C au suivi multi-canal AMSR2 sur 28 jours :

| Configuration | RMSE étape 1 (km) | FPE moyen (km) | FPE médian (km) |
|---|---|---|---|
| **AMSR2 multi-ch** | **27,8** | **167,5** | **74,0** |
| Fusionné (poids égal) | 31,8 | 258,6 | 221,2 |
| ASCAT seul | 36,6 | 389,2 | 405,6 |

**La fusion à poids égal dégrade la précision de 14 %.** La rétrodiffusion bande C d'ASCAT fournit une texture de glace de mer insuffisante pour un appariement NCC fiable — les champs de dérive sont spatialement incohérents avec une divergence moyenne 50 % plus élevée qu'AMSR2 seul. Moyenner ces estimations médiocres avec les vecteurs AMSR2 de haute qualité dilue systématiquement la précision.

![Croissance de l'erreur — AMSR2 systématiquement meilleur que fusionné ou ASCAT seul](/projects/sea-ice-drift/fig_F_error_growth.png)

La configuration multi-canal AMSR2 seul à 89 GHz atteint une amélioration de +46 % par rapport à la référence 36 GHz (27,8 vs 52 km RMSE par étape), confirmant que **la fréquence du canal et la qualité de la texture comptent plus que le nombre de capteurs**.

---

## Conclusions

| Scénario | Capteur | Meilleure méthode | RMSE | Résultat clé |
|---|---|---|---|---|
| A | Synthétique | CMCC | 0,012 px | 33× meilleur que MCC |
| B | Synthétique | CMCC | 0,026 px FPE | 248× meilleur, √N vs linéaire |
| C | AMSR2 36H | CMCC Laplacien | 14,6 km | Seulement +5 % |
| D | AMSR2 36H (28j) | — | ~95 km FPE | Pas d'avantage CMCC |
| E | AMSR2 89H+89V | Multi CMCC | 11,55 km | +23 % vs 36 GHz |
| F | AMSR2+ASCAT (28j) | AMSR2 multi-ch | 27,8 km/étape | La fusion nuit |

### Résultats clés

1. **CMCC élimine le bruit de quantification.** Sur données synthétiques, CMCC atteint une précision 33× meilleure par paire (0,012 vs 0,40 px) et une précision de trajectoire 248× meilleure sur 15 étapes. La croissance de l'erreur suit √N (marche aléatoire) au lieu de l'accumulation linéaire de MCC. À la résolution AMSR2, cela se traduit par 0,3 km vs 79,5 km sur 30 jours.

2. **L'avantage CMCC en données réelles dépend de la netteté du pic NCC.** À 36 GHz, des pics NCC larges issus de champs Tb lisses ne donnent que +5 % d'amélioration. À 89 GHz, des pics plus nets grâce à une texture de surface plus riche donnent +23 %. Le raffinement sous-pixellaire n'est aussi bon que la surface de corrélation qu'il optimise.

3. **Le préfiltrage laplacien est la plus grande amélioration.** Un filtre Laplacien de Gaussienne (σ=1,0) réduit le RMSE de 60 % sur données réelles (37 → 15 km) — dépassant largement les gains MCC→CMCC. Il rehausse les bords, les chenaux et les structures de déformation qui déterminent la qualité des pics NCC. Un lissage excessif (σ > 1,5) détruit la texture et dégrade les performances.

4. **89 GHz fournit substantiellement plus de texture que 36 GHz.** L'amélioration de 23 % du RMSE de 36→89 GHz est le facteur le plus important après le filtrage laplacien. 89 GHz est plus sensible aux propriétés de surface (frontières de types de glace, structure des grains de neige, chenaux) que 36 GHz, qui pénètre plus profondément et moyenne sur le volume neige/glace.

5. **La fusion multi-capteurs à poids égal est contre-productive quand la qualité des capteurs est asymétrique.** Ajouter le σ0 ASCAT à AMSR2 par moyennage à poids égal dégrade la précision de 14 %. La rétrodiffusion bande C d'ASCAT manque de texture de glace de mer suffisante pour un appariement NCC fiable. Une fusion efficace nécessite une pondération par corrélation ou une fusion conditionnelle — utilisant chaque capteur uniquement là où il fournit une information fiable.

6. **Écart par rapport à la référence JGR : 4,6-11×.** Nos meilleurs résultats (11,55 km par paire, 27,8 km/étape en trajectoire) sont 4,6 à 11× moins bons que le σ de 2,5 km rapporté par JGR. La cause principale est le rééchantillonnage AU_SI12 : la résolution native d'AMSR2 à 89 GHz (~5 km) est dégradée à 12,5 km lors de la génération du produit. L'algorithme est correct et validé ; la résolution des données d'entrée est le goulot d'étranglement. Un traitement au niveau des fauchées (L1) comblerait cet écart.

7. **Paradoxe de l'erreur de direction.** CMCC améliore systématiquement le RMSE de magnitude mais dégrade l'erreur de direction (33° vs 16° à 36 GHz). Aux petits déplacements (~1-2 px), des corrections sous-pixellaires de ~0,2 px peuvent faire pivoter le vecteur de déplacement de 10 à 20° tout en changeant à peine sa magnitude. C'est un compromis fondamental dépendant de l'échelle qui s'atténue avec des déplacements plus grands ou une imagerie de plus haute résolution.
