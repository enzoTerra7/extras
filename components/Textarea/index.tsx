import React, { TextareaHTMLAttributes } from 'react'

export interface TextareaProps {
  className?: string
  label?: string
  row?: number
  name?: string
  error?: boolean
  errorMessage?: string
  textarea?: TextareaHTMLAttributes<HTMLTextAreaElement>
  id: string
}

export const Textarea = (props: TextareaProps) => {

  return (
    <div className='w-full'>
      {props.label && (
        <label htmlFor={props.id} className="block pl-2 text-sm font-medium text-gray-700">
          {props.label}
        </label>
      )}
      <label
        className={`
          mt-1 flex items-center gap-3 py-4 px-3 border border-solid ${props.error ? 'border-red-500' : 'border-gray-300'} rounded-lg bg-white text-gray-100 text-xs placeholder:text-gray-400 focus-within:border-0 focus-within:ring-2 ring-blue-500 transition ${props.className}
        `}
      >
        <textarea
          {...props.textarea}
          data-testId={props.id}
          id={props.id}
          rows={props.row || 5}
          className="bg-transparent flex-1 text-gray-700 text-xs placeholder:text-gray-500 outline-none"
        />
      </label>
      {(props.error && props.errorMessage) && (
        <p
          className='mt-1 text-red-500 font-bold text-[0.625rem]'
        >
          {props.errorMessage}
        </p>
      )}
    </div>
  )
}