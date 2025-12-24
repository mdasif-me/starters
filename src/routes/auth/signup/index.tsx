'use client'

import hms from '@/assets/img/hotel-management-system-login.jpg'
import { Separator } from '@/components/ui/separator'
import { createFileRoute } from '@tanstack/react-router'
import SignupForm from '@/features/auth/components/signup-form'
import logo from '/logo-icon.svg'

export const Route = createFileRoute('/auth/signup/')({
  component: RouteComponent,
})

export default function RouteComponent() {
  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-full h-full grid lg:grid-cols-2">
        <div className="relative w-full sm:max-w-md m-auto flex flex-col items-center p-8 outline-0 sm:outline-2 outline-border/40 dark:outline-border/80 outline-offset-0.5">
          <div className="max-sm:hidden absolute border-t top-0 inset-x-0 w-[calc(100%+4rem)] -translate-x-8" />
          <div className="max-sm:hidden absolute border-b bottom-0 inset-x-0 w-[calc(100%+4rem)] -translate-x-8" />
          <div className="max-sm:hidden absolute border-s left-0 inset-y-0 h-[calc(100%+4rem)] -translate-y-8" />
          <div className="max-sm:hidden absolute border-e right-0 inset-y-0 h-[calc(100%+4rem)] -translate-y-8" />

          <div className="max-sm:hidden absolute border-t -top-1 inset-x-0 w-[calc(100%+3rem)] -translate-x-6" />
          <div className="max-sm:hidden absolute border-b -bottom-1 inset-x-0 w-[calc(100%+3rem)] -translate-x-6" />
          <div className="max-sm:hidden absolute border-s -left-1 inset-y-0 h-[calc(100%+3rem)] -translate-y-6" />
          <div className="max-sm:hidden absolute border-e -right-1 inset-y-0 h-[calc(100%+3rem)] -translate-y-6" />

          <article>
            <img
              src={logo}
              alt="Logo"
              className="size-32 flex justify-center w-full"
            />
            <p className="sm:text-xl text-lg text-center font-semibold tracking-tight">
              Signup to Property Management <br /> System
            </p>
          </article>
          <div className="my-7 w-full flex items-center justify-center overflow-hidden">
            <Separator />
            <span className="text-sm px-2">-</span>
            <Separator />
          </div>
          <SignupForm />
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
