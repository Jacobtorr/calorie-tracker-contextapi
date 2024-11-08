import { Activity } from "../types"

// Actions
export type ActivityActions = 

{ type: 'save-activity', payload:  { newActivity : Activity } } |
{ type: 'set-activeId', payload:  { id : Activity['id'] } } |
{ type: 'delete-activity', payload:  { id : Activity['id'] } }  |
{ type: 'restart-app' }  

// Type
export type ActivityState = {
    activities : Activity[],
    activeId: Activity['id']
}

const localStorageActivities = () : Activity[] => {
    const activities = localStorage.getItem('activities')
    return activities ? JSON.parse(activities) : []
}

// STate
export const initialState : ActivityState = {
    activities: localStorageActivities(),
    activeId: ''
}


// Dispatch
export const activityReducer = (
    state : ActivityState = initialState,
    action: ActivityActions
) => {
    
    // Registrar nueva actividad
    if(action.type === 'save-activity') {
        // Este codigo maneja lalogica para actualizar el state

        let updatedActivities : Activity[] = []
        if(state.activeId) {
            // Si estamos editando la actividad
            updatedActivities = state.activities.map(activity => activity.id === state.activeId ? action.payload.newActivity : activity)

        } else {
            // Si es una nueva actividad 
            updatedActivities = [...state.activities, action.payload.newActivity]
        }

        return {
            ...state,
            activities: updatedActivities,
            activeId: '' // Reiniciar el activeId para no reescribir cuando se registre uno nuevo
        }
    }

    // Editar actividad
    if(action.type === 'set-activeId') {
        // Este codigo maneja lalogica para actualizar el state
        return {
            ...state,
            activeId: action.payload.id
        }
    }

    // Eliminar actividad
    if(action.type === 'delete-activity') {


        return {
            ...state,
            activities: state.activities.filter(activity => activity.id !== action.payload.id)
        }
    }

    // Reiniciar la App
    if(action.type === 'restart-app') {

        
        return {
            activities: [],
            activeId: ''
        }
    }

    return state

}