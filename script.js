// Gradient Interaction
document.addEventListener('DOMContentLoaded', () => {
  // Gradient bubble movement
  const interBubble = document.querySelector('.interactive');
  let curX = 0, curY = 0, tgX = 0, tgY = 0;
  
  const moveBubble = () => {
    curX += (tgX - curX) / 20;
    curY += (tgY - curY) / 20;
    interBubble.style.transform = `translate(${Math.round(curX)}px, ${Math.round(curY)}px)`;
    requestAnimationFrame(moveBubble);
  };

  // Word Cloud Initialization
  const main = () => {
    const root = document.querySelector('.tags');
    const cloud = new TagsCloud(root);
    cloud.start();
  };

  // Combined mouse move handler
  window.addEventListener('mousemove', (event) => {
    // Update gradient bubble
    tgX = event.clientX;
    tgY = event.clientY;
    
    // Update word cloud rotation
    if (window.cloud) {
      const rootRect = window.cloud._root.getBoundingClientRect();
      const deltaX = event.clientX - (rootRect.left + window.cloud._root.offsetWidth / 2);
      const deltaY = event.clientY - (rootRect.top + window.cloud._root.offsetHeight / 2);
      const a = Math.atan2(deltaX, deltaY) - Math.PI / 2;
      window.cloud._rotationAxis = [Math.sin(a), Math.cos(a), 0];
      const delta = Math.sqrt(deltaX ** 2 + deltaY ** 2);
      window.cloud._rotationSpeed = delta / Math.max(window.innerHeight, window.innerWidth) / 20;
    }
  });

  // Start animations
  moveBubble();
  main();
});

// Keep original FibonacciSphere and TagsCloud classes unchanged
class FibonacciSphere { /* ... */ }
class TagsCloud { /* ... */ }