import { Dispatch } from "redux";
import { useDispatch } from "react-redux";

type Fn<T> = (dispatch: Dispatch) => T;

const useAction = <T>(fn: Fn<T>) => {
  const dispatch = useDispatch();

  return fn(dispatch);
};

export default useAction;
