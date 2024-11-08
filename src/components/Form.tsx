import { useState, ChangeEvent, FormEvent, useEffect } from "react"
import { v4 as uuidv4 } from 'uuid'
import { categories } from "../data/categories"
import type { Activity } from "../types";
import { useActivity } from "../hooks/useActivity";

const initialState : Activity = {
    id: uuidv4(),
    category: 1,
    name: '',
    calories: 0
}

export default function Form() {

    const { state, dispatch } = useActivity()

    const [activity, setActivity] = useState<Activity>(initialState);

    // Editar actividad
    useEffect(() => {
        if(state.activeId) {
            const selectedActivity = state.activities.filter(stateActivity => stateActivity.id === state.activeId)[0]

            setActivity(selectedActivity)
        }
    }, [state.activeId]);

    // Detectar cuando cambio un input y escribir en el State
    function handleChange (e: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>) {

        const isNumberField = ['category', 'calories'].includes(e.target.id)

        setActivity({
            ...activity,
            [e.target.id]: isNumberField ? +e.target.value : e.target.value
        })
    }

    function isValidActivity () {
        const { name, calories } = activity

        return name.trim() !== '' && calories > 0
    }

    function handleSubmit (e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        
        // Agregar datos al State
        dispatch({ type: 'save-activity', payload: {newActivity: activity} })

        // Reiniciar el Form
        setActivity({
            ...initialState,
            id: uuidv4()
        })
    }

  return (
    <form
        className="space-y-5 bg-white shadow p-10 rounded-lg"
        onSubmit={handleSubmit}
    >
        <div className="grid grid-cols-1 gap-3">
            <label htmlFor="category" className="font-bold">Categoria:</label>

            <select 
                name="category" 
                id="category" 
                className="border border-slate-300 p-2 rounded-lg w-full bg-white"
                value={activity.category}
                onChange={handleChange}
            >
                {categories.map(category => (
                    <option key={category.id} value={category.id}>
                        {category.name}
                    </option>
                ))}
            </select>
        </div>

        <div className="grid grid-cols-1 gap-3">
            <label htmlFor="name" className="font-bold">Actividad:</label>

            <input 
                id="name"
                type="text" 
                className="border border-slate-300 p-2 rounded-lg w-full bg-white"
                placeholder="Ej: Comida, Jugo de Naranja, Ensalada, Ejercicio, Pesas, Bicicleta"
                value={activity.name}
                onChange={handleChange}
            />
        </div>

        <div className="grid grid-cols-1 gap-3">
            <label htmlFor="calories" className="font-bold">Calorias:</label>

            <input 
                id="calories"
                type="number" 
                className="border border-slate-300 p-2 rounded-lg w-full bg-white"
                placeholder="Calorias. Ej: 300"
                value={activity.calories}
                onChange={handleChange}
            />
        </div>

        <input 
            type="submit" 
            value={activity.category === 1 ? 'Guardar Comida' : 'Guardar Ejercicio'} 
            className="bg-gray-600 text-white uppercase font-bold p-2 w-full cursor-pointer hover:bg-gray-900 transition-all rounded-lg disabled:opacity-10 disabled:cursor-not-allowed"
            disabled={!isValidActivity()}
        />
    </form>
  )
}
