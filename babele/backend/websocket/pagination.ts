import {merge, Observable, Subject} from "rxjs";
import {Event, matchEvent} from "@marblejs/core";
import {Type} from "./EffectTypes";
import {
  bufferCount,
  concatMap, filter,
  mapTo, mergeMap, scan,
  shareReplay, startWith, take, tap,
} from "rxjs/operators";

export default function <A>(method: (event: Event) => Observable<A>) {
  const resume$: Subject<boolean> = new Subject()
  const pause$: Subject<boolean> = new Subject()

  return (event: Event, event$: Observable<Event>) => {
    const resumeEv$ = merge(
      event$.pipe(matchEvent(Type.CONTINUE), mapTo(true)),
      resume$
    )

    const methodExecution$: Observable<A> = method(event)

    const pauseResume$ = merge(
      pause$,
      resumeEv$
    ).pipe(startWith(true), shareReplay(1))

/*    methodExecution$
      .pipe(scan((acc, _) => acc + 1, 0), filter(count => count % 5 === 0))
      .subscribe((count) => {
        console.log('Count', count)
        if (count >= 5) {
          on$.next(false)
        }
      })
 */
    resume$.next(true)
    const tmp$ = methodExecution$.pipe(
      tap(console.log),
      concatMap(value => pauseResume$.pipe(
        filter(resume => Boolean(resume)),
        take(1),
        mapTo(value)
      ))
    )

    tmp$.pipe(bufferCount(5, 2)).subscribe(() => {
        console.log('pause')
        pause$.next(false)
    })

    return tmp$
  }
}
