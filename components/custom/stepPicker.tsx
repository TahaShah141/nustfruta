"use client"

import React, { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { MinusIcon, PlusIcon } from '@radix-ui/react-icons'

type Props = {
  value: number
  onChange: (arg0: number) => void
  display?: number
  step?: number
  min?: number
  max?: number
}

export const StepPicker: React.FC<Props> = ({step=1, value, display=value, onChange, min=0, max}) => {
  return (
    <div className='flex gap-2'>
      <Button className='h-6 aspect-square p-1' variant={"ghost"} onClick={() => onChange(Math.max(min, value-step))} ><MinusIcon /></Button>
      <p>{display}</p>
      <Button className='h-6 aspect-square p-1' variant={"ghost"} onClick={() => onChange(Math.min(value+step, max !== undefined ? max : value+step))} ><PlusIcon /></Button>
    </div>
  )
}