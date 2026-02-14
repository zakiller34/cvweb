
En 2018, j'ai participé à ce challenge de Recherche Opérationnelle :
https://roadef.org/challenge/2018/en/sujet.php

Je suis heureux d'avoir été classé 6e en tant qu'équipe S6 parmi toutes les équipes de recherche et industrielles. Voici la page des résultats :
https://roadef.org/challenge/2018/en/finalResults.php

## Problème

**Saint-Gobain Glass France** produit du verre plat par le procédé float : des poudres sont fondues, étalées sur un bain d'étain, refroidies en un ruban continu, puis découpées en grandes feuilles appelées **jumbos** (typiquement 3m x 6m). Les jumbos sont redécoupés en pièces rectangulaires plus petites pour les clients. La découpe doit satisfaire des contraintes guillotine (les fissures se propagent de bord à bord) et éviter les défauts repérés par des scanners à la sortie du procédé float.

64 équipes de 24 pays. Deux catégories : 180s (sprint) et 3600s (finale).

### Entrées

- **Item** *i* : pièce de verre à découper, caractérisée par (w_i, h_i)
- **Pile** *s = (i_1, i_2, ..., i_j)* : séquence ordonnée où i_1 doit être découpé avant i_2, etc. (contraintes de planning/livraison)
- **Lot** *I* : tous les items à découper, partitionnés en *n* piles : I = s_1 U s_2 U ... U s_n
- **Bin** *b* : un jumbo de largeur W_b, hauteur H_b, et ensemble de défauts D_b. Les bins sont ordonnés et utilisés séquentiellement. Tous les bins ont la même taille standardisée ; ils ne diffèrent que par leurs défauts
- **Défaut** *d* : tuple (x_d, y_d, w_d, h_d) — position et dimensions sur un bin spécifique

### Découpe guillotine

Une **coupe guillotine** sur une plaque va d'un bord au bord opposé, produisant deux rectangles. C'est obligatoire pour le verre — les coupes non-guillotine produisent des fissures.

![Motifs non-guillotine vs guillotine](/projects/cut-defi-roadef-2018/fig1-guillotine-vs-non.png)
*Fig 1 : (a) Motif non-guillotine — invalide. (b) Motif guillotine — valide. Toutes les coupes vont de bord à bord.*

Un **patron de découpe** est un plan 2D de coupes guillotine sur un bin. Une **alpha-coupe** désigne une coupe guillotine à la profondeur alpha. Le patron ci-dessous est à 3 étages : i1 nécessite 2 coupes, i2 et i3 nécessitent 3 coupes. Les zones hachurées sont des chutes, le point noir est un défaut.

![Patron de découpe avec niveaux de coupe](/projects/cut-defi-roadef-2018/fig2-cutting-pattern.png)
*Fig 2 : (a) Patron initial avec 1-coupe, 2-coupe, 3-coupes et un défaut. (b-d) Coupes progressives révélant les items.*

Un patron de découpe peut être représenté comme un **arbre** : la racine est la plaque, les feuilles sont des items ou des chutes, et les enfants à chaque niveau sont les sous-plaques obtenues après une coupe.

![Représentation en arbre](/projects/cut-defi-roadef-2018/fig3-tree-representation.png)
*Fig 3 : Représentation en arbre du patron de découpe de la Fig 2. Le parcours en profondeur donne l'ordre de découpe : i1, i2, i3.*

### Objectif

Minimiser la perte géométrique. Le reste de verre (résiduel) sur le dernier bin peut être réutilisé. Le résiduel est la chute à droite de la dernière 1-coupe du dernier patron.

Pour une solution réalisable P = {p_1, ..., p_m} avec un résiduel r_m sur le dernier patron p_m :

```
min  H * W * m  -  H * r_m  -  SUM(w_i * h_i)  pour tout i dans I        (1)
```

### Contraintes

**Contraintes items & bins :**

- Seule la rotation à 90 degrés des items est autorisée (horizontal ou vertical)
- Tous les items du lot I doivent être découpés — pas d'omissions
- Pas de surproduction — uniquement les items de I, pas de doublons
- Chaque item appartient à sa pile donnée ; l'affectation aux piles est fixée
- Les items dans chaque pile doivent être découpés dans l'ordre de la séquence (le parcours en profondeur de l'arbre de découpe donne l'ordre)
- Pas d'ordre entre items de piles différentes
- Les bins sont toujours horizontaux (W > H), pas de rotation de bin
- Les bins doivent être utilisés dans l'ordre donné : les patrons p_1,...,p_m utilisent les bins b_1,...,b_m

**Contraintes de patron de découpe :**

- Pas de chevauchement d'items
- Pas de chevauchement d'items avec des défauts — les items doivent être sans défaut
- **Interdit de couper à travers un défaut**
- Coupes guillotine uniquement — chaque coupe va de bord à bord, produisant deux rectangles
- Maximum 3 coupes pour obtenir un item (1,2,3-coupes). Cependant, une **4-coupe (ébarbage)** est autorisée par sous-plaque obtenue après une 3-coupe — uniquement pour séparer un item d'une chute ou deux items, pas pour une subdivision supplémentaire. Les items peuvent aussi être obtenus en moins de 3 coupes.

![Exemples de 4-coupe d'ébarbage](/projects/cut-defi-roadef-2018/fig4-trimming-4cut.png)
*Fig 4 : (a) Valide — une 4-coupe enlève la chute pour obtenir i4. (b) Valide — deux 4-coupes dans des sous-plaques séparées de 3-coupe. (c) Interdit — deux 4-coupes dans la même sous-plaque de 3-coupe.*

- **Les 1-coupes sont toujours verticales**
- Largeur minimum entre 1-coupes consécutives : **100** (sauf chutes)
- Largeur maximum entre 1-coupes consécutives : **3500** (sauf résiduel)
- Chaque patron doit contenir au moins une 1-coupe
- Hauteur minimum entre 2-coupes consécutives : **100** (sauf chutes)
- **Taille minimum des chutes : (20, 20)** — chaque fragment de chute doit faire au moins 20 dans les deux dimensions

---

## Résultat

**Équipe S6 — Zakaria Teffah — Individuel — France**
**6e place sur 64 équipes — 155 points**

---

## Approche de résolution

Le solveur combine des heuristiques constructives, un portefeuille multi-stratégies et une métaheuristique de recuit simulé. Tous les algorithmes respectent le budget de temps imposé par la compétition (180s ou 3600s).

### 1. Heuristique constructive à trois niveaux

L'idée centrale construit une solution **plaque par plaque**, en remplissant chaque plaque à travers 3 niveaux imbriqués de coupes guillotine qui reflètent le processus de découpe physique :

1. **Niveau 1 — bandes verticales** : diviser la plaque en bandes verticales (1-coupes, de gauche à droite). Pour chaque bande, choisir un « item pilote » — l'item qui détermine la largeur de la bande.
2. **Niveau 2 — rangées horizontales** : dans chaque bande, diviser en rangées horizontales (2-coupes, de bas en haut). La hauteur de chaque rangée est déterminée par l'item le plus grand placé dedans.
3. **Niveau 3 — items verticaux** : dans chaque rangée, placer les items côte à côte (3-coupes, de gauche à droite), optionnellement avec une 4-coupe d'ébarbage.

À chaque niveau, l'heuristique doit décider **quel item placer ensuite**. Cela est contrôlé par un critère de score appliqué aux items disponibles dans les piles (en respectant l'ordre FIFO). Plusieurs critères ont été conçus :
- Plus grande dimension d'abord (remplir efficacement les espaces hauts/larges)
- Score basé sur la diagonale (équilibrer largeur et hauteur)
- Somme des dimensions
- Classement par surface

Les défauts sont gérés par **décalage** : quand un item chevaucherait un défaut, il est déplacé au-delà, laissant une chute dans la zone de défaut. Les deux orientations de l'item (originale et rotation à 90 degrés) sont essayées.

Après qu'une plaque est remplie, la dernière plaque est optionnellement **reconstruite** pour améliorer l'objectif — en essayant différents arrangements d'items pour réduire le résiduel.

### 2. Sélection gloutonne par meilleur ratio

Au lieu de s'engager sur le premier item faisable à chaque niveau de coupe, cette stratégie **énumère tous les placements faisables** à un niveau donné et sélectionne celui qui minimise le ratio chute/surface utile.

Cela peut être appliqué à tout niveau de l'arbre de découpe :
- Au niveau 2 (coupes horizontales) : évaluer toutes les compositions de rangées possibles et choisir le meilleur ratio
- Au niveau 3 (coupes verticales) : évaluer tous les placements d'items dans une rangée et choisir le plus ajusté

La sélection gloutonne par ratio réduit significativement les chutes par rapport au placement heuristique simple mais est plus coûteuse en calcul.

### 3. Portefeuille multi-heuristiques

Le solveur principal exécute **plusieurs variantes d'heuristiques constructives** et garde la meilleure solution trouvée. Chaque variante utilise une combinaison différente de :
- Critère de choix d'item (8 variantes)
- Stratégie de niveau de coupe (quels niveaux utilisent le meilleur ratio vs. placement simple)
- Stratégies de sous-listes (quelles piles prioriser)

Cela produit ~24+ configurations distinctes. Les exécuter toutes est abordable car chaque heuristique constructive est rapide (sous-seconde). L'approche portefeuille exploite le fait que différentes configurations heuristiques fonctionnent mieux sur différentes structures d'instances.

### 4. Multi-départ aléatoire

Une variante aléatoire de l'heuristique constructive remplace la sélection déterministe d'items par une **sélection aléatoire** à chaque niveau de coupe. L'exécuter plusieurs fois avec différentes graines aléatoires explore des régions diverses de l'espace de solutions.

Cela agit comme une procédure multi-départ simple : générer beaucoup de solutions faisables aléatoires, garder la meilleure. C'est particulièrement utile quand les heuristiques déterministes restent bloquées dans un motif local.

### 5. Recuit simulé

En partant de la meilleure solution constructive, le recuit simulé (SA) l'améliore itérativement :

- **Mouvements de voisinage** : perturber la solution courante en modifiant les placements d'items — réorganiser les bandes, échanger des items entre rangées, changer l'ordre dans lequel les piles sont consommées. Plusieurs types de voisinage de tailles variées ont été implémentés, des petits changements locaux aux grandes restructurations.
- **Critère d'acceptation** : règle de Metropolis — toujours accepter les améliorations, accepter les dégradations avec probabilité exp(-delta/T) où T est la température.
- **Schéma de refroidissement** : refroidissement géométrique (T = T * 0.99 à chaque étape), en partant d'une haute température pour permettre l'exploration, en figeant progressivement vers une bonne solution.
- **Niveaux d'agressivité** : le SA peut être configuré pour utiliser des redémarrages heuristiques aléatoires (explorer largement), toujours redémarrer de la meilleure solution connue (exploiter localement), ou un mélange.

### 6. Implémentation parallèle en C++

Les heuristiques critiques en temps ont été réimplémentées en C++ avec parallélisme OpenMP. Cela a permis d'exécuter significativement plus d'évaluations heuristiques et d'itérations SA dans le budget de temps de la compétition, ce qui se traduit directement par de meilleures solutions.

La figure ci-dessous montre une solution faisable complète pour une plaque, illustrant comment les items (bleu), les chutes (gris) et les défauts (points rouges) sont arrangés dans les limites de dimensions.

![Limites de dimensions](/projects/cut-defi-roadef-2018/fig5-bounds.png)
*Un patron de découpe faisable pour une plaque. Bandes 1-coupe : 100 <= largeur <= 3500. Rangées 2-coupe : hauteur >= 100. Chutes : >= 20 dans les deux dimensions. Points rouges = défauts, toujours placés dans les zones de chute.*

---

## Références

- [Challenge ROADEF/EURO 2018](https://roadef.org/challenge/2018/en/index.php)
- [PDF de description du problème](https://roadef.org/challenge/2018/files/Challenge_ROADEF_EURO_SG_Description.pdf)
- [Résultats finaux](https://roadef.org/challenge/2018/en/finalResults.php)
