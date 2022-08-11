import { TypedUseSelectorHook, useSelector } from "react-redux";
import { RootState } from "../stores/reducers";

export const useTypedSelector: TypedUseSelectorHook<RootState> = useSelector