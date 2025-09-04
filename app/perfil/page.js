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
import { Pencil } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
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
  const [isLoadingImage, setIsLoadingImage] = useState(false)

  useEffect(() => {
    const loadUserData = async () => {
      const token = localStorage.getItem("auth_token")
      const userData = localStorage.getItem("user_data")
      
      if (!token || !userData) {
        router.push("/login")
        return
      }
      
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        setName(parsedUser.nome || "")
        setEmail(parsedUser.email || "")
        
        if (parsedUser.userId) {
          await loadUserPhoto(parsedUser.userId)
        }
      } catch (error) {
        console.error("Erro ao parsear dados do usuário:", error)
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_data')
        router.push("/login")
        return
      }
      
      setLoading(false)
    }
    
    loadUserData()
  }, [router])

  const loadUserPhoto = async (userId) => {
    try {
      setIsLoadingImage(true)
      console.log('Carregando foto para usuário:', userId)
      
      const token = localStorage.getItem('auth_token')
      const response = await fetch(`http://localhost:8080/api/usuarios/${userId}/foto`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      console.log('Status da resposta GET foto:', response.status)
      
      if (response.ok) {
        const contentType = response.headers.get('content-type')
        console.log('Content-Type da resposta:', contentType)
        
        if (contentType && contentType.startsWith('image/')) {
          // Se retorna imagem diretamente
          const photoBlob = await response.blob()
          const photoUrl = URL.createObjectURL(photoBlob)
          setPreviewImage(photoUrl)
        } else {
          // Se retorna JSON com URL da imagem
          const data = await response.json()
          console.log('Dados da foto recebidos:', data)
          
          if (data && (data.url || data.fotoUrl || data.path)) {
            const imageUrl = data.url || data.fotoUrl || data.path
            setPreviewImage(imageUrl.startsWith('http') ? imageUrl : `http://localhost:8080${imageUrl}`)
          } else {
            setPreviewImage(null)
          }
        }
      } else if (response.status === 404) {
        console.log('Usuário não possui foto')
        setPreviewImage(null)
      } else {
        console.log('Erro ao carregar foto - Status:', response.status)
        const errorText = await response.text()
        console.log('Erro:', errorText)
        setPreviewImage(null)
      }
    } catch (error) {
      console.log('Erro ao carregar foto do usuário:', error)
      setPreviewImage(null)
    } finally {
      setIsLoadingImage(false)
    }
  }

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
    if (!user?.userId) {
      toast.error("Usuário não autenticado");
      return;
    }
  
    setIsSaving(true);
    try {
      const token = localStorage.getItem('auth_token');
      
      // Atualizar dados básicos
      const updateResponse = await fetch(`http://localhost:8080/api/usuarios/${user.userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ nome: name, email })
      });
      
      if (!updateResponse.ok) {
        const errorData = await updateResponse.text();
        throw new Error(`Erro ${updateResponse.status}: ${errorData}`);
      }
  
      // Atualizar foto se existir
      if (selectedFile) {
        const formData = new FormData();
        formData.append('foto', selectedFile);
        
        const photoResponse = await fetch(`http://localhost:8080/api/usuarios/${user.userId}/foto`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${token}`
            // Não inclua Content-Type quando usar FormData, o browser define automaticamente
            // com o boundary correto
          },
          body: formData
        });
        
        if (!photoResponse.ok) {
          const errorData = await photoResponse.text();
          throw new Error(`Erro ao atualizar foto: ${photoResponse.status} - ${errorData}`);
        }
  
        const usuario = await photoResponse.json();
        if (usuario.fotoUrl) {
          const fotoUrl = usuario.fotoUrl.startsWith('http') 
            ? usuario.fotoUrl 
            : `http://localhost:8080${usuario.fotoUrl}`;
          setPreviewImage(`${fotoUrl}?t=${new Date().getTime()}`);
        }
      }
      
      // Atualizar localStorage
      const updatedUser = { ...user, nome: name, email };
      localStorage.setItem("user_data", JSON.stringify(updatedUser));
      setUser(updatedUser);
      
      setSelectedFile(null);
      setUnsavedChanges(false);
      toast.success("Perfil atualizado com sucesso");
    } catch (err) {
      console.error('Erro completo ao atualizar perfil:', err);
      
      if (err.name === 'TypeError' && err.message.includes('fetch')) {
        toast.error("Erro de conexão. Verifique se o servidor está rodando.");
      } else {
        toast.error(err.message || "Erro ao atualizar perfil");
      }
    } finally {
      setIsSaving(false);
    }
  };
  
  const handlePasswordChange = async () => {
    if (!user?.userId) {
      toast.error("Usuário não autenticado")
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error("As senhas não conferem")
      return
    }
    
    if (!currentPassword || !newPassword) {
      toast.error("Preencha todos os campos")
      return
    }
    
    try {
      const token = localStorage.getItem('auth_token')
      
      // PATCH /{id}/senha - Alterar senha do usuário
      const response = await fetch(`http://localhost:8080/api/usuarios/${user.userId}/senha`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          senhaAtual: currentPassword,
          novaSenha: newPassword
        })
      })
      
      if (!response.ok) {
        const errorData = await response.text()
        throw new Error(`Erro ${response.status}: ${errorData}`)
      }
      
      toast.success("Senha alterada com sucesso")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err) {
      console.error('Erro ao alterar senha:', err)
      toast.error(err.message || "Erro ao alterar senha")
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

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="flex flex-col h-screen bg-gray-50 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="mt-4 text-gray-600">Carregando...</p>
      </div>
    )
  }

  // Don't render if not authenticated (will redirect in useEffect)
  if (!user) {
    return null
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
                    {isLoadingImage ? (
                      <div className="flex items-center justify-center h-full w-full bg-gray-200">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                      </div>
                    ) : (
                      <>
                        <AvatarImage src={previewImage || "/default-avatar.png"} />
                        <AvatarFallback className="text-3xl">{user?.nome?.charAt(0) || "U"}</AvatarFallback>
                      </>
                    )}
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
