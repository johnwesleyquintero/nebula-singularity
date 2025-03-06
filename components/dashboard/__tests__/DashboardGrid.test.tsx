import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardGrid from '../DashboardGrid';
import { ThemeProvider } from '../../theme-provider';

const mockData = {
  widgets: [
    { id: 1, title: 'Sales Overview', type: 'chart' },
    { id: 2, title: 'Recent Activity', type: 'list' }
  ]
};

// Mock child components
jest.mock('../Widget', () => ({
  __esModule: true,
  default: ({ title }) => <div data-testid="mock-widget">{title}</div>
}));

describe('DashboardGrid Component', () => {
  const renderComponent = () => {
    return render(
      <ThemeProvider>
        <DashboardGrid data={mockData} />
      </ThemeProvider>
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    renderComponent();
    expect(screen.getByTestId('dashboard-grid')).toBeInTheDocument();
  });

  it('renders correct number of widgets', () => {
    renderComponent();
    const widgets = screen.getAllByTestId('mock-widget');
    expect(widgets).toHaveLength(mockData.widgets.length);
  });

  it('displays widget titles correctly', () => {
    renderComponent();
    mockData.widgets.forEach(widget => {
      expect(screen.getByText(widget.title)).toBeInTheDocument();
    });
  });

  it('handles empty data gracefully', () => {
    render(
      <ThemeProvider>
        <DashboardGrid data={{ widgets: [] }} />
      </ThemeProvider>
    );
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
  });

  it('handles error states appropriately', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error');
    const mockError = new Error('Failed to load widgets');
    
    render(
      <ThemeProvider>
        <DashboardGrid data={null} />
      </ThemeProvider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('error-state')).toBeInTheDocument();
      expect(consoleErrorSpy).toHaveBeenCalledWith(mockError);
    });

    consoleErrorSpy.mockRestore();
  });

  it('handles loading state correctly', () => {
    render(
      <ThemeProvider>
        <DashboardGrid isLoading={true} data={null} />
      </ThemeProvider>
    );
    expect(screen.getByTestId('loading-state')).toBeInTheDocument();
  });
});