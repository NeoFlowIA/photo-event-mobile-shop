const Footer = () => {
  const footerSections = [
    {
      title: "Quem somos",
      links: [
        { name: "Sobre nós", href: "#" },
        { name: "Manifesto", href: "#" },
        { name: "Carreiras", href: "#" },
        { name: "Termos de uso", href: "#" }
      ]
    },
    {
      title: "Soluções", 
      links: [
        { name: "Encontrar fotos", href: "#" },
        { name: "Para fotógrafos", href: "#" },
        { name: "Explorar", href: "#" }
      ]
    },
    {
      title: "Ajuda",
      links: [
        { name: "Como o Olha a Foto funciona", href: "#" },
        { name: "Central de ajuda", href: "#" },
        { name: "Perguntas frequentes", href: "#" }
      ]
    }
  ];

  return (
    <footer className="bg-background border-t border-border">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {footerSections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-foreground mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            © 2025 OlhaFoto. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;