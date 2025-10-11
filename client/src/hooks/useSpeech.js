import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

export default function useSpeech() {
  const state = useSpeechRecognition();

  const start = () => SpeechRecognition.startListening({ continuous: false, language: 'en-US' });
  const stop = () => SpeechRecognition.stopListening();
  const supported = SpeechRecognition.browserSupportsSpeechRecognition();

  return { ...state, start, stop, supported };
}
