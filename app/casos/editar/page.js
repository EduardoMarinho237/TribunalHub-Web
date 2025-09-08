"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft } from "lucide-react"
import { Loader2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const mockCaseData = {
  id: "123",
  title: "Processo trabalhista - Reclamação de horas extras",
  area: "trabalhista",
  notes: "Cliente alega não receber horas extras há 6 meses. Possui prints do sistema de ponto.",
  clientName: "João da Silva",
  clientId: "456"
}

export default function EditCasePage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const clientId = params.id
  const casoId = searchParams.get('casoId')

  const [formData, setFormData] = useState({
    title: "",
    area: "",
    notes: "",
    clientName: "Carregando..."
  })
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      try {
        await new Promise(resolve => setTimeout(resolve, 500))
        setFormData({
          title: mockCaseData.title,
          area: mockCaseData.area,
          notes: mockCaseData.notes,
          clientName: mockCaseData.clientName
        })
      } catch (error) {
      } finally {
        setIsLoading(false)
      }
    }

    if (casoId) loadData()
  }, [casoId])

  const handleSubmit = async () => {
    setIsSaving(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      router.push(`/`)
    } catch (error) {
    } finally {
      setIsSaving(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <header className="bg-white py-4 px-6 flex justify-between items-center border-b">
        <Button 
          variant="ghost" 
          onClick={() => router.push(`/`)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <h1 className="text-xl font-semibold">Editar Caso</h1>
        <div></div>
      </header>

      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-3xl mx-auto bg-white p-6 rounded-lg shadow-sm border">
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <Label>ID do Caso</Label>
                <Input
                  value={casoId}
                  readOnly
                  disabled
                  className="bg-gray-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="client">Cliente</Label>
                <Input
                  id="client"
                  value={formData.clientName}
                  readOnly
                  disabled
                  className="bg-gray-100"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Título do Caso *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Digite o título do caso"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="area">Área de Atuação *</Label>
                <Select 
                  value={formData.area} 
                  onValueChange={(value) => handleChange('area', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a área de atuação" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="civil">Civil</SelectItem>
                    <SelectItem value="penal">Penal</SelectItem>
                    <SelectItem value="trabalhista">Trabalhista</SelectItem>
                    <SelectItem value="tributario">Tributário</SelectItem>
                    <SelectItem value="consumidor">Consumidor</SelectItem>
                    <SelectItem value="familia">Família e Sucessões</SelectItem>
                    <SelectItem value="empresarial">Empresarial</SelectItem>
                    <SelectItem value="ambiental">Ambiental</SelectItem>
                    <SelectItem value="outra">Outra</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Anotações</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  placeholder="Detalhes do caso, observações, etc."
                  className="min-h-[120px]"
                />
              </div>
            </div>

            <div className="border-t pt-4 flex justify-end">
              <Button 
                onClick={handleSubmit}
                disabled={isSaving || !formData.title.trim() || !formData.area.trim()}
                className="w-full md:w-auto"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : 'Salvar Alterações'}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}