/* WebGL water ripple — hero section only */
(function () {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const SIM = 256;

  /* ── Canvas ── */
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;';
  hero.insertBefore(canvas, hero.firstChild);

  // Lift hero content above canvas
  Array.from(hero.children).forEach(el => {
    if (el !== canvas) { el.style.position = 'relative'; el.style.zIndex = '1'; }
  });

  /* ── WebGL init — bail cleanly if unsupported ── */
  const gl = canvas.getContext('webgl', { alpha: false, antialias: false })
           || canvas.getContext('experimental-webgl', { alpha: false, antialias: false });
  if (!gl) { canvas.remove(); return; }

  /* ── Shader helpers ── */
  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.error('Shader error:', gl.getShaderInfoLog(s));
      return null;
    }
    return s;
  }

  function makeProgram(vsSrc, fsSrc) {
    const vs = compile(gl.VERTEX_SHADER, vsSrc);
    const fs = compile(gl.FRAGMENT_SHADER, fsSrc);
    if (!vs || !fs) return null;
    const p = gl.createProgram();
    gl.attachShader(p, vs); gl.attachShader(p, fs);
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(p));
      return null;
    }
    return p;
  }

  /* ── Shaders ── */
  const VS = `
    attribute vec2 pos;
    void main() { gl_Position = vec4(pos, 0.0, 1.0); }
  `;

  const UPDATE_FS = `
    precision mediump float;
    uniform sampler2D uCurr;
    uniform sampler2D uPrev;
    uniform vec2 uRes;
    uniform vec2 uMouse;
    uniform float uDrop;
    void main() {
      vec2 uv = gl_FragCoord.xy / uRes;
      vec2 px = 1.0 / uRes;
      float c = texture2D(uCurr, uv).r - 0.5;
      float p = texture2D(uPrev, uv).r - 0.5;
      float n = texture2D(uCurr, uv + vec2(0.0,  px.y)).r - 0.5;
      float s = texture2D(uCurr, uv - vec2(0.0,  px.y)).r - 0.5;
      float e = texture2D(uCurr, uv + vec2(px.x,  0.0)).r - 0.5;
      float w = texture2D(uCurr, uv - vec2(px.x,  0.0)).r - 0.5;
      float next = (2.0 * c - p + (n + s + e + w - 4.0 * c) * 0.22) * 0.987;
      float drop = uDrop * smoothstep(0.06, 0.0, distance(uv, uMouse));
      next += drop;
      gl_FragColor = vec4(vec3(clamp(next + 0.5, 0.0, 1.0)), 1.0);
    }
  `;

  const RENDER_FS = `
    precision mediump float;
    uniform sampler2D uImage;
    uniform sampler2D uHeight;
    uniform vec2 uRes;
    void main() {
      vec2 uv = gl_FragCoord.xy / uRes;
      vec2 px = 1.0 / uRes;
      float hR = texture2D(uHeight, uv + vec2(px.x,  0.0)).r;
      float hL = texture2D(uHeight, uv - vec2(px.x,  0.0)).r;
      float hU = texture2D(uHeight, uv + vec2(0.0,  px.y)).r;
      float hD = texture2D(uHeight, uv - vec2(0.0,  px.y)).r;
      vec2 grad = vec2(hR - hL, hU - hD) * 4.0;
      vec2 imgUV = vec2(uv.x + grad.x, (1.0 - uv.y) + grad.y);
      imgUV = clamp(imgUV, 0.001, 0.999);
      vec4 color = texture2D(uImage, imgUV);
      gl_FragColor = mix(color, vec4(0.0, 0.0, 0.0, 1.0), 0.3);
    }
  `;

  const updateProg = makeProgram(VS, UPDATE_FS);
  const renderProg = makeProgram(VS, RENDER_FS);

  if (!updateProg || !renderProg) { canvas.remove(); return; }

  /* ── Quad buffer ── */
  const quad = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quad);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

  function bindQuad(prog) {
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    const loc = gl.getAttribLocation(prog, 'pos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  }

  /* ── Simulation FBOs ── */
  function makeFBO() {
    const data = new Uint8Array(SIM * SIM * 4);
    for (let i = 0; i < data.length; i += 4) { data[i] = data[i+1] = data[i+2] = 128; data[i+3] = 255; }
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, SIM, SIM, 0, gl.RGBA, gl.UNSIGNED_BYTE, data);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
    return { tex, fbo };
  }

  let curr = makeFBO(), prev = makeFBO(), next = makeFBO();

  /* ── Image texture ── */
  const imgTex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, imgTex);
  // Placeholder teal while image loads
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
    new Uint8Array([100, 179, 197, 255]));
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  const bgImg = new Image();
  bgImg.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, imgTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, bgImg);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
  };
  bgImg.onerror = () => console.error('water-bg.jpg failed to load');
  bgImg.src = 'images/water-bg.jpg';

  /* ── Mouse ── */
  let mx = 0.5, my = 0.5, dropStr = 0, prevMx = -1, prevMy = -1;
  hero.addEventListener('mousemove', e => {
    const r = hero.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width;
    const ny = 1.0 - (e.clientY - r.top) / r.height;
    if (Math.hypot(nx - prevMx, ny - prevMy) > 0.003) {
      mx = nx; my = ny; dropStr = 0.7; prevMx = nx; prevMy = ny;
    }
  });

  /* ── Resize ── */
  function resize() {
    canvas.width  = hero.offsetWidth  || window.innerWidth;
    canvas.height = hero.offsetHeight || window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  /* ── Cached uniform locations ── */
  const U = {
    uCurr:   gl.getUniformLocation(updateProg, 'uCurr'),
    uPrev:   gl.getUniformLocation(updateProg, 'uPrev'),
    uRes:    gl.getUniformLocation(updateProg, 'uRes'),
    uMouse:  gl.getUniformLocation(updateProg, 'uMouse'),
    uDrop:   gl.getUniformLocation(updateProg, 'uDrop'),
    rImage:  gl.getUniformLocation(renderProg, 'uImage'),
    rHeight: gl.getUniformLocation(renderProg, 'uHeight'),
    rRes:    gl.getUniformLocation(renderProg, 'uRes'),
  };

  /* ── Render loop ── */
  function frame() {
    requestAnimationFrame(frame);

    // Physics pass
    gl.bindFramebuffer(gl.FRAMEBUFFER, next.fbo);
    gl.viewport(0, 0, SIM, SIM);
    gl.useProgram(updateProg);
    bindQuad(updateProg);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, curr.tex);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, prev.tex);
    gl.uniform1i(U.uCurr, 0);
    gl.uniform1i(U.uPrev, 1);
    gl.uniform2f(U.uRes, SIM, SIM);
    gl.uniform2f(U.uMouse, mx, my);
    gl.uniform1f(U.uDrop, dropStr);
    dropStr = 0;
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // Ping-pong
    const tmp = prev; prev = curr; curr = next; next = tmp;

    // Render pass
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(renderProg);
    bindQuad(renderProg);
    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, imgTex);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, curr.tex);
    gl.uniform1i(U.rImage, 0);
    gl.uniform1i(U.rHeight, 1);
    gl.uniform2f(U.rRes, canvas.width, canvas.height);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  frame();
})();
