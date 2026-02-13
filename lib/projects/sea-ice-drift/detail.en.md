# Sea Ice Drift Estimation: MCC vs CMCC

## Introduction

From my 2010 publication with MR. Thomas Lavergne, I decided to explore again and code this project to have a global study. Indeed, this study evaluates two cross-correlation methods for estimating Arctic sea ice drift from satellite imagery: Maximum Cross-Correlation (MCC, discrete integer-pixel) and Continuous MCC (CMCC, sub-pixel refinement). Following the methodology of Lavergne et al. (2010, JGR), we compare both methods across three sensor configurations — AMSR2 passive microwave at 36 GHz and 89 GHz, and ASCAT C-band scatterometer — progressing from controlled synthetic experiments to realistic multi-sensor trajectory tracking over the Arctic Ocean. Validation uses IABP drifting buoy GPS tracks as ground truth.

## Methodology

### Drift estimation

MCC estimates ice displacement by extracting a template patch from a reference image and sliding it across a search area in a subsequent image. At each integer-pixel offset, the Normalized Cross-Correlation (NCC) is computed. The displacement is the offset that maximizes NCC. This limits resolution to 1 pixel — at AMSR2's 12.5 km grid, a 12.5 km error floor.

CMCC refines MCC's integer peak by fitting a cubic interpolation surface to the 7x7 neighborhood of the NCC maximum, then applying Nelder-Mead optimization on the continuous surface. This recovers the true sub-pixel peak location, eliminating quantization noise.

For multi-channel estimation (JGR Eq. 2), individual NCC surfaces from each channel are summed before sub-pixel optimization: ρ_total = Σ ρ_c. This exploits complementary texture from different polarizations or frequencies.

### Preprocessing

A Laplace-of-Gaussian filter (tunable σ) is applied to brightness temperature fields before correlation. The filter acts as a high-pass operator, enhancing edges, leads, deformation zones, and ice-type boundaries while suppressing large-scale gradients. This sharpens NCC peaks, improving both MCC feature matching and CMCC sub-pixel localization. Empirically, Laplace filtering is the single most impactful processing step — reducing RMSE by 60% on real data, far exceeding the MCC-to-CMCC improvement.

### Sensors

| Sensor | Channel | Frequency | Pixel size | Observable | Texture quality |
|---|---|---|---|---|---|
| AMSR2 | 36H | 36.5 GHz | 12.5 km | Brightness temperature (Tb) | Low — smooth, deep penetration |
| AMSR2 | 89H | 89.0 GHz | 12.5 km | Brightness temperature (Tb) | Moderate — surface roughness |
| AMSR2 | 89V | 89.0 GHz | 12.5 km | Brightness temperature (Tb) | Moderate-high — emissivity gradients |
| ASCAT | σ0 | 5.255 GHz (C-band) | 12.5 km | Backscatter coefficient | Low — weak ice texture |

All channels are on the NSIDC 12.5 km polar stereographic grid (AU_SI12 product). Native AMSR2 89 GHz resolution (~5 km) is degraded by this gridding — a significant factor in the gap to JGR-level accuracy.

### Validation

Ground truth comes from IABP (International Arctic Buoy Programme) GPS-tracked drifting buoys deployed across the Arctic. Buoy positions are interpolated to satellite image acquisition times and projected onto the NSIDC polar stereographic grid. Each buoy's observed displacement is compared to the nearest estimated drift vector. Quality filters remove unreliable matches: NCC correlation < 0.5 (poor feature match), search-radius edge hits (displacement at boundary of search area), and spatial proximity constraints. After filtering, typically 28-40 buoys remain per image pair (from ~70 raw Arctic buoys).

Metrics: RMSE and MAE measure displacement magnitude error in km. Direction error measures angular deviation. Final Position Error (FPE) measures endpoint accuracy after multi-step Lagrangian tracking.

---

## Synthetic Validation

Synthetic experiments use Gaussian-filtered white noise images with known sub-pixel displacements, isolating intrinsic algorithm precision from data quality.

### Single-pair precision (Scenario A)

A 2D displacement sweep over [0, 2] x [0, 2] px (step 0.1, 441 test points) reveals the fundamental error structure of each method:

| Metric | MCC | CMCC |
|---|---|---|
| RMSE | 0.40 px | 0.012 px |
| Ratio | — | **33x better** |
| Gate (< 0.1 px) | FAIL | **PASS** (7.5x margin) |

MCC's error follows a checkerboard pattern (left): maximum at half-pixel displacements (~0.7 px), zero at integers. This is irreducible quantization noise — a property of discrete search, independent of SNR or template size. CMCC (right) shows uniformly low error (~0.01 px) regardless of displacement.

![Error heatmaps — MCC checkerboard vs CMCC flat](/projects/sea-ice-drift/fig_A_error_heatmaps.png)

At AMSR2 resolution (12.5 km/px): MCC's quantization floor = 5.0 km; CMCC precision = 150 m.

### Error accumulation over trajectories (Scenario B)

Tracking a point through 15 steps at constant velocity (1.3, 0.7) px/step reveals fundamentally different error growth:

| Metric | MCC | CMCC |
|---|---|---|
| Final position error | 6.36 px | 0.026 px |
| Ratio | — | **248x** |
| Growth model | linear (0.42 px/step) | √N (0.004 px/√step) |
| Physical (AMSR2, 30 days) | 79.5 km | 0.3 km |

MCC's systematic quantization bias compounds linearly — the same rounding error every step. CMCC's zero-mean random errors follow a random walk (√N growth). Over 15 steps, this difference magnifies from 33x (single pair) to 248x.

![Error growth — linear (MCC) vs √N (CMCC)](/projects/sea-ice-drift/fig_B_error_growth.png)

**Physical implication:** For 30-day Arctic tracking at 48h cadence (15 pairs), MCC accumulates ~80 km of position error from quantization alone. CMCC keeps this contribution below 0.3 km. This makes CMCC essential for Lagrangian trajectory products — but only if the sensor provides sufficient texture for reliable sub-pixel fitting.

---

## Single-Sensor Real Data (AMSR2 36 GHz)

### Two-image validation (Scenario C)

Applied to AMSR2 36.5 GHz horizontal polarization (Nov 15-17, 2016, 48h baseline), validated against 37-38 IABP buoys:

| Metric | MCC | CMCC | JGR ref (85 GHz) |
|---|---|---|---|
| RMSE | 15.4 km | 14.6 km | 2.5 km |
| MAE | 10.9 km | 10.5 km | — |
| Direction error | 15.7° | 32.9° | — |
| Improvement | — | **+5%** | +40% |

The Laplace filter dominates all other factors. Raw brightness temperature yields 37 km RMSE; Laplace σ=1.0 reduces this to 15 km — a **60% improvement**. The MCC-to-CMCC gain is only 5%, far below JGR's reported 40% at 85 GHz.

![Raw vs Laplace-filtered AMSR2 36H brightness temperature](/projects/sea-ice-drift/fig_C_raw_vs_laplace.png)

The four-panel drift field comparison reveals the qualitative difference: MCC vectors are quantized and blocky; CMCC with Laplace produces smooth, physically coherent patterns with visible shear zones.

![Drift fields — MCC/CMCC x raw/Laplace](/projects/sea-ice-drift/fig_C_drift_fields.png)

**Direction error paradox:** CMCC achieves lower magnitude RMSE (14.6 vs 15.4 km) but *worse* direction error (33° vs 16°). At small displacements (~1.65 px mean), sub-pixel corrections of ~0.2 px can rotate the displacement vector significantly while barely changing its magnitude. This paradox would resolve at higher frequencies where displacements are larger relative to sub-pixel corrections.

**Why CMCC improvement is marginal at 36 GHz:** The 36.5 GHz channel penetrates deep into the snow/ice volume, producing smooth Tb fields with low spatial texture contrast. NCC peaks are broad and rounded, leaving the cubic interpolation surface poorly constrained for sub-pixel localization. The mean sub-pixel correction is only ~0.2 px — minimal compared to the ~50 km per-step geophysical error.

### One-month trajectories (Scenario D)

Extended to Nov 1-29, 2016 (14 pairs, 48h cadence), tracking 67 buoys over 28 days:

| Metric | MCC | CMCC |
|---|---|---|
| FPE mean | 94.2 km | 98.1 km |
| MCC/CMCC ratio | — | **1.0x** |

The synthetic 248x advantage **completely vanishes**. Both methods perform identically on real 36 GHz data. The error ratio hovers at 1.0 throughout the 28-day period.

![Error growth over 28 days — MCC and CMCC indistinguishable](/projects/sea-ice-drift/fig_D_error_growth.png)

**Root cause:** Geophysical noise (~50 km per step) is 8x larger than MCC's quantization bias (~6 km). Ice deformation, lead opening, atmospheric contamination, and template decorrelation dominate the error budget. CMCC's sub-pixel refinement corrects a noise source that is negligible compared to these real-world factors at 36 GHz.

---

## Multi-Channel and Multi-Sensor Results

### 89 GHz multi-channel (Scenario E)

Switching to AMSR2 89 GHz H+V polarization (same dates, same buoys) and applying multi-channel NCC summation:

| Method | RMSE (km) | N buoys |
|---|---|---|
| 36H CMCC (baseline) | 15.03 | 38 |
| 89V CMCC (best mono) | 12.12 | 29 |
| **Multi CMCC (89H+89V)** | **11.55** | **29** |

**89 GHz improves RMSE by 23% over 36 GHz** — the largest single improvement since the Laplace filter. Despite AU_SI12 gridding degrading native 89 GHz resolution from ~5 km to 12.5 km, enough surface texture (emissivity gradients at ice-type boundaries, lead signatures) survives to produce sharper NCC peaks.

89V outperforms 89H: vertical polarization emissivity gradients at ice-type boundaries (first-year/multi-year, ice/water) create stronger spatial texture than horizontal polarization roughness signatures.

Multi-channel fusion adds a modest +4.7% on top. The gain is limited because H and V channels from the same swath and frequency share partially correlated noise — the √2 SNR improvement from perfectly independent channels is not achieved.

![RMSE comparison — all methods with JGR reference line](/projects/sea-ice-drift/fig_E_rmse_comparison.png)

### Multi-sensor fusion with ASCAT (Scenario F)

Adding ASCAT C-band scatterometer to the multi-channel AMSR2 tracker over 28 days:

| Config | Step-1 RMSE (km) | FPE mean (km) | FPE median (km) |
|---|---|---|---|
| **AMSR2 multi-ch** | **27.8** | **167.5** | **74.0** |
| Merged (equal wt) | 31.8 | 258.6 | 221.2 |
| ASCAT only | 36.6 | 389.2 | 405.6 |

**Equal-weight fusion degrades accuracy by 14%.** ASCAT's C-band backscatter provides insufficient sea ice texture for reliable NCC matching — drift fields are spatially incoherent with mean divergence 50% higher than AMSR2-only. Averaging these poor estimates with high-quality AMSR2 vectors dilutes accuracy systematically.

![Error growth — AMSR2 consistently better than merged or ASCAT-only](/projects/sea-ice-drift/fig_F_error_growth.png)

The AMSR2-only 89 GHz multi-channel configuration achieves +46% improvement over the 36 GHz baseline (27.8 vs 52 km per-step RMSE), confirming that **channel frequency and texture quality matter more than sensor count**.

---

## Conclusions

| Scenario | Sensor | Best Method | RMSE | Key Result |
|---|---|---|---|---|
| A | Synthetic | CMCC | 0.012 px | 33x better than MCC |
| B | Synthetic | CMCC | 0.026 px FPE | 248x better, √N vs linear |
| C | AMSR2 36H | CMCC Laplace | 14.6 km | Only +5% |
| D | AMSR2 36H (28d) | — | ~95 km FPE | No CMCC advantage |
| E | AMSR2 89H+89V | Multi CMCC | 11.55 km | +23% over 36 GHz |
| F | AMSR2+ASCAT (28d) | AMSR2 multi-ch | 27.8 km/step | Fusion hurts |

### Key findings

1. **CMCC eliminates quantization noise.** On synthetic data, CMCC achieves 33x better single-pair precision (0.012 vs 0.40 px) and 248x better trajectory accuracy over 15 steps. Error growth follows √N (random walk) instead of MCC's linear accumulation. At AMSR2 resolution, this translates to 0.3 km vs 79.5 km over 30 days.

2. **Real-data CMCC advantage depends on NCC peak sharpness.** At 36 GHz, broad NCC peaks from smooth Tb fields yield only +5% improvement. At 89 GHz, sharper peaks from richer surface texture yield +23%. The sub-pixel refinement is only as good as the correlation surface it optimizes on.

3. **Laplace pre-filtering is the single largest improvement.** A Laplace-of-Gaussian filter (σ=1.0) reduces RMSE by 60% on real data (37 → 15 km) — far exceeding MCC→CMCC gains. It enhances edges, leads, and deformation features that drive NCC peak quality. Over-smoothing (σ > 1.5) destroys texture and degrades performance.

4. **89 GHz provides substantially more texture than 36 GHz.** The 23% RMSE improvement from 36→89 GHz is the largest factor after Laplace filtering. 89 GHz is more sensitive to surface properties (ice-type boundaries, snow grain structure, leads) than 36 GHz, which penetrates deeper and averages over the snow/ice volume.

5. **Equal-weight multi-sensor fusion is counterproductive when sensor quality is asymmetric.** Adding ASCAT σ0 to AMSR2 via equal-weight averaging degrades accuracy by 14%. ASCAT's C-band backscatter lacks sufficient sea ice texture for reliable NCC matching. Effective fusion requires correlation-weighted or conditional merging — using each sensor only where it provides reliable information.

6. **Gap to JGR reference: 4.6-11x.** Our best results (11.55 km single-pair, 27.8 km/step trajectory) are 4.6-11x worse than JGR's reported 2.5 km σ. The primary cause is AU_SI12 gridding: native AMSR2 89 GHz resolution (~5 km) is degraded to 12.5 km during product generation. The algorithm is correct and validated; input data resolution is the bottleneck. Swath-level (L1) processing would close this gap.

7. **Direction error paradox.** CMCC consistently improves magnitude RMSE but worsens direction error (33° vs 16° at 36 GHz). At small displacements (~1-2 px), sub-pixel corrections of ~0.2 px can rotate the displacement vector by 10-20° while barely changing its magnitude. This is a fundamental scale-dependent trade-off that diminishes with larger displacements or higher-resolution imagery.
