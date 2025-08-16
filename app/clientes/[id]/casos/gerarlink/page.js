"use client"

import { useState } from "react"
import { useRouter, useParams, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, X, Plus } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Lista de campos padrão para processos jurídicos no Brasil
const STANDARD_FIELDS = [
  "Nome completo",
  "CPF",
  "RG",
  "Certidão de Nascimento",
  "Certidão de Casamento",
  "Título de Eleitor",
  "CNH (Carteira Nacional de Habilitação)",
  "Comprovante de Residência",
  "Contrato Social",
  "CNPJ",
  "Carteira de Trabalho",
  "PIS/PASEP",
  "Comprovante de Renda",
  "Extrato Bancário",
  "IPTU",
  "Contrato de Locação",
  "Nota Fiscal",
  "Laudo Médico",
  "Comprovante de Pagamento",
  "Procuração",
  "Documentos de Imóvel",
  "Histórico Escolar",
  "Comprovante de Inscrição Estadual",
  "Comprovante de Inscrição Municipal",
  "Termo de Acordo"
]

export default function FormLinkPage() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const clientId = params.id
  const casoId = searchParams.get('casoId')

  const [formFields, setFormFields] = useState([
    { id: 1, name: '', type: 'text', required: false, isCustom: false }
  ])
  const [showModal, setShowModal] = useState(false)
  const [onceCheckbox, setOnceCheckbox] = useState(false)
  const [emailCheckbox, setEmailCheckbox] = useState(false)

  const addFormField = () => {
    setFormFields([...formFields, {
      id: Date.now(),
      name: '',
      type: 'text',
      required: false,
      isCustom: false
    }])
  }

  const updateFormField = (id, field, value) => {
    setFormFields(formFields.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const toggleCustomField = (id) => {
    setFormFields(formFields.map(item => 
      item.id === id ? { ...item, isCustom: !item.isCustom, name: '' } : item
    ))
  }

  const removeFormField = (id) => {
    setFormFields(formFields.filter(item => item.id !== id))
  }

  const generateFormLink = () => {
    setShowModal(true)
  }

  const copyToClipboard = () => {
    const link = `https://TribunalHub.com/formulario/${casoId}`
    navigator.clipboard.writeText(link)
    alert('Link copiado para a área de transferência!')
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Link do Formulário</h2>
              <button onClick={() => setShowModal(false)}>
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="mb-4 p-3 bg-gray-100 rounded text-sm break-all">
              http://localhost:3000/formularios/clientes/1/casos/1/formulario?formularioId=1
            </div>
            <Button 
              onClick={copyToClipboard}
              className="w-full"
            >
              Copiar Link
            </Button>
          </div>
        </div>
      )}

      <header className="bg-white py-4 px-6 flex justify-between items-center border-b">
        <Button 
          variant="ghost" 
          onClick={() => router.push(`/`)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <h1 className="text-xl font-semibold">Gerar Link de Formulário</h1>
        <div></div>
      </header>

      <main className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-sm border">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Título do Caso</Label>
              <Input
                value="Contrato de Locação Residencial - Cliente Silva"
                readOnly
                disabled
                className="bg-gray-100"
              />
            </div>

            <div className="space-y-2">
              <Label>Cliente</Label>
              <Input
                value="José da Silva - CPF: 123.456.789-00"
                readOnly
                disabled
                className="bg-gray-100"
              />
            </div>

            <div className="space-y-2">
              <Label>Título do Formulário</Label>
              <Input
                placeholder="Adicione aqui suas informações para dar início ao processo. Ass: Dra Eduarda Zidanes"
                className="bg-gray-100"
                type="text"
              />
            </div>

            <div className="space-y-4">
              {formFields.map((field, index) => (
                <div key={field.id} className="group">
                  <div className={`p-4 rounded-lg hover:bg-gray-50 transition-colors ${index !== 0 ? 'border-t' : ''}`}>
                    <div className="space-y-2">
                      <div className="grid grid-cols-12 gap-4 items-end">
                        <div className="col-span-5">
                          <Label>Nome do Campo</Label>
                          {field.isCustom ? (
                            <Input
                              value={field.name}
                              onChange={(e) => updateFormField(field.id, 'name', e.target.value)}
                              placeholder="Digite o nome customizado"
                            />
                          ) : (
                            <Select
                              value={field.name}
                              onValueChange={(value) => updateFormField(field.id, 'name', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione um campo padrão" />
                              </SelectTrigger>
                              <SelectContent className="max-h-[300px] overflow-y-auto">
                                {STANDARD_FIELDS.map((fieldName) => (
                                  <SelectItem key={fieldName} value={fieldName}>
                                    {fieldName}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                        
                        <div className="col-span-4">
                          <Label>Tipo de Campo</Label>
                          <Select
                            value={field.type}
                            onValueChange={(value) => updateFormField(field.id, 'type', value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="text">Texto</SelectItem>
                              <SelectItem value="longtext">Texto longo</SelectItem>
                              <SelectItem value="numeric">Numérico</SelectItem>
                              <SelectItem value="file">Arquivo</SelectItem>
                              <SelectItem value="image">Imagem</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="col-span-2 flex items-center gap-2 h-10">
                          <Checkbox
                            id={`required-${field.id}`}
                            checked={field.required}
                            onCheckedChange={(checked) => updateFormField(field.id, 'required', checked)}
                          />
                          <Label htmlFor={`required-${field.id}`}>Obrigatório</Label>
                        </div>
                        
                        <div className="col-span-1 flex justify-end h-10">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeFormField(field.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="pl-1">
                        <Button
                          variant="link"
                          size="sm"
                          className="h-auto p-0 text-xs"
                          onClick={() => toggleCustomField(field.id)}
                        >
                          {field.isCustom ? 'Usar campo padrão' : 'Usar campo customizado'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              <div className="flex justify-center pt-4">
                <Button
                  variant="outline"
                  onClick={addFormField}
                  className="w-full md:w-auto"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Campo
                </Button>
              </div>
              
              <div className="pt-6">
                <div className="flex justify-end space-x-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="once-checkbox" 
                      checked={onceCheckbox}
                      onCheckedChange={(checked) => setOnceCheckbox(checked)}
                    />
                    <Label htmlFor="once-checkbox">Só pode ser respondido uma vez</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="email-checkbox" 
                      checked={emailCheckbox}
                      onCheckedChange={(checked) => setEmailCheckbox(checked)}
                    />
                    <Label htmlFor="email-checkbox">Enviar por email após gerar</Label>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-6 flex justify-end">
                <Button 
                  onClick={generateFormLink}
                  className="w-full md:w-auto"
                >
                  Gerar Link do Formulário
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}