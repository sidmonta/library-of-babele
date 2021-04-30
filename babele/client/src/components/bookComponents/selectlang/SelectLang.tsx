import {useRecoilState} from "recoil";
import {langSelected} from "../../../store/books";
import {ChangeEvent, useEffect, useState} from "react";
import {Observable} from "rxjs";
import {Quad} from "../../../services/models";
import {distinct, filter, map} from "rxjs/operators";

export default function SelectLang (props: { data: Observable<{ quad: Quad}>}) {
  const stream = props.data
  const [lang, setLang] = useRecoilState(langSelected)
  const [availableLang, setAvailableLang] = useState<string[]>([])

  useEffect(() => {
    const subscriber = stream.pipe(
      map(({ quad }) => quad.object.language),
      filter(lang => Boolean(lang)),
      distinct()
    ).subscribe(
      value => setAvailableLang(old => [value, ...old])
    )

    return () => subscriber.unsubscribe()
  }, [stream])

  const selectNewLang = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value
    setLang(value)
  }

  return (
    <select onChange={selectNewLang} value={lang}>
      <option key={lang} value={lang}>{lang.toLocaleUpperCase()}</option>
      {availableLang.map(l => {
        return <option key={l} value={l}>{l.toLocaleUpperCase()}</option>
      })}
    </select>
  )
}
