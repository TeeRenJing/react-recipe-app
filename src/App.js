import { db } from "./firebase.config";
import { useState, useEffect } from "react";
import {
  collection,
  onSnapshot,
  doc,
  addDoc,
  deleteDoc,
} from "firebase/firestore";

function App() {
  const [recipes, setRecipes] = useState([]);
  const [form, setForm] = useState({
    title: "",
    desc: "",
    ingredients: [],
    steps: [],
  });
  const [popupActive, setPopupActive] = useState(false);

  const recipesCollectionRef = collection(db, "recipes");

  useEffect(() => {
    onSnapshot(recipesCollectionRef, (snapshot) => {
      setRecipes(
        snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            viewing: false,
            ...doc.data(),
          };
        })
      );
    });
  }, []);

  const handleView = (id) => {
    const recipesClone = [...recipes];
    // so we only can see one recipe at one recipe at once, the rest of the recipes will be collapsed
    recipesClone.forEach((recipe) => {
      if (recipe.id === id) {
        recipe.viewing = !recipe.viewing;
      } else {
        recipe.viewing = false;
      }
    });

    setRecipes(recipesClone);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title || !form.desc || !form.ingredients || !form.steps) {
      alert("Fill up all fields");
      return;
    }

    addDoc(recipesCollectionRef, form);

    setForm({ title: "", desc: "", ingredients: [], steps: [] });

    setPopupActive(false);
  };

  const handleIngredient = (e, i) => {
    const ingredientsClone = [...form.ingredients];
    ingredientsClone[i] = e.target.value;
    setForm({
      ...form,
      ingredients: ingredientsClone,
    });
  };

  const handleStep = (e, i) => {
    const stepsClone = [...form.steps];
    stepsClone[i] = e.target.value;
    setForm({
      ...form,
      steps: stepsClone,
    });
  };

  const handleIngredientCount = () => {
    setForm({
      ...form,
      ingredients: [...form.ingredients, ""],
      // add empty string so that it can be filled up with the ingredient by the user
    });
  };

  const handleStepCount = () => {
    setForm({
      ...form,
      steps: [...form.steps, ""],
      // add empty string so that it can be filled up with the ingredient by the user
    });
  };

  const removeRecipe = (id) => {
    deleteDoc(doc(db, "recipes", id));
  };

  return (
    <div className="App">
      <h1>My recipes</h1>
      <button onClick={() => setPopupActive(!popupActive)}>Add recipe</button>
      <div className="recipes">
        {/* generate many divs of class "recipe", mapping through recipes Array of recipe objects*/}
        {recipes.map((recipe, i) => {
          return (
            <div className="recipe" key={recipe.id}>
              <h3>{recipe.title}</h3>
              <p dangerouslySetInnerHTML={{ __html: recipe.desc }}></p>
              {/* if recipe.viewing evals to true, show the whole div on the right */}
              {recipe.viewing && (
                <div>
                  <h4>Ingredients</h4>
                  {/* generate unordered list of ingredients, map thru ingredients Array in a recipe object*/}
                  <ul>
                    {recipe.ingredients.map((ingredient, i) => {
                      return <li key={i}> {ingredient} </li>;
                    })}
                  </ul>
                  <h4>Steps</h4>
                  {/* generate ordered list of steps, map thru steps Array in a recipe object*/}
                  <ol>
                    {recipe.steps.map((step, i) => {
                      return <li key={i}> {step} </li>;
                    })}
                  </ol>
                </div>
              )}

              <div className="buttons">
                <button
                  onClick={() => {
                    handleView(recipe.id);
                  }}
                >
                  View {recipe.viewing ? "less" : "more"}
                </button>
                <button className="remove" onClick={()=> {removeRecipe(recipe.id)}}>Remove</button>
              </div>
            </div>
          );
        })}
      </div>

      {/* once again only display the div if popupActive evals to true */}
      {popupActive && (
        <div className="popup">
          <div className="popup-inner">
            <h2>Add a new recipe </h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Title</label>
                {/* rmb that at the start theres setState for form and setForm */}
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Description</label>
                {/* rmb that at the start theres setState for form and setForm */}
                <input
                  type="text"
                  value={form.desc}
                  onChange={(e) => setForm({ ...form, desc: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Steps</label>
                {/* rmb that at the start theres setState for form and setForm */}
                {/* generate input fields based on the number of ingredient strings in the ingredients Array */}
                {/* so if customer want to add ingredient, need click add ingredient first. It adds an empty str to ingredients Array
                This empty string in the array will map to an input field to be displayed for user to input their Ingredient in the FE */}
                {form.steps.map((step, i) => {
                  return (
                    <textarea
                      type="text"
                      key={i}
                      value={step}
                      onChange={(e) => handleStep(e, i)}
                    />
                  );
                })}
                <button type="button" onClick={handleStepCount}>
                  Add step
                </button>
              </div>

              <div className="form-group">
                <label>Ingredients</label>
                {/* rmb that at the start theres setState for form and setForm */}
                {/* generate input fields based on the number of ingredient strings in the ingredients Array */}
                {/* so if customer want to add ingredient, need click add ingredient first. It adds an empty str to ingredients Array
                This empty string in the array will map to an input field to be displayed for user to input their Ingredient in the FE */}
                {form.ingredients.map((ingredient, i) => {
                  return (
                    <input
                      type="text"
                      key={i}
                      value={ingredient}
                      onChange={(e) => handleIngredient(e, i)}
                    />
                  );
                })}
                <button type="button" onClick={handleIngredientCount}>
                  Add ingredient
                </button>
              </div>

              <div className="buttons">
                <button type="submit">Submit</button>
                <button
                  type="button"
                  className="remove"
                  onClick={() => {
                    setPopupActive(false);
                  }}
                >
                  Close
                </button>
              </div>
            </form>
            {JSON.stringify(form)}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
