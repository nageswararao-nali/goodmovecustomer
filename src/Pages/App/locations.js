const emoji = ['😴', '😄', '😃', '⛔', '🎠', '🚓', '🚇'];
const animations = ['bounce', 'fade', 'pulse', 'jump', 'waggle', 'spin'];
const duration = Math.floor(Math.random() * 3) + 1;
const delay = Math.floor(Math.random()) * 0.5;
const interationCount = 'infinite';

export default (locations = [
  {
    id: Math.floor(Math.random() * 1000),
    coords: [37.06452161, -75.67364786],
    icon: emoji[Math.floor(Math.random() * emoji.length)],
    animation: {
      name: animations[Math.floor(Math.random() * animations.length)],
      duration: Math.floor(Math.random() * 3) + 1,
      delay: Math.floor(Math.random()) * 0.5,
      interationCount
    }
  },
]);
