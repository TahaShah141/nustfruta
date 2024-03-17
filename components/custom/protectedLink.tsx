"use client"

import React, { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { ArrowRightIcon, LockClosedIcon } from '@radix-ui/react-icons'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { login } from '@/lib/redux/authSlice'

type Props = {
  linkPath: string
  pathName: string
  className: string
}

export const ProtectedLink: React.FC<Props> = ({linkPath, pathName, className}) => {

  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const { isLoggedIn } = useAppSelector(state => state.auth)
  const dispatch = useAppDispatch()

  const router = useRouter()

  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD

  const checkPassword = () => {
    if (password === adminPassword) {
      dispatch(login())
      router.push(linkPath)
    } else {
      setError("Wrong Password")
      setPassword("")
    }
  }

  return (
    <>
    {isLoggedIn ? 
    <Link className={className} href={linkPath}>{pathName}</Link> : 
    <Popover>
      <PopoverTrigger className={className}>
        <div className="flex gap-1 items-center">
          <LockClosedIcon />
          <p>{pathName}</p>
        </div>
      </PopoverTrigger>
      <PopoverContent>
        <div className='flex flex-col gap-2'>
          <div>
            <p className='text-md font-bold'>This is a Protected Link</p>
            {error ? 
            <p className='text-sm text-destructive'>{error}</p> :
            <p className='text-sm text-muted-foreground'>Enter Password to Continue</p>}
          </div>
          <div className='flex gap-2 items-center'>
            <Input value={password} onChange={e => {setPassword(e.target.value); setError("")}} type="password" placeholder='Password' />
            <Button onClick={checkPassword} size={"icon"} className='h-full aspect-square'><ArrowRightIcon /></Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>}
    </>
  )
}