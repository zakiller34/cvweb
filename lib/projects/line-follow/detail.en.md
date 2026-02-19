A **line follower** is a robot that detects a dark line on a light surface and steers itself to stay on it. This project walks through a MicroPython program running on a **BBC micro:bit** mounted on a **SparkFun MotoBit** chassis with three infrared (IR) reflectance sensors.

![Photo of the assembled robot](/projects/line-follow/robot-photo.jpg)

---

## Hardware Overview

| Component | Role |
|---|---|
| **BBC micro:bit v2** | Main controller (ARM Cortex-M4, MicroPython) |
| **SparkFun MotoBit** | Motor driver board, sits under the micro:bit |
| **2x DC motors + wheels** | Drive the robot |
| **3x IR reflectance sensors** | Detect the line (analog output 0-3.3 V) |
| **Battery pack** | Powers motors + micro:bit |

![The BBC micro:bit v2 board](/projects/line-follow/microbit.png)

The MotoBit communicates with the micro:bit over the **I2C** bus (a 2-wire serial protocol using SDA/SCL lines). The IR sensors are wired to analog input pins.

![The SparkFun MotoBit carrier board](/projects/line-follow/motobit-board.jpg)

### How IR Reflectance Sensors Work

Each sensor has an IR LED and a phototransistor side by side. The LED shines infrared light down. A **light surface** reflects most of it back &rarr; high voltage reading. A **dark line** absorbs it &rarr; low voltage reading.

```
     IR LED   Phototransistor
       |           |
       v           v
   ┌───────────────────┐
   │    Sensor PCB     │
   └───────┬───────────┘
           |  IR light
           v
   ========================  <-- surface
   ======██████==========    <-- black line (absorbs IR)
```

---

## Hardware Wiring Diagram

```
                 ┌─────────────────────┐
                 │    BBC micro:bit    │
                 │                     │
                 │  pin0  pin1  pin2   │
                 └──┬──────┬──────┬───┘
                    │      │      │      (analog signals)
                    │      │      │
              ┌─────┴──────┴──────┴─────┐
              │     MotoBit Board       │
              │                         │
              │  I2C addr: 0x59         │
              │                         │
              │  ┌─────┐   ┌─────┐     │
              │  │Motor │   │Motor│     │
              │  │Left  │   │Right│     │
              │  └──┬───┘   └──┬──┘     │
              └─────┼──────────┼────────┘
                    │          │
               ┌────┴┐      ┌─┴───┐
               │Wheel│      │Wheel│
               └─────┘      └─────┘

  ── Robot top view ──────────────────────

         (front - direction of travel)
                    ↑
        ┌───────────────────────┐
        │                       │
        │  [L sensor] [M] [R]  │   ← 3 IR sensors
        │   (pin0)  (pin1)(pin2)│     facing down
        │                       │
        │     ┌───────────┐     │
        │     │ micro:bit │     │
        │     │ + MotoBit │     │
        │     └───────────┘     │
        │                       │
        │  (Left)       (Right) │
        │   ○ wheel    wheel ○  │
        │                       │
        └───────────────────────┘
```

![MotoBit motor input pins](/projects/line-follow/wiring.jpg)

![Sensor mounting on the robot chassis](/projects/line-follow/sensor-mounting.jpg)

![I2C port on the MotoBit board](/projects/line-follow/i2c-port.jpg)

---

## The MotoBit Driver Class

```python
class MotoBit:
    I2C_ADDR    = 0x59   # MotoBit lives at I2C address 89
    CMD_ENABLE  = 0x70   # Register to enable/disable motors
    CMD_SPEED_LEFT  = 0x21  # Register for left motor speed
    CMD_SPEED_RIGHT = 0x20  # Register for right motor speed
    FORWARD_FLAG    = 0x80  # Bit 7 = direction (1=forward)
```

### I2C Protocol

Every command is a **2-byte write**: `[register, value]`.

| Register | Value | Effect |
|---|---|---|
| `0x70` | `0x01` | Enable motors |
| `0x70` | `0x00` | Disable motors |
| `0x21` | speed byte | Set left motor speed |
| `0x20` | speed byte | Set right motor speed |

### Speed Byte Encoding

The speed byte packs direction and magnitude into a single byte:

```
  Bit:   7       6  5  4  3  2  1  0
       ┌───┐   ┌──────────────────────┐
       │Dir│   │   Speed (0-127)      │
       └───┘   └──────────────────────┘
        1 = forward
        0 = reverse
```

The `_transSpeed` method converts a percentage (-100 to +100) into this format:

```python
def _transSpeed(self, speed):
    flags = 0
    if speed >= 0:
        flags |= 0x80           # set bit 7 for forward
    speed = int(speed / 100 * 127)  # map ±100 → ±127
    speed = max(-127, min(127, speed))  # clamp
    speed = (speed & 0x7f) | flags     # magnitude + direction
    return speed
```

### Why the Right Motor is Negated

```python
def drive(self, left=0, right=0):
    left_  = self._transSpeed(left)
    right_ = self._transSpeed(-right)  # ← negated!
```

The two motors are physically mounted as **mirror images**. "Forward" for the left motor and "forward" for the right motor would spin them in *opposite* directions. Negating the right speed makes `drive(50, 50)` move the robot straight ahead.

---

## Two-Point Calibration

The robot needs to know what "on the line" and "off the line" look like for each sensor. Ambient light, surface color, and sensor-to-ground distance all affect readings. A **two-point calibration** handles this.

### How It Works

1. **ETALONNER1** ("Calibrate 1"): Place all sensors on the **line** (dark surface). Press A or B. The robot reads and stores the values as `V1`.
2. **ETALONNER2** ("Calibrate 2"): Place all sensors on the **background** (light surface). Press A or B. The robot reads and stores the values as `V2`.

```python
# After both calibrations:
for i in range(3):
    # Midpoint between line and background readings
    VM[i] = 0.5 * (V1[i] + V2[i])

    # If line reads LOWER than midpoint, flip the sign
    if V1[i] < VM[i]:
        VMFactor[i] = -1.0
```

### What the Midpoint and Factor Do

```
Sensor reading scale (example):

  V1=200 (on line)         VM=500           V2=800 (off line)
     │                       │                  │
     ▼                       ▼                  ▼
  ───●───────────────────────┼──────────────────●──── raw value
                             │
                     threshold midpoint

After subtracting VM and applying factor:
  negative = OFF line       0        positive = ON line
  ──────────────────────────┼──────────────────────
```

The factor (`-1.0` or `+1.0`) ensures that regardless of whether the line reads *higher* or *lower* than the background, a **positive** normalized value always means "sensor sees the line" and **negative** means "sensor is off the line".

![Calibration in progress](/projects/line-follow/calibration.jpg)

---

## State Machine

The program is structured as a **state machine** — it loops forever, and on each iteration the current state determines what code runs.

```
                        ┌──────────┐
                        │ WAIT_ETA │ ◄──── (initial state)
                        └────┬─────┘
                  button A/B │
                    ┌────────┴────────┐
                    ▼                 │
              ┌───────────┐           │
              │ ETALONNER1│           │ middleIndex
              │ (cal #1)  │           │ increments
              └─────┬─────┘           │
                    │ done            │
                    └─────────────────┘
                             │ middleIndex == 2
                             ▼
                       ┌───────────┐
                       │ ETALONNER2│
                       │ (cal #2)  │
                       └─────┬─────┘
                             │ calibration complete
                             │ motors enabled
                             ▼
              ┌──────────────────────────────────┐
              │          Main Loop               │
              │                                  │
              │   ┌──────┐    ┌───────┐          │
              │   │SENSOR│───►│ DRIVE │          │
              │   └──▲───┘    └───┬───┘          │
              │      │            │              │
              │      │       ┌────▼───┐          │
              │      └───────│  WAIT  │          │
              │              └────┬───┘          │
              └───────────────────┼──────────────┘
                                  │ 3g shock detected
                                  ▼
                           ┌──────────┐
                           │ OBSTACLE │
                           └────┬─────┘
                                │ button press
                                ▼
                             (back to WAIT)
```

| State | What it does |
|---|---|
| `WAIT_ETA` | Scrolls "CALIBRATE N ?" and waits for button press |
| `ETALONNER1` | Reads sensors on the **line**, stores as V1 |
| `ETALONNER2` | Reads sensors on the **background**, computes thresholds, enables motors |
| `SENSOR` | Reads all 3 sensors, normalizes values |
| `DRIVE` | Decides motor speeds based on sensor values |
| `WAIT` | 1 ms pause, checks for obstacle (3g shock), loops back to SENSOR |
| `OBSTACLE` | Stops driving, waits for button press to resume |

---

## The Line-Following Algorithm (DRIVE State)

This is the brain of the robot. It looks at which sensors see the line and adjusts the cumulative bias counters, which then determine motor speed.

### Sensor Patterns and Steering Response

In the diagrams below: `+` = sensor ON the line (positive tild), `-` = sensor OFF the line (negative tild).

```
Pattern 1: ALL ON LINE  →  Go straight
┌─────────────────────────────────┐
│   [+L]    [+M]    [+R]         │   leftCum = 1, rightCum = 1
│                                 │   → equal speed, go straight
│   ████████████████████████      │   (line is wide or centered)
└─────────────────────────────────┘

Pattern 2: DRIFTING RIGHT  →  Steer left
┌─────────────────────────────────┐
│   [-L]    [+M]    [+R]         │   leftCum = 1, rightCum += 1
│                                 │   → right slows, turns left
│          ████████████████       │   (line shifted right)
└─────────────────────────────────┘

Pattern 3: DRIFTING LEFT  →  Steer right
┌─────────────────────────────────┐
│   [+L]    [+M]    [-R]         │   leftCum += 1, rightCum = 1
│                                 │   → left slows, turns right
│   ████████████████              │   (line shifted left)
└─────────────────────────────────┘

Pattern 4: SHARP CURVE RIGHT  →  Hard left
┌─────────────────────────────────┐
│   [-L]    [-M]    [+R]         │   leftCum = 1, rightCum += 2
│                                 │   → right slows fast, sharp left
│                  ████████       │   (line far right)
└─────────────────────────────────┘

Pattern 5: SHARP CURVE LEFT  →  Hard right
┌─────────────────────────────────┐
│   [+L]    [-M]    [-R]         │   leftCum += 2, rightCum = 1
│                                 │   → left slows fast, sharp right
│   ████████                      │   (line far left)
└─────────────────────────────────┘
```

### The Speed Formula

```python
speedLeft  = inverseFun(leftSensorTildCum)  * BOUGER_RAPIDE
speedRight = inverseFun(rightSensorTildCum) * BOUGER_RAPIDE
```

Where:
```python
def inverseFun(x):
    if x == 0: return 0.0
    return 1.0 / float(x)
```

And `BOUGER_RAPIDE = 40` (base speed).

```
  Speed vs. Cumulative Counter

  Speed
   40 │ ●
      │
   20 │    ●
      │
   13 │       ●
   10 │          ●
    8 │             ●
      └──┬──┬──┬──┬──┬── Cum
         1  2  3  4  5

  speed = 40 / cum
```

When a sensor is centered (`cum=1`), speed is `40/1 = 40` (full). As the counter grows (robot drifting), speed drops as `1/cum` — the side that's been off the line longer gets slower, making the robot turn back toward the line. This creates a **proportional-like** control where the steering correction grows the longer the robot is off-center.

### Recovery Mode (Line Lost)

When **all sensors lose the line** (all negative), the robot enters recovery. It remembers **which direction it was drifting** before losing the line, then pivots in that direction. One motor gets a negative speed (reverse) while the other gets positive — the robot **spins in place** to search for the line.

```
  Line lost! Last seen on the right:

            ↺  Robot pivots right
       ┌───────────┐
       │ [-L][-M][-R]  ← all sensors off
       │           │
       │  ←○    ○→ │   left=forward, right=reverse
       └───────────┘
                        until a sensor finds the line again
```

![Robot following a track](/projects/line-follow/track.jpg)

---

## Obstacle Detection

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

The micro:bit's built-in accelerometer detects a **3g shock** — roughly a collision with an obstacle. When triggered the robot stops and waits until you press a button to resume. This is a simple safety mechanism.
