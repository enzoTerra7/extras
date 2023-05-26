import { Transition } from "@headlessui/react";
import { Button, ButtonProps } from "../Button";

interface HeaderProps {
  title: string;
  subtitle?: string;
  button?: ButtonProps
  secondButton?: ButtonProps
}

export function Header(props: HeaderProps) {
  return (
    <div className="flex w-full gap-4 items-center justify-center flex-col md:justify-between md:flex-row">
      <div className="flex flex-col items-center text-center md:text-left md:items-start">
        <h3 className="text-gray-800 font-bold text-md md:text-lg">
          {props.title}
        </h3>
        {props.subtitle && (
          <p className="text-gray-600 font-medium text-sm md:text-md">
            {props.subtitle}
          </p>
        )}
      </div>
      <div className="flex gap-4 flex-col items-center justify-center md:flex-row">
        <Transition
          show={!!props.secondButton}
          enter="transition ease-out duration-300"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-300"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          {props.secondButton && <Button {...props.secondButton} />}
        </Transition>
        <Transition
          show={!!props.button}
          enter="transition ease-out duration-300"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-300"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          {props.button && <Button {...props.button} />}
        </Transition>
      </div>
    </div>
  )
}