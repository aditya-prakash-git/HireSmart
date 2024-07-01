"use client"
import React, { useEffect, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../components/ui/dialog'

import {Button} from '../../../components/ui/button'
import {Input} from '../../../components/ui/input'
import {Textarea} from '../../../components/ui/textarea'
import createChatSession from '../../../utils/GeminiAIModel'
import {  LoaderCircle } from 'lucide-react'
import {db} from '../../../utils/db'
import { AiMockInterview } from '../../../utils/schema'
import { v4 as uuidv4 } from 'uuid';
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'





function NewInterviewAdd() {
  const [openDialog, setOpenDailog]= useState(false)
  const [jobPosition, setJobPosition]= useState();
  const [jobDesc, setJobDesc]= useState();
  const [jobExperience, setJobExperience]= useState();
  const [chatSession, setChatSession] = useState(null);
  const [loading, setLoading]=useState(false);
  const [jsonResponse, setJsonResponse]=useState([]);
  const router=useRouter();
  const {user}=useUser();
  useEffect(() => {
    setChatSession(createChatSession())
  }, [])
  
  const onSubmit = async (e) => {
    setLoading(true)
    e.preventDefault()
    if (!chatSession) {
      console.error('Chat session not initialized')
      return
    }
    try {
      console.log(jobPosition, jobDesc, jobExperience)

      const InputPrompt = `Job Role: ${jobPosition}, Job Description: ${jobDesc}, Years of experience: ${jobExperience}, Depending on Job Position, Job Description and Years of Experience give us ${process.env.NEXT_PUBLIC_INTERVIEW_QUESTION_COUNT} interview question along with Answer in JSON format.`

      const result = await chatSession.sendMessage(InputPrompt)
      const MockJsonResp=(result.text()).replace('```json', '').replace('```', '')
      console.log(JSON.parse(MockJsonResp));
      setJsonResponse(MockJsonResp);
      if (MockJsonResp){

      

      const resp=await db.insert(AiMockInterview)
      .values ({
        mockId:uuidv4(),
        jsonMockResp:MockJsonResp,
        jobPosition:jobPosition,
        jobDesc:jobDesc,
        jobExperience:jobExperience,
        createdBy: user?.primaryEmailAddress?.emailAddress 
      
        
      }).returning({mockId:AiMockInterview.mockId});

      console.log( "Inserted ID:", resp)
      if(resp)
        {
          setOpenDailog(false);
          router.push('dashboard/interview/'+resp[0]?.mockId)
        }
    }
    else{
      console.log('error');
    }
      setLoading(false)
    } catch (error) {
      console.error('Error in onSubmit:', error)
    }
  }

  return (
    <div>
        <div className='p-10 border rounded-lg bg-secondary hover:scale-100 hover:shadow-md cursor-pointer transition-all'
        
        onClick={()=>setOpenDailog(true)}>
            <h2 className='text-lg text-center'>+ Let's Add New </h2>
        </div>
        <Dialog open={openDialog}>
  
  <DialogContent className="max-w-2xl">
    <DialogHeader>
      <DialogTitle >Tell us a bit about your Interview</DialogTitle>
      <DialogDescription>
        <form onSubmit={onSubmit}>
        <div>
          <h2 className='font-bold text-2xl'></h2>
          <h2>Please add details about your Position, Job Description and years of experience</h2>
          <div className='mt-7 my-3'>
            <label>Job Role</label>
            <Input placeholder="Ex. Data Scientist" required
            onChange={(event)=>setJobPosition(event.target.value)}
            />
          </div>
          <div className='my-3'>
            <label>Job Description</label>
            <Textarea placeholder="Ex. Data Analysis " required
            onChange={(event)=>setJobDesc(event.target.value)}
            
            />
          </div>
          <div className='my-3'>
            <label>Years of Experience</label>
            <Input placeholder="2" type="number" max="50" required
            onChange={(event)=>setJobExperience(event.target.value)}
            
            />
          </div>

        </div>
       
        
        <div className='flex gap-5 justify-end'>
          <Button type="button" variant="ghost" onClick={()=>setOpenDailog(false)}>Cancel</Button>
          <Button type="submit" disabled={loading}>
            {loading?
            <>
            <LoaderCircle className='animate-spin'/> AI Magic is Taking Place
            
            </>:'Start Interview'}
            
            
            </Button>
          
        </div>
        </form>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>


    </div>
  )
}

export default NewInterviewAdd