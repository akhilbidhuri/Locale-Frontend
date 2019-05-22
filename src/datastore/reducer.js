import { REQUEST, RESULT_RECIEVED} from './actions'
export default (state = {request: false, result:[]}, action) => {
    switch (action.type) {
      case REQUEST:
        console.log("aa gaya !!")
        return {
          ...state,
          request: !state.request
        };
      case RESULT_RECIEVED:
        return {
            ...state,
            result: action.payload
        };
      default:
        return state;
    }
  };
  