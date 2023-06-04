import checkAuth from "@/middleware/checkAuth";
import { prisma } from "@/prisma/lib";
import { Extras } from "@prisma/client";
import { addMonths, isSameDay, format, endOfMonth, startOfMonth, addDays, isBefore, subMonths } from "date-fns";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const token = checkAuth(req)

    if (token instanceof NextResponse) {
      return token;
    }

    const currentDate = new Date();
    const currentMonth = startOfMonth(currentDate);
    const previousMonth = subMonths(currentDate, 1);

    const isCurrentMonthDay10OrLater = currentDate.getDate() >= 10;

    const day10CurrentMonth = new Date(currentMonth.getFullYear(), (isCurrentMonthDay10OrLater ? currentMonth.getMonth() : previousMonth.getMonth()), 10);

    // Obter a data do dia 9 do próximo mês
    const nextMonth = addMonths(currentMonth, isCurrentMonthDay10OrLater ? 1 : 0);
    const day9NextMonth = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 9);

    const firstDayOfMonth = startOfMonth(new Date());
    const lastDayOfMonth = endOfMonth(new Date());

    const extras = await prisma.extras.findMany({
      where: {
        //@ts-expect-error
        userId: token?.id,
        AND: {
          diaReferente: {
            gte: day10CurrentMonth,
            lte: day9NextMonth
          }
        }
      }
    })

    await prisma.$disconnect()

    const datas = reduceValues(extras)

    const graphData = getMonthData(extras, isCurrentMonthDay10OrLater)

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

  return { totalGanho, totalHoras: totalHoras == 0 ? '0h' : `${Math.floor(totalHoras / 60)}h${totalHoras % 60}m`, totalHorasDescontadas: totalHorasDescontadas == 0 ? '0h' : `${Math.floor(totalHorasDescontadas / 60)}h${totalHorasDescontadas % 60}m` }
}

function getMonthData(extras: Extras[], currentDay: boolean): { dia: string; horas: number }[] {
  const monthData: { dia: string; horas: number }[] = [];

  const currentDate = new Date();
  const currentMonth = currentDay ? startOfMonth(currentDate) : startOfMonth(subMonths(currentDate, 1));;
  const nextMonth = addDays(endOfMonth(currentMonth), 1);
  const endDate = new Date(nextMonth.getFullYear(), nextMonth.getMonth(), 9);

  let currentDatePointer = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 10);

  while (isBefore(currentDatePointer, endDate) || isSameDay(currentDatePointer, endDate)) {
    const formattedDate = format(currentDatePointer, 'dd/MM');
    monthData.push({
      dia: formattedDate,
      horas: 0,
    });
    currentDatePointer = addDays(currentDatePointer, 1);
  }

  // Preencher as horas correspondentes para os dias com 'Extras'
  for (const extra of extras) {
    const formattedDate = format(extra.diaReferente, 'dd/MM');
    const index = monthData.findIndex(e => e.dia === formattedDate)
    monthData[index].horas = extra.horas;
  }

  return monthData;
}
