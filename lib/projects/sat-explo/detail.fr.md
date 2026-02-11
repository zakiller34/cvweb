## Synchronisation et Inter-calibration Satellite vs In-situ

**Hypotheses :** Les mesures altimetriques satellitaires sont affectees par un bruit de 10 a 30 cm (contamination des berges, erreurs residuelles de geoide) et un echantillonnage temporel de ~20 jours. L'appariement par plus proche voisin (tolerance ±1 jour) preserve l'integrite physique de la mesure in-situ et evite les artefacts d'interpolation lors des crues rapides. Le bruit gaussien est une simplification ; les erreurs altimetriques reelles suivent des distributions a queues lourdes.

**Methode :** Generation d'une riviere synthetique avec cycle hydrologique annuel (sinusoidal, periode 365 j). In-situ : 730 mesures journalieres, bruit sigma = 0.02 m. Satellite : 36 mesures a ~20 jours, bruit sigma = 0.15 m, biais geoide +0.30 m. Appariement temporel par plus proche voisin (pd.merge_asof, tolerance 1 jour). Analyse metrologique : biais systematique, RMSE, correlation de Pearson.

**Resultats :**
- Appariement : 36/36 passes associees
- Biais systematique : **+0.281 m**
- RMSE : **0.323 m**
- Correlation de Pearson R : **0.9959** (p = 3.95e-37)

![Serie temporelle satellite vs in-situ et residus](/projects/sat-explo/validation-fig1.png)
*Fig. 1 — Comparaison altimetrie satellite vs stations in-situ. Haut : hauteurs d'eau in-situ (journalier) et satellite (~20 j) avec barres d'erreur. Bas : residus satellite - in-situ avec biais moyen +0.281 m.*

![Regression satellite vs verite terrain](/projects/sat-explo/validation-fig2.png)
*Fig. 2 — Scatter de regression satellite vs in-situ. R = 0.9959, RMSE = 0.323 m, biais = +0.281 m. La droite 1:1 (grise) montre le decalage systematique du au geoide.*

---

## Detection d'Anomalies et Filtrage par Kalman

**Hypotheses :** Les mesures altimetriques sont contaminees par l'effet de hooking (reflexions des berges), les multi-echos de la vegetation riparienne et les surfaces mixtes eau/terre. Le seuil Z-score tau = 2.5 est un compromis empirique entre sensibilite et specificite. Le modele de marche aleatoire du filtre de Kalman (x(k) = x(k-1) + bruit) est une simplification qui ne capture pas la physique de l'ecoulement.

**Methode :** Injection de ~10 % d'outliers (70 % positifs depuis les berges, 30 % negatifs depuis les reflexions speculaires, amplitude 1000.5 m). Detection Z-score glissant (fenetre = 5, seuil = 2.5). Filtre de Kalman 1D avec bruit de mesure R = (incertitude theorique)^2 et bruit de processus Q = 0.02. Comparaison des performances a 3 etapes : brut, post Z-score, post Kalman.

**Resultats :**
- Outliers injectes : 3/36 (8 %)
- Detection Z-score : 0 vrais positifs, 3 faux negatifs (seuil trop conservateur)
- RMSE brut : **413.9 m**
- RMSE post Z-score : **413.9 m** (amelioration +0.0 %)
- RMSE post Kalman : **263.5 m** (amelioration **+36.3 %**)

![Detection d'anomalies par Z-score](/projects/sat-explo/anomalies-fig1.png)
*Fig. 3 — Serie temporelle avec points valides (bleu) et outliers (croix rouges). Les spikes a ±1000 m sont visibles mais le Z-score glissant ne les detecte pas.*

![Pipeline de filtrage Z-score + Kalman](/projects/sat-explo/anomalies-fig2.png)
*Fig. 4 — Pipeline complet : verite terrain in-situ (bleu), satellite brut (gris), outliers rejetes (croix rouges), filtre de Kalman (vert) avec intervalle de confiance 95 %. Le Kalman reduit le RMSE de 36.3 %.*

---

## Suivi de la Largeur des Rivieres par Imagerie SAR Sentinel-1

**Hypotheses :** L'eau presente une retrodiffusion tres faible (sigma0 ~ -18 a -25 dB, reflexion speculaire) contre la terre (-3 a -8 dB, diffusion de volume), ce qui permet une detection automatique. Le chatoiement (speckle) suit une distribution Gamma avec L ~ 4.4 vues pour Sentinel-1 GRD IW. Le seuillage d'Otsu suppose un histogramme bimodal. La transformee de distance suppose une geometrie convexe pour la mesure de largeur.

**Methode :** Simulation d'une scene SAR 512x512 pixels avec riviere sinueuse (amplitude = 80 px, longueur d'onde = 200 px, largeur moyenne = 30 px). Speckle multiplicatif Gamma(4.4, 1/4.4). Filtre de Lee adaptatif (fenetre = 7). Seuillage d'Otsu + operations morphologiques (ouverture/fermeture, disque rayon = 5). Squelettisation (Zhang-Suen) + transformee de distance pour la largeur. MCC (Maximum Cross-Correlation) pour la detection de deplacement entre deux dates.

**Resultats :**
- Image : 512x512, dynamique dB : [-30.0, 1.7]
- Surface en eau : **6.0 %**
- Seuil d'Otsu : **-11.3 dB**
- Pixels eau detectes : **14 259** (5.4 % apres nettoyage morphologique)
- Largeur moyenne : **15.8 px** (ecart-type : 5.2 px)
- Deplacement impose : dx = 3, dy = 7 px
- Deplacement detecte par MCC : dx = 11, dy = -13 px (correlation max : 0.014 — echec sur donnees synthetiques)

![Simulation SAR : verite terrain, intensite lineaire, intensite dB](/projects/sat-explo/sar-fig1.png)
*Fig. 5 — Simulation SAR Sentinel-1. Gauche : masque verite terrain. Centre : intensite lineaire. Droite : intensite en dB. La riviere sinueuse est nettement visible en dB.*

![Comparaison avant/apres filtre de Lee](/projects/sat-explo/sar-fig2.png)
*Fig. 6 — Reduction du speckle par filtre de Lee adaptatif. Gauche : SAR brute en dB. Droite : apres filtrage. Les contours de la riviere sont plus nets.*

![Seuillage d'Otsu et masque eau](/projects/sat-explo/sar-fig3.png)
*Fig. 7 — Gauche : histogramme SAR filtree avec seuil d'Otsu a -11.3 dB. Droite : masque eau superpose sur l'image filtree.*

![Squelettisation et profil de largeur](/projects/sat-explo/sar-fig4.png)
*Fig. 8 — Gauche : squelette de la riviere (rouge) sur le masque eau. Droite : profil de largeur le long de la riviere (moyenne = 15.8 px, ±1 sigma = 5.2 px).*

![Carte MCC de correlation croisee](/projects/sat-explo/sar-fig5.png)
*Fig. 9 — Detection de deplacement par MCC. Gauche/Centre : deux dates SAR filtrees. Droite : carte de correlation avec pic detecte.*

---

## Stations Virtuelles par Fusion et Krigeage

**Hypotheses :** Le biais de geoide entre references ellipsoidale (satellite) et locale (in-situ) peut etre estime par co-localisation spatio-temporelle (mediane des differences). Le Krigeage Universel avec derive lineaire regionale capture le gradient hydraulique aval. La courbe de tarage suit une loi puissance Q = a(H - H0)^b avec contraintes a > 0, b > 0, H0 < min(H). Le bruit gaussien et la saisonnalite sinusoidale sont des simplifications.

**Methode :** Simulation d'une riviere de 100 km avec 8 stations in-situ (journalier, bruit 0.02 m) et 4 traces satellite (cycle 27 jours, bruit 0.20 m, biais geoide +0.45 m). Gradient hydraulique 5e-4 m/m. Correction de biais par co-localisation (tolerance spatiale 10 km, temporelle 3 jours). Krigeage Universel avec variogramme lineaire. Calage de la courbe de tarage par L-BFGS-B. Validation : NSE et KGE.

**Resultats :**
- Reseau : 8 stations in-situ, 4 traces satellite, 365 jours
- Biais geoide injecte : +0.45 m
- Courbe de tarage calee : Q = 11.5(H - 124.0)^1.90 (vraie : Q = 15.0(H - 124.2)^1.8)
- **NSE = 0.674**, **KGE = 0.738**

![Reseau hydrometrique et chroniques temporelles](/projects/sat-explo/stations-virtuelles-fig1.png)
*Fig. 10 — Gauche : reseau de stations in-situ (triangles bleus), traces satellite (etoiles oranges) et station virtuelle cible (croix rouge). Droite : chroniques temporelles montrant le biais geoide visible entre satellite et in-situ.*

![Prediction par Krigeage Universel](/projects/sat-explo/stations-virtuelles-fig2.png)
*Fig. 11 — Prediction de hauteur d'eau a la station virtuelle par Krigeage Universel (orange) vs verite terrain (bleu) avec intervalle de confiance ±2 sigma.*

![Courbe de tarage calee](/projects/sat-explo/stations-virtuelles-fig3.png)
*Fig. 12 — Courbe de tarage : observations (points bleus), courbe calee Q = 11.5(H - 124.0)^1.90 (orange) vs courbe vraie Q = 15.0(H - 124.2)^1.8 (tirets gris).*

![Validation du debit predit vs observe](/projects/sat-explo/stations-virtuelles-fig4.png)
*Fig. 13 — Gauche : debit predit (tirets orange) vs verite (bleu). Droite : scatter observe vs predit avec NSE = 0.674 et KGE = 0.738.*

---

## Analyse de Stabilite et Entropie du Signal Radar

**Hypotheses :** L'eau libre produit une reflexion speculaire (echo etroit, sigma ~ 2-4 bins, fort SNR). La terre produit un echo diffus (sigma ~ 15-25 bins, faible amplitude). Les surfaces mixtes superposent deux echos. L'entropie de Shannon, le PNR et le kurtosis sont des descripteurs suffisants pour classifier ces 3 types de surface. K-means suppose des clusters spheriques de taille comparable.

**Methode :** Simulation de 600 waveforms (200 par classe, 128 bins chacune) avec variabilite intra-classe. Calcul de 3 indicateurs : entropie de Shannon (H = -somme p_i log2 p_i), PNR (max / moyenne des 10 premiers bins), kurtosis en exces (Fisher). K-means (k = 3) sur features normalisees (StandardScaler). Alignement des labels par vote majoritaire.

**Resultats :**
- Entropie : Eau libre = **5.513 bits**, Mixte = **6.320 bits**, Terre = **6.753 bits**
- PNR : Eau [2.80, 80.08], Mixte [~10, ~40], Terre [~3, ~20]
- Kurtosis : Eau [5, 20], Mixte [0, 10], Terre [-1.36, 5]
- Inertie K-means : 388.4
- Precision apres alignement : **96.7 %** (Eau 95.0 %, Mixte 95.0 %, Terre 100.0 %)

![Waveforms typiques des 3 types de surface](/projects/sat-explo/entropie-fig1.png)
*Fig. 14 — Waveforms altimetriques typiques. Eau libre (bleu) : pic etroit et fort. Mixte/Bordure (orange) : double pic. Terre (vert) : echo large et faible.*

![Separation des classes par indicateurs statistiques](/projects/sat-explo/entropie-fig2.png)
*Fig. 15 — Boxplots des 3 indicateurs (Entropie, PNR, Kurtosis) par type de surface. Separation nette entre les classes.*

![Espace des features 3D — classes vraies](/projects/sat-explo/entropie-fig3.png)
*Fig. 16 — Scatter 3D colore par classe vraie dans l'espace (Entropie, PNR, Kurtosis).*

![Espace des features 3D — clusters K-means](/projects/sat-explo/entropie-fig4.png)
*Fig. 17 — Scatter 3D colore par clusters K-means alignes. Bonne correspondance avec les classes vraies.*

![Matrice de confusion K-means vs verite](/projects/sat-explo/entropie-fig5.png)
*Fig. 18 — Matrice de confusion : 190/200 pour Eau, 190/200 pour Mixte, 200/200 pour Terre. Precision globale = 96.7 %.*

---

## Retracking : OCOG, Threshold et Modele de Brown

**Hypotheses :** Le modele de Brown (1977) decrit la waveform pour une surface uniforme. Le retracker a seuil 50 % avec interpolation spline donne une precision sub-bin. Le modele de Brown suppose une surface isotrope et homogene (type ocean), hypothese forte pour les eaux continentales avec echos multi-pics. Corrections atmospheriques simplifiees (valeurs fixes) au lieu de corrections ECMWF reelles.

**Methode :** Simulation de waveforms Brown avec parametres : epoch, sigma (pente du front montant), amplitude, alpha (decroissance du bord de fuite), bruit thermique. Retracker OCOG : centre de gravite de W^2, amplitude depuis W^4/W^2. Retracker a seuil 50 % et 80 % avec interpolation spline cubique sub-bin. Chaine de conversion epoch → range → hauteur. Ajustement moindres carres du modele de Brown (Levenberg-Marquardt). Benchmark sur 100 waveforms aleatoires.

**Resultats :**
- Constantes : espacement porte = 0.4684 m, espacement bin = 3.125 ns, fenetre totale = 60.0 m
- OCOG : Amplitude = 0.889, Largeur = 75.3 bins, COG = 84.69 bins (vs epoch vraie 50.0 — OCOG inadapte aux pics etroits)
- Threshold 50 % : epoch = 49.948 bins, erreur = **0.024 m**
- Threshold 80 % : epoch = 52.223 bins, erreur = **1.041 m**
- Brown fit : epoch = 50.02 ± 0.09 bins, RMSE fit = **0.028**
- Chaine epoch → hauteur : 49.948 bins → 156.1 ns → range brut 23.40 m → corrections atmo +2.47 m → hauteur surface 813 974.1 m
- **Benchmark 100 waveforms** : Threshold 50 % RMSE = **1.846 m** ; Brown Fit RMSE = **0.064 m** (28x meilleur)

![Waveform annotee — modele de Brown](/projects/sat-explo/retracker-fig1.png)
*Fig. 19 — Waveform altimetrique simulee (modele de Brown). Annotations : front montant (leading edge), bord de fuite (trailing edge), fenetre de bruit thermique, epoch vraie = 50.0 bins.*

![Analyse OCOG](/projects/sat-explo/retracker-fig2.png)
*Fig. 20 — Resultat OCOG : centre de gravite, amplitude et largeur estimees. Le COG (84.7 bins) est tres eloigne de l'epoch vraie (50.0 bins) car l'OCOG est inadapte aux pics etroits.*

![Retracking par seuil 50 % et 80 %](/projects/sat-explo/retracker-fig3.png)
*Fig. 21 — Retracking par seuil avec interpolation spline. Le seuil 50 % (epoch = 49.95) est proche de la verite ; le seuil 80 % (epoch = 52.22) surestime.*

![Ajustement moindres carres du modele de Brown](/projects/sat-explo/retracker-fig4.png)
*Fig. 22 — Haut : donnees (points) et fit Brown (courbe orange), epoch vraie (rouge) et estimee (jaune). Bas : residus (RMSE = 0.028).*

![Benchmark Threshold 50 % vs Brown Fit sur 100 waveforms](/projects/sat-explo/retracker-fig5.png)
*Fig. 23 — Scatter epoch estimee vs vraie. Gauche : Threshold 50 % (RMSE = 1.85 m). Droite : Brown Fit (RMSE = 0.064 m). Le modele de Brown est 28 fois plus precis.*

---

## Inter-calibration et Homogeneisation Multi-Satellites

**Hypotheses :** Differentes missions altimetriques possedent des biais systematiques lies aux systemes de reference, a la frequence radar et a la geometrie d'observation. Aux points de croisement (crossovers), la difference de hauteur revele le biais inter-mission. Le biais est suppose constant (pas de derive temporelle ou spatiale). Le budget d'erreur suit une composition RSS ; les poids de fusion optimaux sont en inverse de la variance (Gauss-Markov).

**Methode :** Simulation d'un lac elliptique (40x25 km), deux satellites : Sentinel-3A (inclinaison 98.6 deg, cycle 27 j, sigma = 3 cm, biais = 0) et Jason-3 (inclinaison 66 deg, cycle 10 j, sigma = 4 cm, biais = +0.12 m). Detection des crossovers par intersection de segments + interpolation de hauteur. Estimation du biais : constante (moyenne de Dh) et lineaire beta(t) = beta0 + beta1*t par moindres carres. Budget d'erreur RSS et ponderation Gauss-Markov pour 3 missions.

**Resultats :**
- Sentinel-3A : 1823 mesures, 15 passes
- Jason-3 : 1474 mesures, 12 passes, biais injecte = **+0.12 m**
- Dh avant correction : moyenne = **-0.435 m**
- Dh apres correction : moyenne = **~0.000 m** (bruit residuel uniquement)
- Budget d'erreur : Sentinel-3A sigma = 2.0 cm, Jason-3 sigma = 2.3 cm, CryoSat-2 sigma = 3.1 cm

![Traces satellites sur le lac](/projects/sat-explo/intercalibration-fig1.png)
*Fig. 24 — Geometrie des orbites sur le lac elliptique. Sentinel-3A (bleu, 15 passes) et Jason-3 (rouge, 12 passes).*

![Points de croisement et distribution des Dh](/projects/sat-explo/intercalibration-fig2.png)
*Fig. 25 — Gauche : crossovers colores par Dh. Droite : histogramme des Dh avec moyenne (-0.435 m) et biais vrai (+0.12 m).*

![Correction de biais avant/apres](/projects/sat-explo/intercalibration-fig3.png)
*Fig. 26 — Histogrammes de Dh avant (gauche, moyenne = -0.435 m) et apres correction (droite, moyenne ~ 0.000 m). Le biais est entierement absorbe.*

![Budget d'erreur et poids de fusion](/projects/sat-explo/intercalibration-fig4.png)
*Fig. 27 — Budget d'erreur par mission et poids de fusion Gauss-Markov.*

![Residus par passe avant/apres correction](/projects/sat-explo/intercalibration-fig5.png)
*Fig. 28 — Residus (h_mesure - h_vrai) par passe, avant et apres correction du biais.*

---

## Reconstruction 2D par Krigeage Spatio-Temporel

**Hypotheses :** La surface d'un lac est quasi-horizontale (pente < 1 cm/km). Les correlations spatiales sont longue portee sur un lac, les correlations temporelles suivent le cycle saisonnier. Stationnarite du variogramme supposee. La contrainte de quasi-planeite est imposee par lissage de type Tikhonov pour supprimer les gradients irrealistes.

**Methode :** Simulation d'un lac elliptique (40x25 km), 3 missions : Sentinel-3 (10 passes, sigma = 2 cm), Jason-3 (8 passes, sigma = 3 cm), CryoSat-2 (6 passes, sigma = 4 cm). Variogramme experimental sur 500 points sous-echantillonnes, ajustement modeles spherique et gaussien. Krigeage Ordinaire 2D par pas de temps avec fenetre temporelle ±10 jours. Grille 30x20. Contrainte de pente par diffusion iterative (max 0.01 m/km, alpha = 0.3, 50 iterations).

**Resultats :**
- Observations multi-missions : Sentinel-3 (560 pts), Jason-3 (468 pts), CryoSat-2 (329 pts)
- Grille d'interpolation : 30x20, ~145 points sur le lac
- Incertitude de krigeage : sigma ~ 2-3 cm pres des traces, augmentation aux bords

![Observations altimetriques multi-missions](/projects/sat-explo/krigeage-fig1.png)
*Fig. 29 — Observations multi-missions sur le lac. Sentinel-3 (bleu, 560 pts), Jason-3 (rose, 468 pts), CryoSat-2 (orange, 329 pts).*

![Variogramme experimental et modeles ajustes](/projects/sat-explo/krigeage-fig2.png)
*Fig. 30 — Gauche : variogramme experimental avec modeles spherique et gaussien ajustes. Droite : nombre de paires par classe de distance.*

![Reconstruction 2D et incertitude de krigeage](/projects/sat-explo/krigeage-fig3.png)
*Fig. 31 — Haut : hauteur d'eau reconstruite a t = 0, 15, 30, 45 jours avec traces d'observation. Bas : incertitude de krigeage (sigma en cm) — faible pres des traces, forte aux bords.*

![Validation : predit vs vrai](/projects/sat-explo/krigeage-fig4.png)
*Fig. 32 — Scatter predit vs vrai pour 4 pas de temps avec RMSE.*

---

## Dynamique Large-Echelle — Approche SWOT

**Hypotheses :** SWOT fournit des images 2D de hauteur d'eau (fauchee ~120 km) contrairement aux altimetres nadir (1D). La vitesse d'ecoulement est derivee par l'equation de Manning avec profondeur et rugosite uniformes. Le suivi lagrangien utilise l'integration RK4 du champ de vitesse -grad(h). Le bilan hydrique : dV/dt = Qin - Qout + P - E.

**Methode :** Simulation d'un bassin 200x150 pixels (resolution 1 km, 24 pas de temps a 15 jours). Lac central elliptique, 2 rivieres affluentes (nord, est), 1 exutoire (sud). Dataset Xarray chunke avec Dask. Statistiques temporelles (moyenne, ecart-type, anomalie). Gradients spatiaux par differentiation. Champ de vitesse par Manning (n = 0.03, profondeur = 5 m). Suivi lagrangien de 9 particules par RK4 (10 sous-pas). Bilan hydrologique : flux aux sections de controle, volume du lac, dV/dt vs flux net, residus.

**Resultats :**
- Bassin : 200x150 km, 24 pas de temps (1 an)
- Hauteur de base du lac : 372 m, amplitude saisonniere : ±2.0 m
- Pente hydraulique moyenne : ~0.3 mm/km (sur l'eau)
- 9 particules suivies sur 360 jours
- Bilan hydrologique : fermeture a ±10-30 % (residus P-E + erreurs numeriques)

![Snapshots temporels du champ de hauteur d'eau](/projects/sat-explo/swot-fig1.png)
*Fig. 33 — Champ WSE (Water Surface Elevation) a t = 0, 90, 180 et 270 jours. Le lac central et les rivieres affluentes/exutoire sont visibles. Cycle saisonnier de ±2 m.*

![Gradients hydrauliques et champ de vitesse](/projects/sat-explo/swot-fig2.png)
*Fig. 34 — Gauche : magnitude de la pente hydraulique (0-10 mm/km). Droite : champ de hauteur avec vecteurs de direction d'ecoulement (-grad h).*

![Suivi lagrangien des masses d'eau](/projects/sat-explo/swot-fig3.png)
*Fig. 35 — Trajectoires lagrangiennes de 9 particules (vert = depart, rouge = arrivee). Coloration par temps (jours). Les particules convergent vers l'exutoire sud.*

![Bilan hydrologique simplifie](/projects/sat-explo/swot-fig4.png)
*Fig. 36 — Haut gauche : volume stocke dans le lac. Haut droite : flux aux 3 sections de controle. Bas gauche : dV/dt vs flux net. Bas droite : residu du bilan (P-E + erreurs).*