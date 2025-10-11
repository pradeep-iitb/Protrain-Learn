import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

export default function useSpeech() {
  const state = useSpeechRecognition();

  const start = () => SpeechRecognition.startListening({ 
    continuous: true, 
    language: 'en-US',
    interimResults: true // Show interim results as user speaks
  });
  const stop = () => SpeechRecognition.stopListening();
  const supported = SpeechRecognition.browserSupportsSpeechRecognition();

  return { ...state, start, stop, supported };
}
