import { db } from "./firebase.config"
import { useState, useEffect } from "react"
import { collection, onSnapshot, doc, addDoc, deleteDoc } from "firebase/firestore"

function App() {
  const [recipes, setRecipes] = useState([])
  const [form, setForm] = useState({
    title: "",
    desc: "",
    ingredients: [],
    steps: []
  })
  const [popupActive, setPopupActive] = useState(false)

  const recipesCollectionRef = collection(db, "receitas")

  useEffect(() => {
    onSnapshot(recipesCollectionRef, snapshot => {
      setRecipes(snapshot.docs.map(doc => {
        return {
          id: doc.id,
          viewing: false,
          ...doc.data()
        }
      }))
    })
  }, [])

  const handleView = id => {
    const recipesClone = [...recipes]

    recipesClone.forEach(recipe => {
      if (recipe.id === id) {
        recipe.viewing = !recipe.viewing
      } else {
        recipe.viewing = false
      }
    })

    setRecipes(recipesClone)
  }

  const handleSubmit = e => {
    e.preventDefault()

    if (!form.title || !form.desc || !form.ingredients || !form.steps) {
      alert("Por favor preencha todos os campos!")
      return
    }
    addDoc(recipesCollectionRef, form)
    setForm({
      title: "",
      desc: "",
      ingredients: [],
      steps: [],
    })
  }

  const handleIngredient = (e, i) => {
    const ingredientsClone = [...form.ingredients]

    ingredientsClone[i] = e.target.value

    setForm({
      ...form,
      ingredients: ingredientsClone
    })
  }

  const handleIngredientCount = () => {
    setForm({
      ...form,
      ingredients: [...form.ingredients, ""]
    })
  }

  const handleStep = (e, i) => {
    const stepsClone = [...form.steps]

    stepsClone[i] = e.target.value

    setForm({
      ...form,
      steps: stepsClone
    })
  }

  const handleStepCount = () => {
    setForm({
      ...form,
      steps: [...form.steps, ""]
    })
  }

  const removeRecipe = id => {
    if (
      confirm("Deseja realmente excluir a receita?")
    )
      deleteDoc(doc(db, "receitas", id))
  }

  return (
    <div className="App">
      <h1>Minhas Receitas</h1>
      <button onClick={() => setPopupActive(!popupActive)}>Adicionar Receita</button>
      <div className="recipes">
        {recipes.map((recipe, i) => (
          <div className="recipe" key={recipe.id}>
            <h3>{recipe.title}</h3>
            <p dangerouslySetInnerHTML={{ __html: recipe.desc }}></p>

            {recipe.viewing && <div>
              <h4>Ingredientes</h4>
              <ul>
                {recipe.ingredients.map((ingredient, i) => (
                  <li key={i}>{ingredient}</li>
                ))}
              </ul>
              <h4>Etapas</h4>
              <ol>

                {recipe.steps.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>}

            <div className="buttons">
              <button onClick={() => handleView(recipe.id)}>Ver {recipe.viewing ? 'menos' : 'mais'}</button>
              <button className="remove" onClick={() => removeRecipe(recipe.id)}>Excluir Receita</button>
            </div>
          </div>
        ))}
      </div>
      {popupActive && <div className="popup">
        <div className="popup-inner">
          <h2>Adicionar nova receita</h2>

          <form onSubmit={handleSubmit}>

            <div className="form-group">
              <label htmlFor="title">Nome</label>
              <input
                type="text"
                id="title"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })} />
            </div>

            <div className="form-group">
              <label htmlFor="desc">Descrição</label>
              <textarea
                type="text"
                id="desc"
                value={form.desc}
                onChange={e => setForm({ ...form, desc: e.target.value })} />

            </div>

            <div className="form-group">
              <label htmlFor="ingredients">Ingredientes</label>
              {
                form.ingredients.map((ingredient, i) => (
                  <input
                    type="text"
                    key={i}
                    id="ingredients"
                    value={ingredient}
                    onChange={e => handleIngredient(e, i)} />
                ))
              }
              <button type="button" onClick={handleIngredientCount}>Adicionar Ingrediente</button>
            </div>

            <div className="form-group">
              <label htmlFor="steps">Etapas</label>
              {
                form.steps.map((step, i) => (
                  <textarea
                    type="text"
                    key={i}
                    id="steps"
                    value={step}
                    onChange={e => handleStep(e, i)} />
                ))
              }
              <button type="button" onClick={handleStepCount}>Adicionar Etapa</button>
            </div>

            <div className="buttons">
              <button type="submit">Enviar</button>
              <button type="button" className="remove" onClick={() => setPopupActive(false)}>Fechar</button>
            </div>

          </form>
        </div>
      </div>}
    </div>
  )
}

export default App
