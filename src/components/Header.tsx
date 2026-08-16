import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, NavLink } from 'react-router-dom';

const navigation = [
  { name: 'Início', to: '/' },
  { name: 'Cursos', to: '/cursos' },
  { name: 'Artigos', to: '/artigos' },
  { name: 'Monitoramento', to: '/monitoramento' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <header className="bg-primary/95 border-b border-gold/20 sticky top-0 z-50">
      <nav className="container mx-auto px-4" aria-label="Global">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold text-gold">Velociclos</Link>
          </div>
          <div className="hidden md:flex md:space-x-8">
            {navigation.map((item) => (
              <NavLink key={item.name} to={item.to} className="text-sm font-medium text-gray-300 hover:text-gold">
                {item.name}
              </NavLink>
            ))}
          </div>
          <div className="md:hidden">
            <button type="button" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-gray-300 hover:text-gold focus:outline-none">
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            {navigation.map((item) => (
              <NavLink key={item.name} to={item.to} onClick={() => setMobileMenuOpen(false)} className="block px-4 py-2 text-gray-300 hover:text-gold hover:bg-accent transition-colors">
                {item.name}
              </NavLink>
            ))}
          </div>
        )}
      </nav>
    </header>
  );
}

