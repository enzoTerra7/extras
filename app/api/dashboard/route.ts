import checkAuth from "@/middleware/checkAuth";
import { prisma } from "@/prisma/lib";
import { Extras } from "@prisma/client";
import { endOfMonth, startOfMonth } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = checkAuth(req)

    if (token instanceof NextResponse) {
      return token;
    }

    const firstDayOfMonth = startOfMonth(new Date());
    const lastDayOfMonth = endOfMonth(new Date());

    const extras = await prisma.extras.findMany({
      where: {
        //@ts-expect-error
        userId: token?.id,
        AND: {
          diaReferente: {
            gte: firstDayOfMonth,
            lte: lastDayOfMonth
          }
        }
      }
    })

    await prisma.$disconnect()

    const datas = reduceValues(extras)

    const graphData = getMonthData(extras, lastDayOfMonth)

    return NextResponse.json({
      message: 'Dados encontrados com sucesso',
      dados: {
        ...datas,
        grafico: graphData
      }
    }, {
      status: 200
    })
  } catch (e: any) {
    console.log(e)
    await prisma.$disconnect()
    return NextResponse.json({ message: "Ocorreu um erro. Tente novamente mais tarde", error: e }, {
      status: 500
    })
  }
}

function reduceValues(extras: Extras[]) {

  const totalGanho = extras.reduce((total, extra) => total + extra.valor, 0);
  const totalHorasDescontadas = extras.reduce((total, extra) => total + (extra.horasDescontas || 0), 0);
  const totalHoras = extras.reduce((total, extra) => total + extra.horas, 0);

  return {totalGanho, totalHoras: totalHoras == 0 ? '0h' : `${Math.floor(totalHoras / 60)}h${totalHoras % 60}m`, totalHorasDescontadas: totalHorasDescontadas == 0 ? '0h' : `${Math.floor(totalHorasDescontadas / 60)}h${totalHorasDescontadas % 60}m`}
}

function getMonthData(extras: Extras[], lastDayOfMonth: Date): { dia: number; horas: number }[] {
  const monthData: { dia: number; horas: number }[] = [];

  const totalDays = lastDayOfMonth.getDate(); // Obter o número total de dias no mês

  // Inicializar o array com todos os dias e horas 0
  for (let i = 1; i <= totalDays; i++) {
    monthData.push({ dia: i, horas: 0 });
  }

  // Preencher as horas correspondentes para os dias com 'Extras'
  for (const extra of extras) {
    const day = extra.diaReferente.getDate();
    monthData[day - 1].horas = extra.horas;
  }

  return monthData;
}
