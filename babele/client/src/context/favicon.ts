import {createContext, useContext} from "react"
import GrabFavicon from "../services/grabfavicon";

const grabFavicon = new GrabFavicon()

export const FaviconContext = createContext(grabFavicon)
export const useGrabFavicon = () => useContext(FaviconContext)
