'use client';

import { ProfileForm } from "@/components/ProfileForm";
import { Button } from "@/components/ui/button";
import { format } from "path";
import { createElement, useState } from "react";
import z, { string } from "zod";
import { FormDataError } from "./types";

const regex = /^\d+([.,]\d{1,6})?$/;
const schema = z.object({
  utimateRead: z.string()
    .min(1, { message: "Utima leitura é obrigatória" })
    .refine(value => value.length === 0 || /^\d+$/.test(value), { message: "Deve ser um número", path: ["utimateRead"] }),
  currentRead: z.string()
    .min(1, { message: "Leitura atual é obrigatória" })
    .refine(value => value.length === 0 || /^\d+$/.test(value), { message: "Deve ser um número", path: ["currentRead"] }),
  fee: z.string()
    .min(1, { message: "Tarifa é obrigatória" })
    .refine(value => value.length === 0 || regex.test(value), { message: "Deve ser um número válido com até duas casas decimais", path: ["fee"] })
});


const validateFormData = (formData: FormData) => {
  const utimateRead = formData.get("utima-leitura")?.toString();
  const currentRead = formData.get("leitura-atual")?.toString();
  const fee = formData.get("tarifa")?.toString();

  const data = { utimateRead, currentRead, fee };

  const result = schema.safeParse(data);

  if (!result.success) {
    return { success: false, errors: result.error.errors };
  }

  return { success: true, data: result.data };
};

export default function Home() {
  const [valueCalculated, setValueCalculated] = useState(0);
  const [data, setData] = useState("");
  const [error, setError] = useState<z.ZodIssue[] | undefined>();

  function handleCalculate(formData: FormData) {
    const utimateRead = formData.get("utima-leitura")?.toString();
    const currenteRead = formData.get("leitura-atual")?.toString();
    const fee = formData.get("tarifa")?.toString();

    const validateResult = validateFormData(formData);

    if (validateResult.success) {
      const invoice = (Number(currenteRead?.replace(",", "").replace(".", "")) - Number(utimateRead?.replace(",", "").replace(".", ""))) * parseFloat(fee!.replace(',', '.'));

      const file = `Utima leitura: ${utimateRead}\nLeitura atual: ${currenteRead}\nTarifa cobrada por Kw/h: ${fee}\nValor: ${formatCurrency(invoice)}`;

      setValueCalculated(invoice);
      setError(validateResult.errors);
      setData(file);
    } else {
      setError(validateResult.errors);
    }
  }

  function saveFile() {
    const blob = new Blob([data], { type: "text/plan" });
    const url = URL.createObjectURL(blob);
    const date = new Date();
    const month = getMonthName(date);

    const link = document.createElement("a");
    link.href = url;
    link.download = `meu_consumo_${month}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  function setEmoji() {
    if (valueCalculated < 100) {
      return `🥰`;
    } else if (valueCalculated < 250) {
      return `😳`;
    } else if (valueCalculated < 350) {
      return `😱`;
    } else {
      return `🤬`;
    }
  }

  function getMonthName(date: Date) {
    return date.toLocaleDateString('default', { month: 'long' });
  }

  function formatCurrency(currency: number) {
    return currency.toLocaleString('pt-Br', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-2 lg:p-24">
      <h1 className="text-3xl font-bold text-zinc-300 mb-10 mt-10">Meu consumo</h1>
      <ProfileForm handleCalculate={handleCalculate} formDataError={error} />
      <h2 className="text-lg mt-5">Valor: </h2>
      {
        valueCalculated > 0 &&
        <>
          <div className="flex items-center gap-5">
            <h2 className="text-3xl text-teal-500 mt-4">R$ {formatCurrency(valueCalculated)}</h2>
            <p className="text-3xl mt-4">{setEmoji()}</p>
          </div>
          <Button onClick={() => saveFile()} className="mt-5 bg-blue-700 text-zinc-100 border border-zinc-100 hover:text-blue-700">Baixar esse registro</Button>
        </>
      }
    </main>
  );
}
