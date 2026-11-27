"use client";

import { motion, type MotionValue } from "motion/react";
import { useEffect, useRef } from "react";
import { LUXURY_EASE } from "./MotionPrimitives";

interface SilkVeilHeroProps {
  /** Base sculptural (stone) portrait URL */
  src: string;
  /** Optional 1:1 pixel-aligned living-skin portrait URL for the 5-second finger-touch reveal */
  livingSrc?: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  /** CSS object-position as [x, y] fractions (0..1) so WebGL sampling matches object-cover 1:1 */
  objectPosition?: [number, number];
  /** Minimum texture X (0..1) where optional 3D sunlight shimmer activates */
  shimmerMinX?: number;
  /** Keep legacy sunlit champagne rays toggleable (off by default when living reveal is active) */
  enableShimmer?: boolean;
  /** Optional 0..1 scroll-driven progress for the stone -> living skin reveal (when set, replaces auto-play timer) */
  revealProgress?: MotionValue<number>;
  /** Shared 0..1 hero exit progress MotionValue */
  scrollProgress?: MotionValue<number>;
}

const VERT_SRC = `
attribute vec2 a_pos;
varying vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

// Unified WebGL shader:
// 1) Primary mode (u_hasLiving > 0.5): 5-second quiet choreography where warmth awakens
//    from the fingertips cradling the cheeks (left cheek first -> asymmetric stone/skin beat ->
//    right cheek & lips -> upper-right temple gold vein melts last -> quiet breath of light).
// 2) Optional legacy sunlit champagne shimmer preserved behind u_enableShimmer (off by default).
const FRAG_SRC = `
precision highp float;

varying vec2 v_uv;
uniform sampler2D u_tex;
uniform sampler2D u_livingTex;
uniform float u_hasLiving;
uniform float u_enableShimmer;
uniform float u_time;
uniform float u_animTime;
uniform float u_scroll;
uniform vec2 u_mouse;
uniform vec2 u_res;
uniform vec2 u_imgRes;
uniform vec2 u_objPos;
uniform float u_shimmerMinX;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 3; i++) {
    v += a * noise(p);
    p = p * 2.03 + vec2(13.7, 7.3);
    a *= 0.5;
  }
  return v;
}

// Matches CSS object-cover + object-position 1:1 in WebGL bottom-up UV space
vec2 coverUv(vec2 uv) {
  float canvasAspect = u_res.x / max(u_res.y, 1.0);
  float imgAspect = u_imgRes.x / max(u_imgRes.y, 1.0);
  vec2 outUv = uv;
  if (canvasAspect > imgAspect) {
    float scaleY = imgAspect / canvasAspect;
    float cropY = 1.0 - scaleY;
    outUv.y = (1.0 - u_objPos.y) * cropY + uv.y * scaleY;
  } else {
    float scaleX = canvasAspect / imgAspect;
    float cropX = 1.0 - scaleX;
    outUv.x = u_objPos.x * cropX + uv.x * scaleX;
  }
  return clamp(outUv, 0.001, 0.999);
}

float sampleHeight(vec2 uv) {
  vec3 c = texture2D(u_tex, clamp(uv, 0.002, 0.998)).rgb;
  return dot(c, vec3(0.299, 0.587, 0.114));
}

float sunRibbon(float coord, float center, float width) {
  float x = (coord - center) / width;
  return exp(-(x * x));
}

vec4 computeLegacyShimmer(vec2 uv, vec2 texUv) {
  float t = u_time;
  float lum = sampleHeight(texUv);

  float e1 = 0.009;
  float e2 = 0.022;
  float gx1 = sampleHeight(texUv + vec2(e1, 0.0)) - sampleHeight(texUv - vec2(e1, 0.0));
  float gy1 = sampleHeight(texUv + vec2(0.0, e1)) - sampleHeight(texUv - vec2(0.0, e1));
  float gx2 = sampleHeight(texUv + vec2(e2, 0.0)) - sampleHeight(texUv - vec2(e2, 0.0));
  float gy2 = sampleHeight(texUv + vec2(0.0, e2)) - sampleHeight(texUv - vec2(0.0, e2));

  float gx = gx1 * 0.45 + gx2 * 0.55;
  float gy = gy1 * 0.45 + gy2 * 0.55;

  vec3 faceNormal = normalize(vec3(-gx * 3.6, -gy * 3.6, 1.0));
  float curvatureBoost = clamp(length(vec2(gx, gy)) * 3.8, 0.0, 0.50);
  float faceMask = clamp(
    smoothstep(0.54, 0.88, lum) + curvatureBoost * smoothstep(0.42, 0.78, lum),
    0.0,
    1.0
  );

  float aspect = u_res.x / max(u_res.y, 1.0);
  vec2 d = vec2((uv.x - u_mouse.x) * aspect, uv.y - u_mouse.y);
  float pointerGlow = exp(-dot(d, d) * 6.5);
  vec2 q = uv + d * (pointerGlow * 0.032);

  float s = smoothstep(0.0, 1.0, u_scroll);
  vec3 sunDir = normalize(vec3(
    sin(t * 0.48 + s * 2.1) * 0.62 + (u_mouse.x - 0.5) * 0.45,
    cos(t * 0.36 - s * 1.2) * 0.42 + (u_mouse.y - 0.5) * 0.35 + 0.25,
    0.76
  ));
  vec3 halfSun = normalize(sunDir + vec3(0.0, 0.0, 1.0));

  float spec3D = pow(max(dot(faceNormal, halfSun), 0.0001), 12.0);
  float slopeLit = smoothstep(0.32, 0.94, dot(faceNormal, sunDir));

  float w1 = (noise(q * 2.8 + vec2(t * 0.16, -t * 0.11)) - 0.5) * 0.11;
  float w2 = (noise(q * 5.2 + vec2(-t * 0.12, t * 0.18)) - 0.5) * 0.05;
  float warp = w1 + w2 + (lum - 0.62) * 0.16 + gx * 0.12 - gy * 0.08;
  float diag = q.x * 0.78 + (1.0 - q.y) * 0.62 + warp;

  float pos1 = fract(0.22 + t * 0.055 + s * 0.55) * 1.45 - 0.20;
  float pos2 = fract(0.56 + t * 0.042 + s * 0.42) * 1.45 - 0.20;
  float pos3 = fract(0.84 + t * 0.064 + s * 0.65) * 1.45 - 0.20;

  float rays = clamp(
    (sunRibbon(diag, pos1, 0.072) + sunRibbon(diag, pos2, 0.090) * 0.80 + sunRibbon(diag, pos3, 0.058) * 0.68) *
    (0.66 + 0.34 * (0.55 + 0.45 * sin(diag * 34.0 - t * 1.35 + warp * 10.0))),
    0.0,
    1.0
  );

  float ray3D = rays * (0.58 + 0.42 * slopeLit) + rays * spec3D * 0.48;
  float sunGlint = spec3D * smoothstep(0.60, 0.90, lum) * 0.24;
  float cursorShimmer = pointerGlow * (0.45 + 0.55 * sin(diag * 22.0 - t * 1.1)) * (0.36 + 0.24 * spec3D);

  float lightSignal = clamp((ray3D + cursorShimmer) * faceMask + sunGlint, 0.0, 1.0);
  vec3 color = mix(vec3(0.97, 0.85, 0.62), vec3(1.00, 0.97, 0.88), smoothstep(0.22, 0.86, lightSignal));

  float regionMask = smoothstep(u_shimmerMinX, u_shimmerMinX + 0.14, texUv.x);
  float edgeFade =
    regionMask *
    smoothstep(0.0, 0.05, uv.x) *
    smoothstep(0.0, 0.04, 1.0 - uv.x) *
    smoothstep(0.0, 0.04, uv.y) *
    smoothstep(0.0, 0.05, 1.0 - uv.y);

  float alpha = clamp(lightSignal * 0.46, 0.0, 0.48) * edgeFade;
  return vec4(color * alpha, alpha);
}

void main() {
  vec2 uv = v_uv;
  vec2 texUv = coverUv(uv);

  if (u_hasLiving < 0.5) {
    if (u_enableShimmer > 0.5) {
      gl_FragColor = computeLegacyShimmer(uv, texUv);
    } else {
      gl_FragColor = vec4(0.0);
    }
    return;
  }

  float t = u_animTime;
  float imgAspect = u_imgRes.x / max(u_imgRes.y, 1.0);

  vec3 stoneCol = texture2D(u_tex, texUv).rgb;
  vec3 livingCol = texture2D(u_livingTex, texUv).rgb;
  float stoneLum = dot(stoneCol, vec3(0.299, 0.587, 0.114));
  float livingLum = dot(livingCol, vec3(0.299, 0.587, 0.114));

  // Aspect-corrected organic noise for soft, blush-like irregular reveal frontier
  vec2 pAspect = vec2(texUv.x * imgAspect, texUv.y);
  float organic = (fbm(pAspect * 5.2 + vec2(0.0, -t * 0.06)) - 0.5) * 0.12;
  float fineOrg = (noise(pAspect * 14.0) - 0.5) * 0.035;
  float warp = organic + fineOrg;

  // Automatically select anatomical anchor coordinates for wide (16:9 desktop) vs portrait (mobile)
  bool isPortrait = imgAspect < 1.0;
  vec2 wristStart  = isPortrait ? vec2(0.28, 0.08)  : vec2(0.625, 0.04);
  vec2 wristEnd    = isPortrait ? vec2(0.14, 0.50)  : vec2(0.568, 0.46);
  vec2 leftFinger  = isPortrait ? vec2(0.14, 0.50)  : vec2(0.575, 0.44);
  vec2 rightFinger = isPortrait ? vec2(0.92, 0.48)  : vec2(0.935, 0.35);
  vec2 templePos   = isPortrait ? vec2(0.92, 0.84)  : vec2(0.955, 0.865);
  float maxReach   = isPortrait ? 1.05              : 1.18;

  // --- BEAT 1 (0.15s -> 1.0s): Warm golden glint glides up left wrist to fingertips ---
  float glintT = clamp((t - 0.15) / 0.85, 0.0, 1.0);
  float glintActive = smoothstep(0.0, 0.18, glintT) * (1.0 - smoothstep(0.78, 1.0, glintT));
  vec2 wristPos = mix(wristStart, wristEnd, smoothstep(0.0, 1.0, glintT));
  wristPos.x -= sin(glintT * 3.14159) * (isPortrait ? 0.035 : 0.022);
  vec2 dWrist = (texUv - wristPos) * vec2(imgAspect, 1.0);
  float wristGlint = exp(-dot(dWrist, dWrist) * 68.0) * glintActive * smoothstep(0.45, 0.88, stoneLum);

  // --- BEAT 2 (0.85s -> 3.4s): Warmth blooms asymmetrically from fingertips ---
  // Origin 1: Left fingertips touching left cheek (starts at 0.85s)
  float dLeft = length((texUv - leftFinger) * vec2(imgAspect * 0.92, 1.0)) + warp;
  float pLeft = smoothstep(0.85, 3.65, t);
  float rLeft = pLeft * maxReach;
  float maskLeft = 1.0 - smoothstep(rLeft - 0.17, rLeft + 0.03, dLeft);

  // Origin 2: Right fingertips touching right cheek (delayed by 0.85s -> asymmetric contrast!)
  float dRight = length((texUv - rightFinger) * vec2(imgAspect * 0.95, 1.0)) + warp * 0.9;
  float pRight = smoothstep(1.70, 4.05, t);
  float rRight = pRight * (maxReach * 0.88);
  float maskRight = 1.0 - smoothstep(rRight - 0.17, rRight + 0.03, dRight);

  // --- BEAT 3 (2.6s -> 4.35s): Lips & center settle, upper-right temple gold vein melts LAST ---
  float dTemple = length((texUv - templePos) * vec2(imgAspect, 1.0)) + organic * 0.5;
  // Local holdback zone right around the blue stone & gold vein at upper-right temple
  float templeZone = 1.0 - smoothstep(0.08, 0.30, dTemple);
  float templeRelease = smoothstep(3.45, 4.32, t);

  float combined = max(maskLeft, maskRight);
  // Hold back the temple vein until 3.45s -> 4.32s so it is literally the last to melt
  float reveal = mix(combined, combined * templeRelease, templeZone * (1.0 - templeRelease));

  // Gentle completion sweep so far background corners reach 1.0 cleanly by 4.35s
  float fullSettle = smoothstep(3.75, 4.40, t);
  reveal = clamp(max(reveal, fullSettle * (1.0 - templeZone * (1.0 - templeRelease))), 0.0, 1.0);

  // Soft warm subsurface blush along the moving stone->skin boundary
  float frontier = reveal * (1.0 - reveal) * 4.0;
  float faceWeight = isPortrait ? 1.0 : smoothstep(0.45, 0.56, texUv.x);
  vec3 warmBlushEdge = vec3(1.00, 0.84, 0.66) * frontier * 0.11 * faceWeight;

  // Final delicate golden catch-light on the temple vein right as it dissolves (3.4s -> 4.35s)
  float templeMeltGlow =
    templeZone *
    smoothstep(3.35, 3.85, t) *
    (1.0 - smoothstep(3.95, 4.40, t)) *
    smoothstep(0.42, 0.82, stoneLum) *
    0.22;

  // --- BEAT 4 (4.25s -> 5.25s): Quiet hydrated "breath of light" settling into calm skin ---
  float breathPhase = (t - 4.72) / 0.34;
  float breath = exp(-(breathPhase * breathPhase)) * step(4.1, t);
  float dewyHighlights = smoothstep(0.56, 0.88, livingLum) * faceWeight;
  vec3 breathGlow = vec3(1.00, 0.94, 0.86) * breath * dewyHighlights * 0.055;

  // Compose living color over stone base (output straight premultiplied alpha over base <img>)
  vec3 glowAdd = warmBlushEdge + vec3(1.0, 0.87, 0.62) * (wristGlint * 0.38 + templeMeltGlow) + breathGlow;

  if (u_enableShimmer > 0.5) {
    vec4 shim = computeLegacyShimmer(uv, texUv);
    glowAdd += shim.rgb;
  }

  // Blend living photo onto stone photo, then add localized warm transition light
  vec3 finalRgb = mix(stoneCol, livingCol, reveal) + glowAdd;
  // Only paint where reveal > 0 or glow > 0; at t=0 canvas is fully transparent over crisp stone <img>
  float activeAlpha = clamp(max(reveal, clamp(length(glowAdd) * 3.5, 0.0, 1.0)), 0.0, 1.0);

  gl_FragColor = vec4(finalRgb * activeAlpha, activeAlpha);
}
`;

const REVEAL_SETTLE_SEC = 5.55;

export function SilkVeilHero({
  src,
  livingSrc,
  alt,
  className = "",
  imgClassName = "",
  objectPosition = [0.5, 0.2],
  shimmerMinX = 0,
  enableShimmer = false,
  revealProgress,
  scrollProgress,
}: SilkVeilHeroProps) {
  const objPosX = objectPosition[0];
  const objPosY = objectPosition[1];
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const revealTargetRef = useRef(0);
  const revealCurrRef = useRef(0);
  const wakeRenderRef = useRef<(() => void) | null>(null);
  const scrollTargetValRef = useRef(0);
  const scrollValRef = useRef(0);
  const mouseTargetRef = useRef({ x: 0.62, y: 0.48 });
  const mouseCurrRef = useRef({ x: 0.62, y: 0.48 });

  useEffect(() => {
    if (!revealProgress) return;
    revealTargetRef.current = revealProgress.get();
    revealCurrRef.current = revealProgress.get();
    return revealProgress.on("change", (v) => {
      revealTargetRef.current = v;
      wakeRenderRef.current?.();
    });
  }, [revealProgress]);

  useEffect(() => {
    if (!scrollProgress) return;
    scrollTargetValRef.current = scrollProgress.get();
    return scrollProgress.on("change", (v) => {
      scrollTargetValRef.current = v;
    });
  }, [scrollProgress]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // The hero renders a mobile and a desktop instance (one is display:none). Defer all GPU
    // work until this canvas is actually laid out, so the hidden twin never spins a WebGL loop.
    let teardown: (() => void) | null = null;
    const tryInit = () => {
      if (teardown || canvas.clientWidth === 0 || canvas.clientHeight === 0) return;
      teardown = initVeil(canvas);
    };
    const visibilityRo = new ResizeObserver(tryInit);
    visibilityRo.observe(canvas);
    tryInit();

    return () => {
      visibilityRo.disconnect();
      teardown?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [src, livingSrc, objPosX, objPosY, shimmerMinX, enableShimmer, Boolean(revealProgress)]);

  function initVeil(canvas: HTMLCanvasElement): (() => void) | null {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const hasLivingMode = Boolean(livingSrc);
    const isScrollScrub = hasLivingMode && Boolean(revealProgress);

    const gl = canvas.getContext("webgl", {
      alpha: true,
      premultipliedAlpha: true,
      antialias: false,
      powerPreference: "high-performance",
    });

    if (!gl) {
      canvas.dataset.veilState = "no-webgl";
      return null;
    }

    const compile = (type: number, source: string) => {
      const sh = gl.createShader(type);
      if (!sh) return null;
      gl.shaderSource(sh, source);
      gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.error("SilkVeilHero shader compile error:", gl.getShaderInfoLog(sh));
        gl.deleteShader(sh);
        return null;
      }
      return sh;
    };

    const vs = compile(gl.VERTEX_SHADER, VERT_SRC);
    const fs = compile(gl.FRAGMENT_SHADER, FRAG_SRC);
    if (!vs || !fs) {
      canvas.dataset.veilState = "shader-error";
      return null;
    }

    const prog = gl.createProgram();
    if (!prog) return null;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error("SilkVeilHero link error:", gl.getProgramInfoLog(prog));
      canvas.dataset.veilState = "link-error";
      return null;
    }

    gl.useProgram(prog);
    canvas.dataset.veilState = hasLivingMode ? "living-reveal" : "active";

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );

    const posLoc = gl.getAttribLocation(prog, "a_pos");
    gl.enableVertexAttribArray(posLoc);
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0);

    const createSafeTexture = (unit: number) => {
      const t = gl.createTexture();
      gl.activeTexture(unit);
      gl.bindTexture(gl.TEXTURE_2D, t);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        1,
        1,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        new Uint8Array([238, 224, 208, 255])
      );
      return t;
    };

    const stoneTex = createSafeTexture(gl.TEXTURE0);
    const livingTex = createSafeTexture(gl.TEXTURE1);

    const imgSize = { w: 2880, h: 1620 };
    let disposed = false;
    let stoneReady = false;
    let livingReady = !hasLivingMode;
    let animStartMs: number | null = null;
    let settled = false;

    const uploadImage = async (
      url: string,
      tex: WebGLTexture | null,
      unit: number,
      maxWidth: number,
      onDone: (w: number, h: number) => void
    ) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.decoding = "async";
      img.onload = async () => {
        if (disposed || !tex) return;
        const nw = img.naturalWidth || 2880;
        const nh = img.naturalHeight || 1620;
        let source: TexImageSource = img;
        try {
          if (typeof createImageBitmap === "function" && nw > maxWidth) {
            source = await createImageBitmap(img, {
              resizeWidth: maxWidth,
              resizeHeight: Math.round((nh / nw) * maxWidth),
              resizeQuality: "high",
            });
          }
        } catch {
          source = img;
        }
        if (disposed) {
          if (source instanceof ImageBitmap) source.close();
          return;
        }
        gl.activeTexture(unit);
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
        if (source instanceof ImageBitmap) source.close();
        onDone(nw, nh);
      };
      img.src = url;
    };

    const maxTexW = hasLivingMode ? Math.min(gl.getParameter(gl.MAX_TEXTURE_SIZE) || 2048, 2880) : 640;

    const kickIfReady = () => {
      if (stoneReady && livingReady && animStartMs === null) {
        animStartMs = performance.now();
        if (!rafId) rafId = requestAnimationFrame(render);
      }
    };

    uploadImage(src, stoneTex, gl.TEXTURE0, maxTexW, (w, h) => {
      imgSize.w = w;
      imgSize.h = h;
      stoneReady = true;
      kickIfReady();
    });

    if (livingSrc) {
      uploadImage(livingSrc, livingTex, gl.TEXTURE1, maxTexW, () => {
        livingReady = true;
        kickIfReady();
      });
    }

    const uTex = gl.getUniformLocation(prog, "u_tex");
    const uLivingTex = gl.getUniformLocation(prog, "u_livingTex");
    const uHasLiving = gl.getUniformLocation(prog, "u_hasLiving");
    const uEnableShimmer = gl.getUniformLocation(prog, "u_enableShimmer");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uAnimTime = gl.getUniformLocation(prog, "u_animTime");
    const uScroll = gl.getUniformLocation(prog, "u_scroll");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
    const uRes = gl.getUniformLocation(prog, "u_res");
    const uImgRes = gl.getUniformLocation(prog, "u_imgRes");
    const uObjPos = gl.getUniformLocation(prog, "u_objPos");
    const uShimmerMinX = gl.getUniformLocation(prog, "u_shimmerMinX");

    gl.uniform1i(uTex, 0);
    gl.uniform1i(uLivingTex, 1);
    gl.uniform1f(uHasLiving, hasLivingMode ? 1.0 : 0.0);
    gl.uniform1f(uEnableShimmer, enableShimmer ? 1.0 : 0.0);
    gl.uniform2f(uObjPos, objPosX, objPosY);
    gl.uniform1f(uShimmerMinX, shimmerMinX);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    let rafId = 0;

    const drawFrame = (now: number) => {
      const elapsed = reduceMotion ? REVEAL_SETTLE_SEC : (now - start) * 0.001;

      if (isScrollScrub) {
        if (reduceMotion) {
          revealCurrRef.current = 1;
        } else {
          const diff = revealTargetRef.current - revealCurrRef.current;
          revealCurrRef.current =
            Math.abs(diff) < 0.0008 ? revealTargetRef.current : revealCurrRef.current + diff * 0.16;
        }
      }

      const animElapsed = reduceMotion
        ? REVEAL_SETTLE_SEC
        : isScrollScrub
          ? revealCurrRef.current * REVEAL_SETTLE_SEC
          : animStartMs !== null
            ? (now - animStartMs) * 0.001
            : 0.0;

      scrollValRef.current += (scrollTargetValRef.current - scrollValRef.current) * 0.1;
      mouseCurrRef.current.x += (mouseTargetRef.current.x - mouseCurrRef.current.x) * 0.07;
      mouseCurrRef.current.y += (mouseTargetRef.current.y - mouseCurrRef.current.y) * 0.07;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uTime, elapsed);
      gl.uniform1f(uAnimTime, animElapsed);
      gl.uniform1f(uScroll, scrollValRef.current);
      gl.uniform2f(uMouse, mouseCurrRef.current.x, mouseCurrRef.current.y);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uImgRes, imgSize.w, imgSize.h);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      return animElapsed;
    };

    const resize = () => {
      // Full crisp Retina resolution for the living-skin portrait; lighter scale for shimmer-only
      const scale = hasLivingMode
        ? Math.min(window.devicePixelRatio || 1, 2)
        : Math.min(window.devicePixelRatio || 1, 1) * 0.6;
      const w = Math.max(1, Math.round(canvas.clientWidth * scale));
      const h = Math.max(1, Math.round(canvas.clientHeight * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
        // Redraw static frame at new viewport size when idle
        if (settled || (isScrollScrub && stoneReady && livingReady && !rafId)) {
          drawFrame(performance.now());
        }
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    let inView = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView && !rafId && !settled && !reduceMotion) {
          rafId = requestAnimationFrame(render);
        }
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    const start = performance.now();

    const render = (now: number) => {
      rafId = 0;

      // Wait until both textures are uploaded before painting the living transition
      if (hasLivingMode && (!stoneReady || !livingReady)) {
        return;
      }

      // Sticky hero stays mounted under the page: pause GPU work when covered or tab hidden
      const maxHeroScroll = isScrollScrub ? window.innerHeight * 1.85 : window.innerHeight * 1.05;
      if (!reduceMotion && (!inView || document.hidden || window.scrollY > maxHeroScroll)) {
        if (inView && !settled && !isScrollScrub) rafId = requestAnimationFrame(render);
        return;
      }

      const animElapsed = drawFrame(now);

      if (isScrollScrub) {
        canvas.dataset.veilState =
          revealCurrRef.current >= 0.99
            ? "living-complete"
            : revealCurrRef.current <= 0.01
              ? "stone-rest"
              : "living-scrub";
        // Keep rendering only while catching up to scroll target (or if legacy shimmer is on)
        if (!reduceMotion && (enableShimmer || Math.abs(revealTargetRef.current - revealCurrRef.current) >= 0.0008)) {
          rafId = requestAnimationFrame(render);
        }
        return;
      }

      // Auto-play mode: stop RAF completely once the 5-second living transformation finishes
      if (hasLivingMode && !enableShimmer && animElapsed >= REVEAL_SETTLE_SEC) {
        settled = true;
        canvas.dataset.veilState = "living-complete";
        return;
      }

      if (!reduceMotion) {
        rafId = requestAnimationFrame(render);
      } else {
        settled = true;
      }
    };

    wakeRenderRef.current = () => {
      if (!disposed && !rafId && stoneReady && livingReady) {
        rafId = requestAnimationFrame(render);
      }
    };

    if (!hasLivingMode) {
      rafId = requestAnimationFrame(render);
    }

    return () => {
      disposed = true;
      wakeRenderRef.current = null;
      cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
      gl.deleteTexture(stoneTex);
      gl.deleteTexture(livingTex);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
    };
  }

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    mouseTargetRef.current = {
      x: (e.clientX - rect.left) / rect.width,
      y: 1 - (e.clientY - rect.top) / rect.height,
    };
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Base Sculptural Stone Portrait (instant LCP on frame 0) */}
      <motion.img
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, ease: LUXURY_EASE }}
        src={src}
        alt={alt}
        className={`h-full w-full ${imgClassName || "object-cover"}`}
      />

      {/* Real-time WebGL Living-Skin Finger-Touch Reveal Layer */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 z-10 h-full w-full ${
          livingSrc ? "" : "mix-blend-screen"
        }`}
      />
    </div>
  );
}
