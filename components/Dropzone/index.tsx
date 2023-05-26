import React, { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'

interface Props {
  saveFile?: any
  children: any
  preview?: any
  typeFiles?: 1 | 2
}

export const Dropzone: React.FC<Props> = ({
  saveFile,
  children,
  typeFiles = 1,
  preview
}) => {
  const onDrop = useCallback(
    (acceptedFiles: any) => {
      const file = acceptedFiles[0]
      const uri = URL.createObjectURL(file)

      if(saveFile){
        saveFile(file)
        console.log(file)
      }
      if(preview){
        preview(uri)
        console.log(uri)
      }
    },
    [saveFile, preview]
  )
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      'application/x-freearc': typeFiles === 1 ? ['.pdf'] : ['.jpg', '.jpeg', '.png']
    }
  })

  return (
    <div className='w-full' {...getRootProps()}>
      <input {...getInputProps()} name="enviarDoc" />
        {children}
    </div>
  )
}