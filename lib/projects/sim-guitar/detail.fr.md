Simulation physique d'une guitare acoustique — du pincement de corde au son rayonné.

## Chaîne de simulation

Trois domaines physiques couplés simulent le trajet acoustique complet : une **corde 1D** (EF mixtes vitesse/contrainte, avance temporelle leapfrog) transmet la force au chevalet vers une **table d'harmonie 2D** (plaque de Kirchhoff-Love, décomposition modale), dont la vitesse normale excite l'**air 3D** environnant (équations d'Euler linéarisées sur grille de Yee décalée avec couches PML absorbantes). Tous les domaines sont couplés à chaque pas de temps via un complément de Schur imposant la continuité des vitesses et l'équilibre des forces. Le système couplé conserve un invariant d'énergie discret (modulo amortissement et absorption PML).

<audio controls src="/projects/sim-guitar/mi6_pluck.mp3">
  Mi6 pluck (4 s)
</audio>

*Corde de Mi grave (fondamentale 82 Hz), 4 secondes, 216k pas de temps.*

---

## Résultats

### Maillage de la guitare

Le corps de la guitare est un maillage surfacique 3D fermé (table + fond + éclisses) importé depuis un fichier Gmsh `.geo` — 670 nœuds, 1326 triangles.

![Corps 3D de la guitare — vues perspective, côté, dessus](/projects/sim-guitar/prestep_06_1_fig01.png)

### Modes de la table d'harmonie

Résolution modale de Kirchhoff-Love sur le maillage de la table (424 nœuds, bord encastré, rosace libre). 50 modes calculés de 73 Hz à 1049 Hz. Les 6 premiers modes montrent une complexité croissante des lignes nodales avec la fréquence.

![6 premiers modes propres](/projects/sim-guitar/soundboard_modes.png)

### Rayonnement acoustique

Champ de pression calculé sur une grille de Yee 3D. Les fronts d'onde rayonnent depuis la table et se propagent vers l'extérieur ; les PML absorbent aux limites du domaine.

![Coupes XZ du champ de pression](/projects/sim-guitar/step_06b_fig05.png)

### Admittance au chevalet

Admittance impulsionnelle Y(f) = V/F au chevalet, comparant la plaque dans le vide et couplée à la cavité d'air. Le mode A0 de Helmholtz émerge à 97 Hz (absent dans le vide) ; le mode T1 se décale de 180 à 215 Hz sous l'effet de la masse d'air.

![Admittance au chevalet — vide vs couplé](/projects/sim-guitar/step_07a_fig01.png)

### Mode de respiration

Zoom sur l'interaction plaque-cavité près du mode (4,4) de la plaque à 661 Hz. L'amortissement par rayonnement domine : le système couplé dissipe plus d'énergie par rayonnement acoustique que la cavité n'en renforce, réduisant le facteur de qualité.

![Zoom admittance 600-750 Hz](/projects/sim-guitar/step_07b_fig03.png)

### Pincement Mi6 — 4 secondes

Simulation étendue d'un pincement de corde de Mi grave : 4,0 s de temps physique, 216k pas de temps. Harmoniques à n × 82 Hz ; les harmoniques élevées décroissent plus vite par amortissement visqueux et structural.

![Forme d'onde et FFT](/projects/sim-guitar/step_07c_fig01.png)

![Spectrogramme](/projects/sim-guitar/step_07c_fig02.png)

---

## Méthodes

### Équations aux dérivées partielles

- **Corde 1D** — Équation d'onde mixte vitesse/contrainte avec élasticité linéaire et amortissement localisé. La vitesse v(x,t) et le taux de contrainte q(x,t) évoluent sur une grille décalée.
- **Table 2D** — Équation de plaque de Kirchhoff-Love d'ordre quatre avec propriétés orthotropes. Déplacement w, tenseur des moments M, tenseur de souplesse liant rigidité de flexion et courbure.
- **Air 3D** — Équations d'Euler linéarisées pour la vitesse acoustique **v** et la pression p, avec couche PML absorbante aux limites du domaine.

### Schémas numériques

- **Éléments finis P1** pour la discrétisation spatiale de la corde et de la plaque ; **leapfrog de Yee décalé** (Q0 pression / RT0 vitesse) pour l'air.
- **Projection modale** : résolution modale de la plaque effectuée une fois, puis intégration temporelle en coordonnées modales réduites via noyaux résolvants (exact, pas de contrainte CFL sur la plaque).
- **Couplage par complément de Schur** : résolution implicite multi-domaine à chaque pas de temps — force au chevalet + multiplicateur de Lagrange plaque-air résolus simultanément.
- **Méthode de domaine fictif** : surface 2D de la plaque immergée dans la grille 3D d'air, couplée via intégrales de surface (intersection triangle-cube, évaluation des bases P1 × RT0).
- **PML** (perfectly matched layers) absorbe les ondes acoustiques sortantes aux limites du domaine.

### Bibliothèques

Python, NumPy, SciPy, GetFEM (assemblage EF + résolution modale), Gmsh (génération de maillage), Matplotlib.
