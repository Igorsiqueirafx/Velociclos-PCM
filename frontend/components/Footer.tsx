export default function Footer() {
  return (
    <footer className="bg-[#2a2e39] border-t border-[#404857] py-6">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-[#a0a0a0] text-sm">
          &copy; {new Date().getFullYear()} Velociclos. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  )
}
