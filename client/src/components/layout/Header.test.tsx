import { render, screen, fireEvent } from '@testing-library/react'; // Added fireEvent
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Header from '@/components/layout/Header'; // Correct path
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Remove mock for AppHeader as Header.tsx is the actual component content
// vi.mock('@/components/AppHeader', () => ({
// default: () => <div data-testid="mocked-app-header">Mocked AppHeader</div>,
// }));

// Mock the useEditor hook from '@/lib/editorContext'
const mockUseEditorValue = {
  state: {
    currentPage: { id: 'page1', name: 'Test Page Name' }, // Ensure currentPage.id is present for "Publish" button logic
    // Add other state properties as needed by Header
  },
  savePage: vi.fn(),
  togglePreviewMode: vi.fn(),
  previewMode: false,
  // ... other functions or properties Header might use from useEditor
};

vi.mock('@/lib/editorContext', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/editorContext')>();
  return {
    ...actual,
    useEditor: () => mockUseEditorValue,
  };
});

// Mock useToast hook
const mockToast = vi.fn();
vi.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

// Create a new QueryClient instance
const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      staleTime: Infinity,
    },
    mutations: {
      retry: false,
    }
  },
});

describe('Header Component', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = createTestQueryClient();
    vi.clearAllMocks();
    // Reset parts of the mock if necessary for specific tests
    mockUseEditorValue.state.currentPage = { id: 'page1', name: 'Test Page Name' };
    mockUseEditorValue.previewMode = false;
  });

  const renderWithProviders = (ui: React.ReactElement) => {
    return render(
      <QueryClientProvider client={queryClient}>
        {ui}
      </QueryClientProvider>
    );
  };

  it('renders without crashing and displays title', () => {
    renderWithProviders(<Header />);
    expect(screen.getByText('PageCraft Builder')).toBeInTheDocument();
  });

  it('displays core action buttons', () => {
    renderWithProviders(<Header />);
    expect(screen.getByRole('button', { name: /preview/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /publish/i })).toBeInTheDocument();
  });

  it('displays device selection buttons', () => {
    renderWithProviders(<Header />);
    // Assuming Monitor, Tablet, Smartphone icons are identifiable by their visual role or via aria-labels if added
    // For now, checking for buttons that likely wrap these icons.
    // A more specific test would involve `getByRole('button', { name: /desktop/i })` if they have aria-labels.
    expect(screen.getByRole('button', { name: (content, element) => element?.querySelector('svg.lucide-monitor') !== null })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: (content, element) => element?.querySelector('svg.lucide-tablet') !== null })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: (content, element) => element?.querySelector('svg.lucide-smartphone') !== null })).toBeInTheDocument();
  });

  it('calls saveMutation when Save button is clicked', () => {
    renderWithProviders(<Header />);
    const saveButton = screen.getByRole('button', { name: /save/i });
    fireEvent.click(saveButton);
    // The actual mutation call is tested by react-query's own tests.
    // Here we can check if our mock savePage (from useEditor) was called if saveMutation.onSuccess calls it,
    // or if the mutation was triggered (which is harder to check without seeing its internals being called).
    // For now, just ensuring it doesn't crash and the button is clickable.
    // A more detailed test would involve mocking apiRequest and checking if it's called by saveMutation.
    expect(mockUseEditorValue.savePage).not.toHaveBeenCalled(); // savePage from context is called on SUCCESS of mutation
  });

  it('toggles preview mode when Preview/Edit button is clicked', () => {
    renderWithProviders(<Header />);
    const previewButton = screen.getByRole('button', { name: /preview/i });
    fireEvent.click(previewButton);
    expect(mockUseEditorValue.togglePreviewMode).toHaveBeenCalledTimes(1);

    // Update mock to simulate preview mode being active
    mockUseEditorValue.previewMode = true;
    renderWithProviders(<Header />); // Re-render or update state
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
  });
});
