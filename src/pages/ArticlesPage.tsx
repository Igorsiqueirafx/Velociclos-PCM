import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LoadingSpinner, ErrorMessage } from '@/components/ui/LoadingStates';
import { useArticles } from '@/hooks/useApi';
import { Link } from 'react-router-dom';

export function ArticlesPage() {
  const { articles, loading, error } = useArticles();
  if (loading) return <><Header /><div className="container mx-auto py-20"><LoadingSpinner text="Carregando artigos..." /></div><Footer /></>;
  if (error) return <><Header /><div className="container mx-auto py-20"><ErrorMessage message={error} /></div><Footer /></>;
  return (
    <>
      <Header />
      <main className="pt-24 pb-16 bg-gradient-to-b from-primary to-secondary min-h-screen">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white mb-4">Artigos &amp; Blog</h1>
          <p className="text-gray-400 mb-12">Artigos sobre análise gráfica, Fibonacci e trading</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          {articles.length === 0 && !loading && !error && (
            <div className="text-center py-20"><p className="text-gray-400 text-lg">Nenhum artigo encontrado.</p></div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

function ArticleCard({ article }) {
  return (
    <Link to={"/artigos/" + article.slug} className="group">
      <article className="bg-secondary/50 rounded-xl overflow-hidden border border-gold/20 hover:border-gold/40 transition-transform">
        <div className="aspect-video bg-accent/20">
          {article.image ? (
            <img src={article.image} alt={article.title} className="w-full h-full object-cover" loading="lazy" />
          ) : (
            <div className="w-full h-full flex items-center justify-center"><span className="text-gray-500">Sem imagem</span></div>
          )}
        </div>
        <div className="p-6">
          <span className="px-2 py-1 rounded text-xs font-bold bg-gold/20 text-gold">{article.category || "Geral"}</span>
          <h3 className="text-white font-bold text-xl mb-2 group-hover:text-gold transition-colors">{article.title}</h3>
          <p className="text-gray-400 text-sm mb-4">{article.excerpt}</p>
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{article.author}</span>
            <span>{article.publishedAt}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}


