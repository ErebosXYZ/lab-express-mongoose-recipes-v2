const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");

const Recipe = require("./models/Recipe.model");

const app = express();

// MIDDLEWARE
app.use(logger("dev"));
app.use(express.static("public"));
app.use(express.json());


// Iteration 1 - Connect to MongoDB
// DATABASE CONNECTION

const MONGODB_URI = "mongodb+srv://RobertMF:zVz8C3as1iXclvIV@cluster0.jrj3qzj.mongodb.net/recipes-2025";

mongoose
    .connect(MONGODB_URI)
    .then((x) => console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`))
    .catch((err) => console.error("Error connecting to mongo", err));

// ROUTES
//  GET  / route - This is just an example route
app.get('/', (req, res) => {
    res.send("<h1>LAB | Express Mongoose Recipes</h1>");
});


//  Iteration 3 - Create a Recipe route
//  POST  /recipes route

app.post('/recipes', async (req, res) => {
    const { title, instructions, level, ingredients, image, duration, isArchived, created } = req.body;

    const newRecipe = Recipe({
        title,
        instructions,
        level,
        ingredients,
        image,
        duration,
        isArchived,
        created
    })

    await newRecipe.save();
    try {
        res.status(201).json(newRecipe);
    } catch (error) {
        res.status(500).json({ message: "Error while creating a new recipe" });
    }

})

/** title: { type: String, required: true, unique: true },
    instructions: { type: String, required: true },
    level: { type: String, enum: ["Easy Peasy", "Amateur Chef", "UltraPro Chef"] },
    ingredients: { type: [String] },
    image: { type: String, default: "https://images.media-allrecipes.com/images/75131.jpg" },
    duration: { type: Number, min: 0 },
    isArchived: { type: Boolean, default: false },
    created: { type: Date, default: Date.now } */


//  Iteration 4 - Get All Recipes
//  GET  /recipes route
app.get('/recipes', async (req, res) => {
    /**Recipe.find({}).then( recipes => res.status(201).json(recipes)).catch(err => res.status(500).json({ message: "Error while getting all recipes"})); (solution)*/

    const allRecipes = await Recipe.find();

    try {
        res.status(200).json(allRecipes);
    } catch (error) {
        res.status(500).json({ message: "We could not retrieve the recipes" });
        console.log(error.message);
    }
})

//  Iteration 5 - Get a Single Recipe
//  GET  /recipes/:id route

app.get('/recipes/:id', async (req, res) => {
    
    try {
        const recipeId = await Recipe.findById(req.params.id);
        res.status(200).json(recipeId);
    } catch (error) {
        res.status(500).json({ message: 'Error finding recipe by this ID' });
        console.error(error.message);
    }
})


//  Iteration 6 - Update a Single Recipe
//  PUT  /recipes/:id route

app.put('/recipes/:id', async (req, res) => {
    try {
        const recipeUpdate = await Recipe.findByIdAndUpdate(req.params.id, req.body, { new: true} );
        res.status(200).json(recipeUpdate);
    } catch (error) {
        res.status(500).json( { message: 'Error updating recipe'});
        console.log(error.message);
    }
})

//  Iteration 7 - Delete a Single Recipe
//  DELETE  /recipes/:id route

app.delete('/recipes/:id', async (req, res) => {
    try {
        const recipeDelete = await Recipe.findByIdAndDelete(req.params.id)
        res.status(200).json(recipeDelete);
        console.log("Recipe deleted succesfully!")
    } catch (error) {
        res.status(500).json( { message: 'Error deleting recipe'});
        console.log(error.message);
    }
})


// Start the server
app.listen(3000, () => console.log('Listening on http://localhost:3000/'));



//❗️DO NOT REMOVE THE BELOW CODE
module.exports = app;
