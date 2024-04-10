import { GoogleAuthProvider, createUserWithEmailAndPassword, signInWithPopup, updateProfile, signInWithEmailAndPassword } from 'firebase/auth';
import { FirebaseAuth } from './config';


const googleProvider = new GoogleAuthProvider();

export const singInWithGoogle = async() => {

    try {

        const result = await signInWithPopup( FirebaseAuth, googleProvider );
        // Lo de la siguiente linea es para obetenr token y otra información que no usamos en este caso
        // const credentials = GoogleAuthProvider.credentialFromResult( result );
        const { displayName, email, photoURL, uid } = result.user;

        return {
            ok: true,
            // User info
            displayName,
            email,
            photoURL,
            uid,
        }
        
        
    } catch (error) {

        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;

        return {
            ok: false,
            errorMessage,
        }
        
    }

}



export const registerUserWithEmailPassword = async({displayName, email, password}) => {

    try {

        const resp = await createUserWithEmailAndPassword(FirebaseAuth, email, password);
        const { uid, photoURL } = resp.user;
        //Actualizar el dosplayName en Firebase
        await updateProfile(FirebaseAuth.currentUser, {displayName});

        return {
            ok: true,
            uid, photoURL, email, displayName
        }
        
    } catch (error) {

        // console.log(error);
        return {ok: false, errorMessage: error.message}
        
    }

}



export const loginWithEmailPassword = async( {email, password} ) => {

    try {

        const resp = await signInWithEmailAndPassword( FirebaseAuth, email, password );
        const { uid, displayName, photoURL } = resp.user;
        // console.log(resp.user);

        return {
            ok: true,
            uid, email, displayName, photoURL
        }
        
    } catch (error) {

        // console.log(error.message);

        return {
            ok: false,
            errorMessage: error.message,
        }
        
    }

}



export const logoutFirebase = async() => {

    return await FirebaseAuth.signOut();

}