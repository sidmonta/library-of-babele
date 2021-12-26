import {useEffect, useState} from "react";
import {DeweyCategory} from "@sidmonta/babelelibrary/build/types";
import {fetchAPI} from "../services";

const fetchDewey = fetchAPI('GET')

export function useQueryBookcase(dewey: string | null) {
  const [bookcases, setBookcase] = useState<DeweyCategory[]>([])

  useEffect(() => {
    let url = dewey ? '/children/' + dewey : '/init'
    const fetchBookCases = async () => {
      try {
        const bookcases: DeweyCategory[] = await fetchDewey(url)
        setBookcase(bookcases)
      } catch (err) {
        console.error(err)
      }
    }

    fetchBookCases().then()
  }, [dewey])

  return bookcases
}
