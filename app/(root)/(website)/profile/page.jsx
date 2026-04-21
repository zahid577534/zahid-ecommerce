'use client'

import React, { useState } from 'react'
import UserPanelLayout from '@/components/Application/Website/UserPanelLayout'
import WebSiteBreadcrumb from '@/components/Application/Website/WebSiteBreadcrumb'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl
} from '@/components/ui/form'

import { Input } from '@/components/ui/input'
import ButtonLoading from '@/components/Application/ButtonLoading'

const breadCrumbData = {
  title: 'Profile',
  links: [{ label: 'Profile' }]
}

const formSchema = z.object({
  email: z.string().email('Invalid email'),
  name: z.string().min(2, 'Name is too short')
})

const Profile = () => {
  const [loading, setLoading] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      name: ''
    }
  })

  const updateProfile = (values) => {
    console.log('Updated Values:', values)
  }

  return (
    <div>
      <WebSiteBreadcrumb props={breadCrumbData} />

      <UserPanelLayout>
        <div className='shadow rounded bg-white'>
          
          {/* Header */}
          <div className='p-5 text-xl font-semibold border-b'>
            Profile
          </div>

          {/* Form */}
          <Form onSubmit={form.handleSubmit(updateProfile)} className='mb-5'>
            
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} type='email' placeholder='example@gmail.com' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit */}
            <div className='mb-3'>
              <ButtonLoading
                loading={loading}
                type='submit'
                text='Save Changes'
                className='w-full cursor-pointer'
              />
            </div>

          </Form>
        </div>
      </UserPanelLayout>
    </div>
  )
}

export default Profile