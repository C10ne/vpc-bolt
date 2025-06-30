
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ProjectShowcaseProps {
  title: string;
  description: string;
  imageUrl: string;
  technologies: string[];
  link: string;
}

export function ProjectShowcase({
  title,
  description,
  imageUrl,
  technologies,
  link
}: ProjectShowcaseProps) {
  return (
    <Card className="overflow-hidden">
      <img src={imageUrl} alt={title} className="w-full h-48 object-cover" />
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 flex-wrap mb-4">
          {technologies.map((tech) => (
            <Badge key={tech} variant="secondary">{tech}</Badge>
          ))}
        </div>
        <a 
          href={link} 
          className="text-primary hover:underline"
          target="_blank" 
          rel="noopener noreferrer"
        >
          View Project →
        </a>
      </CardContent>
    </Card>
  );
}
