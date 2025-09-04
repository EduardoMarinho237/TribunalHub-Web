"use client"

import UserProfileDropdown from "@/components/common/user-profile-dropdown"
import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ChevronDown, ChevronUp, Download } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

// Dados mockados do usuário
const mockUser = {
  name: "Eduarda Zidanes",
  email: "DraEduarda@advocacia.com",
  avatar: "/default-avatar.png",
  role: "Advogada"
}

// Dados mockados de casos (simulando API)
const mockCasesData = [
  {
    id: "1",
    title: "Processo Trabalhista - Indenização por Danos Morais",
    type: "Trabalhista",
    startDate: "15/03/2023",
    status: "Em andamento",
    clientInfo: {
      fullName: "João da Silva Santos",
      cpf: "123.456.789-00",
      rg: "12.345.678-9",
      educationLevel: "Ensino Superior Completo",
      pis: "123.45678.91-0",
      maritalStatus: "Casado",
      profession: "Analista de Sistemas",
      address: "Rua Exemplo, 123 - São Paulo/SP"
    },
    documents: [
      { name: "Contrato de Trabalho", date: "10/03/2023" },
      { name: "Holerites últimos 12 meses", date: "12/03/2023" },
      { name: "Comprovante de Rescisão", date: "14/03/2023" }
    ],
    updates: [
      { 
        title: "Petição inicial protocolada", 
        date: "20/03/2023", 
        description: "Status: Recebido pela vara trabalhista" 
      },
      { 
        title: "Designação para audiência", 
        date: "05/04/2023", 
        description: "Audiência marcada para 15/05/2023" 
      }
    ]
  },
  {
    id: "2",
    title: "Ação de Cobrança - Empresa XYZ",
    type: "Cível",
    startDate: "10/01/2023",
    status: "Concluído",
    clientInfo: {
      fullName: "João da Silva Santos",
      cpf: "123.456.789-00",
      rg: "12.345.678-9"
    },
    documents: [
      { name: "Contrato de Prestação de Serviço", date: "05/01/2023" },
      { name: "Notas Fiscais", date: "08/01/2023" }
    ],
    updates: [
      { 
        title: "Processo ajuizado", 
        date: "10/01/2023", 
        description: "Número do processo: 0001234-56.2023.8.26.0100" 
      },
      { 
        title: "Sentença", 
        date: "28/02/2023", 
        description: "Procedente em parte" 
      }
    ]
  }
]

export default function ClientCasesPage() {
  const params = useParams()
  const clientId = params.id
  const [cases, setCases] = useState([])
  const [loading, setLoading] = useState(true)
  const [expandedCase, setExpandedCase] = useState(null)

  // Simula chamada à API
  useEffect(() => {
    const fetchClientCases = async () => {
      try {
        setLoading(true)
        
        // Simula delay de API
        await new Promise(resolve => setTimeout(resolve, 800))
        
        // Filtra casos mockados pelo clientId (simulando API)
        const filteredCases = mockCasesData.filter(caseItem => 
          caseItem.clientInfo.cpf === clientId
        )
        
        setCases(filteredCases.length > 0 ? filteredCases : mockCasesData)
      } catch (error) {
        console.error("Erro ao carregar casos:", error)
        setCases(mockCasesData) // Fallback para dados mockados
      } finally {
        setLoading(false)
      }
    }

    fetchClientCases()
  }, [clientId])

  const toggleCase = (caseId) => {
    setExpandedCase(expandedCase === caseId ? null : caseId)
  }

  const handleDownloadPDF = (caseId) => {
    console.log(`Gerando PDF para o caso ${caseId}`)
    // Implementação real:
    // 1. Busca os dados do caso específico
    // 2. Gera o PDF com biblioteca como react-pdf
    // 3. Dispara o download
  }

  // Esqueleto de carregamento
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen">
        <header className="bg-white py-4 px-4 sm:px-6 border-b flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" className="flex items-center gap-2 p-2 sm:p-2">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only">Voltar</span>
            </Button>
            <Skeleton className="h-6 w-32 sm:w-48 ml-2 sm:ml-4" />
          </div>
          <UserProfileDropdown user={mockUser} />
        </header>
        
        <main className="flex-1 p-4 sm:p-6">
          <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="space-y-2 p-4 sm:p-6">
                  <Skeleton className="h-5 sm:h-6 w-3/4" />
                  <Skeleton className="h-3 sm:h-4 w-1/2" />
                </CardHeader>
              </Card>
            ))}
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Cabeçalho */}
      <header className="bg-white py-4 px-4 sm:px-6 border-b flex items-center justify-between">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            onClick={() => window.history.back()} 
            className="flex items-center gap-2 p-2 sm:p-2"
            size="sm"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only sm:not-sr-only">Voltar</span>
          </Button>
          <h1 className="text-lg sm:text-xl font-semibold ml-2 sm:ml-4">Seus casos</h1>
        </div>
        <UserProfileDropdown user={mockUser} />
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 p-4 sm:p-6">
        <div className="max-w-4xl mx-auto space-y-3 sm:space-y-4">
          {cases.length === 0 ? (
            <Card>
              <CardHeader className="p-4 sm:p-6">
                <CardTitle className="text-base sm:text-lg">Nenhum caso encontrado</CardTitle>
                <CardDescription className="text-sm sm:text-base">
                  Este cliente ainda não possui casos registrados ou você não tem acesso
                </CardDescription>
              </CardHeader>
            </Card>
          ) : (
            cases.map((caseItem) => (
              <Card key={caseItem.id} className="overflow-hidden">
                {/* Cabeçalho do Caso */}
                <button
                  onClick={() => toggleCase(caseItem.id)}
                  className="w-full text-left hover:bg-gray-50 transition-colors"
                >
                  <CardHeader className="flex flex-row items-center justify-between p-3 sm:p-4">
                    <div className="text-left flex-1 min-w-0">
                      <CardTitle className="text-base sm:text-lg truncate">{caseItem.title}</CardTitle>
                      <CardDescription className="mt-1 text-xs sm:text-sm">
                        {caseItem.type} • Iniciado em: {caseItem.startDate}
                      </CardDescription>
                    </div>
                    <div className="flex items-center gap-2 sm:gap-3 ml-2">
                      <Badge variant={
                        caseItem.status === "Concluído" ? "secondary" :
                        caseItem.status === "Arquivado" ? "destructive" : "default"
                      } className="text-xs sm:text-sm">
                        {caseItem.status}
                      </Badge>
                      {expandedCase === caseItem.id ? (
                        <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                      )}
                    </div>
                  </CardHeader>
                </button>

                {/* Detalhes do Caso (expandível) */}
                {expandedCase === caseItem.id && (
                  <>
                    <CardContent className="p-0">
                      <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 pt-0">
                        {/* Informações do Cliente - Renderiza dinamicamente */}
                        <div className="space-y-3 sm:space-y-4">
                          <h3 className="font-medium text-sm sm:text-base">Informações do Cliente</h3>
                          <div className="grid grid-cols-1 gap-3 sm:gap-4">
                            {Object.entries(caseItem.clientInfo).map(([key, value]) => (
                              <div key={key} className="space-y-1">
                                <p className="text-xs sm:text-sm font-medium text-muted-foreground capitalize">
                                  {key.replace(/([A-Z])/g, ' $1').trim()}
                                </p>
                                <p className="p-2 text-sm sm:text-base bg-gray-50 rounded-md break-words">
                                  {value || 'Não informado'}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Documentos Anexados - Mostra apenas se existir */}
                        {caseItem.documents?.length > 0 ? (
                          <div className="space-y-3 sm:space-y-4">
                            <h3 className="font-medium text-sm sm:text-base">Documentos Anexados</h3>
                            <div className="space-y-2 sm:space-y-3">
                              {caseItem.documents.map((doc, idx) => (
                                <div key={idx} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 border rounded-md gap-2 sm:gap-0">
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-sm sm:text-base truncate">{doc.name}</p>
                                    {doc.date && (
                                      <p className="text-xs sm:text-sm text-muted-foreground">
                                        Anexado em: {doc.date}
                                      </p>
                                    )}
                                  </div>
                                  <Button variant="outline" size="sm" className="w-full sm:w-auto">
                                    Visualizar
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3 sm:space-y-4">
                            <h3 className="font-medium text-sm sm:text-base">Documentos Anexados</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              Nenhum documento anexado a este caso
                            </p>
                          </div>
                        )}

                        {/* Histórico do Caso - Mostra apenas se existir */}
                        {caseItem.updates?.length > 0 ? (
                          <div className="space-y-3 sm:space-y-4">
                            <h3 className="font-medium text-sm sm:text-base">Histórico do Caso</h3>
                            <div className="space-y-3 sm:space-y-4">
                              {caseItem.updates.map((update, idx) => (
                                <div key={idx} className="border-l-2 pl-3 sm:pl-4 py-1 sm:py-2 space-y-1">
                                  <div className="flex flex-col sm:flex-row justify-between gap-1 sm:gap-0">
                                    <p className="font-medium text-sm sm:text-base">{update.title}</p>
                                    {update.date && (
                                      <p className="text-xs sm:text-sm text-muted-foreground">
                                        {update.date}
                                      </p>
                                    )}
                                  </div>
                                  {update.description && (
                                    <p className="text-xs sm:text-sm text-muted-foreground">
                                      {update.description}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3 sm:space-y-4">
                            <h3 className="font-medium text-sm sm:text-base">Histórico do Caso</h3>
                            <p className="text-xs sm:text-sm text-muted-foreground">
                              Nenhum registro de atualização disponível
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>

                    {/* Botão para baixar PDF */}
                    <div className="border-t p-3 sm:p-4 flex justify-end">
                      <Button 
                        onClick={() => handleDownloadPDF(caseItem.id)}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                      >
                        <Download className="h-4 w-4" />
                        <span className="hidden sm:inline">Baixar em PDF</span>
                        <span className="sr-only sm:hidden">PDF</span>
                      </Button>
                    </div>
                  </>
                )}
              </Card>
            ))
          )}
        </div>
      </main>
    </div>
  )
}