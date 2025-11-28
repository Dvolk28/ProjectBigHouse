export function playIlluminateSound() {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  const masterGain = audioContext.createGain();
  masterGain.connect(audioContext.destination);
  masterGain.gain.setValueAtTime(0.3, audioContext.currentTime);
  
  const oscillator1 = audioContext.createOscillator();
  oscillator1.type = 'sine';
  oscillator1.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
  oscillator1.frequency.exponentialRampToValueAtTime(784, audioContext.currentTime + 0.3); // G5
  
  const oscillator2 = audioContext.createOscillator();
  oscillator2.type = 'sine';
  oscillator2.frequency.setValueAtTime(659.25, audioContext.currentTime); // E5
  oscillator2.frequency.exponentialRampToValueAtTime(1046.5, audioContext.currentTime + 0.4); // C6
  
  const oscillator3 = audioContext.createOscillator();
  oscillator3.type = 'triangle';
  oscillator3.frequency.setValueAtTime(392, audioContext.currentTime + 0.1); // G4
  oscillator3.frequency.exponentialRampToValueAtTime(523.25, audioContext.currentTime + 0.5); // C5
  
  const gain1 = audioContext.createGain();
  gain1.gain.setValueAtTime(0.4, audioContext.currentTime);
  gain1.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
  
  const gain2 = audioContext.createGain();
  gain2.gain.setValueAtTime(0.3, audioContext.currentTime);
  gain2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.6);
  
  const gain3 = audioContext.createGain();
  gain3.gain.setValueAtTime(0, audioContext.currentTime);
  gain3.gain.linearRampToValueAtTime(0.25, audioContext.currentTime + 0.15);
  gain3.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
  
  const reverb = audioContext.createConvolver();
  const reverbLength = audioContext.sampleRate * 1.5;
  const impulse = audioContext.createBuffer(2, reverbLength, audioContext.sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const channelData = impulse.getChannelData(channel);
    for (let i = 0; i < reverbLength; i++) {
      channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / reverbLength, 2);
    }
  }
  reverb.buffer = impulse;
  
  const reverbGain = audioContext.createGain();
  reverbGain.gain.setValueAtTime(0.15, audioContext.currentTime);
  
  oscillator1.connect(gain1);
  oscillator2.connect(gain2);
  oscillator3.connect(gain3);
  
  gain1.connect(masterGain);
  gain2.connect(masterGain);
  gain3.connect(masterGain);
  
  gain1.connect(reverb);
  gain2.connect(reverb);
  gain3.connect(reverb);
  reverb.connect(reverbGain);
  reverbGain.connect(masterGain);
  
  oscillator1.start(audioContext.currentTime);
  oscillator2.start(audioContext.currentTime);
  oscillator3.start(audioContext.currentTime + 0.1);
  
  oscillator1.stop(audioContext.currentTime + 0.5);
  oscillator2.stop(audioContext.currentTime + 0.6);
  oscillator3.stop(audioContext.currentTime + 0.8);
  
  setTimeout(() => {
    audioContext.close();
  }, 2000);
}
