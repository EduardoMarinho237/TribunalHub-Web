"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from 'react-hot-toast'
import { clientsAPI } from '@/lib/api/client'

export default function ClientForm({ client = null, onSuccess, onCancel }) {
  const [formData, setFormData] = useState({
    nome: client?.nome || '',
    email: client?.email || '',
    telefone: client?.telefone || '',
    acompanhamento: client?.acompanhamento || false,
    visivel: client?.visivel !== undefined ? client.visivel : true
  })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}

    if (!formData.nome.trim()) {
      newErrors.nome = 'Nome é obrigatório'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }

    if (!formData.telefone.trim()) {
      newErrors.telefone = 'Telefone é obrigatório'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      if (client) {
        // Atualizar cliente existente
        await clientsAPI.update(client.id, formData)
        toast.success('Cliente atualizado com sucesso!')
      } else {
        // Criar novo cliente
        await clientsAPI.create(formData)
        toast.success('Cliente criado com sucesso!')
      }
      
      onSuccess?.()
    } catch (error) {
      console.error('Erro ao salvar cliente:', error)
      
      if (error.response?.status === 400) {
        toast.error('Dados inválidos. Verifique os campos.')
      } else if (error.response?.status === 409) {
        toast.error('Email ou telefone já cadastrado.')
      } else {
        toast.error('Erro ao salvar cliente.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Limpar erro do campo quando usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>
          {client ? 'Editar Cliente' : 'Novo Cliente'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome *</Label>
            <Input
              id="nome"
              type="text"
              value={formData.nome}
              onChange={(e) => handleChange('nome', e.target.value)}
              className={errors.nome ? 'border-red-500' : ''}
              placeholder="Nome completo"
            />
            {errors.nome && (
              <p className="text-sm text-red-500">{errors.nome}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={errors.email ? 'border-red-500' : ''}
              placeholder="email@exemplo.com"
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefone">Telefone *</Label>
            <Input
              id="telefone"
              type="tel"
              value={formData.telefone}
              onChange={(e) => handleChange('telefone', e.target.value)}
              className={errors.telefone ? 'border-red-500' : ''}
              placeholder="(11) 99999-9999"
            />
            {errors.telefone && (
              <p className="text-sm text-red-500">{errors.telefone}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="acompanhamento"
              checked={formData.acompanhamento}
              onCheckedChange={(checked) => handleChange('acompanhamento', checked)}
            />
            <Label htmlFor="acompanhamento">
              Cliente em acompanhamento
            </Label>
          </div>

          {client && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="visivel"
                checked={formData.visivel}
                onCheckedChange={(checked) => handleChange('visivel', checked)}
              />
              <Label htmlFor="visivel">
                Cliente ativo
              </Label>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={loading}
            >
              {loading ? 'Salvando...' : (client ? 'Atualizar' : 'Criar')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
