"use client";

import { motion } from "framer-motion";

// Delay derivation:
//   Each branch delay = time when parent path animation reaches that junction.
//   junction_time = parent.delay + (junction_path_fraction * parent.dur)
//   path fractions estimated from segment arc lengths.
// All delay/dur values are 0.5× the original (2× speed).

const BRANCHES = [
  // TRUNK lower: (680,500)→(578,275), dur 0.9
  {
    d: "M 680 500 C 662 470 640 438 620 408 L 604 384 C 590 358 580 328 578 298 L 578 275",
    sw: 10,
    delay: 0,
    dur: 0.9,
  },
  // TRUNK upper: (578,275)→(628,140), starts at t=0.9, dur 0.43
  {
    d: "M 578 275 C 588 250 604 228 622 210 L 630 196 C 636 178 636 158 628 140",
    sw: 7,
    delay: 0.9,
    dur: 0.43,
  },
  // TRUNK tip: (628,140)→(498,8), starts at t=1.33, dur 0.38
  {
    d: "M 628 140 C 612 118 592 96 570 76 L 552 60 C 536 42 518 24 498 8",
    sw: 5,
    delay: 1.33,
    dur: 0.38,
  },

  // BRANCH-RIGHT-LOW: from (604,384) at t=0.5, dur 0.43
  {
    d: "M 604 384 C 636 370 668 358 700 350 L 724 344 C 748 338 770 326 786 310 L 794 296",
    sw: 6,
    delay: 0.5,
    dur: 0.43,
  },
  { d: "M 724 344 C 734 322 738 298 730 274", sw: 3.5, delay: 0.76, dur: 0.24 },
  { d: "M 786 310 C 794 288 796 264 788 240", sw: 3, delay: 0.89, dur: 0.24 },
  { d: "M 794 296 C 802 272 802 248 796 224", sw: 2.5, delay: 0.93, dur: 0.23 },
  // terminals
  { d: "M 730 274 C 736 250 736 226 728 202", sw: 2, delay: 1.0, dur: 0.2 },
  { d: "M 730 274 C 744 256 756 236 760 214", sw: 2, delay: 1.0, dur: 0.19 },
  { d: "M 788 240 C 792 216 788 192 780 170", sw: 2, delay: 1.13, dur: 0.19 },
  { d: "M 796 224 C 800 198 798 174 788 152", sw: 2, delay: 1.15, dur: 0.19 },

  // BRANCH-LEFT-MID: from (578,275) at t=0.9, dur 0.53
  {
    d: "M 578 275 C 550 262 520 252 490 246 L 460 242 C 428 240 396 242 364 248 L 334 256",
    sw: 6,
    delay: 0.9,
    dur: 0.53,
  },
  // drooping arm from (460,242) at t=1.17, dur 0.33
  {
    d: "M 460 242 C 444 260 424 276 402 288 L 378 298 C 354 306 328 310 302 308",
    sw: 3.5,
    delay: 1.17,
    dur: 0.33,
  },
  { d: "M 378 298 C 362 314 342 326 320 332", sw: 2.5, delay: 1.35, dur: 0.21 },
  { d: "M 302 308 C 284 316 264 320 244 318", sw: 2, delay: 1.49, dur: 0.19 },
  { d: "M 302 308 C 290 326 274 340 256 348", sw: 2, delay: 1.49, dur: 0.19 },
  // up-left arm from (364,248) at t=1.36, dur 0.35
  {
    d: "M 364 248 C 342 228 316 210 288 196 L 262 184 C 236 172 208 162 178 156",
    sw: 3.5,
    delay: 1.36,
    dur: 0.35,
  },
  // from (262,184) at t=1.56, dur 0.30
  {
    d: "M 262 184 C 248 164 230 146 210 132 L 192 120 C 176 108 158 96 138 88",
    sw: 3,
    delay: 1.56,
    dur: 0.3,
  },
  { d: "M 192 120 C 176 104 156 90 134 80", sw: 2, delay: 1.72, dur: 0.19 },
  { d: "M 192 120 C 188 102 180 84 168 68", sw: 2, delay: 1.72, dur: 0.19 },
  { d: "M 178 156 C 160 142 140 130 118 122", sw: 2, delay: 1.71, dur: 0.19 },
  { d: "M 178 156 C 168 170 154 182 138 190", sw: 2, delay: 1.71, dur: 0.19 },
  // upward sub from (334,256) at t=1.43, dur 0.28, end (240,200) at t=1.71
  {
    d: "M 334 256 C 314 238 290 222 264 210 L 240 200",
    sw: 3,
    delay: 1.43,
    dur: 0.28,
  },
  { d: "M 240 200 C 224 186 204 174 182 166", sw: 2, delay: 1.7, dur: 0.19 },
  { d: "M 240 200 C 236 182 228 164 216 148", sw: 2, delay: 1.7, dur: 0.19 },
  // drooping sub from (334,256) at t=1.43, end (282,296) at t=1.64
  { d: "M 334 256 C 320 272 302 286 282 296", sw: 2.5, delay: 1.43, dur: 0.21 },
  { d: "M 282 296 C 266 306 248 314 228 316", sw: 2, delay: 1.64, dur: 0.19 },

  // BRANCH-RIGHT-MID: from (630,196) at t=1.17, dur 0.40
  {
    d: "M 630 196 C 656 182 684 170 712 162 L 736 156 C 758 150 778 140 794 126 L 800 112",
    sw: 5.5,
    delay: 1.17,
    dur: 0.4,
  },
  { d: "M 736 156 C 746 134 750 110 744 86", sw: 3, delay: 1.41, dur: 0.24 },
  { d: "M 794 126 C 802 104 804 80 798 56", sw: 3, delay: 1.53, dur: 0.24 },
  { d: "M 800 112 C 806 88 806 64 798 40", sw: 2.5, delay: 1.57, dur: 0.23 },
  // terminals
  { d: "M 744 86 C 750 62 750 38 742 14", sw: 2, delay: 1.65, dur: 0.19 },
  { d: "M 744 86 C 758 66 768 44 770 20", sw: 2, delay: 1.65, dur: 0.19 },
  { d: "M 798 56 C 802 32 800 8 790 -14", sw: 2, delay: 1.77, dur: 0.19 },

  // TOP BRANCHES: from (552,60) at t=1.55
  {
    d: "M 552 60 C 534 38 512 16 488 -4 L 466 -20 C 442 -36 416 -48 388 -56",
    sw: 3.5,
    delay: 1.55,
    dur: 0.33,
  },
  { d: "M 466 -20 C 450 -38 430 -54 408 -66", sw: 2, delay: 1.73, dur: 0.19 },
  { d: "M 466 -20 C 454 -38 438 -54 420 -66", sw: 2, delay: 1.73, dur: 0.19 },
  // right
  { d: "M 552 60 C 568 38 580 14 586 -10", sw: 3, delay: 1.55, dur: 0.28 },
  { d: "M 586 -10 C 592 -32 592 -54 584 -74", sw: 2, delay: 1.82, dur: 0.19 },
  { d: "M 586 -10 C 598 -32 606 -54 608 -76", sw: 2, delay: 1.82, dur: 0.19 },
  // from trunk tip end (498,8) at t=1.70
  { d: "M 498 8 C 484 -12 466 -30 446 -44", sw: 2.5, delay: 1.7, dur: 0.21 },
  { d: "M 498 8 C 496 -12 490 -32 480 -50", sw: 2.5, delay: 1.7, dur: 0.2 },
];

const LEAVES = [
  // R-LOW — terminal tips
  { cx: 730, cy: 274, r: 7, delay: 1.24 },
  { cx: 722, cy: 266, r: 5, delay: 1.27 },
  { cx: 738, cy: 265, r: 5, delay: 1.29 },
  { cx: 726, cy: 258, r: 4, delay: 1.32 },

  { cx: 728, cy: 202, r: 6, delay: 1.24 },
  { cx: 720, cy: 194, r: 4, delay: 1.27 },
  { cx: 736, cy: 193, r: 4, delay: 1.29 },

  { cx: 760, cy: 214, r: 6, delay: 1.23 },
  { cx: 752, cy: 206, r: 4, delay: 1.26 },
  { cx: 768, cy: 205, r: 4, delay: 1.28 },

  { cx: 780, cy: 170, r: 6, delay: 1.36 },
  { cx: 772, cy: 162, r: 4, delay: 1.39 },
  { cx: 788, cy: 161, r: 4, delay: 1.41 },

  { cx: 788, cy: 152, r: 6, delay: 1.38 },
  { cx: 780, cy: 144, r: 4, delay: 1.41 },
  { cx: 796, cy: 143, r: 4, delay: 1.43 },

  // L-MID — drooping arm tips
  { cx: 320, cy: 332, r: 6, delay: 1.6 },
  { cx: 312, cy: 340, r: 4, delay: 1.62 },
  { cx: 328, cy: 340, r: 4, delay: 1.65 },

  { cx: 244, cy: 318, r: 6, delay: 1.72 },
  { cx: 236, cy: 326, r: 4, delay: 1.75 },
  { cx: 252, cy: 326, r: 4, delay: 1.77 },

  { cx: 256, cy: 348, r: 5, delay: 1.72 },
  { cx: 248, cy: 356, r: 4, delay: 1.75 },

  // L-MID — up-left arm tips
  { cx: 134, cy: 80, r: 7, delay: 1.95 },
  { cx: 126, cy: 72, r: 5, delay: 1.98 },
  { cx: 142, cy: 71, r: 5, delay: 2.0 },
  { cx: 130, cy: 64, r: 4, delay: 2.03 },

  { cx: 168, cy: 68, r: 6, delay: 1.95 },
  { cx: 160, cy: 60, r: 4, delay: 1.98 },
  { cx: 176, cy: 59, r: 4, delay: 2.0 },

  { cx: 118, cy: 122, r: 6, delay: 1.94 },
  { cx: 110, cy: 114, r: 4, delay: 1.97 },
  { cx: 126, cy: 113, r: 4, delay: 1.99 },

  { cx: 138, cy: 190, r: 5, delay: 1.94 },
  { cx: 130, cy: 198, r: 4, delay: 1.97 },
  { cx: 146, cy: 197, r: 4, delay: 1.99 },

  { cx: 182, cy: 166, r: 6, delay: 1.93 },
  { cx: 174, cy: 158, r: 4, delay: 1.96 },
  { cx: 190, cy: 157, r: 4, delay: 1.98 },

  { cx: 216, cy: 148, r: 5, delay: 1.93 },
  { cx: 208, cy: 140, r: 4, delay: 1.96 },
  { cx: 224, cy: 139, r: 4, delay: 1.98 },

  { cx: 228, cy: 316, r: 5, delay: 1.87 },
  { cx: 220, cy: 322, r: 4, delay: 1.89 },
  { cx: 236, cy: 322, r: 4, delay: 1.92 },

  { cx: 240, cy: 200, r: 6, delay: 1.93 },
  { cx: 232, cy: 192, r: 4, delay: 1.96 },
  { cx: 248, cy: 191, r: 4, delay: 1.98 },

  // R-MID — terminal tips
  { cx: 744, cy: 86, r: 7, delay: 1.69 },
  { cx: 736, cy: 78, r: 5, delay: 1.71 },
  { cx: 752, cy: 77, r: 5, delay: 1.74 },
  { cx: 740, cy: 70, r: 4, delay: 1.76 },

  { cx: 742, cy: 14, r: 6, delay: 1.88 },
  { cx: 734, cy: 6, r: 4, delay: 1.9 },
  { cx: 750, cy: 5, r: 4, delay: 1.93 },

  { cx: 770, cy: 20, r: 6, delay: 1.88 },
  { cx: 762, cy: 12, r: 4, delay: 1.9 },
  { cx: 778, cy: 11, r: 4, delay: 1.93 },

  { cx: 790, cy: -14, r: 6, delay: 2.0 },
  { cx: 782, cy: -22, r: 4, delay: 2.02 },
  { cx: 798, cy: -22, r: 4, delay: 2.05 },

  // TOP — terminal tips
  { cx: 388, cy: -56, r: 7, delay: 1.91 },
  { cx: 380, cy: -64, r: 5, delay: 1.94 },
  { cx: 396, cy: -64, r: 5, delay: 1.96 },
  { cx: 384, cy: -72, r: 4, delay: 1.99 },

  { cx: 408, cy: -66, r: 6, delay: 1.96 },
  { cx: 400, cy: -74, r: 4, delay: 1.98 },
  { cx: 416, cy: -73, r: 4, delay: 2.01 },

  { cx: 420, cy: -66, r: 5, delay: 1.96 },
  { cx: 412, cy: -74, r: 4, delay: 1.98 },

  { cx: 584, cy: -74, r: 6, delay: 2.05 },
  { cx: 576, cy: -82, r: 4, delay: 2.08 },
  { cx: 592, cy: -82, r: 4, delay: 2.1 },

  { cx: 608, cy: -76, r: 5, delay: 2.05 },
  { cx: 600, cy: -84, r: 4, delay: 2.08 },
  { cx: 616, cy: -84, r: 4, delay: 2.1 },

  { cx: 446, cy: -44, r: 6, delay: 1.95 },
  { cx: 438, cy: -52, r: 4, delay: 1.98 },
  { cx: 454, cy: -52, r: 4, delay: 2.0 },

  { cx: 480, cy: -50, r: 6, delay: 1.94 },
  { cx: 472, cy: -58, r: 4, delay: 1.97 },
  { cx: 488, cy: -58, r: 4, delay: 1.99 },

  // junction accent flowers
  { cx: 604, cy: 384, r: 5, delay: 0.53 },
  { cx: 578, cy: 275, r: 5, delay: 0.93 },
  { cx: 724, cy: 344, r: 5, delay: 0.79 },
  { cx: 460, cy: 242, r: 5, delay: 1.19 },
  { cx: 630, cy: 196, r: 5, delay: 1.19 },
  { cx: 364, cy: 248, r: 5, delay: 1.39 },
  { cx: 736, cy: 156, r: 5, delay: 1.43 },
];

// 5-petal plum blossom path centered at (cx, cy) with outer radius r
function flowerPath(cx: number, cy: number, r: number): string {
  const pr = +(r * 0.55).toFixed(2);
  const dist = +(r * 0.48).toFixed(2);
  const pr2 = +(pr * 2).toFixed(2);
  const parts: string[] = [];
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * 2 * Math.PI - Math.PI / 2;
    const px = +(cx + dist * Math.cos(a)).toFixed(2);
    const py = +(cy + dist * Math.sin(a)).toFixed(2);
    parts.push(
      `M${px - pr} ${py} a${pr} ${pr} 0 1 0 ${pr2} 0 a${pr} ${pr} 0 1 0 ${-pr2} 0`,
    );
  }
  return parts.join(" ");
}

export function GrowingTree() {
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 bottom-28 overflow-hidden opacity-[0.2]">
      <svg
        viewBox="0 0 800 500"
        preserveAspectRatio="xMaxYMax meet"
        className="h-full w-full"
        style={{ overflow: "visible" }}
        aria-hidden="true"
      >
        {BRANCHES.map((b, i) => (
          <motion.path
            key={i}
            d={b.d}
            stroke="currentColor"
            strokeWidth={b.sw}
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: b.dur, delay: b.delay, ease: "easeOut" }}
          />
        ))}
        {LEAVES.map((l, i) => (
          <motion.path
            key={i}
            d={flowerPath(l.cx, l.cy, l.r)}
            fill="currentColor"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 0.23,
              delay: l.delay,
              type: "spring",
              stiffness: 200,
              damping: 15,
            }}
            style={{ transformOrigin: `${l.cx}px ${l.cy}px` }}
          />
        ))}
      </svg>
    </div>
  );
}
