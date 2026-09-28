import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, createAnecdote, updateAnecdote } from '../requests'
import useNotify from '../hooks/useNotify'

export const useAnecdotes = () => {

  const { notify } = useNotify()

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
      notify(`anecdote '${newAnecdote.content}' added`)
    },
    onError: () => {
      notify('too short anecdote, must have length 5 or more')
    }
  })

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onSuccess: (anecdote) => {
      queryClient.invalidateQueries({ queryKey: ['anecdotes'] })
      notify(`anecdote '${anecdote.content}' voted`)
    }
  })

  return {
    anecdotes: result.data,
    isPending: result.isPending,
    isError: result.isError,
    addAnecdote: (content) => {
      newAnecdoteMutation.mutate({ content, votes: 0 })
    },
    voteAnecdote: (anecdote) => {
      updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
    },
  }
}