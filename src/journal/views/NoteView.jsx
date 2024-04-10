import { useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { DeleteOutline, SaveOutlined, UploadOutlined } from '@mui/icons-material';
import { Button, Grid, IconButton, TextField, Typography } from '@mui/material';
import Swal from 'sweetalert2';
import 'sweetalert2/dist/sweetalert2.css';

import { useForm } from '../../hooks/useForm';
import { setActiveNote } from '../../store/journal/journalSlice';
import { startDeletingNote, startSaveNote, startUploadingFiles } from '../../store/journal/thunks';
import { ImageGallery } from '../components';


export const NoteView = () => {

    const dispatch = useDispatch();

    const { active:note, messageSaved, isSaving } = useSelector( state => state.journal );

    const { body, title, date, onInputChange, formState } = useForm( note );

    // Esto es para ponerle formato a la fecha
    const dateString = useMemo( () => {

        const newDate = new Date( date );

        return newDate.toUTCString();

    }, [date]);

    const fileInputRef = useRef();

    //Esto es para que se actualice en tiempo real la nota activa en el store
    useEffect(() => {
      dispatch( setActiveNote( formState ) );
    }, [formState])

    const onSaveNote = () => {

        dispatch( startSaveNote() );

    }

    // Aqui recibimos el target del input de files
    const onFileInputChange = ({ target }) => {
        if( target.files === 0 ) return;

        dispatch( startUploadingFiles( target.files ) );
    }

    useEffect(() => {
      if( messageSaved.length > 0 ){
        Swal.fire('Nota actualizada', messageSaved, 'success');
      }
    }, [messageSaved])

    const onDelete = () => {
        dispatch( startDeletingNote() );
    }
    
    
  return (
    <Grid 
        container 
        direction='row' 
        justifyContent='space-between' 
        alignItems='center' 
        sx={{ mb: 1 }}
        className='animate__animated animate__fadeIn animate__faster' 
    >
        
        <Grid item>
            <Typography fontSize={39} fontWeight='light'>{ dateString }</Typography>
        </Grid>
        <Grid item>

            <input
                type="file"
                multiple
                ref={ fileInputRef }
                onChange={ onFileInputChange }
                style={{display:'none'}}
            />

            <IconButton
                color="primary"
                 disabled={ isSaving }
                 onClick={ () => fileInputRef.current.click() }
            >
                <UploadOutlined/>
            </IconButton>

            <Button 
                disabled={ isSaving }
                onClick={ onSaveNote }
                color='primary' 
                sx={{ padding: 2 }}
            >
                <SaveOutlined sx={{ fontSize: 30, mr: 1 }} />
                Guardar
            </Button>
        </Grid>

        <Grid container>
            <TextField 
                type='text'
                variant='filled'
                fullWidth
                placeholder='Ingrese un título'
                label='Título'
                sx={{ border: 'none', mb: 1 }}
                // Los siguientes valores son los que se ponen para conectar el hook useForm
                name="title"
                value={ title }
                onChange={ onInputChange }
            />

            <TextField 
                type='text'
                variant='filled'
                fullWidth
                multiline
                placeholder='¿Qué sucedió en el día de hoy?'
                minRows={5}
                // Los siguientes valores son los que se ponen para conectar el hook useForm
                name="body"
                value={ body }
                onChange={ onInputChange }
            />
        </Grid>

        <Grid container justifyContent='end'>
            <Button
                onClick={ onDelete }
                sx={{ mt:2 }}
                color="error"
            >
                <DeleteOutline />
                Borrar
            </Button>
        </Grid>

        {/* Image gallery */}
        {/* Aca tiene mas sentido enviarle las urls de las imagenes al imageGallery en vez de leelas dentro de imageGallery del store */}
        <ImageGallery 
            images={ note.imageUrls }
        />

    </Grid>
  )
}
