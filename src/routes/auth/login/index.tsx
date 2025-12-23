'use client'

import { createFileRoute } from '@tanstack/react-router'
import hms from '../../../assets/img/hotel-management-system-login.jpg'
import LoginForm from './form'
import logo from '/logo-icon.svg'

export const Route = createFileRoute('/auth/login/')({
  component: RouteComponent,
})

export default function RouteComponent() {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-full h-full grid lg:grid-cols-2">
        <div className="relative max-w-md m-auto w-full flex flex-col items-center p-8 outline-0 sm:outline-2 outline-border/40 dark:outline-border/80 outline-offset-0.5">
          <div className="max-sm:hidden absolute border-t top-0 inset-x-0 w-[calc(100%+4rem)] -translate-x-8" />
          <div className="max-sm:hidden absolute border-b bottom-0 inset-x-0 w-[calc(100%+4rem)] -translate-x-8" />
          <div className="max-sm:hidden absolute border-s left-0 inset-y-0 h-[calc(100%+4rem)] -translate-y-8" />
          <div className="max-sm:hidden absolute border-e right-0 inset-y-0 h-[calc(100%+4rem)] -translate-y-8" />

          <div className="max-sm:hidden absolute border-t -top-1 inset-x-0 w-[calc(100%+3rem)] -translate-x-6" />
          <div className="max-sm:hidden absolute border-b -bottom-1 inset-x-0 w-[calc(100%+3rem)] -translate-x-6" />
          <div className="max-sm:hidden absolute border-s -left-1 inset-y-0 h-[calc(100%+3rem)] -translate-y-6" />
          <div className="max-sm:hidden absolute border-e -right-1 inset-y-0 h-[calc(100%+3rem)] -translate-y-6" />

          <article className="mb-10">
            <img
              src={logo}
              alt="Logo"
              className="size-32 flex justify-center w-full"
            />
            <p className="text-xl text-center font-semibold tracking-tight">
              Log in to Property Management <br /> System
            </p>
          </article>
          <LoginForm />
        </div>
        <div className="bg-muted hidden lg:block border-l max-h-screen min-h-screen">
          <img
            src={hms}
            alt="hotel-management-system"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  )
}
