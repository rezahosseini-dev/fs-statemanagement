import { useAnecdotes, useAnecdoteActions, useFilter } from "../store";
import { useNotificationActions } from "../notificationStore";

const AnecdoteList = () => {
  const anecdotes = useAnecdotes();
  const { vote, removeAnecdote } = useAnecdoteActions();
  const filter = useFilter();
  const { setNotification } = useNotificationActions();

  const handleVote = async (anecdote) => {
    await vote(anecdote.id);
    setNotification(`you voted '${anecdote.content}'`, 5);
  };

  const handleDelete = async (anecdote) => {
    await removeAnecdote(anecdote);
    setNotification(`you  deleted the '${anecdote.content}'`, 5);
  };

  const filteredAnecdotes = anecdotes.filter((anecdote) =>
    anecdote.content.toLowerCase().includes(filter.toLowerCase()),
  );

  const sortedAnecdotes = filteredAnecdotes.toSorted(
    (a, b) => b.votes - a.votes,
  );

  return (
    <div>
      {sortedAnecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}{" "}
            <button onClick={() => handleVote(anecdote)}>vote</button>
            {anecdote.votes === 0 && (
              <button onClick={() => handleDelete(anecdote)}>delete</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default AnecdoteList;
