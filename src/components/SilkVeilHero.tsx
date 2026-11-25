"use client";

import { motion, type MotionValue } from "motion/react";
import { useEffect, useRef } from "react";
import { LUXURY_EASE } from "./MotionPrimitives";

interface SilkVeilHeroProps {
  src: string;
  alt: string;
  className?: string;
  imgClassName?: string;
  /** CSS object-position as [x, y] fractions (0..1) so WebGL luminance sampling matches object-cover 1:1 */
  objectPosition?: [number, number];
  /** Minimum texture X (0..1) where 3D sunlight shimmer activates (keeps text zone clean on wide full-bleed heroes) */
  shimmerMinX?: number;
  /** Shared 0..1 hero exit progress MotionValue (avoids duplicate useScroll/useSpring listeners) */
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

// Real-time warm sunlit liquid-gold shimmer that hugs the exact 3D porcelain contours
// of the portrait via 1:1 object-cover texture luminance sampling.
// Narrow, delicate golden-champagne light caustics — zero dark bands, zero wide white glare, zero cursor dots.
const FRAG_SRC = `
precision highp float;

varying vec2 v_uv;
uniform sampler2D u_tex;
uniform float u_time;
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
  return clamp(outUv, 0.002, 0.998);
}

// Helper to sample porcelain height (luminance) safely inside portrait bounds
float sampleHeight(vec2 uv) {
  vec3 c = texture2D(u_tex, clamp(uv, 0.002, 0.998)).rgb;
  return dot(c, vec3(0.299, 0.587, 0.114));
}

// Slender sunlit caustic ribbon (narrow width, zero negative pow)
float sunRibbon(float coord, float center, float width) {
  float x = (coord - center) / width;
  return exp(-(x * x));
}

void main() {
  vec2 uv = v_uv;
  float t = u_time;

  // Sample exact porcelain face pixel + 2-scale smooth Sobel gradient to estimate 3D curvature (выпуклости лица)
  vec2 texUv = coverUv(uv);
  float lum = sampleHeight(texUv);

  // Fine + macro neighborhood taps for smooth 3D sculpture normals (nose bridge, cheekbones, lips, fingers)
  float e1 = 0.009;
  float e2 = 0.022;
  float gx1 = sampleHeight(texUv + vec2(e1, 0.0)) - sampleHeight(texUv - vec2(e1, 0.0));
  float gy1 = sampleHeight(texUv + vec2(0.0, e1)) - sampleHeight(texUv - vec2(0.0, e1));
  float gx2 = sampleHeight(texUv + vec2(e2, 0.0)) - sampleHeight(texUv - vec2(e2, 0.0));
  float gy2 = sampleHeight(texUv + vec2(0.0, e2)) - sampleHeight(texUv - vec2(0.0, e2));

  float gx = gx1 * 0.45 + gx2 * 0.55;
  float gy = gy1 * 0.45 + gy2 * 0.55;

  // Reconstructed 3D porcelain surface normal from facial relief
  vec3 faceNormal = normalize(vec3(-gx * 3.6, -gy * 3.6, 1.0));
  float curvatureBoost = clamp(length(vec2(gx, gy)) * 3.8, 0.0, 0.50);

  // Contour mask: sunlight catches sculpted porcelain surfaces & raised curves, staying off deep shadows
  float faceMask = smoothstep(0.54, 0.88, lum) + curvatureBoost * smoothstep(0.42, 0.78, lum);
  faceMask = clamp(faceMask, 0.0, 1.0);

  // Smooth C-infinity Gaussian cursor warmth & gentle ripple (zero dots/singularities)
  float aspect = u_res.x / max(u_res.y, 1.0);
  vec2 d = vec2((uv.x - u_mouse.x) * aspect, uv.y - u_mouse.y);
  float dist2 = dot(d, d);
  float pointerGlow = exp(-dist2 * 6.5);
  vec2 q = uv + d * (pointerGlow * 0.032);

  // Scroll & gentle time drive a playful 3D moving sunbeam across the face
  float s = smoothstep(0.0, 1.0, u_scroll);
  vec3 sunDir = normalize(vec3(
    sin(t * 0.48 + s * 2.1) * 0.62 + (u_mouse.x - 0.5) * 0.45,
    cos(t * 0.36 - s * 1.2) * 0.42 + (u_mouse.y - 0.5) * 0.35 + 0.25,
    0.76
  ));
  vec3 viewDir = vec3(0.0, 0.0, 1.0);
  vec3 halfSun = normalize(sunDir + viewDir);

  // Real 3D Blinn-Phong specular play across raised facial contours (nose, cheekbones, brow, lips)
  float spec3D = pow(max(dot(faceNormal, halfSun), 0.0001), 12.0);
  float slopeLit = smoothstep(0.32, 0.94, dot(faceNormal, sunDir));

  // Organic liquid-sunlight refraction warp + 3D heightfield bend so sun rays wrap around face protrusions!
  float w1 = (noise(q * 2.8 + vec2(t * 0.16, -t * 0.11)) - 0.5) * 0.11;
  float w2 = (noise(q * 5.2 + vec2(-t * 0.12, t * 0.18)) - 0.5) * 0.05;
  float reliefBend = (lum - 0.62) * 0.16 + gx * 0.12 - gy * 0.08;
  float warp = w1 + w2 + reliefBend;

  float diag = q.x * 0.78 + (1.0 - q.y) * 0.62 + warp;

  // 3 slender, refined sunlight caustic streams wrapping over the 3D contours
  float pos1 = fract(0.22 + t * 0.055 + s * 0.55) * 1.45 - 0.20;
  float pos2 = fract(0.56 + t * 0.042 + s * 0.42) * 1.45 - 0.20;
  float pos3 = fract(0.84 + t * 0.064 + s * 0.65) * 1.45 - 0.20;

  float ray1 = sunRibbon(diag, pos1, 0.072);
  float ray2 = sunRibbon(diag, pos2, 0.090) * 0.80;
  float ray3 = sunRibbon(diag, pos3, 0.058) * 0.68;

  // Delicate fine sunlit shimmer lines nested inside each ray
  float shimmer = 0.55 + 0.45 * sin(diag * 34.0 - t * 1.35 + warp * 10.0);
  float rays = clamp((ray1 + ray2 + ray3) * (0.66 + 0.34 * shimmer), 0.0, 1.0);

  // Modulate rays by 3D sun-facing slopes + add playful 3D specular glint right on protruding curves
  float ray3D = rays * (0.58 + 0.42 * slopeLit) + rays * spec3D * 0.48;
  float sunGlint = spec3D * smoothstep(0.60, 0.90, lum) * 0.24;

  // Subtle golden warmth near cursor respecting 3D face curvature
  float cursorShimmer = pointerGlow * (0.45 + 0.55 * sin(diag * 22.0 - t * 1.1)) * (0.36 + 0.24 * spec3D);

  // Combine 3D contour-wrapped sunlight caustics + playful sunbeam glint
  float lightSignal = clamp((ray3D + cursorShimmer) * faceMask + sunGlint, 0.0, 1.0);

  // Pure warm sunlight palette: antique champagne-gold edges -> soft sunlit ivory core (+3-4% gentle lift)
  vec3 goldRay  = vec3(0.97, 0.85, 0.62);
  vec3 warmSun  = vec3(1.00, 0.97, 0.88);
  vec3 color = mix(goldRay, warmSun, smoothstep(0.22, 0.86, lightSignal));

  // Soft edge feather + optional horizontal mask so wide full-bleed heroes keep the headline zone calm
  float regionMask = smoothstep(u_shimmerMinX, u_shimmerMinX + 0.14, texUv.x);
  float edgeFade =
    regionMask *
    smoothstep(0.0, 0.05, uv.x) *
    smoothstep(0.0, 0.04, 1.0 - uv.x) *
    smoothstep(0.0, 0.04, uv.y) *
    smoothstep(0.0, 0.05, 1.0 - uv.y);

  // Gentle +3-4% brightness boost for lively sunbeam play without blowing out porcelain details
  float alpha = clamp(lightSignal * 0.46, 0.0, 0.48) * edgeFade;

  gl_FragColor = vec4(color * alpha, alpha);
}
`;

export function SilkVeilHero({
  src,
  alt,
  className = "",
  imgClassName = "",
  objectPosition = [0.5, 0.2],
  shimmerMinX = 0,
  scrollProgress,
}: SilkVeilHeroProps) {
  const objPosX = objectPosition[0];
  const objPosY = objectPosition[1];
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const scrollTargetValRef = useRef(0);
  const scrollValRef = useRef(0);
  const mouseTargetRef = useRef({ x: 0.62, y: 0.48 });
  const mouseCurrRef = useRef({ x: 0.62, y: 0.48 });

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
  }, [src, objPosX, objPosY, shimmerMinX]);

  function initVeil(canvas: HTMLCanvasElement): (() => void) | null {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
    canvas.dataset.veilState = "active";

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

    // Upload portrait image into NPOT-safe WebGL texture so sunlight caustics hug exact face contours
    const tex = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    // 1x1 warm neutral pixel placeholder until portrait finishes loading
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      1,
      1,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      new Uint8Array([225, 210, 192, 255])
    );

    const imgSize = { w: 682, h: 1024 };
    let disposed = false;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";
    img.onload = async () => {
      if (disposed) return;
      imgSize.w = img.naturalWidth || 682;
      imgSize.h = img.naturalHeight || 1024;
      // The shader only needs soft luminance relief: upload a small, off-thread-decoded copy
      // instead of the full-resolution portrait (avoids a long main-thread texture upload).
      let source: TexImageSource = img;
      try {
        if (typeof createImageBitmap === "function") {
          const targetW = Math.min(640, imgSize.w);
          source = await createImageBitmap(img, {
            resizeWidth: targetW,
            resizeHeight: Math.round((imgSize.h / imgSize.w) * targetW),
            resizeQuality: "medium",
          });
        }
      } catch {
        source = img;
      }
      if (disposed) return;
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
      if (source instanceof ImageBitmap) source.close();
    };
    img.src = src;

    const uTex = gl.getUniformLocation(prog, "u_tex");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uScroll = gl.getUniformLocation(prog, "u_scroll");
    const uMouse = gl.getUniformLocation(prog, "u_mouse");
    const uRes = gl.getUniformLocation(prog, "u_res");
    const uImgRes = gl.getUniformLocation(prog, "u_imgRes");
    const uObjPos = gl.getUniformLocation(prog, "u_objPos");
    const uShimmerMinX = gl.getUniformLocation(prog, "u_shimmerMinX");

    gl.uniform1i(uTex, 0);
    gl.uniform2f(uObjPos, objPosX, objPosY);
    gl.uniform1f(uShimmerMinX, shimmerMinX);

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    const resize = () => {
      // Soft caustic glow: render at reduced resolution and let the compositor upscale.
      // Full-DPR full-bleed shading was the main per-frame GPU cost on scroll.
      const scale = Math.min(window.devicePixelRatio || 1, 1) * 0.6;
      const w = Math.max(1, Math.round(canvas.clientWidth * scale));
      const h = Math.max(1, Math.round(canvas.clientHeight * scale));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // Pause the loop whenever the hero is off-screen or the tab is hidden.
    let inView = true;
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting;
        if (inView && !rafId && !reduceMotion) rafId = requestAnimationFrame(render);
      },
      { threshold: 0 }
    );
    io.observe(canvas);

    let rafId = 0;
    const start = performance.now();

    const render = (now: number) => {
      rafId = 0;
      // Sticky hero stays mounted under the page: stop GPU work once later sections cover it
      if (!reduceMotion && (!inView || document.hidden || window.scrollY > window.innerHeight * 1.05)) {
        if (inView) rafId = requestAnimationFrame(render);
        return;
      }

      const elapsed = reduceMotion ? 1.4 : (now - start) * 0.001;

      // Smooth scroll & pointer inertia (zero Framer Motion useSpring overhead)
      scrollValRef.current += (scrollTargetValRef.current - scrollValRef.current) * 0.1;
      mouseCurrRef.current.x += (mouseTargetRef.current.x - mouseCurrRef.current.x) * 0.07;
      mouseCurrRef.current.y += (mouseTargetRef.current.y - mouseCurrRef.current.y) * 0.07;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(uTime, elapsed);
      gl.uniform1f(uScroll, scrollValRef.current);
      gl.uniform2f(uMouse, mouseCurrRef.current.x, mouseCurrRef.current.y);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uImgRes, imgSize.w, imgSize.h);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      if (!reduceMotion) {
        rafId = requestAnimationFrame(render);
      }
    };

    rafId = requestAnimationFrame(render);

    return () => {
      disposed = true;
      cancelAnimationFrame(rafId);
      ro.disconnect();
      io.disconnect();
      gl.deleteTexture(tex);
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
      {/* Steady Sculptural Portrait (zero scale/zoom on scroll; only sunlit shimmer glides over face contours) */}
      <motion.img
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.9, ease: LUXURY_EASE }}
        src={src}
        alt={alt}
        className={`h-full w-full ${imgClassName || "object-cover"}`}
      />

      {/* Real-time WebGL Contour-Following Sunlit Champagne Shimmer Layer */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-10 h-full w-full mix-blend-screen"
      />
    </div>
  );
}
