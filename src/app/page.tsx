"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { supabase } from "@/lib/supabase"

const questions = [
  "What do you love?",
  "What are you good at?",
  "What can you be paid for?",
  "What does the world need?"
]

export default function Home() {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<string[]>(["", "", "", ""])

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newAnswers = [...answers]
    newAnswers[step] = e.target.value
    setAnswers(newAnswers)
  }

  function nextQuestion() {
    if (step < questions.length - 1) {
      setStep(step + 1)
    } else {
      console.log("All answers:", answers)
    }
  }

  return (
    <main className="flex items-center justify-center h-screen bg-[#FAFAF7]">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Ikigai App</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg">{questions[step]}</p>
          <input
            type="text"
            className="border p-2 w-full"
            value={answers[step]}
            onChange={handleChange}
          />
          <Button className="bg-indigo-600 text-white w-full" onClick={nextQuestion}>
            {step < questions.length - 1 ? "Next" : "Finish"}
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
