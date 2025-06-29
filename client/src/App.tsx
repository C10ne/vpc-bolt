import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Router, Route, Switch } from 'wouter';
import { Toaster } from '@/components/ui/toaster';
import { EditorProvider } from '@/lib/editorContext';
import PatternSelectionPage from '@/pages/PatternSelectionPage';
import PatternEditorPage from '@/pages/PatternEditorPage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <EditorProvider>
        <Router>
          <div className="min-h-screen bg-background">
            <Switch>
              <Route path="/" component={PatternSelectionPage} />
              <Route path="/patterns" component={PatternSelectionPage} />
              <Route path="/editor/:templateId" component={PatternEditorPage} />
              <Route>
                {/* 404 fallback */}
                <div className="flex items-center justify-center min-h-screen">
                  <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">404</h1>
                    <p className="text-gray-600 mb-4">Page not found</p>
                    <a href="/" className="text-primary hover:underline">
                      Return to Pattern Selection
                    </a>
                  </div>
                </div>
              </Route>
            </Switch>
          </div>
        </Router>
        <Toaster />
      </EditorProvider>
    </QueryClientProvider>
  );
}

export default App;