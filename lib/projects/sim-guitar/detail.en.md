Physical simulation of an acoustic guitar — from string pluck to radiated sound.

## Simulation Chain

Three coupled physical domains simulate the full acoustic path: a **1D string** (mixed velocity/stress FEM, leapfrog time-stepping) transfers force at the bridge to a **2D soundboard** (Kirchhoff-Love plate, modal decomposition), whose normal velocity drives the surrounding **3D air** (linearized Euler equations on a Yee staggered grid with PML absorbing boundaries). All domains are coupled at each time step through a Schur complement system that enforces velocity continuity and force balance. The coupled system conserves a discrete energy invariant (modulo damping and PML absorption). This project is based on the thesis by G. Derveaux [1].

<audio controls src="/projects/sim-guitar/mi6_pluck.mp3">
  Mi6 pluck (4 s)
</audio>

*Low E string (82 Hz fundamental), 4 seconds, 216k time steps.*

---

## Results

### Guitar Mesh

The guitar body is a closed 3D surface mesh (soundboard + back + sides) imported from a Gmsh `.geo` file — 670 nodes, 1326 triangles.

![3D guitar body — perspective, side, top views](/projects/sim-guitar/prestep_06_1_fig01.png)

### Soundboard Modes

Kirchhoff-Love eigensolve on the guitar soundboard mesh (424 nodes, clamped rim, free soundhole). 50 modes computed from 73 Hz to 1049 Hz. First 6 mode shapes show increasing nodal-line complexity with frequency.

![First 6 mode shapes](/projects/sim-guitar/soundboard_modes.png)

### Acoustic Radiation

Pressure field computed on a 3D Yee grid. Wavefronts radiate from the soundboard and propagate outward; PML absorbs at domain boundaries.

![XZ-slice pressure snapshots](/projects/sim-guitar/step_06b_fig05.png)

### Bridge Admittance

Impulse-response admittance Y(f) = V/F at the bridge, comparing plate in vacuum vs coupled to air cavity. The A0 Helmholtz mode emerges at 97 Hz (absent in vacuum); the T1 mode shifts from 180 to 215 Hz due to air mass loading.

![Bridge admittance — vacuum vs coupled](/projects/sim-guitar/step_07a_fig01.png)

### Breathing Mode

Zoom on plate-cavity interaction near the (4,4) plate mode at 661 Hz. Radiation damping dominates: the coupled system dissipates more energy through acoustic radiation than the cavity reinforces, reducing the Q-factor.

![Admittance zoom 600-750 Hz](/projects/sim-guitar/step_07b_fig03.png)

### Mi6 Pluck — 4 Seconds

Extended simulation of a single low E string pluck: 4.0 s physical time, 216k time steps. Harmonics at n × 82 Hz; higher harmonics decay faster from viscous and structural damping.

![Waveform and FFT](/projects/sim-guitar/step_07c_fig01.png)

![Spectrogram](/projects/sim-guitar/step_07c_fig02.png)

---

## Methods

### Partial Differential Equations

- **1D String** — Mixed velocity/stress wave equation with linear elasticity and localized damping. Velocity v(x,t) and stress rate q(x,t) evolve on a staggered grid.
- **2D Soundboard** — Kirchhoff-Love fourth-order plate equation with orthotropic material properties. Displacement w, moment tensor M, compliance tensor linking bending stiffness to curvature.
- **3D Air** — Linearized Euler equations for acoustic velocity **v** and pressure p, with PML absorbing layer extending the domain to prevent reflections.

### Numerical Schemes

- **P1 finite elements** for string and plate spatial discretization; **Yee staggered leapfrog** (Q0 pressure / RT0 velocity) for air.
- **Modal projection**: plate eigensolve performed once, then time integration in reduced modal coordinates via resolvent kernels (exact, no CFL constraint on the plate).
- **Schur complement coupling**: implicit multi-domain solve at each time step — string bridge force + plate-air Lagrange multiplier resolved simultaneously.
- **Fictitious domain method**: immersed 2D plate surface inside the 3D air grid, coupled via surface integrals (triangle-cube intersection, P1 × RT0 basis evaluation).
- **PML** (perfectly matched layers) absorbs outgoing acoustic waves at domain boundaries.

### Libraries

Python, NumPy, SciPy, GetFEM (FEM assembly + eigensolve), Gmsh (mesh generation), Matplotlib.

---

## References

[1] G. Derveaux, *Modelisation numerique de la guitare acoustique*, PhD thesis, Ecole Polytechnique, 2002. Directed by P. Joly. [theses.fr](https://www.theses.fr/2002EPXX0029)
