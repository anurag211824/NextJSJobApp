/* eslint-disable @typescript-eslint/ban-ts-comment */
//@ts-nocheck
'use client'
import { AppContext } from '@/context/AppContext'
import React, { useContext } from 'react'

const PAge = () => {
const {user} =  useContext(AppContext)

  return (
    <div className='bg-red-400'>
      {user.id}
    
      {user.email}
 
      {user.role}
    
    </div>
  )
}

export default PAge
