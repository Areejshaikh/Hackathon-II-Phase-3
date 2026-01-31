import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChatInterface from '../ChatInterface';

// Mock the Lucide icons
jest.mock('lucide-react', () => ({
  Send: () => <span>SendIcon</span>,
  Bot: () => <span>BotIcon</span>,
  User: () => <span>UserIcon</span>,
}));

// Mock the fetch API
global.fetch = jest.fn();

describe('ChatInterface', () => {
  const mockUserId = 'test-user-123';

  beforeEach(() => {
    (global.fetch as jest.MockedFunction<typeof fetch>).mockClear();
  });

  it('renders the chat interface with initial message', () => {
    render(<ChatInterface userId={mockUserId} />);

    expect(screen.getByText('AI Task Assistant')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ask me to add, list, complete, or delete tasks...')).toBeInTheDocument();
    expect(screen.getByText('Hi there! I\'m your AI assistant. You can ask me to add, list, complete, or delete tasks.')).toBeInTheDocument();
  });

  it('allows user to type and submit a message', async () => {
    const mockResponse = {
      response: 'I received your message',
      conversation_id: 1,
      messages: [],
      tool_results: [],
    };

    (global.fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    } as Response);

    render(<ChatInterface userId={mockUserId} />);

    const input = screen.getByPlaceholderText('Ask me to add, list, complete, or delete tasks...');
    fireEvent.change(input, { target: { value: 'Test message' } });

    const sendButton = screen.getByText('SendIcon'); // Using the mock icon text
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        `/api/${mockUserId}/chat`,
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify({
            message: 'Test message',
            conversation_id: null,
          }),
        })
      );
    });
  });

  it('shows loading state when waiting for response', async () => {
    // Create a promise that doesn't resolve immediately to simulate loading
    const fetchPromise = new Promise<Response>((resolve) => {
      setTimeout(() => {
        resolve({
          ok: true,
          json: async () => ({
            response: 'Test response',
            conversation_id: 1,
            messages: [],
            tool_results: [],
          }),
        } as Response);
      }, 100);
    });

    (global.fetch as jest.MockedFunction<typeof fetch>).mockReturnValueOnce(fetchPromise);

    render(<ChatInterface userId={mockUserId} />);

    const input = screen.getByPlaceholderText('Ask me to add, list, complete, or delete tasks...');
    fireEvent.change(input, { target: { value: 'Test message' } });

    const sendButton = screen.getByText('SendIcon');
    fireEvent.click(sendButton);

    // Check that loading indicator appears
    expect(screen.getByText(/animate-bounce/)).toBeInTheDocument(); // Loading dots
  });

  it('handles API errors gracefully', async () => {
    (global.fetch as jest.MockedFunction<typeof fetch>).mockRejectedValueOnce(
      new Error('Network error')
    );

    render(<ChatInterface userId={mockUserId} />);

    const input = screen.getByPlaceholderText('Ask me to add, list, complete, or delete tasks...');
    fireEvent.change(input, { target: { value: 'Test message' } });

    const sendButton = screen.getByText('SendIcon');
    fireEvent.click(sendButton);

    await waitFor(() => {
      expect(screen.getByText('Sorry, I encountered an error processing your request. Please try again.')).toBeInTheDocument();
    });
  });
});