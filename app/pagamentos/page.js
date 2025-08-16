"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Calendar, CreditCard, DollarSign, Download, Loader2, ArrowLeft } from "lucide-react"
import { Progress } from "@/components/ui/progress"

export default function PaymentsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)

  // Dados mockados
  const paymentHistory = [
    { id: 1, date: '15/06/2025', method: 'Pix', amount: 'R$ 1.200,00', status: 'Pago', invoice: true },
    { id: 2, date: '15/05/2025', method: 'Cartão', amount: 'R$ 1.200,00', status: 'Pago', invoice: true },
    { id: 3, date: '15/04/2025', method: 'Boleto', amount: 'R$ 1.200,00', status: 'Atrasado', invoice: false },
  ]

  const paymentMethods = [
    { id: 1, type: 'Pix', details: 'Chave: 123.456.789-00', primary: true },
    { id: 2, type: 'Cartão de Crédito', details: 'Mastercard **** 4567', primary: false }
  ]

  const handlePayment = () => {
    setIsProcessing(true)
    setTimeout(() => setIsProcessing(false), 2000)
  }

  const getStatusVariant = (status) => {
    switch(status) {
      case 'Pago': return 'default'
      case 'Pendente': return 'secondary'
      case 'Atrasado': return 'destructive'
      default: return 'outline'
    }
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white py-4 px-6 flex justify-between items-center">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <h1 className="text-xl font-semibold flex items-center gap-2">
         Pagamentos
        </h1>
        <div></div> {/* Espaçador */}
      </header>

      {/* Conteúdo */}
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Resumo Financeiro */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Próximo Vencimento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15/07/2025</div>
                <p className="text-xs text-gray-500 mt-1">Faltam 22 dias</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Valor Mensal</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R$ 1.200,00</div>
                <p className="text-xs text-gray-500 mt-1">Plano Premium</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Status</CardTitle>
              </CardHeader>
              <CardContent>
                <Badge variant="default" className="mb-2">Em dia</Badge>
                <Progress value={100} className="h-2" />
              </CardContent>
            </Card>
          </div>

          {/* Métodos de Pagamento */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" /> Métodos de Pagamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {paymentMethods.map((method) => (
                  <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">{method.type}</p>
                      <p className="text-sm text-gray-500">{method.details}</p>
                    </div>
                    <div className="flex gap-2">
                      {method.primary && <Badge variant="secondary">Principal</Badge>}
                      <Button variant="outline" size="sm">Editar</Button>
                    </div>
                  </div>
                ))}
                <Button variant="outline" className="w-full mt-2">
                  Adicionar Método de Pagamento
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Pagar Agora */}
          <Card>
            <CardHeader>
              <CardTitle>Realizar Pagamento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 border rounded-lg bg-gray-50">
                  <p className="font-medium">Valor a Pagar: R$ 1.200,00</p>
                  <p className="text-sm text-gray-500">Vencimento: 15/07/2025</p>
                </div>
                <Button 
                  onClick={handlePayment}
                  className="w-full"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processando Pagamento...
                    </>
                  ) : 'Pagar Agora'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Histórico Recente */}
          <Card>
            <CardHeader>
              <CardTitle>Histórico de Pagamentos</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Método</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Recibo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paymentHistory.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>{payment.date}</TableCell>
                      <TableCell>{payment.method}</TableCell>
                      <TableCell>{payment.amount}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(payment.status)}>
                          {payment.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {payment.invoice ? (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => console.log(`Downloading invoice ${payment.id}`)}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        ) : '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}