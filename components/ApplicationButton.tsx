/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
import React, { useState } from 'react'
import { Button } from './ui/button'

const ApplicationButton = ({jobData,hasApplied}) => {
    const [userApplied,setuserApplied] =  useState(hasApplied)
  return (
   <>
   {
    userApplied ?<Button className='w-full bg-red-500' variant="outline">Delete</Button> : <Button className='w-full bg-green-500' variant="outline">Apply</Button> 
   }
   </>
  )
}

export default ApplicationButton
