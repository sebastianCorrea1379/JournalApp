import { useEffect, useMemo, useState } from "react";


export const useForm = (initialForm = {}, formValidations = {} ) => {
  
    const [formState, setFormState] = useState(initialForm);
    const [formValidation, setFormValidation] = useState({});

    // Se ejecuta la función createValidators() cada vez que cambie el formState que son pues los campos del formulario
    useEffect(() => {
        createValidators();
    }, [formState])

    // Este es para que si cambia el initialForm, se establezca ese initialForm como el estado actual del formulario
    useEffect(() => {
      setFormState( initialForm );
    }, [ initialForm ])
    

    const isFormValid = useMemo( () => {

        for (const formValue of Object.keys( formValidation )) {
            if( formValidation[formValue] !== null ) return false;
        }

        return true;

    }, [formValidation]);
    

    const onInputChange = ({ target }) => {
        const { name, value } = target;
        setFormState({
            ...formState,
            [name]: value
        })
    }

    const onResetForm = () => {
        setFormState(initialForm);
    }

    const createValidators = () => {

        const formCheckedValues = {};

        // esto es un for of es para iterar, el Object.key devuelve el nombre de las claves
        // del objeto, en este caso, displayName, email, password.
        for (const formField of Object.keys( formValidations )) {
            // Aquí desestructuramos la funcion el mensaje de error que vienen en cada clave del objeto
            const [fn, errorMessage] = formValidations[formField];
            // Aquí creamos la clave displayNameValid, emailValid, passwordValid
            // y le asignamos el valor de null si la condicion de la funcion se cumple, o si no el erroMessage
            formCheckedValues[`${ formField }Valid`] = fn( formState[formField] ) ? null : errorMessage;

        }

        // Finalmente se lo asignamos al formValidation del useState que controla eso
        // Usamos useState porque necesitamos redibujar el componente cuando se manden los errorMessage del objeto
        setFormValidation( formCheckedValues );

    }

    return {
        ...formState,
        formState,
        onInputChange,
        onResetForm,

        ...formValidation,
        isFormValid,
    }
}