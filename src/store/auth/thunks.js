import { loginWithEmailPassword, logoutFirebase, registerUserWithEmailPassword, singInWithGoogle } from "../../firebase/providers";
import { clearNotesLogout } from "../journal/journalSlice";
import { checkingCredentials, login, logout } from "./"


export const chekingAuthentication = ( email, password ) => {
    return async( dispatch ) => {

        dispatch( checkingCredentials() );

    }
}

export const startGoogleSingIn = () => {
    return async( dispatch ) => {

        dispatch( checkingCredentials() );
        const result = await singInWithGoogle();
        if( !result.ok ) return dispatch(logout(result));

        dispatch( login(result) );
        
    }
}

// Funcion para empezar a crear un usuario, aqui llamamos la funcion correspondiente para eso del provider osea esta registerUserWithEmailPassword()
export const startCreatingUserWithEmailPassword = ({ displayName, email, password }) => {

    return async( dispatch ) => {

        dispatch( checkingCredentials() );

        const { ok, uid, photoURL, errorMessage } = await registerUserWithEmailPassword({displayName, email, password});

        //Aqui el error message lo mande en objeto porque en el slice lo estoy recibiendo como una clave del objeto payload
        if( !ok ) return dispatch( logout({errorMessage}) );

        dispatch( login( {uid, email, displayName, photoURL} ) );

    }

}

export const startLoginWithEmailPassword = ({ email, password }) => {

    return async( dispatch ) => {

        dispatch( checkingCredentials() );

        const { ok, errorMessage, uid, displayName, photoURL } = await loginWithEmailPassword({ email, password });

        if( !ok ) return dispatch( logout({ errorMessage }) );

        dispatch( login({ uid, email, displayName, photoURL }) );

    }

}


export const startLogout = () => {

    return async( dispatch ) => {

        await logoutFirebase();

        dispatch( clearNotesLogout() );
        dispatch( logout() );

    }

}