import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button, buttonVariants } from './button'; // Assuming buttonVariants is also exported if needed for comprehensive tests
import React from 'react';

describe('Button Component', () => {
  it('renders with default props', () => {
    render(<Button>Click me</Button>);
    const buttonElement = screen.getByRole('button', { name: /click me/i });
    expect(buttonElement).toBeInTheDocument();
    expect(buttonElement).toHaveClass(buttonVariants({ variant: 'default', size: 'default' }));
  });

  it('renders with different variants and sizes', () => {
    // Test a specific variant
    render(<Button variant="destructive">Delete</Button>);
    const destructiveButton = screen.getByRole('button', { name: /delete/i });
    expect(destructiveButton).toHaveClass(buttonVariants({ variant: 'destructive', size: 'default' }));

    // Test a specific size
    render(<Button size="lg">Large Button</Button>);
    const largeButton = screen.getByRole('button', { name: /large button/i });
    expect(largeButton).toHaveClass(buttonVariants({ variant: 'default', size: 'lg' }));

    // Test a combination
    render(<Button variant="outline" size="sm">Small Outline</Button>);
    const smallOutlineButton = screen.getByRole('button', { name: /small outline/i });
    expect(smallOutlineButton).toHaveClass(buttonVariants({ variant: 'outline', size: 'sm' }));
  });

  it('renders children correctly', () => {
    render(<Button><span>Hello</span> World</Button>);
    const buttonElement = screen.getByRole('button');
    expect(buttonElement).toHaveTextContent('Hello World');
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Clickable</Button>);
    const buttonElement = screen.getByRole('button', { name: /clickable/i });
    fireEvent.click(buttonElement);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    const handleClick = vi.fn();
    render(<Button disabled onClick={handleClick}>Disabled Button</Button>);
    const buttonElement = screen.getByRole('button', { name: /disabled button/i });
    expect(buttonElement).toBeDisabled();
    fireEvent.click(buttonElement);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it('renders as child when asChild prop is true', () => {
    render(
      <Button asChild>
        <a href="/test">Link Button</a>
      </Button>
    );
    // Check if the 'a' tag is rendered instead of a 'button' tag
    const linkElement = screen.getByRole('link', { name: /link button/i });
    expect(linkElement).toBeInTheDocument();
    expect(linkElement.tagName).toBe('A');
    // Check if it still gets button-like styling (optional, but good)
    expect(linkElement).toHaveClass(buttonVariants({ variant: 'default', size: 'default' }));

    // Ensure no button element is rendered with this text
    expect(screen.queryByRole('button', { name: /link button/i })).not.toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Button className="custom-class">Custom</Button>);
    const buttonElement = screen.getByRole('button', { name: /custom/i });
    expect(buttonElement).toHaveClass('custom-class');
    // Ensure default classes are also applied
    expect(buttonElement).toHaveClass(buttonVariants({ variant: 'default', size: 'default' }));
  });
});
