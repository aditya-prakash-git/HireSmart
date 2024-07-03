"use client"
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import Webcam from 'react-webcam'
import { Button } from '../../../../../../components/ui/button'
import useSpeechToText from 'react-hook-speech-to-text';
import { Mic } from 'lucide-react'
import { toast } from 'sonner'
import createChatSession from '../../../../../../utils/GeminiAIModel'
import { db } from '../../../../../../utils/db'
import { useUser } from '@clerk/nextjs'


const chatSession = createChatSession();

function RecordAnswerSection({ questions = [], activeQuestionIndex = 0, interviewData }) {
  const [userAnswer, setUserAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useUser();
  const {
    error,
    interimResult,
    isRecording,
    results,
    startSpeechToText,
    stopSpeechToText,
  } = useSpeechToText({
    continuous: true,
    useLegacyResults: false
  });

  useEffect(() => {
    results.map((result) => (
      setUserAnswer(prevAns => prevAns + result?.transcript)
    ));
  }, [results]);

  useEffect(() => {
    if (!isRecording && userAnswer.length > 10) {
      UpdateUserAnswer();
    }
  }, [userAnswer]);

  const StartStopRecording = async () => {
    if (isRecording) {
      stopSpeechToText();
    } else {
      startSpeechToText();
    }
  }

  const UpdateUserAnswer = async () => {
    console.log(userAnswer);
    setLoading(true);
    const feedbackPrompt = `Question: ${questions[activeQuestionIndex]?.question}, User Answer: ${userAnswer}, Depends on question and user answer for given interview question. Please give us rating for answer and feedback in just 3 to 5 lines to improve it in JSON format with rating field and feedback field`;

    try {
      const result = await chatSession.sendMessage(feedbackPrompt);
      const mockJsonResp = result.text().replace('```json', '').replace('```', '');
      console.log(mockJsonResp);
      const JsonFeedbackResp = JSON.parse(mockJsonResp);

      const resp = await db.insert(userAnswer).values({
        mockIdRef: interviewData?.mockId,
        question: questions[activeQuestionIndex]?.question,
        correctAns: questions[activeQuestionIndex]?.answer,
        userAns: userAnswer,
        feedback: JsonFeedbackResp?.feedback,
        rating: JsonFeedbackResp?.rating,
        userEmail: user?.primaryEmailAddress?.emailAddress,
      });

      if (resp) {
        toast('User Answer recorded successfully');
      }
      setUserAnswer('');
      setLoading(false);
    } catch (error) {
      console.error('Error updating user answer:', error);
      toast('Error updating user answer');
      setLoading(false);
    }
  }

  return (
    <div className='flex items-center justify-center flex-col'>
      <div className='flex flex-col justify-center items-center mt-20 bg-black rounded-lg p-5'>
        <Image src={'/webcam.png'} width={200} height={200} alt='sup' className='absolute' />
        <Webcam
          mirrored={true}
          style={{
            height: 300,
            width: '100%',
            zIndex: 10,
          }}
        />
      </div>
      <Button
        disabled={loading}
        variant="outline"
        className="my-10"
        onClick={StartStopRecording}>
        {isRecording ?
          <h2 className='text-red-600 flex gap-2'>
            <Mic />Stop Recording
          </h2>
          :
          'Record Answer'}
      </Button>

      <Button onClick={() => console.log(userAnswer)}>Show Results</Button>
    </div>
  )
}

export default RecordAnswerSection;
