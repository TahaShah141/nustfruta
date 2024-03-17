"use client"

import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { login } from '@/lib/redux/authSlice'
import { ArrowRightIcon } from '@radix-ui/react-icons'
import Link from 'next/link'

type Props = {
  children: React.ReactNode
}

export const Authenticator: React.FC<Props> = ({children}) => {
  
  const { isLoggedIn } = useAppSelector(state => state.auth)

  const [password, setPassword] = useState("")
  const [error, setError] = useState("")

  const dispatch = useAppDispatch()


  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD

  const checkPassword = () => {
    if (password === adminPassword) {
      dispatch(login())
    } else {
      setError("Wrong Password")
      setPassword("")
    }
  }
  
  return (
    <>
    {isLoggedIn ?
    <>{children}</> :
    <Card className='w-4/5 max-w-sm'>
      <CardHeader>
        <CardTitle>Not Logged In</CardTitle>
        <CardDescription>The Page You are trying to visit is for admin only</CardDescription>
      </CardHeader>
      <CardContent>
        <Label className={`${error ? "text-destructive" : ""}`}>{!error ? "Password" : error}</Label>
        <div className='flex gap-2 items-center'>
          <Input value={password} onChange={e => {setPassword(e.target.value); setError("")}} type="password" placeholder='Password' />
          <Button onClick={checkPassword} size={"icon"} className='h-full aspect-square'><ArrowRightIcon /></Button>
        </div>
      </CardContent>
      <CardFooter>
        <Link href={"/"} className='w-full'>
          <Button className='w-full' variant={"outline"}>Return to Home</Button>
        </Link>
      </CardFooter>
    </Card>}
    </>
  )
}
