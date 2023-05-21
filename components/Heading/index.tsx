import { Button, ButtonProps } from "../Button";

interface HeaderProps {
  title: string;
  subtitle?: string;
  button?: ButtonProps
}

export function Header (props: HeaderProps) {
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
      {props.button && <Button {...props.button} />}
    </div>
  )
}