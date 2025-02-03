const { initializeDatabase } = require("./db/db.connect");
const Recipe = require("./models/recipe.model");
initializeDatabase();

const express = require("express");
const app = express();
app.use(express.json());

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});

async function createRecipe(newRecipe) {
  try {
    const recipe = new Recipe(newRecipe);
    const saveRecipe = await recipe.save();
    return saveRecipe;
  } catch (error) {
    throw error;
  }
}

app.post("/recipes", async (req, res) => {
  try {
    const savedRecipe = await createRecipe(req.body);
    res
      .status(201)
      .json({ message: "Recipe added successfully", recipe: savedRecipe });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error occured in adding new recipe", error });
  }
});

async function readAllRecipe(recipes) {
  try {
    const allRecipe = await Recipe.find();
    return allRecipe;
  } catch (error) {
    console.log("error occured in reading all recipe", error);
  }
}

app.get("/recipes", async (req, res) => {
  try {
    const recipes = await readAllRecipe();
    if (recipes.length != 0) {
      res.json(recipes);
    } else {
      res.status(404).json({ error: "No recipe found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error occured in fetching all recipes.", error });
  }
});

async function recipeByTitle(title) {
  try {
    const recipeTitle = await Recipe.findOne({ title: title });
    return recipeTitle;
  } catch (error) {
    console.log(error);
  }
}
app.get("/recipe/:recipeTitle", async (req, res) => {
  try {
    const recipeTitle = await recipeByTitle(req.params.recipeTitle);
    if (recipeTitle.length != 0) {
      res.json(recipeTitle);
    } else {
      res.status(404).json({ error: "No recipe found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error in fetching recipe by title" });
  }
});

async function readRecipeByAuthor(author) {
  try {
    const authorRecipe = await Recipe.find({ author: author });
    return authorRecipe;
  } catch (error) {
    console.log("Error in finding recipes by author", error);
  }
}

app.get("/readRecipe/:authorRecipe", async (req, res) => {
  try {
    const recipeByAuthor = await readRecipeByAuthor(req.params.authorRecipe);
    if (recipeByAuthor.length != 0) {
      res.json(recipeByAuthor);
    } else {
      res.json(404).status({ error: "Recipe not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error occured in find author recipe." });
  }
});

async function readRecipeByDifficultyLevel(difficulty) {
  try {
    const recipeDifficultyLevel = await Recipe.find({ difficulty: difficulty });
    return recipeDifficultyLevel;
  } catch (error) {
    console.log("Error in reading recipe by  difficulty level.", error);
  }
}
app.get("/readRecipeDifficulty/:difficulty", async (req, res) => {
  try {
    const recipeDifficulty = await readRecipeByDifficultyLevel(
      req.params.difficulty
    );
    if (recipeDifficulty.length != 0) {
      res.json(recipeDifficulty);
    } else {
      res.status(404).json({ error: "Recipe not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error in find recipe by difficulty level" });
  }
});

async function updateRecipeDifficultyLevelById(id, dataToUpdate) {
  try {
    const updatedDifficultyLevel = await Recipe.findByIdAndUpdate(
      id,
      dataToUpdate,
      { new: true }
    );
    console.log("Updating Recipe ID:", id);
    console.log("Data to update:", dataToUpdate);
    return updatedDifficultyLevel;
  } catch (error) {
    console.log("Error in updating difficulty level by id", error);
  }
}

app.post("/updateRecipe/:RecipeId", async (req, res) => {
  try {
    const updatedDifficulty = await updateRecipeDifficultyLevelById(
      req.params.RecipeId,
      req.body
    );
    if (updatedDifficulty) {
      res.status(200).json({
        message: "Recipe updated successfully",
        updatedDifficulty: updatedDifficulty,
      });
    } else {
      res.status(404).json({ error: "recipe not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error in updating recipe difficulty" });
  }
});

async function updateRecipePrepAndCookTime(title, dataToUpdate) {
  try {
    const updatedPrepAndCookTme = await Recipe.findOneAndUpdate(
      { title: title },
      dataToUpdate,
      { new: true }
    );
    return updatedPrepAndCookTme;
  } catch (error) {
    console.log("Error in updating recipes prep and cook time", error);
  }
}
app.post("/recipeTiming/:updatedTiming", async (req, res) => {
  try {
    const recipeUpdatedTiming = await updateRecipePrepAndCookTime(
      req.params.updatedTiming,
      req.body
    );
    if (recipeUpdatedTiming) {
      res.status(200).json({
        message: "Recipe timing updated successfullyu",
        recipeUpdatedTiming: recipeUpdatedTiming,
      });
    } else {
      res.status(404).json({ error: "Recipe timings not found" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to updated recipe timings not found" });
  }
});

async function deleteRecipeById(id) {
  try {
    const deleteRecipe = await Recipe.findByIdAndDelete(id);

    return deleteRecipe;
  } catch (error) {
    console.log("Error occured in deleting recipe by id", error);
  }
}
app.delete("/deleteRecipe/:recipeId", async (req, res) => {
  try {
    const deletedRecipe = await deleteRecipeById(req.params.recipeId);
    if (deletedRecipe) {
      res.status(200).json({ message: "Recipe deleted successfully" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to delete recipe by id" });
  }
});
