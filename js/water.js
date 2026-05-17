/* Water ripple effect for hero section — WebGL ping-pong simulation */
(function () {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const SIM = 256; // wave physics grid resolution (low for performance)

  /* ── Canvas ──────────────────────────────────────────────────── */
  const canvas = document.createElement('canvas');
  canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;';
  hero.insertBefore(canvas, hero.firstChild);

  // Lift all other hero children above the canvas
  Array.from(hero.children).forEach(el => {
    if (el !== canvas) { el.style.position = 'relative'; el.style.zIndex = '1'; }
  });

  const gl = canvas.getContext('webgl', { alpha: false, antialias: false });
  if (!gl) { canvas.remove(); return; } // static CSS fallback kicks in

  /* ── Shader helpers ──────────────────────────────────────────── */
  function compile(type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src.trim());
    gl.compileShader(s);
    return s;
  }

  function makeProgram(vsSrc, fsSrc) {
    const p = gl.createProgram();
    gl.attachShader(p, compile(gl.VERTEX_SHADER, vsSrc));
    gl.attachShader(p, compile(gl.FRAGMENT_SHADER, fsSrc));
    gl.linkProgram(p);
    return p;
  }

  /* ── Shaders ─────────────────────────────────────────────────── */
  const VS = `attribute vec2 pos; void main(){ gl_Position = vec4(pos, 0.0, 1.0); }`;

  // Wave physics — stored in [0,1] where 0.502 = rest height
  const UPDATE_FS = `
    precision mediump float;
    uniform sampler2D uCurr, uPrev;
    uniform vec2 uRes;
    uniform vec2 uMouse;
    uniform float uDrop;
    void main() {
      vec2 uv  = gl_FragCoord.xy / uRes;
      vec2 px  = 1.0 / uRes;
      float c  = texture2D(uCurr, uv).r - 0.502;
      float p  = texture2D(uPrev, uv).r - 0.502;
      float n  = texture2D(uCurr, uv + vec2(0.0, px.y)).r - 0.502;
      float s  = texture2D(uCurr, uv - vec2(0.0, px.y)).r - 0.502;
      float e  = texture2D(uCurr, uv + vec2(px.x, 0.0)).r - 0.502;
      float w  = texture2D(uCurr, uv - vec2(px.x, 0.0)).r - 0.502;
      float next = (2.0 * c - p + (n + s + e + w - 4.0 * c) * 0.22) * 0.987;
      next += uDrop * smoothstep(0.05, 0.0, distance(uv, uMouse));
      gl_FragColor = vec4(clamp(next + 0.502, 0.0, 1.0));
    }
  `;

  // Render — displace image UVs by height gradient, add slight dark overlay
  const RENDER_FS = `
    precision mediump float;
    uniform sampler2D uImage, uHeight;
    uniform vec2 uRes;
    void main() {
      vec2 uv  = gl_FragCoord.xy / uRes;
      vec2 px  = 1.0 / uRes;
      float r  = texture2D(uHeight, uv + vec2(px.x, 0.0)).r;
      float l  = texture2D(uHeight, uv - vec2(px.x, 0.0)).r;
      float u2 = texture2D(uHeight, uv + vec2(0.0, px.y)).r;
      float d  = texture2D(uHeight, uv - vec2(0.0, px.y)).r;
      vec2 grad   = vec2(r - l, u2 - d) * 3.0;
      vec2 imgUV  = vec2(uv.x, 1.0 - uv.y) + grad;
      vec4 color  = texture2D(uImage, clamp(imgUV, 0.001, 0.999));
      gl_FragColor = mix(color, vec4(0.0, 0.0, 0.0, 1.0), 0.28);
    }
  `;

  const updateProg = makeProgram(VS, UPDATE_FS);
  const renderProg = makeProgram(VS, RENDER_FS);

  /* ── Fullscreen quad ─────────────────────────────────────────── */
  const quadBuf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);

  function bindQuad(prog) {
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuf);
    const loc = gl.getAttribLocation(prog, 'pos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  }

  /* ── Simulation FBOs ─────────────────────────────────────────── */
  function makeFBO() {
    const data = new Uint8Array(SIM * SIM * 4).fill(128);
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

  /* ── Image texture ───────────────────────────────────────────── */
  const imgTex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, imgTex);
  // Placeholder teal while image loads
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
    new Uint8Array([100, 180, 195, 255]));

  const img = new Image();
  img.src = 'images/water-bg.jpg';
  img.onload = () => {
    gl.bindTexture(gl.TEXTURE_2D, imgTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, img);
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  };

  /* ── Mouse tracking ──────────────────────────────────────────── */
  let mx = 0.5, my = 0.5, dropStrength = 0;
  let prevMx = -1, prevMy = -1;

  hero.addEventListener('mousemove', (e) => {
    const r = hero.getBoundingClientRect();
    const nx = (e.clientX - r.left) / r.width;
    const ny = 1.0 - (e.clientY - r.top) / r.height;
    if (Math.hypot(nx - prevMx, ny - prevMy) > 0.004) {
      mx = nx; my = ny;
      dropStrength = 0.6;
      prevMx = nx; prevMy = ny;
    }
  });

  /* ── Resize ──────────────────────────────────────────────────── */
  function resize() {
    canvas.width  = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  /* ── Cached uniform locations ────────────────────────────────── */
  const uLoc = {
    curr:   gl.getUniformLocation(updateProg, 'uCurr'),
    prev:   gl.getUniformLocation(updateProg, 'uPrev'),
    ures:   gl.getUniformLocation(updateProg, 'uRes'),
    mouse:  gl.getUniformLocation(updateProg, 'uMouse'),
    drop:   gl.getUniformLocation(updateProg, 'uDrop'),
    rimg:   gl.getUniformLocation(renderProg, 'uImage'),
    rheight:gl.getUniformLocation(renderProg, 'uHeight'),
    rres:   gl.getUniformLocation(renderProg, 'uRes'),
  };

  /* ── Render loop ─────────────────────────────────────────────── */
  function frame() {
    requestAnimationFrame(frame);

    // 1. Update wave physics at SIM resolution
    gl.bindFramebuffer(gl.FRAMEBUFFER, next.fbo);
    gl.viewport(0, 0, SIM, SIM);
    gl.useProgram(updateProg);
    bindQuad(updateProg);

    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, curr.tex);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, prev.tex);
    gl.uniform1i(uLoc.curr, 0);
    gl.uniform1i(uLoc.prev, 1);
    gl.uniform2f(uLoc.ures, SIM, SIM);
    gl.uniform2f(uLoc.mouse, mx, my);
    gl.uniform1f(uLoc.drop, dropStrength);
    dropStrength = 0;

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    // Ping-pong buffers
    const tmp = prev; prev = curr; curr = next; next = tmp;

    // 2. Render to screen at full canvas resolution
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.useProgram(renderProg);
    bindQuad(renderProg);

    gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, imgTex);
    gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, curr.tex);
    gl.uniform1i(uLoc.rimg, 0);
    gl.uniform1i(uLoc.rheight, 1);
    gl.uniform2f(uLoc.rres, canvas.width, canvas.height);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  frame();
})();
