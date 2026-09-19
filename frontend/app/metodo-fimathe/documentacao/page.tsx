import { Metadata } from 'next'
import MetodoFimatheDocumentation from '@/components/MetodoFimatheDocumentation'

export const metadata: Metadata = {
  title: 'Documentação do Método Fimathe | Velociclos PCM',
  description: 'Análise técnica completa e aprofundada do Método Fimathe Price Channel Method (PCM): fundamentos matemáticos, regras operacionais, gestão de risco e aplicação prática.',
}

export default function MetodoFimatheDocumentationPage() {
  return <MetodoFimatheDocumentation />
}
