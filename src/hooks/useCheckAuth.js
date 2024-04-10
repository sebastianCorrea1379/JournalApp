import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../store/auth";
import { FirebaseAuth } from "../firebase/config";
import { startLoadingNotes } from "../store/journal/thunks";


export const useCheckAuth = () => {

    const { status } = useSelector(state => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
      
      // Esto es un escuchador que esta pendiente en cambios de la autenticacion en firebase
      onAuthStateChanged( FirebaseAuth, async( user ) => {

        if( !user ) return dispatch( logout() );
  
        const { uid, email, displayName, photoURL } = user;
        dispatch( login( { uid, email, displayName, photoURL } ) );
        dispatch( startLoadingNotes() );
      })
    
    }, [])

    return {
        status
    }
  
}
