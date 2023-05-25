'use client'
import { Header } from "@/components/Heading";
import { TableExtras } from "./components/table";
import { ButtonModal } from "../workData/components/buttonModal";
import { PlusIcon } from "@heroicons/react/solid";

export default function Extras() {

  return (
    <>
      <div className="flex w-full flex-col gap-4">
        <Header
          title="Listagem de extras"
          subtitle="Veja todos os seus extras"
          button={{
            testId: 'lancarHoras',
            asChild: true,
            children: <ButtonModal>
              <PlusIcon className="h-6 w-6" />
              Lançar horas
            </ButtonModal>,
            className: 'max-w-xs rounded rounded-md'
          }}
        />
        <TableExtras />
      </div>
    </>
  )
}