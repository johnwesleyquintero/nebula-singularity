/** @jest-environment jsdom */
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DashboardGrid from '../DashboardGrid';
import { ThemeProvider } from '../../theme-provider';

// Mock child components
jest.mock('../Widget', () => ({
  __esModule: true,
  default: ({ title }: { title: string }) => <div data-testid="mock-widget">{title}</div>
}));

describe('DashboardGrid Component', () => {
  const mockWidgets = [
    { id: 1, title: 'Sales Overview', type: 'chart' },
    { id: 2, title: 'Recent Activity', type: 'list' }
  ];

  const renderComponent = () => {
    return render(
      <ThemeProvider>
        <DashboardGrid>
          {mockWidgets.map(widget => (
            <div key={widget.id} data-testid="mock-widget">{widget.title}</div>
          ))}
        </DashboardGrid>
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
    expect(widgets).toHaveLength(mockWidgets.length);
  });

  it('displays widget titles correctly', () => {
    renderComponent();
    mockWidgets.forEach(widget => {
      expect(screen.getByText(widget.title)).toBeInTheDocument();
    });
  });
});
