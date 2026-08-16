import { Loader2 } from 'lucide-react';

export function LoadingSpinner({ text }) {
  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <Loader2 className="w-10 h-10 animate-spin text-gold mx-auto mb-4" />
        <p className="text-gray-400">{text || "Carregando..."}</p>
      </div>
    </div>
  );
}

export function ErrorMessage({ message, onRetry }) {
  return (
    <div className="text-center py-12">
      <p className="text-red-400 text-lg mb-4">{message || "Ocorreu um erro"}</p>
      {onRetry && (
        <button onClick={onRetry} className="px-4 py-2 bg-gold text-primary font-bold rounded-lg hover:bg-gold-light transition-colors">
          Tentar novamente
        </button>
      )}
    </div>
  );
}
