console.clear();

var config = {
  attractor: 'lorenz',
  dt: 0.005,
  maxLife: 1000,
  minLife: 100,
  maxTailLength: 80,
  minTailLength: 5,
  numberOfParticles: 75,
  segmentsPerFrame: 1,
  spawnRange: 10,
  strokeWeight: 0.5,
  tailOpacity: 190,
  zoom: 12,

  minRed: 0,
  maxRed: 100,
  minGreen: 100,
  maxGreen: 255,
  minBlue: 100,
  maxBlue: 255,
};

var particles = [];

function setup() {
  createCanvas(window.innerWidth, window.innerHeight);
  loadUI();
}

function draw() {
  while (particles.length < config.numberOfParticles) {
    let c = color(
        random(config.minRed, config.maxRed),
        random(config.minGreen, config.maxGreen),
        random(config.minBlue, config.maxBlue),
        config.tailOpacity
      ),
      life = random(config.minLife, config.maxLife),
      tailLength = random(config.minTailLength, config.maxTailLength),
      x = random(-config.spawnRange, config.spawnRange),
      y = random(-config.spawnRange, config.spawnRange),
      z = random(-config.spawnRange, config.spawnRange);
    particles.push(
      new Particle(
        { x: x, y: y, z: z },
        config.dt,
        c,
        tailLength,
        config.zoom,
        life
      )
    );
  }

  background(0);
  strokeWeight(config.strokeWeight);
  translate(width / 2, height / 2);
  for (let j = particles.length - 1; j >= 0; j--) {
    for (let i = 0; i < config.segmentsPerFrame; i++) {
      particles[j].flow(config.attractor);
    }
    particles[j].display();
    if (particles[j].dead || j >= config.numberOfParticles) {
      particles.splice(j, 1);
    }
  }
}

function loadUI() {
  var gui = new dat.GUI();

  gui.add(config, 'attractor', [
    'aizawa', // doesnt look good
    'dequanli',
    'halvorsen',
    'lorenz',
  ]);
  gui
    .add(config, 'dt')
    .min(0.00001)
    .max(0.01)
    .step(0.0001);
  gui
    .add(config, 'maxLife')
    .min(100)
    .max(2500)
    .step(1);
  gui
    .add(config, 'minLife')
    .min(1)
    .max(2500)
    .step(1);
  gui
    .add(config, 'maxTailLength')
    .min(1)
    .max(500)
    .step(1);
  gui
    .add(config, 'minTailLength')
    .min(1)
    .max(500)
    .step(1);
  gui
    .add(config, 'numberOfParticles')
    .min(1)
    .step(1)
    .max(250);
  gui
    .add(config, 'segmentsPerFrame')
    .min(1)
    .step(1)
    .max(10);
  gui
    .add(config, 'spawnRange')
    .min(1)
    .step(0.5)
    .max(50);
  gui
    .add(config, 'strokeWeight')
    .min(0.1)
    .step(0.1)
    .max(5);
  gui
    .add(config, 'zoom')
    .min(1)
    .max(20)
    .step(0.1);

  var colors = gui.addFolder('Colors');
  colors
    .add(config, 'minRed')
    .min(0)
    .max(255)
    .step(1);
  colors
    .add(config, 'maxRed')
    .min(0)
    .max(255)
    .step(1);
  colors
    .add(config, 'minGreen')
    .min(0)
    .max(255)
    .step(1);
  colors
    .add(config, 'maxGreen')
    .min(0)
    .max(255)
    .step(1);
  colors
    .add(config, 'minBlue')
    .min(0)
    .max(255)
    .step(1);
  colors
    .add(config, 'maxBlue')
    .min(0)
    .max(255)
    .step(1);
  colors
    .add(config, 'tailOpacity')
    .min(0)
    .max(255)
    .step(1);
  gui.close();
}

class Particle {
  constructor(v, dt, c, l, z, h) {
    this.v = [v];
    this.dt = dt;
    this.c = c;
    this.h = h;
    this.l = l;
    this.z = z;
    this.dead = false;
  }

  display() {
    stroke(this.c);
    for (let i = 1; i < this.v.length; i++) {
      let i_m_1 = i - 1;
      line(
        this.v[i_m_1].x * this.z,
        this.v[i_m_1].y * this.z,
        this.v[i].x * this.z,
        this.v[i].y * this.z
      );
    }
  }

  flow(type) {
    let v;
    let l = this.v.length - 1;
    switch (type) {
      case 'aizawa':
        v = this.aizawa(this.v[l]);
        break;
      case 'dequanli':
        v = this.dequanli(this.v[l]);
        break;
      case 'lorenz':
        v = this.lorenz(this.v[l]);
        break;
      case 'halvorsen':
        v = this.halvorsen(this.v[l]);
        break;
    }

    this.v.push(v);

    if (this.v.length > this.l) {
      this.v.splice(0, 1);
    }

    this.h--;
    this.dead = this.h <= 0;
  }

  aizawa(v) {
    let dy = 3.5 * v.x + (v.z - 0.7) * v.y;

    let x = v.x + this.dt * (v.x * (v.z - 0.7) - dy),
      y = v.y + this.dt * dy,
      z =
        v.z +
        this.dt *
          (0.6 +
            0.95 * v.z -
            pow(v.z, 3) / 3 -
            (pow(v.x, 2), +pow(v.y, 2)) * (1 + 0.25 * v.z) +
            0.1 * v.z * pow(v.x, 3));

    return { x: x, y: y, z: z };
  }

  dequanli(v) {
    let x = v.x + this.dt * (40 * (v.y - v.x) + 0.16 * v.x * v.z),
      y = v.y + this.dt * (55 * v.x + 20 * v.y - v.x * v.z),
      z = v.z + this.dt * (1.833 * v.z + v.x * v.y - 0.65 * pow(v.x, 2));

    return { x: x, y: y, z: z };
  }

  halvorsen(v) {
    let x = v.x + this.dt * (-1.4 * v.x - 4 * (v.y + v.z) - pow(v.y, 2)),
      y = v.y + this.dt * (-1.4 * v.y - 4 * (v.z + v.x) - pow(v.z, 2)),
      z = v.z + this.dt * (-1.4 * v.z - 4 * (v.x + v.y) - pow(v.x, 2));

    return { x: x, y: y, z: z };
  }

  lorenz(v) {
    let x = v.x + this.dt * 10 * (v.y - v.x),
      y = v.y + this.dt * (v.x * (28 - v.z) - v.y),
      z = v.z + this.dt * (v.x * v.y - (8 / 3) * v.z);

    return { x: x, y: y, z: z };
  }
}
