import { WorkDataCards } from "./components/cards";

export default function WorkData() {

  return (
    <>
      <div className="flex w-full flex-col gap-4">
        <div className="flex gap-4 items-center w-full">
          <WorkDataCards />
        </div>
      </div>
    </>
  )
}