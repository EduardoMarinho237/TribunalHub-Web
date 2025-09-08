'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'}`}>
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-[#0c0071]">TribunalHub</span>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/login" className="text-gray-700 hover:text-[#0c0071] px-3 py-2 text-sm font-medium">
                Entrar
              </Link>
              <Link 
                href="/signup" 
                className="bg-[#0c0071] text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-[#0a0059] transition-colors"
              >
                Cadastre-se
              </Link>
            </div>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Gestão jurídica <span className="text-[#0c0071]">simplificada</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
              O TribunalHub oferece as ferramentas necessárias para advogados e escritórios de advocacia gerenciarem seus casos com eficiência e precisão.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                href="/signup" 
                className="bg-[#0c0071] text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-[#0a0059] transition-colors"
              >
                Comece agora
              </Link>
              <Link 
                href="#saiba-mais" 
                className="border border-gray-300 text-gray-700 px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Saiba mais ›
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="saiba-mais" className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Tudo o que você precisa em um só lugar</h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Simplificamos a gestão jurídica para que você possa focar no que realmente importa.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-[#e6e5ff] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-[#0c0071]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Gestão de Casos</h3>
                <p className="text-gray-600">Organize e acompanhe todos os seus processos em um só lugar.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-[#e6e5ff] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-[#0c0071]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Economize Tempo</h3>
                <p className="text-gray-600">Automatize tarefas repetitivas e ganhe mais eficiência.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-[#e6e5ff] rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-[#0c0071]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Segurança Garantida</h3>
                <p className="text-gray-600">Seus dados protegidos com criptografia de última geração.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Pronto para transformar sua gestão jurídica?</h2>
            <p className="text-xl text-gray-600 mb-10">
              Junte-se a centenas de escritórios que já confiam no TribunalHub para simplificar seus processos.
            </p>
            <Link 
              href="/signup" 
              className="inline-block bg-[#0c0071] text-white px-8 py-4 rounded-md text-lg font-medium hover:bg-[#0a0059] transition-colors"
            >
              Criar conta gratuita
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <span className="text-xl font-bold text-[#0c0071]">TribunalHub</span>
              <p className="mt-2 text-sm text-gray-500">© {new Date().getFullYear()} TribunalHub. Todos os direitos reservados.</p>
            </div>
            <div className="flex space-x-6">
              <Link href="/termos" className="text-gray-500 hover:text-gray-700 text-sm">
                Termos de Uso
              </Link>
              <Link href="/privacidade" className="text-gray-500 hover:text-gray-700 text-sm">
                Política de Privacidade
              </Link>
              <Link href="/contato" className="text-gray-500 hover:text-gray-700 text-sm">
                Contato
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
