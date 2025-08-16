"use client"

import { useState } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Info } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function CaseTrackingPage() {
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [showCodeField, setShowCodeField] = useState(false)
  const [code, setCode] = useState("")
  const isFormValid = email.trim() !== "" && phone.trim() !== ""

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center gap-2">
            <CardTitle>Acompanhar meus casos</CardTitle>
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-4 w-4 text-gray-500" />
                </TooltipTrigger>
                <TooltipContent side="right" className="max-w-[300px]">
                  <p className="text-sm">
                    Para ter acesso ao acompanhamento dos seus casos gerenciados no TribunalHub, o responsável pelo seu caso deve ter habilitado a disponibilização do acompanhamento e ter registrado seu email e telefone no sistema. Entre em contato com o responsável caso hajam problemas.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>

        <CardContent>
          {!showCodeField ? (
            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault()
              setShowCodeField(true)
            }}>
              <div className="space-y-2">
                <Label>Email cadastrado *</Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Telefone cadastrado *</Label>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(00) 00000-0000"
                  required
                />
              </div>

              <Button 
                type="submit" 
                className="w-full"
                disabled={!isFormValid}
              >
                Acompanhar meus casos
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Código de verificação</Label>
                <Input
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="Digite o código recebido"
                  required
                />
                <p className="text-sm text-gray-500">
                  Enviamos um código para {email}
                </p>
              </div>

              <Button className="w-full">
                Verificar código
              </Button>

              <Button 
                variant="link" 
                className="w-full text-sm"
                onClick={() => setShowCodeField(false)}
              >
                Voltar e corrigir dados
              </Button>
            </div>
          )}
        </CardContent>

        {showCodeField && (
          <CardFooter className="flex justify-center">
            <Button variant="link" className="text-sm">
              Reenviar código
            </Button>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}