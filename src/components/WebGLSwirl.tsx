import React, { useEffect, useRef } from 'react';

/**
 * Minimal WebGL swirl prototype (points + additive blending)
 * - Uses a canvas and simple shaders to render many point sprites on the GPU.
 * - This is a starting point — we will tune shaders to match the Codrops look.
 */

export default function WebGLSwirl(): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const gl = canvas.getContext('webgl', { antialias: true });
    if (!gl) return;

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = w + 'px';
      canvas.style.height = h + 'px';
      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
    };
    window.addEventListener('resize', resize);
    resize();

    // vertex shader: positions + size + color
    const vsSrc = `
      attribute vec2 a_pos;
      attribute float a_size;
      attribute vec3 a_color;
      uniform vec2 u_resolution;
      varying vec3 v_color;
      void main() {
        vec2 zeroToOne = a_pos / u_resolution;
        vec2 clip = zeroToOne * 2.0 - 1.0;
        gl_Position = vec4(clip * vec2(1.0, -1.0), 0, 1.0);
        gl_PointSize = a_size;
        v_color = a_color;
      }
    `;
    // fragment shader: soft circular point
    const fsSrc = `
      precision mediump float;
      varying vec3 v_color;
      void main() {
        vec2 coord = gl_PointCoord - vec2(0.5);
        float dist = length(coord);
        float alpha = smoothstep(0.5, 0.0, dist);
        gl_FragColor = vec4(v_color, alpha);
      }
    `;

    function compile(src: string, type: number) {
      const s = gl.createShader(type)!;
      gl.shaderSource(s, src);
      gl.compileShader(s);
      if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(s));
        gl.deleteShader(s);
        return null;
      }
      return s;
    }

    const vs = compile(vsSrc, gl.VERTEX_SHADER)!;
    const fs = compile(fsSrc, gl.FRAGMENT_SHADER)!;
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(prog));
      return;
    }
    gl.useProgram(prog);

    const u_resolution = gl.getUniformLocation(prog, 'u_resolution')!;
    const a_pos = gl.getAttribLocation(prog, 'a_pos');
    const a_size = gl.getAttribLocation(prog, 'a_size');
    const a_color = gl.getAttribLocation(prog, 'a_color');

    // particle data: start with modest count — we'll tune later
    const particleCount = 2000;
    const positions = new Float32Array(particleCount * 2);
    const sizes = new Float32Array(particleCount);
    const colors = new Float32Array(particleCount * 3);
    const velocities = new Float32Array(particleCount * 2);
    const life = new Float32Array(particleCount);

    function rand(n: number) { return Math.random() * n; }
    function init(i: number) {
      const w = canvas.width;
      const h = canvas.height;
      const x = Math.random() * w;
      const y = h / 2 + (Math.random() - 0.5) * 200;
      positions[i * 2] = x;
      positions[i * 2 + 1] = y;
      velocities[i * 2] = (Math.random() - 0.5) * 0.6;
      velocities[i * 2 + 1] = (Math.random() - 0.5) * 0.6;
      sizes[i] = 1 + Math.random() * 6;
      const hue = 220 + Math.random() * 60;
      // convert a simple HSL->RGB approximation (blue/purple tint)
      colors[i * 3] = 0.1 + Math.random() * 0.2;
      colors[i * 3 + 1] = 0.5 + Math.random() * 0.5;
      colors[i * 3 + 2] = 0.9 + Math.random() * 0.1;
      life[i] = 60 + Math.random() * 200;
    }
    for (let i = 0; i < particleCount; i++) init(i);

    // GL buffers
    const posBuf = gl.createBuffer();
    const sizeBuf = gl.createBuffer();
    const colorBuf = gl.createBuffer();

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE); // additive

    let t = 0;
    function update() {
      t += 1;
      for (let i = 0; i < particleCount; i++) {
        const idx = i * 2;
        const x = positions[idx];
        const y = positions[idx + 1];
        // cheap swirl noise
        const n = Math.sin(x * 0.002 + t * 0.01) + Math.cos(y * 0.002 - t * 0.007);
        const vx = Math.cos(n) * 0.7;
        const vy = Math.sin(n) * 0.7;
        positions[idx] = x + vx * (sizes[i] * 0.02);
        positions[idx + 1] = y + vy * (sizes[i] * 0.02);
        life[i]--;
        if (positions[idx] < 0 || positions[idx] > canvas.width ||
            positions[idx + 1] < 0 || positions[idx + 1] > canvas.height ||
            life[i] < 0) {
          init(i);
        }
      }
    }

    function renderLoop() {
      update();
      gl.clearColor(0.07,0.06,0.13,1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.bindBuffer(gl.ARRAY_BUFFER, posBuf);
      gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(a_pos);
      gl.vertexAttribPointer(a_pos, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuf);
      gl.bufferData(gl.ARRAY_BUFFER, sizes, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(a_size);
      gl.vertexAttribPointer(a_size, 1, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuf);
      gl.bufferData(gl.ARRAY_BUFFER, colors, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(a_color);
      gl.vertexAttribPointer(a_color, 3, gl.FLOAT, false, 0, 0);

      gl.uniform2f(u_resolution, canvas.width, canvas.height);
      gl.drawArrays(gl.POINTS, 0, particleCount);
      requestAnimationFrame(renderLoop);
    }
    let running = true;
    renderLoop();

    return () => {
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    />
  );
}
