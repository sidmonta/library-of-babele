import React, { useEffect, useState } from 'react'
import WrapBook from '../wrapbook/WrapBook'

export default function BookStack({ first }: { first: string }) {
  const [bookStack, setBookStack] = useState<string[]>([])
  const addBookToStack = (book: string) => setBookStack((sk) => [book, ...sk])
  const removeBookFromStack = (book: string) => setBookStack((sk) => sk.filter((b) => b === book))

  useEffect(() => {
    addBookToStack(first)
  }, [first])

  return (
    <div className="stack-container">
      {bookStack.map((bookUri: string) => (
        <WrapBook key={bookUri} book={bookUri} onClose={removeBookFromStack} />
      ))}
    </div>
  )
}
