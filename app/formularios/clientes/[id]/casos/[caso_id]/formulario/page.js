"use client"

import { useState, useEffect } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2, CheckCircle2 } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function FormPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  
  const clientId = params.id
  const casoId = params.casoId
  const formularioId = searchParams.get('formularioId')

  const [formFields, setFormFields] = useState([])
  const [formData, setFormData] = useState({})
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  useEffect(() => {
    const loadForm = async () => {
      try {
        // Substitua por chamada real à API
        // const res = await fetch(`/api/formularios/${formularioId}`)
        // const data = await res.json()
        
        // Mock de dados
        await new Promise(resolve => setTimeout(resolve, 800))
        const mockFields = [
          { id: 'nome', name: 'Nome Completo', type: 'text', required: true },
          { id: 'cpf', name: 'CPF', type: 'text', required: true },
          { id: 'doc', name: 'Documento de Identidade', type: 'file', required: true }
        ]
        
        setFormFields(mockFields)
        const initialData = {}
        mockFields.forEach(field => {
          initialData[field.id] = ''
        })
        setFormData(initialData)
      } catch (error) {
        console.error("Erro ao carregar formulário:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (formularioId) loadForm()
  }, [formularioId])

  const handleChange = (fieldId, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Validação
      const missingFields = formFields.filter(f => 
        f.required && !formData[f.id]
      )
      
      if (missingFields.length > 0) {
        alert(`Preencha os campos obrigatórios: ${missingFields.map(f => f.name).join(', ')}`)
        return
      }

      // Envio para API
      // await fetch('/api/formularios/enviar', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     clientId,
      //     casoId,
      //     formularioId,
      //     data: formData
      //   })
      // })

      await new Promise(resolve => setTimeout(resolve, 1500))
      setIsSuccess(true)
    } catch (error) {
      console.error("Erro ao enviar:", error)
      alert("Erro ao enviar formulário")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">


      <main className="container mx-auto p-6">
        <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold mb-2">Formulário</h1>
          <p className="text-gray-600 mb-6">Caso {casoId} - Cliente {clientId}</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {formFields.map(field => (
              <div key={field.id} className="space-y-2">
                <Label>
                  {field.name}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                
                {field.type === 'text' && (
                  <Input
                    value={formData[field.id] || ''}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    placeholder={`Digite ${field.name.toLowerCase()}`}
                  />
                )}

                {field.type === 'file' && (
                  <Input
                    type="file"
                    onChange={(e) => handleChange(field.id, e.target.files[0])}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
                  />
                )}
              </div>
            ))}

            <Button type="submit" disabled={isSubmitting} className="mt-6 w-full">
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Enviando...
                </>
              ) : 'Enviar Formulário'}
            </Button>
          </form>
        </div>
      </main>
    </div>
  )
}