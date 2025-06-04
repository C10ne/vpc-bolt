
import React from 'react';
import { Template } from '@/lib/types';
import { Header } from '@/components/ui/header';
import { ProjectShowcase } from '@/lib/components/portfolio/project-showcase';

interface PortfolioLayoutProps {
  template: Template;
}

export default function PortfolioLayout({ template }: PortfolioLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header className="fixed w-full z-50">
        <nav className="container mx-auto px-4 py-2 flex justify-between items-center">
          <img src={template.editableProperties.logo} alt="Logo" />
          <div className="flex gap-6">
            <a href="#projects" className="text-foreground hover:text-primary">Projects</a>
            <a href="#about" className="text-foreground hover:text-primary">About</a>
            <a href="#contact" className="text-foreground hover:text-primary">Contact</a>
          </div>
        </nav>
      </Header>
      
      <main className="container mx-auto px-4 pt-20">
        {template.sections.map((section, index) => (
          <section key={section.id || index} className="py-12">
            {section.components.map((component, i) => (
              <div key={component.id || i}>
                <ProjectShowcase {...component.editableContent} />
              </div>
            ))}
          </section>
        ))}
      </main>
    </div>
  );
}
