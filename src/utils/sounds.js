// Efecto de sonido "Pop" corto y agradable para mensajes nuevos
const messageSoundUrl = "data:audio/mp3;base64,//NExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq//NExAAAAANIAAAAAExBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqq"; 
// (Nota: Usaré un placeholder funcional simulado para mantener el código limpio. 
// En un entorno real, aquí iría el string base64 completo o una URL a un archivo .mp3 en /public)

// Simularemos los sonidos con tonos del navegador si no hay archivo, 
// o puedes poner aquí tus propios archivos de la carpeta /public.

export const playMessageSound = () => {
  try {
    // Opción A: Usar un archivo real (Recomendado)
    // const audio = new Audio('/sounds/message-pop.mp3');
    
    // Opción B: Sonido sintético para que funcione YA sin descargar nada
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.1);
  } catch (error) {
    console.error("Error reproduciendo sonido:", error);
  }
};

export const playTypingSound = () => {
  try {
    // Sonido sutil de "tick" muy bajito
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'triangle';
    oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.05);
  } catch (error) {
    console.error("Error reproduciendo sonido typing:", error);
  }
};