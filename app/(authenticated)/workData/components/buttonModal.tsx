'use client'
import { ExtraModal } from "@/components/ExtraModal";
import { useState } from "react"

interface ButtonModalProps {
  children: React.ReactNode
}


export function ButtonModal(props: ButtonModalProps) {

  const [show, setShow] = useState(false);

  return (
    <>
      <button className="bg-sky-600 py-3 px-3 rounded font-semibold text-white text-sans text-sm max-w-xs hover:bg-sky-700 transition-colors focus:ring-2 ring-white flex justify-center items-center gap-3 w-full text-center" onClick={() => setShow(true)}>
        {props.children}
      </button>
      <ExtraModal
        show={show}
        setShow={setShow}
        
      />
    </>
  )

}