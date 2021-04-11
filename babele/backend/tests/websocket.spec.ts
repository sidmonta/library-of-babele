import { getBookData } from '../websocket/stream.response'
import { Type, WSBookDataIn } from '../websocket/EffectTypes'
import { Observable } from 'rxjs'

const cache = {
  sadd (dewey, bookUr) {
    // console.log(`Salvataggio in cache di ${bookUr} con dewey: ${dewey}`)
  }
}

const getBookDataTest = getBookData(cache)

const urlToTest: WSBookDataIn = {
  type: Type.BOOKDATA,
  payload: {
    uri: 'https://viaf.org/viaf/29732107'
  }
}

const [bookData$, bookService$, newBookClassified$] = getBookDataTest(urlToTest) as Observable<any>[]

// bookData$.subscribe({
//   next: (data) => { console.log('BookData Next') },
//   error: (err) => { console.log('BookData Error', err) },
//   complete: () => { console.log('BookData Observer complete') }
// })
//
// bookService$.subscribe({
//   next: (data) => { console.log('Book Service Next') },
//   error: (err) => { console.log('Book Service Error', err) },
//   complete: () => { console.log('Book Service Observer complete') }
// })

newBookClassified$.subscribe({
  next: (data) => { console.log('Book Classified Next', data) },
  error: (err) => { console.log('Book Classified Error', err) },
  complete: () => { console.log('Book Classified Observer complete') }
})