import { useParams, Link } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LoadingSpinner, ErrorMessage } from '@/components/ui/LoadingStates';
import { useArticle } from '@/hooks/useApi';
import { ArrowLeft, User, Calendar } from 'lucide-react';

export function ArticleDetailPage() {
  const { slug } = useParams();
  const { article, loading, error } = useArticle(slug);
  if (loading) return <><Header /><div className="container mx-auto py-20"><LoadingSpinner text="Carregando..." /></div><Footer /></>;
  if (error) return <><Header /><div className="container mx-auto py-20"><ErrorMessage message={error} /></div><Footer /></>;
  if (!article) return <><Header /><div className="container mx-auto py-20"><p className="text-gray-400">Artigo não encontrado.</p></div><Footer /></>;
  return (
    <>
      <Header />
      <main className="pt-24 pb-16 bg-gradient-to-b from-primary to-secondary min-h-screen">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link to="/artigos" className="inline-flex items-center gap-2 text-gray-400 hover:text-gold transition-colors mb-8">
            <ArrowLeft size={16} /> Voltar aos artigos
          </Link>
          <h1 className="text-4xl font-bold text-white mb-6">{article.title}</h1>
          <div className="flex items-center gap-6 text-sm text-gray-400 mb-8">
            <div className="flex items-center gap-2"><User size={16} /><span>{article.author}</span></div>
            <div className="flex items-center gap-2"><Calendar size={16} /><span>{article.publishedAt}</span></div>
          </div>
          {article.image && <img src={article.image} alt={article.title} className="w-full rounded-xl mb-8" />}
          <div className="prose prose-lg text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: article.content }} />
        </div>
      </main>
      <Footer />
    </>
  );
}


