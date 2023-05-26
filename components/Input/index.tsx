'use client'
import React, { InputHTMLAttributes, useState } from 'react'
import { Slot } from '@radix-ui/react-slot';
import { AiFillEyeInvisible, AiFillEye } from 'react-icons/ai'
import { NumericFormat } from 'react-number-format';
import InputMask from 'react-input-mask';

export interface InputProps {
  className?: string
  label?: string
  type?: string
  isPassword?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  name?: string
  error?: boolean
  errorMessage?: string
  input?: InputHTMLAttributes<HTMLInputElement>
  mask?: string
  id: string
}

interface InputIconProps {
  onClick?: () => void
  children: React.ReactNode
}

function InputIcon({ onClick, children }: InputIconProps) {
  return (
    <Slot
      onClick={onClick}
      className="w-4 h-4 text-gray-700"
    >
      {children}
    </Slot>
  )
}

export const Input = (props: InputProps) => {

  const [show, setShow] = useState(false)

  return (
    <div className='w-full'>
      {props.label && (
        <label htmlFor={props.id} className="block pl-2 text-sm font-medium text-gray-700">
          {props.label}
        </label>
      )}
      <label
        className={`
          mt-1 flex items-center h-6 gap-3 py-4 px-3 border border-solid ${props.error ? 'border-red-500' : 'border-gray-300'} rounded-lg text-gray-100 text-xs placeholder:text-gray-400 focus-within:border-0 focus-within:ring-2 ring-blue-500 transition ${props.className || ''} ${props.input?.disabled && 'bg-gray-100' || 'bg-white'}
        `}
      >
        {props.leftIcon && (
          <InputIcon>
            {props.leftIcon}
          </InputIcon>
        )}
        {props.mask ? (
          <InputMask
            {...props.input}
            data-testId={props.id}
            type={props.isPassword ? show ? 'text' : 'password' : props.type || 'text'}
            id={props.id}
            className="bg-transparent flex-1 text-gray-700 text-xs placeholder:text-gray-500 outline-none"
            mask={props.mask}
            maskChar={null}
          />
        ) : (
          <input
            {...props.input}
            data-testId={props.id}
            type={props.isPassword ? show ? 'text' : 'password' : props.type || 'text'}
            id={props.id}
            className="bg-transparent flex-1 text-gray-700 text-xs placeholder:text-gray-500 outline-none"
          />
        )}
        {props.isPassword ? (
          <InputIcon onClick={() => setShow(e => !e)}>
            {show ? <AiFillEyeInvisible className='cursor-pointer' /> : <AiFillEye className='cursor-pointer' />}
          </InputIcon>
        ) : props.rightIcon && (
          <InputIcon>
            {props.rightIcon}
          </InputIcon>
        )}
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

interface InputCurrencyProps extends InputProps {
  setValue: (e: string) => void
  value: string
  placeholder?: string
  message?: string
}

export const InputCurrency = (props: InputCurrencyProps) => {

  return (
    <div>
      {props.label && (
        <label htmlFor={props.id} className="block pl-2 text-sm font-medium text-gray-700">
          {props.label}
        </label>
      )}
      <div
        className={`
          mt-1 flex items-center h-6 gap-3 py-4 px-3 border border-solid ${props.error ? 'border-red-500' : 'border-gray-300'} rounded-lg bg-white text-gray-100 text-xs placeholder:text-gray-400 focus-within:border-0 focus-within:ring-2 ring-blue-500 transition
        `}
      >
        <NumericFormat
          type="text"
          value={props.value}
          valueIsNumericString={true}
          decimalSeparator=","
          thousandSeparator="."
          prefix='R$'
          className='bg-transparent flex-1 text-gray-700 text-xs placeholder:text-gray-500 outline-none'
          data-testId={props.id}
          onChange={e => props.setValue(String(e.target.value))}
          decimalScale={2}
          maxLength={16}
          placeholder={props.placeholder}
        />;
        {/* <input
          {...props.input}
          value={formatCurrency(Number(props.input.value || 0))}
          onChange={e => handleValue(e.target.value)}
          id={props.id}
          className="bg-transparent flex-1 text-gray-700 text-xs placeholder:text-gray-500 outline-none"
        /> */}
        {props.rightIcon && (
          <InputIcon>
            {props.rightIcon}
          </InputIcon>
        )}
      </div>
      {props.message && (
        <p
          className='mt-1 text-gray-900 text-xs'
        >
          {props.message}
        </p>
      )}
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