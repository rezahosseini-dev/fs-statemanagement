import { render, screen, cleanup, fireEvent } from "@testing-library/react";
import { act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import useAnecdoteStore from "./store";
import * as anecdoteService from "./services/anecdotes";
import AnecdoteList from "./components/AnecdoteList";

vi.mock("./services/anecdotes");

describe("Anecdotes Tests - Exercises 6.12. to 6.15", () => {
  beforeEach(() => {
    cleanup();
    useAnecdoteStore.setState({ anecdotes: [], filter: "" });
    vi.clearAllMocks();
  });

  // Step 11
  it("verifies the state is initialized with anecdotes returned by the backend", async () => {
    const mockAnecdotes = [
      { id: "1", content: "If it hurts, do it more often", votes: 0 },
      {
        id: "2",
        content: "Adding manpower to a late software project makes it later!",
        votes: 5,
      },
    ];

    anecdoteService.getAll.mockResolvedValue(mockAnecdotes);

    await act(async () => {
      await useAnecdoteStore.getState().actions.initializeAnecdotes();
    });

    const currentAnecdotes = useAnecdoteStore.getState().anecdotes;
    expect(currentAnecdotes).toHaveLength(2);
    expect(currentAnecdotes).toEqual(mockAnecdotes);
  });

  // Step 12
  it("verifies the component displaying anecdotes receives them sorted by votes", () => {
    const unsortedAnecdotes = [
      { id: "1", content: "First anecdote low votes", votes: 2 },
      { id: "2", content: "Second anecdote high votes", votes: 10 },
      { id: "3", content: "Third anecdote medium votes", votes: 5 },
    ];

    useAnecdoteStore.setState({ anecdotes: unsortedAnecdotes, filter: "" });

    render(<AnecdoteList />);

    const firstContent = screen.getByText("Second anecdote high votes");
    const secondContent = screen.getByText("Third anecdote medium votes");
    const thirdContent = screen.getByText("First anecdote low votes");

    expect(firstContent.compareDocumentPosition(secondContent)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
    expect(secondContent.compareDocumentPosition(thirdContent)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  // Step 13
  it("verifies the component receives a properly filtered list of anecdotes", () => {
    const anecdotesList = [
      { id: "1", content: "React is awesome and declarative", votes: 4 },
      { id: "2", content: "Zustand makes state management easy", votes: 10 },
      { id: "3", content: "Vitest is fast for testing React apps", votes: 2 },
    ];

    useAnecdoteStore.setState({
      anecdotes: anecdotesList,
      filter: "react",
    });

    render(<AnecdoteList />);

    expect(screen.getByText("React is awesome and declarative")).toBeDefined();
    expect(
      screen.getByText("Vitest is fast for testing React apps"),
    ).toBeDefined();

    expect(
      screen.queryByText("Zustand makes state management easy"),
    ).toBeNull();
  });

  // Step 14
  it("verifies that voting increases the number of votes for an anecdote", async () => {
    const anecdotesList = [
      { id: "1", content: "Testing with Vitest is fun", votes: 0 },
    ];

    useAnecdoteStore.setState({
      anecdotes: anecdotesList,
      filter: "",
    });

    if (anecdoteService.update) {
      anecdoteService.update.mockResolvedValue({
        ...anecdotesList[0],
        votes: 1,
      });
    }

    render(<AnecdoteList />);

    expect(screen.getByText("has 0")).toBeDefined();

    const voteButton = screen.getByRole("button", { name: /vote/i });
    await act(async () => {
      fireEvent.click(voteButton);
    });

    expect(screen.getByText("has 1")).toBeDefined();
  });
});
