import { UserButton } from '@clerk/nextjs'
import React from 'react'
import NewInterviewAdd from './_components/NewInterviewAdd'

function Dashboard() {
  return (
    <div className='p-10'>
      <h2 className='font-bold text-2xl'>Dashboard</h2>
      <h1 className='text-gray-500'>Initialize your AI Interview</h1>

      <div className='grid grid-cols-1 md:grid-cols-3 my-5'>
        <NewInterviewAdd/>
        
      </div>
      


        
    </div>
  )
}

export default Dashboard