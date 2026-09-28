import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, createAnecdote, updateAnecdote } from '../requests'
import useNotificationContext from '../hooks/useContext'

export const useAnecdotes = () => {

  const { notify } = useNotificationContext()

  const queryClient = useQueryClient()

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    refetchOnWindowFocus: false
  })

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
    }
  })

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
    }
  })

  return {
    anecdotes: result.data,
    isPending: result.isPending,
    isError: result.isError,
    addAnecdote: (content) => {
      newAnecdoteMutation.mutate({ content, votes: 0 })
      notify(`anecdote '${content}' added`)
    },
    voteAnecdote: (anecdote) => {
      updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
      notify(`anecdote '${anecdote.content}' voted`)
    },
  }
}