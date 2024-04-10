import { collection, deleteDoc, doc, setDoc } from "firebase/firestore/lite";
import { FirebaseDB } from "../../firebase/config";
import { addNewEmptyNote, deleteNoteById, savingNewNote, setActiveNote, setNotes, setPhotosToActiveNote, setSaving, updateNote } from "./journalSlice";
import { loadNotes } from "../../helpers/loadNotes";
import { fileUpload } from "../../helpers/fileUpload";

export const startNewNote = () => {
    return async( dispatch, getState ) => {
        
        dispatch( savingNewNote() );

        const { uid } = getState().auth;

        const newNote = {
            title: '',
            body: '',
            date: new Date().getTime(),
            imageUrls: [],
        }

        const newDoc = doc( collection( FirebaseDB, `${ uid }/journal/notes` ) );
        await setDoc( newDoc, newNote );

        newNote.id = newDoc.id;

        dispatch( addNewEmptyNote( newNote ) );
        dispatch ( setActiveNote( newNote ) );

    }
}


export const startLoadingNotes= () => {
    return async( dispatch, getState ) => {

        //Obtenemos uid del usuario
        const { uid } = getState().auth;

        if( !uid ) throw new Error('El uid del usuario no existe');

        const notes = await loadNotes( uid );

        dispatch( setNotes( notes ) );

    }
}


export const startSaveNote = () => {
    return async( dispatch, getState ) => {

        dispatch( setSaving() );

        const { uid } = getState().auth;
        //Obtengo la nota activa del store
        // Cuando esta asi active:note quiere decir que le estoy poniendo un alias a active
        const { active:note } = getState().journal;

        const noteToFireStore = { ...note };
        // En firebase no estamos almaceando la informacion del id de la nota entonces hay que remover eso
        delete noteToFireStore.id;

        const docRef = doc( FirebaseDB, `${ uid }/journal/notes/${ note.id }` );
        // Aqui estamos grabando en FireStore, el merge es para que si agregamos otro campo o algo se actulice todo, literal es un merge
        await setDoc( docRef, noteToFireStore, { merge: true } );

        dispatch( updateNote( note ) );

    }
}


export const startUploadingFiles = ( files = [] ) => {
    return async( dispatch ) => {

        dispatch( setSaving() );
        
        // await fileUpload( files[0] );

        const fileUploadPromises = [];

        for (const file of files) {
            fileUploadPromises.push( fileUpload( file ) );
        }

        const photosUrls = await Promise.all( fileUploadPromises );
        
        dispatch( setPhotosToActiveNote( photosUrls ) );
        dispatch( startSaveNote() ); //Este lo puse para que se guarde la nota automaticamente cuando se carguen imagenes

    }
}


export const startDeletingNote = () => {
    return async( dispatch, getState ) => {

        const { uid } = getState().auth;
        const { active: note } = getState().journal;

        const docRef = doc( FirebaseDB, `${ uid }/journal/notes/${ note?.id }` );
        await deleteDoc( docRef );

        dispatch( deleteNoteById( note.id ) );

    }
}
