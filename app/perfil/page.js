"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ArrowLeft } from "lucide-react"
import toast, { Toaster } from "react-hot-toast"
import axios from "axios"
import { Pencil } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [previewImage, setPreviewImage] = useState(null)
  const [selectedFile, setSelectedFile] = useState(null)
  const fileInputRef = useRef(null)
  const [unsavedChanges, setUnsavedChanges] = useState(false)
  const [showExitDialog, setShowExitDialog] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("usuarioLogado")
    if (storedUser) {
      const parsed = JSON.parse(storedUser)
      setUser(parsed)
      setName(parsed.nome)
      setEmail(parsed.email)
      if (parsed.fotoUrl) setPreviewImage(`http://localhost:8080${parsed.fotoUrl}`)
    }
  }, [])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setPreviewImage(reader.result)
      reader.readAsDataURL(file)
      setUnsavedChanges(true)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const updateData = { nome: name, email }
      await axios.put(`http://localhost:8080/api/usuarios/${user.id}`, updateData)
      if (selectedFile) {
        const formData = new FormData()
        formData.append("foto", selectedFile)
        const res = await axios.patch(`http://localhost:8080/api/usuarios/${user.id}/foto`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        })
        updateData.fotoUrl = res.data.fotoUrl
      }
      const updatedUser = { ...user, ...updateData }
      localStorage.setItem("usuarioLogado", JSON.stringify(updatedUser))
      setUser(updatedUser)
      setSelectedFile(null)
      setUnsavedChanges(false)
      toast.success("Perfil atualizado com sucesso")
    } catch (err) {
      toast.error(err.response?.data || "Erro ao atualizar perfil")
    } finally {
      setIsSaving(false)
    }
  }

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      toast.error("As senhas não conferem")
      return
    }
    try {
      await axios.patch(`http://localhost:8080/api/usuarios/${user.id}/senha`, {
        senhaAtual: currentPassword,
        novaSenha: newPassword
      })
      toast.success("Senha alterada com sucesso")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err) {
      toast.error(err.response?.data || "Erro ao alterar senha")
    }
  }

  const handleBack = () => {
    if (unsavedChanges) {
      setShowExitDialog(true)
    } else {
      router.push("/")
    }
  }

  const confirmExit = () => {
    setShowExitDialog(false)
    router.push("/")
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Toaster position="top-right" />
      <header className="bg-white py-4 px-6 flex justify-between items-center">
        <Button variant="ghost" onClick={handleBack} className="flex items-center gap-2">
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <h1 className="text-xl font-semibold">Editar Perfil</h1>
        <div></div>
      </header>
      <main className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informações Pessoais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center gap-4 relative">
                <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                <div 
                  className="relative cursor-pointer"
                  onClick={() => fileInputRef.current.click()}
                >
                  <Avatar className="h-32 w-32">
                    <AvatarImage src={previewImage || "/default-avatar.png"} />
                    <AvatarFallback className="text-3xl">{user?.nome?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity rounded-full">
                    <span className="text-white text-xl"><Pencil /></span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome Completo</Label>
                  <Input id="name" value={name} onChange={(e) => { setName(e.target.value); setUnsavedChanges(true) }} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setUnsavedChanges(true) }} />
                </div>
                <div className="space-y-2">
                  <Label>Cargo</Label>
                  <Input disabled value={user?.cargo || "Não especificado"} />
                </div>
              </div>
              <div className="pt-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full md:w-auto">Redefinir Senha</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Alterar Senha</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Senha Atual</Label>
                        <Input id="currentPassword" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">Nova Senha</Label>
                        <Input id="newPassword" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                        <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                      </div>
                      <Button onClick={handlePasswordChange} className="w-full">Confirmar Alteração</Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
            <div className="border-t px-6 py-4 flex justify-end">
              <Button onClick={handleSave} disabled={isSaving} className="w-full md:w-auto">
                {isSaving ? "Salvando..." : 'Salvar Alterações'}
              </Button>
            </div>
          </Card>
        </div>
      </main>
      {showExitDialog && (
        <Dialog open onOpenChange={setShowExitDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Sair sem salvar?</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <p>Você tem alterações não salvas. Deseja salvar antes de sair?</p>
              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setShowExitDialog(false)}>Cancelar</Button>
                <Button onClick={confirmExit}>Descartar e Sair</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
