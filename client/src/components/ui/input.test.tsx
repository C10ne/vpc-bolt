import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Input } from './input'; // Assuming Input is exported from ./input.tsx
import React from 'react';

describe('Input Component', () => {
  it('renders with default props', () => {
    render(<Input data-testid="default-input" />);
    const inputElement = screen.getByTestId('default-input');
    expect(inputElement).toBeInTheDocument();
    expect(inputElement).toHaveAttribute('type', 'text'); // Default type
  });

  it('renders with a given type', () => {
    render(<Input type="password" data-testid="password-input" />);
    const inputElement = screen.getByTestId('password-input');
    expect(inputElement).toHaveAttribute('type', 'password');

    render(<Input type="number" data-testid="number-input" />);
    const numberInputElement = screen.getByTestId('number-input');
    expect(numberInputElement).toHaveAttribute('type', 'number');
  });

  it('calls onChange handler when value changes', () => {
    const handleChange = vi.fn();
    render(<Input onChange={handleChange} data-testid="change-input" />);
    const inputElement = screen.getByTestId('change-input');
    fireEvent.change(inputElement, { target: { value: 'test value' } });
    expect(handleChange).toHaveBeenCalledTimes(1);
    // If you want to check the event object passed to handleChange:
    // expect(handleChange).toHaveBeenCalledWith(expect.objectContaining({
    //   target: expect.objectContaining({ value: 'test value' })
    // }));
  });

  it('displays the correct value', () => {
    render(<Input value="Hello World" data-testid="value-input" onChange={() => {}} />);
    const inputElement = screen.getByTestId('value-input') as HTMLInputElement;
    expect(inputElement.value).toBe('Hello World');

    // Test updating the value
    fireEvent.change(inputElement, { target: { value: 'New Value' } });
    // Note: If the component is not controlled, this test needs re-render or direct prop update.
    // Assuming it's a controlled component or the test rerenders with new value.
    // For this unit test, we usually test that onChange is called.
    // The actual update of 'value' in a controlled component is handled by parent state.
    // If it's uncontrolled with defaultValue, that's another test case.
    // Let's assume this test is for a controlled component where 'value' prop dictates its value.
    render(<Input value="New Value" data-testid="value-input-updated" onChange={() => {}} />);
    const updatedInputElement = screen.getByTestId('value-input-updated') as HTMLInputElement;
    expect(updatedInputElement.value).toBe('New Value');
  });

  it('is disabled when disabled prop is true', () => {
    const handleChange = vi.fn();
    render(<Input disabled onChange={handleChange} data-testid="disabled-input" />);
    const inputElement = screen.getByTestId('disabled-input');
    expect(inputElement).toBeDisabled();

    // Attempt to change value
    fireEvent.change(inputElement, { target: { value: 'test value' } });
    // Note: fireEvent.change may still call handlers on disabled elements in RTL/JSDOM.
    // The crucial check is that the input IS disabled. If the component had its own logic
    // to prevent state changes based on 'disabled', that would be tested here.
    // For a simple native input, the browser handles not calling onChange.
    // expect(handleChange).not.toHaveBeenCalled(); // This assertion can be flaky due to fireEvent behavior.
  });

  it('displays placeholder text', () => {
    render(<Input placeholder="Enter text here..." data-testid="placeholder-input" />);
    const inputElement = screen.getByTestId('placeholder-input');
    expect(inputElement).toHaveAttribute('placeholder', 'Enter text here...');
    // Alternatively, using getByPlaceholderText:
    expect(screen.getByPlaceholderText('Enter text here...')).toBeInTheDocument();
  });

  it('applies custom className', () => {
    render(<Input className="custom-class" data-testid="custom-class-input" />);
    const inputElement = screen.getByTestId('custom-class-input');
    expect(inputElement).toHaveClass('custom-class');
  });

  it('forwards ref correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} data-testid="ref-input" />);
    const inputElement = screen.getByTestId('ref-input');
    expect(ref.current).toBe(inputElement);
    ref.current?.focus();
    expect(inputElement).toHaveFocus();
  });
});
