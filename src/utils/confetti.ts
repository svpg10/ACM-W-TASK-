import confetti from 'canvas-confetti';

export function fireCelebrationConfetti() {
  try {
    // Left burst
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0.1, y: 0.7 },
      colors: ['#F8C51C', '#FFFFFF', '#FFAE00', '#E5A800']
    });

    // Right burst
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 0.9, y: 0.7 },
      colors: ['#F8C51C', '#FFFFFF', '#FFAE00', '#E5A800']
    });

    // Center star burst
    setTimeout(() => {
      confetti({
        particleCount: 75,
        spread: 90,
        origin: { x: 0.5, y: 0.5 },
        colors: ['#F8C51C', '#FFE885', '#FFFFFF', '#14120E']
      });
    }, 250);
  } catch {
    // Fallback gracefully if canvas is constrained
  }
}
