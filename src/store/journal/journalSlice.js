import { createSlice } from '@reduxjs/toolkit';

export const journalSlice = createSlice({
    name: 'journal',
    initialState: {
        isSaving: false,
        messageSaved: '',
        notes: [],
        active: null,
        // active: {
        //     id: 'ABC123',
        //     title: '',
        //     body: '',
        //     date: 1234567,
        //     imageUrls: [], //arreglo de urls
        // }
    },
    reducers: {
        savingNewNote: (state) => {
            state.isSaving = true;
        },
        addNewEmptyNote: (state, { payload } ) => {
            state.notes.push( payload );
            state.isSaving = false;
        },
        setActiveNote: (state, { payload } ) => {
            state.active = payload;
            state.messageSaved = '';
        },
        setNotes: (state, { payload } ) => {
            state.notes = payload;
        },
        setSaving: (state, /* action */ ) => {
            state.isSaving = true;
            state.messageSaved = '';
        },
        updateNote: (state, { payload } ) => { //el payload es la nota actualizada
            state.isSaving = false;
            state.notes = state.notes.map( note => {
                if(note.id === payload.id){
                    return payload;
                }
                // el map devuelve un nuevo arreglo con lo que retornemos
                return note;
            });

            state.messageSaved = `${ payload.title }, actualizada correctamente`;

        },
        setPhotosToActiveNote: ( state, {payload} ) => {
            state.active.imageUrls = [ ...state.active.imageUrls, ...payload]; //Aca primero hacemos spread de lo que ya esta para agregar lo nuevo
            state.isSaving = false;
        },
        clearNotesLogout: ( state ) => {
            state.isSaving = false;
            state.messageSaved = '';
            state.notes = [];
            state.active = null; 
        },
        deleteNoteById: (state, { payload } ) => {
            state.active = null;
            state.notes = state.notes.filter( note => note.id !== payload);
        },
    }
});


// Action creators are generated for each case reducer function
export const { 
    addNewEmptyNote, 
    clearNotesLogout,
    deleteNoteById, 
    savingNewNote,
    setActiveNote, 
    setNotes, 
    setPhotosToActiveNote, 
    setSaving, 
    updateNote,
} = journalSlice.actions;