"use client"

import { FormDataError } from "@/app/types";
import { Button } from "./ui/button";
import { z } from "zod";



export function ProfileForm({ handleCalculate, formDataError }: { handleCalculate: (formData: FormData) => void, formDataError: z.ZodIssue[] | undefined }) {
  const error: FormDataError = {};
  console.log(formDataError)
  function setFormDataError(resultError: z.ZodIssue) {
    switch (resultError.path[0]) {
      case "utimateRead":
        error.utimateRead = resultError.message;
        break;
      case "currentRead":
        error.currentRead = resultError.message;
        break;
      case "fee":
        error.fee = resultError.message;
        break;
      default:
        break;
    }
  }
  
  formDataError?.map(e => {
    setFormDataError(e);
  });

  return (
    <form action={handleCalculate} className="grid grid-cols-1 gap-10 w-full p-8 lg:grid-cols-2 lg:gap-10 lg:w-3/5 lg:p-10 bg-zinc-800 rounded">
      <div>
        <label>Valor da útima leitura</label>
        <input type="text" name="utima-leitura" className="w-full h-10 rounded border-2 border-zinc-500 bg-zinc-800 p-2" />
        {error.utimateRead && <span className="text-red-700 font-bold">{error.utimateRead}</span>}
      </div>
      <div>
        <label>Valor atual do relógio</label>
        <input type="text" name="leitura-atual" className="w-full h-10 rounded border-2 border-zinc-500 bg-zinc-800 p-2" />
        {error.currentRead && <span className="text-red-700 font-bold">{error.currentRead}</span>}
      </div>
      <div className="lg:col-span-full">
        <label>Tarifa cobrada por Kw/h</label>
        <div className="w-full">
          <input type="text" name="tarifa" className="w-full h-10 rounded border-2 border-zinc-500 bg-zinc-800 p-2" />
          {error.fee && <span className="text-red-700 font-bold">{error.fee}</span>}
        </div>
      </div>
      <div className="lg:col-span-full">
        <Button size="lg" className="col-span-2 bg-teal-500 text-lg text-zinc-200 w-full hover:text-teal-500">Calcular o consumo</Button>
      </div>
    </form>
  )
}
