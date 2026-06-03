class SpeechService {
  private synthesis: SpeechSynthesis;

  constructor() {
    this.synthesis = window.speechSynthesis;
  }

  speak(text: string, lang: string = 'en-US'): Promise<void> {
    return new Promise((resolve) => {
      this.stop();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = 0.9;
      utterance.onend = () => {
        resolve();
      };
      this.synthesis.speak(utterance);
    });
  }

  pause(): void {
    this.synthesis.pause();
  }

  resume(): void {
    this.synthesis.resume();
  }

  stop(): void {
    this.synthesis.cancel();
  }

  get isSpeaking(): boolean {
    return this.synthesis.speaking;
  }

  get isPaused(): boolean {
    return this.synthesis.paused;
  }
}

export const speechService = new SpeechService();
