import { Lightbulb, Volume2 } from 'lucide-react';
import React from 'react'

function QuestionsSection({mockInterviewQuestion, activeQuestionIndex}) {
  console.log("mockInterviewQuestion:", mockInterviewQuestion);
  
  const textToSpeech = (text) => {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(speech);
    } else {
      alert('Sorry, browser does not support speech synthesis');
    }
  }

  // Access the interview_questions array
  const questions = mockInterviewQuestion && mockInterviewQuestion.interview_questions
    ? mockInterviewQuestion.interview_questions
    : [];

  return mockInterviewQuestion && (
    <div className='p-5 border rounded-lg'>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mb-5'>
        {questions.length > 0 ? (
          questions.map((question, index) => (
            <div key={index} className="mb-4">
              <h2 className={`p-2 bg-secondary rounded-full text-xs md:text-sm text-center cursor-pointer ${activeQuestionIndex === index ? 'bg-orange-500 text-white' : ''}`}>
                Question #{index + 1}
              </h2>
            </div>
          ))
        ) : (
          <p>No questions available.</p>
        )}
      </div>

      {/* Display active question */}
      {questions.length > 0 && activeQuestionIndex !== undefined && (
        <div className="mt-5 p-4 border rounded-lg">
          <h3 className="font-bold text-lg mb-2">Active Question:</h3>
          <p>{questions[activeQuestionIndex]?.question}</p>
          <Volume2 
            className="cursor-pointer mt-2" 
            onClick={() => textToSpeech(questions[activeQuestionIndex]?.question)}
          />
        </div>
      )}

      <div className='border round-lg p-5 bg-blue-100 mt-20'>
        <h2 className='flex gap-2 items-center text-blue-700'>
            <Lightbulb/>
            <strong>Note:</strong>
        </h2>
        <h2 className='text-sm text-purple-500 my-2'>{process.env.NEXT_PUBLIC_QUESTION_NOTE}</h2>
      </div>
    </div>
  )
}

export default QuestionsSection