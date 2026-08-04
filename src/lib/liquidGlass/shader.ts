// Glass shader adapted from liquid-glass-js — https://github.com/dashersw/liquid-glass-js
//
//   Copyright (c) 2025 Armagan Amcalar
//   Released under the MIT License. Permission is hereby granted, free of
//   charge, to any person obtaining a copy of this software and associated
//   documentation files (the "Software"), to deal in the Software without
//   restriction, including without limitation the rights to use, copy, modify,
//   merge, publish, distribute, sublicense, and/or sell copies of the Software.
//   The Software is provided "as is", without warranty of any kind.
//
// The refraction/rim/ripple/mask maths are his. What changed here, and why:
//
//  1. Sampling source. Upstream snapshots the whole page with html2canvas and
//     samples it in page coordinates. This site's backdrop is a fixed, animating
//     photo canvas, so a one-off page snapshot would be stale the moment the
//     slideshow moved. We sample that canvas directly, in viewport coordinates.
//  2. Coordinate split. u_resolution stays in glass-canvas pixels (it drives the
//     shape mask), while texture lookups go through u_containerSizeCss/u_texScale,
//     so the glass layer and the backdrop can be rendered at different densities.
//  3. Tint is a uniform pair rather than hardcoded white, so dark mode gets
//     smoked glass instead of frosted.
//  4. Loop steps widened. Upstream takes ~770 texture samples per fragment (a
//     13x13 blur plus a 20x11x3 gradient average). That is affordable on a
//     48px button and not on a 700px panel, and both loops are averaging a
//     region that is already blurry — the wider steps are visually free.

// Sample counts, kept here because they are the only real performance dial.
const BLUR_STEP = 2.0; // upstream 1.0 -> 13x13 grid becomes 7x7
const GRADIENT_X_STEP = 0.2; // upstream 0.05 -> 20 columns becomes 5
const GRADIENT_Y_STEP = 2.0; // upstream 1.0 -> 11 rows becomes 5

export const VERTEX_SHADER = `
attribute vec2 a_position;
attribute vec2 a_texcoord;
varying vec2 v_texcoord;

void main() {
  gl_Position = vec4(a_position, 0, 1);
  v_texcoord = a_texcoord;
}
`;

export const FRAGMENT_SHADER = `
precision mediump float;

uniform sampler2D u_image;
uniform vec2 u_resolution;          // glass quad size, in glass-canvas pixels
uniform vec2 u_textureSize;         // backdrop canvas size, in device pixels
uniform vec2 u_containerPosition;   // quad centre in viewport CSS pixels
uniform vec2 u_containerSizeCss;    // quad size in viewport CSS pixels
uniform float u_texScale;           // device pixels per CSS pixel of backdrop
uniform float u_blurRadius;
uniform float u_borderRadius;
uniform float u_warp;
uniform float u_edgeIntensity;
uniform float u_rimIntensity;
uniform float u_baseIntensity;
uniform float u_edgeDistance;
uniform float u_rimDistance;
uniform float u_baseDistance;
uniform float u_cornerBoost;
uniform float u_rippleEffect;
uniform float u_tintOpacity;
uniform vec3 u_tintTop;
uniform vec3 u_tintBottom;
uniform float u_specular;   // brightness of the lit rim
uniform float u_chromatic;  // colour split across the refracted edge
uniform float u_latitude;   // how far the interior may drift from the tint

varying vec2 v_texcoord;

float roundedRectDistance(vec2 coord, vec2 size, float radius) {
  vec2 center = size * 0.5;
  vec2 pixelCoord = coord * size;
  vec2 toCorner = abs(pixelCoord - center) - (center - radius);
  float outsideCorner = length(max(toCorner, 0.0));
  float insideCorner = min(max(toCorner.x, toCorner.y), 0.0);
  return (outsideCorner + insideCorner - radius);
}

float circleDistance(vec2 coord, vec2 size, float radius) {
  vec2 pixelCoord = coord * size;
  vec2 centerPixel = size * 0.5;
  return length(pixelCoord - centerPixel) - radius;
}

bool isPill(vec2 size, float radius) {
  float heightRatioDiff = abs(radius - size.y * 0.5);
  return heightRatioDiff < 2.0 && size.x > size.y + 4.0;
}

bool isCircle(vec2 size, float radius) {
  float heightRatioDiff = abs(radius - size.y * 0.5);
  float widthRatioDiff = abs(radius - size.x * 0.5);
  return heightRatioDiff < 2.0 && widthRatioDiff < 2.0;
}

float pillDistance(vec2 coord, vec2 size, float radius) {
  vec2 pixelCoord = coord * size;
  vec2 center = size * 0.5;
  vec2 capsuleStart = vec2(radius, center.y);
  vec2 capsuleEnd = vec2(size.x - radius, center.y);
  vec2 capsuleAxis = capsuleEnd - capsuleStart;

  if (dot(capsuleAxis, capsuleAxis) > 0.0) {
    vec2 toPoint = pixelCoord - capsuleStart;
    float t = clamp(dot(toPoint, capsuleAxis) / dot(capsuleAxis, capsuleAxis), 0.0, 1.0);
    vec2 closestPointOnAxis = capsuleStart + t * capsuleAxis;
    return length(pixelCoord - closestPointOnAxis) - radius;
  }
  return length(pixelCoord - center) - radius;
}

void main() {
  vec2 coord = v_texcoord;

  // Where this fragment lands on the backdrop. The backdrop is viewport-fixed,
  // so viewport coordinates are all we need — no scroll offset.
  vec2 containerOffsetCss = (coord - 0.5) * u_containerSizeCss;
  vec2 backdropPixel = (u_containerPosition + containerOffsetCss) * u_texScale;
  vec2 textureCoord = backdropPixel / u_textureSize;

  float distFromEdgeShape;
  vec2 shapeNormal;

  if (isPill(u_resolution, u_borderRadius)) {
    distFromEdgeShape = -pillDistance(coord, u_resolution, u_borderRadius);

    vec2 pixelCoord = coord * u_resolution;
    vec2 center = u_resolution * 0.5;
    vec2 capsuleStart = vec2(u_borderRadius, center.y);
    vec2 capsuleEnd = vec2(u_resolution.x - u_borderRadius, center.y);
    vec2 capsuleAxis = capsuleEnd - capsuleStart;

    if (dot(capsuleAxis, capsuleAxis) > 0.0) {
      vec2 toPoint = pixelCoord - capsuleStart;
      float t = clamp(dot(toPoint, capsuleAxis) / dot(capsuleAxis, capsuleAxis), 0.0, 1.0);
      vec2 normalDir = pixelCoord - (capsuleStart + t * capsuleAxis);
      shapeNormal = length(normalDir) > 0.0 ? normalize(normalDir) : vec2(0.0, 1.0);
    } else {
      shapeNormal = normalize(coord - vec2(0.5));
    }
  } else if (isCircle(u_resolution, u_borderRadius)) {
    distFromEdgeShape = -circleDistance(coord, u_resolution, u_borderRadius);
    shapeNormal = normalize(coord - vec2(0.5));
  } else {
    distFromEdgeShape = -roundedRectDistance(coord, u_resolution, u_borderRadius);
    shapeNormal = normalize(coord - vec2(0.5));
  }
  distFromEdgeShape = max(distFromEdgeShape, 0.0);

  float distFromLeft = coord.x;
  float distFromRight = 1.0 - coord.x;
  float distFromTop = coord.y;
  float distFromBottom = 1.0 - coord.y;
  float minSide = min(u_resolution.x, u_resolution.y);
  float distFromEdge = distFromEdgeShape / minSide;

  float normalizedDistance = distFromEdge * minSide;
  float baseIntensity = 1.0 - exp(-normalizedDistance * u_baseDistance);
  float edgeIntensity = exp(-normalizedDistance * u_edgeDistance);
  float rimIntensity = exp(-normalizedDistance * u_rimDistance);

  float baseComponent = u_warp > 0.5 ? baseIntensity * u_baseIntensity : 0.0;
  float totalIntensity = baseComponent + edgeIntensity * u_edgeIntensity + rimIntensity * u_rimIntensity;

  vec2 baseRefraction = shapeNormal * totalIntensity;

  float cornerProximityX = min(distFromLeft, distFromRight);
  float cornerProximityY = min(distFromTop, distFromBottom);
  float cornerDistance = max(cornerProximityX, cornerProximityY);
  float cornerNormalized = cornerDistance * minSide;
  float cornerBoost = exp(-cornerNormalized * 0.3) * u_cornerBoost;
  vec2 cornerRefraction = shapeNormal * cornerBoost;

  vec2 perpendicular = vec2(-shapeNormal.y, shapeNormal.x);
  float ripple = sin(distFromEdge * 25.0) * u_rippleEffect * rimIntensity;
  vec2 textureRefraction = perpendicular * ripple;

  vec2 refraction = baseRefraction + cornerRefraction + textureRefraction;
  textureCoord += refraction;

  // Gaussian blur over the refracted lookup.
  vec4 color = vec4(0.0);
  vec2 texelSize = 1.0 / u_textureSize;
  float sigma = u_blurRadius / 2.0;
  vec2 blurStep = texelSize * sigma;
  float totalWeight = 0.0;

  for (float i = -6.0; i <= 6.0; i += ${BLUR_STEP.toFixed(1)}) {
    for (float j = -6.0; j <= 6.0; j += ${BLUR_STEP.toFixed(1)}) {
      float d = length(vec2(i, j));
      if (d > 6.0) continue;
      float weight = exp(-(d * d) / (2.0 * sigma * sigma));
      color += texture2D(u_image, textureCoord + vec2(i, j) * blurStep) * weight;
      totalWeight += weight;
    }
  }
  color /= totalWeight;

  // Glass bends light per wavelength, so the refracted edge splits into colour.
  // Kept branchless: away from the rim both the offset and the blend weight fall
  // to zero on their own, and a texture fetch inside conditional flow is not
  // something every GLSL ES 1.0 driver agrees about.
  float fringe = u_chromatic * rimIntensity;
  vec3 split = vec3(
    texture2D(u_image, textureCoord + refraction * fringe).r,
    color.g,
    texture2D(u_image, textureCoord - refraction * fringe).b
  );
  color.rgb = mix(color.rgb, split, min(rimIntensity * 3.0, 0.75));

  // A saturated photo pushes colour through the blur; pulling slightly toward
  // luminance keeps a panel from going jellyfish-blue under its own text.
  const vec3 W = vec3(0.299, 0.587, 0.114);
  color.rgb = mix(color.rgb, vec3(dot(color.rgb, W)), 0.2);

  // Tint, top to bottom.
  float gradientPosition = coord.y;
  vec3 gradientTint = mix(u_tintTop, u_tintBottom, gradientPosition);
  color = vec4(mix(color.rgb, gradientTint, u_tintOpacity), color.a);

  // Legibility floor. The tint alone is light, which is what makes the pane feel
  // like glass rather than paint — but a near-black photo would still drag a
  // light panel dark enough to swallow its text (and a blown-out sky would do
  // the reverse in dark mode). So anything that drifts further than u_latitude
  // from the tint's own brightness gets pulled back, and everything inside that
  // band passes through untouched. Legibility is paid for only where it's owed.
  float tintLum = dot(gradientTint, W);
  float lum = dot(color.rgb, W);
  float drift = tintLum > 0.5 ? tintLum - lum : lum - tintLum;
  float correction = clamp((drift - u_latitude) * 1.8, 0.0, 0.85);
  color.rgb = mix(color.rgb, gradientTint, correction);

  // Ambient bleed: average the backdrop in three bands and let it colour the
  // glass, which is what stops the panel reading as a flat grey rectangle.
  vec2 centerTex = u_containerPosition * u_texScale;
  float halfHeightTex = u_containerSizeCss.y * u_texScale * 0.4;
  float topY = (centerTex.y - halfHeightTex) / u_textureSize.y;
  float midY = centerTex.y / u_textureSize.y;
  float bottomY = (centerTex.y + halfHeightTex) / u_textureSize.y;

  vec3 topColor = vec3(0.0);
  vec3 midColor = vec3(0.0);
  vec3 bottomColor = vec3(0.0);
  float sampleCount = 0.0;

  for (float x = 0.0; x < 1.0; x += ${GRADIENT_X_STEP.toFixed(2)}) {
    for (float yOffset = -4.0; yOffset <= 4.0; yOffset += ${GRADIENT_Y_STEP.toFixed(1)}) {
      float dy = yOffset * texelSize.y;
      topColor += texture2D(u_image, vec2(x, topY + dy)).rgb;
      midColor += texture2D(u_image, vec2(x, midY + dy)).rgb;
      bottomColor += texture2D(u_image, vec2(x, bottomY + dy)).rgb;
      sampleCount += 1.0;
    }
  }

  topColor /= sampleCount;
  midColor /= sampleCount;
  bottomColor /= sampleCount;

  vec3 sampledGradient;
  if (gradientPosition < 0.1) {
    sampledGradient = topColor;
  } else if (gradientPosition > 0.9) {
    sampledGradient = bottomColor;
  } else {
    float transitionPos = (gradientPosition - 0.1) / 0.8;
    if (transitionPos < 0.5) {
      sampledGradient = mix(topColor, midColor, transitionPos * 2.0);
    } else {
      sampledGradient = mix(midColor, bottomColor, (transitionPos - 0.5) * 2.0);
    }
  }

  // Upstream mixes this at 0.3; that reads beautifully on a small button and
  // drags a whole text panel to the colour of whatever is behind it.
  color = vec4(mix(color.rgb, sampledGradient, u_tintOpacity * 0.15), color.a);

  // Lit rim. A pane of glass catches the light along the edges facing the
  // source and, more faintly, along the ones opposite it where the far surface
  // bounces it back. This is the difference between "blurred rectangle" and
  // "something with thickness sitting on top of the photo".
  vec2 lightDir = normalize(vec2(-0.55, -0.83));
  float rimBand = exp(-normalizedDistance * 0.32);
  float facing = max(dot(shapeNormal, lightDir), 0.0);
  float opposing = max(dot(shapeNormal, -lightDir), 0.0);
  float specular = (pow(facing, 2.0) + pow(opposing, 3.5) * 0.4) * rimBand;
  color.rgb += specular * u_specular;

  float maskDistance;
  if (isPill(u_resolution, u_borderRadius)) {
    maskDistance = pillDistance(coord, u_resolution, u_borderRadius);
  } else if (isCircle(u_resolution, u_borderRadius)) {
    maskDistance = circleDistance(coord, u_resolution, u_borderRadius);
  } else {
    maskDistance = roundedRectDistance(coord, u_resolution, u_borderRadius);
  }
  float mask = 1.0 - smoothstep(-1.0, 1.0, maskDistance);

  // Premultiplied, so the rounded edge composites cleanly over the photo.
  gl_FragColor = vec4(color.rgb * mask, mask);
}
`;
