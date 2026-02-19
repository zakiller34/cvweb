Un **suiveur de ligne** est un robot qui detecte une ligne sombre sur une surface claire et se dirige pour rester dessus. Ce projet presente un programme MicroPython fonctionnant sur un **BBC micro:bit** monte sur un chassis **SparkFun MotoBit** avec trois capteurs infrarouges (IR) de reflectance.

![Photo du robot assemble](/projects/line-follow/robot-photo.jpg)

---

## Apercu du materiel

| Composant | Role |
|---|---|
| **BBC micro:bit v2** | Controleur principal (ARM Cortex-M4, MicroPython) |
| **SparkFun MotoBit** | Carte pilote de moteurs, se place sous le micro:bit |
| **2x moteurs DC + roues** | Propulsion du robot |
| **3x capteurs IR de reflectance** | Detection de la ligne (sortie analogique 0-3.3 V) |
| **Pack de batteries** | Alimentation des moteurs + micro:bit |

![La carte BBC micro:bit v2](/projects/line-follow/microbit.png)

Le MotoBit communique avec le micro:bit via le bus **I2C** (protocole serie a 2 fils utilisant les lignes SDA/SCL). Les capteurs IR sont cables sur des broches d'entree analogiques.

![La carte porteuse SparkFun MotoBit](/projects/line-follow/motobit-board.jpg)

### Fonctionnement des capteurs IR de reflectance

Chaque capteur possede une LED IR et un phototransistor cote a cote. La LED projette de la lumiere infrarouge vers le bas. Une **surface claire** reflechit la majorite &rarr; lecture haute tension. Une **ligne sombre** absorbe &rarr; lecture basse tension.

```
     LED IR   Phototransistor
       |           |
       v           v
   ┌───────────────────┐
   │    Circuit capteur │
   └───────┬───────────┘
           |  lumiere IR
           v
   ========================  <-- surface
   ======██████==========    <-- ligne noire (absorbe l'IR)
```

---

## Schema de cablage

```
                 ┌─────────────────────┐
                 │    BBC micro:bit    │
                 │                     │
                 │  pin0  pin1  pin2   │
                 └──┬──────┬──────┬───┘
                    │      │      │      (signaux analogiques)
                    │      │      │
              ┌─────┴──────┴──────┴─────┐
              │     Carte MotoBit       │
              │                         │
              │  Adresse I2C : 0x59     │
              │                         │
              │  ┌─────┐   ┌─────┐     │
              │  │Moteur│   │Moteur│    │
              │  │Gauche│   │Droit │    │
              │  └──┬───┘   └──┬──┘     │
              └─────┼──────────┼────────┘
                    │          │
               ┌────┴┐      ┌─┴───┐
               │Roue │      │Roue │
               └─────┘      └─────┘

  ── Vue de dessus du robot ──────────────

         (avant - direction de deplacement)
                    ↑
        ┌───────────────────────┐
        │                       │
        │  [Capteur G] [M] [D] │   ← 3 capteurs IR
        │   (pin0)  (pin1)(pin2)│     orientes vers le bas
        │                       │
        │     ┌───────────┐     │
        │     │ micro:bit │     │
        │     │ + MotoBit │     │
        │     └───────────┘     │
        │                       │
        │  (Gauche)     (Droit) │
        │   ○ roue      roue ○  │
        │                       │
        └───────────────────────┘
```

![Broches d'entree moteur du MotoBit](/projects/line-follow/wiring.jpg)

![Montage des capteurs sur le chassis du robot](/projects/line-follow/sensor-mounting.jpg)

![Port I2C sur la carte MotoBit](/projects/line-follow/i2c-port.jpg)

---

## La classe pilote MotoBit

```python
class MotoBit:
    I2C_ADDR    = 0x59   # Adresse I2C 89
    CMD_ENABLE  = 0x70   # Registre activation/desactivation moteurs
    CMD_SPEED_LEFT  = 0x21  # Registre vitesse moteur gauche
    CMD_SPEED_RIGHT = 0x20  # Registre vitesse moteur droit
    FORWARD_FLAG    = 0x80  # Bit 7 = direction (1=avant)
```

### Protocole I2C

Chaque commande est une **ecriture de 2 octets** : `[registre, valeur]`.

| Registre | Valeur | Effet |
|---|---|---|
| `0x70` | `0x01` | Activer les moteurs |
| `0x70` | `0x00` | Desactiver les moteurs |
| `0x21` | octet vitesse | Regler vitesse moteur gauche |
| `0x20` | octet vitesse | Regler vitesse moteur droit |

### Encodage de l'octet de vitesse

L'octet de vitesse combine direction et magnitude en un seul octet :

```
  Bit :  7       6  5  4  3  2  1  0
       ┌───┐   ┌──────────────────────┐
       │Dir│   │   Vitesse (0-127)    │
       └───┘   └──────────────────────┘
        1 = avant
        0 = arriere
```

La methode `_transSpeed` convertit un pourcentage (-100 a +100) dans ce format :

```python
def _transSpeed(self, speed):
    flags = 0
    if speed >= 0:
        flags |= 0x80           # bit 7 pour avant
    speed = int(speed / 100 * 127)  # ±100 → ±127
    speed = max(-127, min(127, speed))  # borner
    speed = (speed & 0x7f) | flags     # magnitude + direction
    return speed
```

### Pourquoi le moteur droit est inverse

```python
def drive(self, left=0, right=0):
    left_  = self._transSpeed(left)
    right_ = self._transSpeed(-right)  # ← inverse !
```

Les deux moteurs sont montes en **miroir**. « Avant » pour le moteur gauche et « avant » pour le moteur droit les feraient tourner en sens *opposes*. Inverser la vitesse droite fait que `drive(50, 50)` deplace le robot tout droit.

---

## Calibration en deux points

Le robot doit connaitre ce que « sur la ligne » et « hors de la ligne » signifient pour chaque capteur. La lumiere ambiante, la couleur de la surface et la distance capteur-sol affectent les lectures. Une **calibration en deux points** gere cela.

### Fonctionnement

1. **ETALONNER1** (« Calibrer 1 ») : Placer tous les capteurs sur la **ligne** (surface sombre). Appuyer sur A ou B. Le robot lit et stocke les valeurs comme `V1`.
2. **ETALONNER2** (« Calibrer 2 ») : Placer tous les capteurs sur le **fond** (surface claire). Appuyer sur A ou B. Le robot lit et stocke les valeurs comme `V2`.

```python
# Apres les deux calibrations :
for i in range(3):
    # Point milieu entre les lectures ligne et fond
    VM[i] = 0.5 * (V1[i] + V2[i])

    # Si la ligne lit PLUS BAS que le milieu, inverser le signe
    if V1[i] < VM[i]:
        VMFactor[i] = -1.0
```

### Role du point milieu et du facteur

```
Echelle de lecture du capteur (exemple) :

  V1=200 (sur ligne)       VM=500           V2=800 (hors ligne)
     │                       │                  │
     ▼                       ▼                  ▼
  ───●───────────────────────┼──────────────────●──── valeur brute
                             │
                       seuil milieu

Apres soustraction de VM et application du facteur :
  negatif = HORS ligne      0        positif = SUR la ligne
  ──────────────────────────┼──────────────────────
```

Le facteur (`-1.0` ou `+1.0`) garantit que quelle que soit la polarite de lecture, une valeur normalisee **positive** signifie toujours « le capteur voit la ligne » et **negative** signifie « le capteur est hors de la ligne ».

![Calibration en cours](/projects/line-follow/calibration.jpg)

---

## Machine a etats

Le programme est structure comme une **machine a etats** — il boucle indefiniment, et a chaque iteration l'etat courant determine le code execute.

```
                        ┌──────────┐
                        │ WAIT_ETA │ ◄──── (etat initial)
                        └────┬─────┘
                  bouton A/B │
                    ┌────────┴────────┐
                    ▼                 │
              ┌───────────┐           │
              │ ETALONNER1│           │ middleIndex
              │ (cal #1)  │           │ s'incremente
              └─────┬─────┘           │
                    │ termine         │
                    └─────────────────┘
                             │ middleIndex == 2
                             ▼
                       ┌───────────┐
                       │ ETALONNER2│
                       │ (cal #2)  │
                       └─────┬─────┘
                             │ calibration terminee
                             │ moteurs actives
                             ▼
              ┌──────────────────────────────────┐
              │          Boucle principale        │
              │                                  │
              │   ┌──────┐    ┌───────┐          │
              │   │SENSOR│───►│ DRIVE │          │
              │   └──▲───┘    └───┬───┘          │
              │      │            │              │
              │      │       ┌────▼───┐          │
              │      └───────│  WAIT  │          │
              │              └────┬───┘          │
              └───────────────────┼──────────────┘
                                  │ choc 3g detecte
                                  ▼
                           ┌──────────┐
                           │ OBSTACLE │
                           └────┬─────┘
                                │ appui bouton
                                ▼
                             (retour a WAIT)
```

| Etat | Fonction |
|---|---|
| `WAIT_ETA` | Affiche "CALIBRATE N ?" et attend un appui bouton |
| `ETALONNER1` | Lit les capteurs sur la **ligne**, stocke V1 |
| `ETALONNER2` | Lit les capteurs sur le **fond**, calcule les seuils, active les moteurs |
| `SENSOR` | Lit les 3 capteurs, normalise les valeurs |
| `DRIVE` | Decide les vitesses moteurs selon les valeurs capteurs |
| `WAIT` | Pause 1 ms, verifie obstacle (choc 3g), reboucle vers SENSOR |
| `OBSTACLE` | Arrete la conduite, attend un appui bouton pour reprendre |

---

## L'algorithme de suivi de ligne (etat DRIVE)

C'est le cerveau du robot. Il observe quels capteurs voient la ligne et ajuste les compteurs de biais cumulatifs, qui determinent ensuite la vitesse des moteurs.

### Motifs de capteurs et reponse de direction

Dans les diagrammes ci-dessous : `+` = capteur SUR la ligne (tild positif), `-` = capteur HORS de la ligne (tild negatif).

```
Motif 1 : TOUS SUR LA LIGNE  →  Tout droit
┌─────────────────────────────────┐
│   [+G]    [+M]    [+D]         │   cumGauche = 1, cumDroit = 1
│                                 │   → vitesse egale, tout droit
│   ████████████████████████      │   (ligne large ou centree)
└─────────────────────────────────┘

Motif 2 : DERIVE A DROITE  →  Tourner a gauche
┌─────────────────────────────────┐
│   [-G]    [+M]    [+D]         │   cumGauche = 1, cumDroit += 1
│                                 │   → droit ralentit, tourne a gauche
│          ████████████████       │   (ligne decalee a droite)
└─────────────────────────────────┘

Motif 3 : DERIVE A GAUCHE  →  Tourner a droite
┌─────────────────────────────────┐
│   [+G]    [+M]    [-D]         │   cumGauche += 1, cumDroit = 1
│                                 │   → gauche ralentit, tourne a droite
│   ████████████████              │   (ligne decalee a gauche)
└─────────────────────────────────┘

Motif 4 : VIRAGE SERRE A DROITE  →  Braquage a gauche
┌─────────────────────────────────┐
│   [-G]    [-M]    [+D]         │   cumGauche = 1, cumDroit += 2
│                                 │   → droit ralentit fort, braquage gauche
│                  ████████       │   (ligne loin a droite)
└─────────────────────────────────┘

Motif 5 : VIRAGE SERRE A GAUCHE  →  Braquage a droite
┌─────────────────────────────────┐
│   [+G]    [-M]    [-D]         │   cumGauche += 2, cumDroit = 1
│                                 │   → gauche ralentit fort, braquage droit
│   ████████                      │   (ligne loin a gauche)
└─────────────────────────────────┘
```

### La formule de vitesse

```python
speedLeft  = inverseFun(leftSensorTildCum)  * BOUGER_RAPIDE
speedRight = inverseFun(rightSensorTildCum) * BOUGER_RAPIDE
```

Ou :
```python
def inverseFun(x):
    if x == 0: return 0.0
    return 1.0 / float(x)
```

Et `BOUGER_RAPIDE = 40` (vitesse de base).

```
  Vitesse vs. Compteur cumulatif

  Vitesse
   40 │ ●
      │
   20 │    ●
      │
   13 │       ●
   10 │          ●
    8 │             ●
      └──┬──┬──┬──┬──┬── Cum
         1  2  3  4  5

  vitesse = 40 / cum
```

Quand un capteur est centre (`cum=1`), la vitesse est `40/1 = 40` (maximale). Plus le compteur augmente (robot en derive), plus la vitesse diminue en `1/cum` — le cote qui est hors ligne depuis plus longtemps ralentit davantage, faisant tourner le robot vers la ligne. Cela cree un controle de type **proportionnel** ou la correction de direction augmente avec la duree de decentrage.

### Mode de recuperation (ligne perdue)

Quand **tous les capteurs perdent la ligne** (tous negatifs), le robot entre en mode recuperation. Il se souvient de **la direction de derive** avant de perdre la ligne, puis pivote dans cette direction. Un moteur recoit une vitesse negative (marche arriere) tandis que l'autre recoit une vitesse positive — le robot **tourne sur place** pour chercher la ligne.

```
  Ligne perdue ! Derniere detection a droite :

            ↺  Le robot pivote a droite
       ┌───────────┐
       │ [-G][-M][-D]  ← tous les capteurs hors ligne
       │           │
       │  ←○    ○→ │   gauche=avant, droit=arriere
       └───────────┘
                        jusqu'a ce qu'un capteur retrouve la ligne
```

![Robot suivant une piste](/projects/line-follow/track.jpg)

---

## Detection d'obstacles

```python
elif currState == "WAIT":
    sleep(1)
    currState = "SENSOR"
    if accelerometer.was_gesture('3g'):
        display.show('Y', delay=100, wait=False)
        currState = "OBSTACLE"

elif currState == "OBSTACLE":
    sleep(100)
    if button_a.was_pressed() or button_b.was_pressed():
        currState = "WAIT"
```

L'accelerometre integre du micro:bit detecte un **choc de 3g** — correspondant approximativement a une collision avec un obstacle. Quand cela se declenche, le robot s'arrete et attend un appui bouton pour reprendre. C'est un mecanisme de securite simple.
