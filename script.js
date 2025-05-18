class FibonacciSphere {
  #points;
  get points() { return this.#points; }

  constructor(N) {
    this.#points = [];
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const radius = Math.sqrt(1 - y ** 2);
      const a = goldenAngle * i;
      this.#points.push([Math.cos(a) * radius, y, Math.sin(a) * radius]);
    }
  }
}

class TagsCloud {
  #root; #size; #sphere; #tags; #rotationAxis; #rotationAngle; #rotationSpeed; #frameRequestId;

  constructor(root) {
    this.#root = root;
    this.#size = root.offsetWidth;
    this.#tags = root.querySelectorAll('.tag');
    this.#sphere = new FibonacciSphere(this.#tags.length);
    this.#rotationAxis = [1, 0, 0];
    this.#rotationAngle = 0;
    this.#rotationSpeed = 0;

    this.#updatePositions();
    this.#initEventListeners();
    this.#root.classList.add('-loaded');
  }

  #initEventListeners() {
    window.addEventListener('resize', this.#updatePositions.bind(this));
  }

  #updatePositions() {
    const [ux, uy, uz] = this.#rotationAxis;
    const sin = Math.sin(this.#rotationAngle);
    const cos = Math.cos(this.#rotationAngle);

    const rotationMatrix = [
      [cos + ux ** 2 * (1 - cos), ux * uy * (1 - cos) - uz * sin, ux * uz * (1 - cos) + uy * sin],
      [uy * ux * (1 - cos) + uz * sin, cos + uy ** 2 * (1 - cos), uy * uz * (1 - cos) - ux * sin],
      [uz * ux * (1 - cos) - uy * sin, uz * uy * (1 - cos) + ux * sin, cos + uz ** 2 * (1 - cos)]
    ];

    this.#tags.forEach((tag, i) => {
      const [x, y, z] = this.#sphere.points[i];
      const tx = rotationMatrix[0][0] * x + rotationMatrix[0][1] * y + rotationMatrix[0][2] * z;
      const ty = rotationMatrix[1][0] * x + rotationMatrix[1][1] * y + rotationMatrix[1][2] * z;
      const tz = rotationMatrix[2][0] * x + rotationMatrix[2][1] * y + rotationMatrix[2][2] * z;

      tag.style.transform = `translateX(${(this.#size * tx) / 2}px) translateY(${(this.#size * ty) / 2}px) scale(${(tz + 2) / 3})`;
      tag.style.opacity = (tz + 1.5) / 2.5;
    });
  }

  #update() {
    this.#rotationAngle += this.#rotationSpeed;
    this.#updatePositions();
    this.#frameRequestId = requestAnimationFrame(this.#update.bind(this));
  }

  start() { this.#update(); }
  stop() { cancelAnimationFrame(this.#frameRequestId); }
}

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Gradient Interaction
  const interBubble = document.querySelector('.interactive');
  let curX = 0, curY = 0, tgX = 0, tgY = 0;

  const moveBubble = () => {
    curX += (tgX - curX) / 20;
    curY += (tgY - curY) / 20;
    interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
    requestAnimationFrame(moveBubble);
  };

  // Initialize Word Cloud
  const cloud = new TagsCloud(document.querySelector('.tags'));
  cloud.start();

  // Combined Mouse Handler
  window.addEventListener('mousemove', (e) => {
    // Update Gradient Bubble
    tgX = e.clientX;
    tgY = e.clientY;

    // Update Cloud Rotation
    const rootRect = cloud._root.getBoundingClientRect();
    const deltaX = e.clientX - (rootRect.left + cloud._root.offsetWidth / 2);
    const deltaY = e.clientY - (rootRect.top + cloud._root.offsetHeight / 2);
    const a = Math.atan2(deltaX, deltaY) - Math.PI / 2;
    cloud._rotationAxis = [Math.sin(a), Math.cos(a), 0];
    cloud._rotationSpeed = Math.sqrt(deltaX ** 2 + deltaY ** 2) / Math.max(window.innerHeight, window.innerWidth) / 20;
  });

  moveBubble();
});
