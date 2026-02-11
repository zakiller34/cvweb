## Satellite vs In-Situ Synchronization and Inter-Calibration

**Hypotheses:** Satellite altimetric measurements are affected by 10–30 cm noise (bank contamination, residual geoid errors) and a temporal sampling of ~20 days. Nearest-neighbor matching (±1 day tolerance) preserves the physical integrity of the in-situ measurement and avoids interpolation artifacts during rapid flood events. Gaussian noise is a simplification; actual altimetric errors follow heavy-tailed distributions.

**Method:** Generation of a synthetic river with an annual hydrological cycle (sinusoidal, 365-day period). In-situ: 730 daily measurements, noise σ = 0.02 m. Satellite: 36 measurements at ~20-day intervals, noise σ = 0.15 m, geoid bias +0.30 m. Temporal matching by nearest neighbor (pd.merge_asof, 1-day tolerance). Metrological analysis: systematic bias, RMSE, Pearson correlation.

**Results:**
- Matching: 36/36 passes paired
- Systematic bias: **+0.281 m**
- RMSE: **0.323 m**
- Pearson correlation R: **0.9959** (p = 3.95e-37)

![Satellite vs in-situ time series and residuals](/projects/sat-explo/validation-fig1.png)
*Fig. 1 — Satellite altimetry vs in-situ station comparison. Top: in-situ water levels (daily) and satellite (~20 d) with error bars. Bottom: satellite − in-situ residuals with mean bias +0.281 m.*

![Satellite vs ground truth regression](/projects/sat-explo/validation-fig2.png)
*Fig. 2 — Satellite vs in-situ regression scatter. R = 0.9959, RMSE = 0.323 m, bias = +0.281 m. The 1:1 line (grey) highlights the systematic offset due to the geoid.*

---

## Anomaly Detection and Kalman Filtering

**Hypotheses:** Altimetric measurements are contaminated by the hooking effect (bank reflections), multi-echoes from riparian vegetation, and mixed water/land surfaces. The Z-score threshold τ = 2.5 is an empirical trade-off between sensitivity and specificity. The random walk model of the Kalman filter (x(k) = x(k−1) + noise) is a simplification that does not capture flow physics.

**Method:** Injection of ~10% outliers (70% positive from bank reflections, 30% negative from specular reflections, amplitude 1000.5 m). Rolling Z-score detection (window = 5, threshold = 2.5). 1D Kalman filter with measurement noise R = (theoretical uncertainty)² and process noise Q = 0.02. Performance comparison across 3 stages: raw, post Z-score, post Kalman.

**Results:**
- Outliers injected: 3/36 (8%)
- Z-score detection: 0 true positives, 3 false negatives (threshold too conservative)
- Raw RMSE: **413.9 m**
- Post Z-score RMSE: **413.9 m** (improvement +0.0%)
- Post Kalman RMSE: **263.5 m** (improvement **+36.3%**)

![Z-score anomaly detection](/projects/sat-explo/anomalies-fig1.png)
*Fig. 3 — Time series with valid points (blue) and outliers (red crosses). The ±1000 m spikes are visible but the rolling Z-score fails to detect them.*

![Z-score + Kalman filtering pipeline](/projects/sat-explo/anomalies-fig2.png)
*Fig. 4 — Complete pipeline: in-situ ground truth (blue), raw satellite (grey), rejected outliers (red crosses), Kalman filter (green) with 95% confidence interval. The Kalman filter reduces RMSE by 36.3%.*

---

## River Width Monitoring from Sentinel-1 SAR Imagery

**Hypotheses:** Water exhibits very low backscatter (σ0 ~ −18 to −25 dB, specular reflection) compared to land (−3 to −8 dB, volume scattering), enabling automatic detection. Speckle follows a Gamma distribution with L ~ 4.4 looks for Sentinel-1 GRD IW. Otsu thresholding assumes a bimodal histogram. The distance transform assumes convex geometry for width measurement.

**Method:** Simulation of a 512×512 pixel SAR scene with a sinuous river (amplitude = 80 px, wavelength = 200 px, mean width = 30 px). Multiplicative Gamma(4.4, 1/4.4) speckle. Adaptive Lee filter (window = 7). Otsu thresholding + morphological operations (opening/closing, disk radius = 5). Skeletonization (Zhang–Suen) + distance transform for width estimation. MCC (Maximum Cross-Correlation) for displacement detection between two dates.

**Results:**
- Image: 512×512, dB dynamic range: [−30.0, 1.7]
- Water surface: **6.0%**
- Otsu threshold: **−11.3 dB**
- Detected water pixels: **14,259** (5.4% after morphological cleaning)
- Mean width: **15.8 px** (std: 5.2 px)
- Imposed displacement: dx = 3, dy = 7 px
- MCC-detected displacement: dx = 11, dy = −13 px (max correlation: 0.014 — failure on synthetic data)

![SAR simulation: ground truth, linear intensity, dB intensity](/projects/sat-explo/sar-fig1.png)
*Fig. 5 — Sentinel-1 SAR simulation. Left: ground truth mask. Center: linear intensity. Right: dB intensity. The sinuous river is clearly visible in dB.*

![Before/after Lee filter comparison](/projects/sat-explo/sar-fig2.png)
*Fig. 6 — Speckle reduction using adaptive Lee filter. Left: raw SAR in dB. Right: after filtering. River edges are sharper.*

![Otsu thresholding and water mask](/projects/sat-explo/sar-fig3.png)
*Fig. 7 — Left: filtered SAR histogram with Otsu threshold at −11.3 dB. Right: water mask overlaid on filtered image.*

![Skeletonization and width profile](/projects/sat-explo/sar-fig4.png)
*Fig. 8 — Left: river skeleton (red) on water mask. Right: width profile along the river (mean = 15.8 px, ±1σ = 5.2 px).*

![MCC cross-correlation map](/projects/sat-explo/sar-fig5.png)
*Fig. 9 — Displacement detection via MCC. Left/Center: two filtered SAR dates. Right: correlation map with detected peak.*

---

## Virtual Stations via Fusion and Kriging

**Hypotheses:** The geoid bias between ellipsoidal (satellite) and local (in-situ) reference frames can be estimated through spatio-temporal co-location (median of differences). Universal Kriging with a linear regional drift captures the downstream hydraulic gradient. The rating curve follows a power law Q = a(H − H₀)ᵇ with constraints a > 0, b > 0, H₀ < min(H). Gaussian noise and sinusoidal seasonality are simplifications.

**Method:** Simulation of a 100 km river with 8 in-situ stations (daily, noise 0.02 m) and 4 satellite tracks (27-day cycle, noise 0.20 m, geoid bias +0.45 m). Hydraulic gradient 5×10⁻⁴ m/m. Bias correction via co-location (spatial tolerance 10 km, temporal tolerance 3 days). Universal Kriging with linear variogram. Rating curve calibration via L-BFGS-B. Validation: NSE and KGE.

**Results:**
- Network: 8 in-situ stations, 4 satellite tracks, 365 days
- Injected geoid bias: +0.45 m
- Calibrated rating curve: Q = 11.5(H − 124.0)¹·⁹⁰ (true: Q = 15.0(H − 124.2)¹·⁸)
- **NSE = 0.674**, **KGE = 0.738**

![Hydrometric network and time series](/projects/sat-explo/stations-virtuelles-fig1.png)
*Fig. 10 — Left: in-situ station network (blue triangles), satellite tracks (orange stars), and target virtual station (red cross). Right: time series showing the visible geoid bias between satellite and in-situ.*

![Universal Kriging prediction](/projects/sat-explo/stations-virtuelles-fig2.png)
*Fig. 11 — Water level prediction at the virtual station via Universal Kriging (orange) vs ground truth (blue) with ±2σ confidence interval.*

![Calibrated rating curve](/projects/sat-explo/stations-virtuelles-fig3.png)
*Fig. 12 — Rating curve: observations (blue dots), calibrated curve Q = 11.5(H − 124.0)¹·⁹⁰ (orange) vs true curve Q = 15.0(H − 124.2)¹·⁸ (grey dashes).*

![Predicted vs observed discharge validation](/projects/sat-explo/stations-virtuelles-fig4.png)
*Fig. 13 — Left: predicted discharge (orange dashes) vs ground truth (blue). Right: observed vs predicted scatter with NSE = 0.674 and KGE = 0.738.*

---

## Stability Analysis and Radar Signal Entropy

**Hypotheses:** Open water produces specular reflection (narrow echo, σ ~ 2–4 bins, high SNR). Land produces a diffuse echo (σ ~ 15–25 bins, low amplitude). Mixed surfaces superpose two echoes. Shannon entropy, PNR, and kurtosis are sufficient descriptors to classify these 3 surface types. K-means assumes spherical clusters of comparable size.

**Method:** Simulation of 600 waveforms (200 per class, 128 bins each) with intra-class variability. Computation of 3 indicators: Shannon entropy (H = −Σ pᵢ log₂ pᵢ), PNR (max / mean of the first 10 bins), excess kurtosis (Fisher). K-means (k = 3) on normalized features (StandardScaler). Label alignment by majority vote.

**Results:**
- Entropy: Open water = **5.513 bits**, Mixed = **6.320 bits**, Land = **6.753 bits**
- PNR: Water [2.80, 80.08], Mixed [~10, ~40], Land [~3, ~20]
- Kurtosis: Water [5, 20], Mixed [0, 10], Land [−1.36, 5]
- K-means inertia: 388.4
- Accuracy after alignment: **96.7%** (Water 95.0%, Mixed 95.0%, Land 100.0%)

![Typical waveforms for the 3 surface types](/projects/sat-explo/entropie-fig1.png)
*Fig. 14 — Altimetric waveforms by surface type. Open water (blue): narrow, strong peak. Mixed/Border (orange): double peak. Land (green): broad, weak echo.*

![Class separation by statistical indicators](/projects/sat-explo/entropie-fig2.png)
*Fig. 15 — Boxplots of the 3 indicators (Entropy, PNR, Kurtosis) by surface type. Clear separation between classes.*

![3D feature space — true classes](/projects/sat-explo/entropie-fig3.png)
*Fig. 16 — 3D scatter colored by true class in the (Entropy, PNR, Kurtosis) feature space.*

![3D feature space — K-means clusters](/projects/sat-explo/entropie-fig4.png)
*Fig. 17 — 3D scatter colored by aligned K-means clusters. Good agreement with true classes.*

![K-means vs ground truth confusion matrix](/projects/sat-explo/entropie-fig5.png)
*Fig. 18 — Confusion matrix: 190/200 for Water, 190/200 for Mixed, 200/200 for Land. Overall accuracy = 96.7%.*

---

## Retracking: OCOG, Threshold, and Brown Model

**Hypotheses:** The Brown model (1977) describes the waveform for a uniform surface. The 50% threshold retracker with spline interpolation achieves sub-bin precision. The Brown model assumes an isotropic and homogeneous surface (ocean-type), a strong assumption for inland waters with multi-peak echoes. Simplified atmospheric corrections (fixed values) instead of actual ECMWF corrections.

**Method:** Simulation of Brown model waveforms with parameters: epoch, sigma (leading edge slope), amplitude, alpha (trailing edge decay), thermal noise. OCOG retracker: center of gravity of W², amplitude from W⁴/W². Threshold retracker at 50% and 80% with sub-bin cubic spline interpolation. Epoch → range → height conversion chain. Brown model least-squares fitting (Levenberg–Marquardt). Benchmark on 100 random waveforms.

**Results:**
- Constants: gate spacing = 0.4684 m, bin spacing = 3.125 ns, total window = 60.0 m
- OCOG: Amplitude = 0.889, Width = 75.3 bins, COG = 84.69 bins (vs true epoch 50.0 — OCOG unsuitable for narrow peaks)
- Threshold 50%: epoch = 49.948 bins, error = **0.024 m**
- Threshold 80%: epoch = 52.223 bins, error = **1.041 m**
- Brown fit: epoch = 50.02 ± 0.09 bins, fit RMSE = **0.028**
- Epoch → height chain: 49.948 bins → 156.1 ns → raw range 23.40 m → atmospheric corrections +2.47 m → surface height 813,974.1 m
- **Benchmark on 100 waveforms**: Threshold 50% RMSE = **1.846 m**; Brown Fit RMSE = **0.064 m** (28× better)

![Annotated waveform — Brown model](/projects/sat-explo/retracker-fig1.png)
*Fig. 19 — Simulated altimetric waveform (Brown model). Annotations: leading edge, trailing edge, thermal noise window, true epoch = 50.0 bins.*

![OCOG analysis](/projects/sat-explo/retracker-fig2.png)
*Fig. 20 — OCOG result: estimated center of gravity, amplitude, and width. The COG (84.7 bins) is far from the true epoch (50.0 bins) because OCOG is unsuitable for narrow peaks.*

![50% and 80% threshold retracking](/projects/sat-explo/retracker-fig3.png)
*Fig. 21 — Threshold retracking with spline interpolation. The 50% threshold (epoch = 49.95) is close to truth; the 80% threshold (epoch = 52.22) overestimates.*

![Brown model least-squares fitting](/projects/sat-explo/retracker-fig4.png)
*Fig. 22 — Top: data (dots) and Brown fit (orange curve), true epoch (red) and estimated epoch (yellow). Bottom: residuals (RMSE = 0.028).*

![Threshold 50% vs Brown Fit benchmark on 100 waveforms](/projects/sat-explo/retracker-fig5.png)
*Fig. 23 — Estimated vs true epoch scatter. Left: Threshold 50% (RMSE = 1.85 m). Right: Brown Fit (RMSE = 0.064 m). The Brown model is 28 times more accurate.*

---

## Multi-Satellite Inter-Calibration and Homogenization

**Hypotheses:** Different altimetric missions exhibit systematic biases linked to reference systems, radar frequency, and observation geometry. At crossover points, the height difference reveals the inter-mission bias. The bias is assumed constant (no temporal or spatial drift). The error budget follows RSS composition; optimal fusion weights are inverse-variance (Gauss–Markov).

**Method:** Simulation of an elliptical lake (40×25 km), two satellites: Sentinel-3A (inclination 98.6°, 27-day cycle, σ = 3 cm, bias = 0) and Jason-3 (inclination 66°, 10-day cycle, σ = 4 cm, bias = +0.12 m). Crossover detection by segment intersection + height interpolation. Bias estimation: constant (mean of Δh) and linear β(t) = β₀ + β₁·t by least squares. RSS error budget and Gauss–Markov weighting for 3 missions.

**Results:**
- Sentinel-3A: 1,823 measurements, 15 passes
- Jason-3: 1,474 measurements, 12 passes, injected bias = **+0.12 m**
- Δh before correction: mean = **−0.435 m**
- Δh after correction: mean = **~0.000 m** (residual noise only)
- Error budget: Sentinel-3A σ = 2.0 cm, Jason-3 σ = 2.3 cm, CryoSat-2 σ = 3.1 cm

![Satellite tracks over the lake](/projects/sat-explo/intercalibration-fig1.png)
*Fig. 24 — Orbit geometry over the elliptical lake. Sentinel-3A (blue, 15 passes) and Jason-3 (red, 12 passes).*

![Crossover points and Δh distribution](/projects/sat-explo/intercalibration-fig2.png)
*Fig. 25 — Left: crossovers colored by Δh. Right: Δh histogram with mean (−0.435 m) and true bias (+0.12 m).*

![Bias correction before/after](/projects/sat-explo/intercalibration-fig3.png)
*Fig. 26 — Δh histograms before (left, mean = −0.435 m) and after correction (right, mean ~ 0.000 m). The bias is fully absorbed.*

![Error budget and fusion weights](/projects/sat-explo/intercalibration-fig4.png)
*Fig. 27 — Per-mission error budget and Gauss–Markov fusion weights.*

![Per-pass residuals before/after correction](/projects/sat-explo/intercalibration-fig5.png)
*Fig. 28 — Residuals (h_measured − h_true) per pass, before and after bias correction.*

---

## 2D Reconstruction via Spatio-Temporal Kriging

**Hypotheses:** The lake surface is quasi-horizontal (slope < 1 cm/km). Spatial correlations are long-range over a lake; temporal correlations follow the seasonal cycle. Variogram stationarity is assumed. The quasi-planarity constraint is enforced via Tikhonov-type smoothing to suppress unrealistic gradients.

**Method:** Simulation of an elliptical lake (40×25 km), 3 missions: Sentinel-3 (10 passes, σ = 2 cm), Jason-3 (8 passes, σ = 3 cm), CryoSat-2 (6 passes, σ = 4 cm). Experimental variogram on 500 subsampled points, fitted with spherical and Gaussian models. 2D Ordinary Kriging per time step with a ±10-day temporal window. 30×20 grid. Slope constraint via iterative diffusion (max 0.01 m/km, α = 0.3, 50 iterations).

**Results:**
- Multi-mission observations: Sentinel-3 (560 pts), Jason-3 (468 pts), CryoSat-2 (329 pts)
- Interpolation grid: 30×20, ~145 points over the lake
- Kriging uncertainty: σ ~ 2–3 cm near tracks, increasing at edges

![Multi-mission altimetric observations](/projects/sat-explo/krigeage-fig1.png)
*Fig. 29 — Multi-mission observations over the lake. Sentinel-3 (blue, 560 pts), Jason-3 (pink, 468 pts), CryoSat-2 (orange, 329 pts).*

![Experimental variogram and fitted models](/projects/sat-explo/krigeage-fig2.png)
*Fig. 30 — Left: experimental variogram with fitted spherical and Gaussian models. Right: number of pairs per distance class.*

![2D reconstruction and kriging uncertainty](/projects/sat-explo/krigeage-fig3.png)
*Fig. 31 — Top: reconstructed water level at t = 0, 15, 30, 45 days with observation tracks. Bottom: kriging uncertainty (σ in cm) — low near tracks, high at edges.*

![Validation: predicted vs true](/projects/sat-explo/krigeage-fig4.png)
*Fig. 32 — Predicted vs true scatter for 4 time steps with RMSE.*

---

## Large-Scale Dynamics — SWOT Approach

**Hypotheses:** SWOT provides 2D water level images (swath ~120 km) unlike nadir altimeters (1D). Flow velocity is derived using Manning's equation with uniform depth and roughness. Lagrangian tracking uses RK4 integration of the velocity field −∇(h). Water balance: dV/dt = Qin − Qout + P − E.

**Method:** Simulation of a 200×150 pixel basin (1 km resolution, 24 time steps at 15-day intervals). Central elliptical lake, 2 tributary rivers (north, east), 1 outlet (south). Xarray dataset chunked with Dask. Temporal statistics (mean, standard deviation, anomaly). Spatial gradients by differentiation. Velocity field via Manning (n = 0.03, depth = 5 m). Lagrangian tracking of 9 particles via RK4 (10 sub-steps). Hydrological balance: fluxes at control sections, lake volume, dV/dt vs net flux, residuals.

**Results:**
- Basin: 200×150 km, 24 time steps (1 year)
- Lake base elevation: 372 m, seasonal amplitude: ±2.0 m
- Mean hydraulic slope: ~0.3 mm/km (over water)
- 9 particles tracked over 360 days
- Hydrological balance: closure within ±10–30% (P−E residuals + numerical errors)

![Water surface elevation field snapshots](/projects/sat-explo/swot-fig1.png)
*Fig. 33 — WSE (Water Surface Elevation) field at t = 0, 90, 180, and 270 days. The central lake and tributary/outlet rivers are visible. Seasonal cycle of ±2 m.*

![Hydraulic gradients and velocity field](/projects/sat-explo/swot-fig2.png)
*Fig. 34 — Left: hydraulic slope magnitude (0–10 mm/km). Right: elevation field with flow direction vectors (−∇h).*

![Lagrangian tracking of water masses](/projects/sat-explo/swot-fig3.png)
*Fig. 35 — Lagrangian trajectories of 9 particles (green = start, red = end). Colored by time (days). Particles converge toward the southern outlet.*

![Simplified hydrological balance](/projects/sat-explo/swot-fig4.png)
*Fig. 36 — Top left: lake stored volume. Top right: fluxes at 3 control sections. Bottom left: dV/dt vs net flux. Bottom right: balance residual (P−E + errors).*
