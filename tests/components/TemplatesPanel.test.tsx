import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { vi } from 'vitest';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import TemplatesPanel from '@/components/templates-panel';
import { templates } from '@/lib/templates';

vi.mock('@tanstack/react-query', async () => {
  const originalModule = await vi.importActual('@tanstack/react-query');
  return {
    ...originalModule,
    useQuery: vi.fn(),
  };
});

const mockOnTogglePanel = vi.fn();
const mockOnSelectTemplate = vi.fn();

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Infinity,
    },
  },
});

describe('TemplatesPanel', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createTestQueryClient();
    mockOnSelectTemplate.mockClear();
    (useQuery as jest.Mock).mockReset();
  });

  it('should render templates and call onSelectTemplate with the correct ID when a template is clicked', async () => {
    const firstTemplate = templates[0];
    if (!firstTemplate) {
      throw new Error("No templates available for testing.");
    }

    (useQuery as jest.Mock).mockImplementation(({ queryKey }) => {
      if (queryKey[0] === '/api/templates') {
        return {
          data: [...templates],
          isLoading: false,
          error: null,
        };
      }
      return { data: undefined, isLoading: true, error: null };
    });

    const { debug } = render(
      <QueryClientProvider client={queryClient}>
        <TemplatesPanel
          selectedTemplateId={undefined}
          onSelectTemplate={mockOnSelectTemplate}
          showPanel={true}
          onTogglePanel={mockOnTogglePanel}
        />
      </QueryClientProvider>
    );

    let templateElement: HTMLElement | null = null;

    // Using waitFor to give JSDOM and React time to settle, then try getByTestId
    // This also helps if the element appears due to async operations not covered by findBy* default timeouts
    await waitFor(async () => {
      templateElement = screen.getByTestId(`template-item-${firstTemplate.id}`);
      expect(templateElement).toBeInTheDocument(); // Ensure it's found within waitFor
    }, { timeout: 5000 }); // Increased timeout

    if (!templateElement) {
        // This will ensure TypeScript knows templateElement is not null past this point
        // and provides a clearer error if it's still not found after waitFor.
        debug(); // Print DOM if element is still not found.
        throw new Error(`Template element with data-testid="template-item-${firstTemplate.id}" not found after waitFor.`);
    }

    await userEvent.click(templateElement);

    expect(mockOnSelectTemplate).toHaveBeenCalledTimes(1);
    expect(mockOnSelectTemplate).toHaveBeenCalledWith(firstTemplate.id.toString());
  });
});
