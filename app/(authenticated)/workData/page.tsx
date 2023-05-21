'use client'
import { Header } from "@/components/Heading";
import { CardsAnimation } from "./components/animtedCardsShow";
import { WorkDataCards } from "./components/cards";
import { PlusIcon } from "@heroicons/react/solid";
import { ButtonModal } from "./components/buttonModal";

export default function WorkData() {

  return (
    <>
      <div className="flex w-full flex-col gap-4">
        <Header
          title="Veja todos os seus dados"
          subtitle="Referente a horários e valores"
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
        <div className="flex flex-wrap gap-4 items-center w-full mt-2">
          <WorkDataCards />
        </div>
        <Header
          title="Resumo de extras"
          subtitle="Veja o total de seus ganhos e horas"
        />
        <CardsAnimation />
      </div>
    </>
  )
}