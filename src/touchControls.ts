export function setupTouchControls(
  canvas: HTMLCanvasElement,
  onLeft: () => void,
  onRight: () => void,
  onDown: () => void,
  onRotate: () => void,
  onDrop: () => void,
  onSwitchPhase: () => void
): void {
  let startX: number;
  let startY: number;
  const MIN_SWIPE_DISTANCE = 30;
  
  canvas.addEventListener('touchstart', (event) => {
    event.preventDefault();
    startX = event.touches[0].clientX;
    startY = event.touches[0].clientY;
  });
  
  canvas.addEventListener('touchend', (event) => {
    event.preventDefault();
    const endX = event.changedTouches[0].clientX;
    const endY = event.changedTouches[0].clientY;
    
    const diffX = endX - startX;
    const diffY = endY - startY;
    
    // Detect swipe direction
    if (Math.abs(diffX) > Math.abs(diffY)) {
      // Horizontal swipe
      if (Math.abs(diffX) > MIN_SWIPE_DISTANCE) {
        if (diffX > 0) {
          onRight();
        } else {
          onLeft();
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(diffY) > MIN_SWIPE_DISTANCE) {
        if (diffY > 0) {
          onDown();
        } else {
          onRotate();
        }
      }
    }
  });
  
  // Double tap for drop
  let lastTap = 0;
  canvas.addEventListener('touchend', (event) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    if (tapLength < 300 && tapLength > 0) {
      onDrop();
      event.preventDefault();
    }
    lastTap = currentTime;
  });
  
  // Add on-screen buttons for mobile
  const addMobileControls = () => {
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'mobile-controls';
    
    const buttonConfig = [
      { text: '←', action: onLeft },
      { text: '↑', action: onRotate },
      { text: '→', action: onRight },
      { text: '↓', action: onDown },
      { text: 'Drop', action: onDrop },
      { text: 'Switch', action: onSwitchPhase }
    ];
    
    buttonConfig.forEach(config => {
      const button = document.createElement('button');
      button.textContent = config.text;
      button.addEventListener('click', config.action);
      controlsContainer.appendChild(button);
    });
    
    document.body.appendChild(controlsContainer);
  };
  
  // Only add mobile controls on small screens
  if (window.innerWidth < 768) {
    addMobileControls();
  }
}
