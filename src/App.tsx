import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { LoadingSpinner } from '@/components/ui/LoadingStates';

const HomePage = lazy(() => import('@/pages/HomePage'));
const CoursesPage = lazy(() => import('@/pages/CoursesPage'));
const ArticlesPage = lazy(() => import('@/pages/ArticlesPage'));
const ArticleDetailPage = lazy(() => import('@/pages/ArticleDetailPage'));
const MonitoringPage = lazy(() => import('@/pages/MonitoringPage'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner text="Carregando..." />}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cursos" element={<CoursesPage />} />
        <Route path="/artigos" element={<ArticlesPage />} />
        <Route path="/artigos/:slug" element={<ArticleDetailPage />} />
        <Route path="/monitoramento" element={<MonitoringPage />} />
      </Routes>
    </Suspense>
  );
}

export default App;

