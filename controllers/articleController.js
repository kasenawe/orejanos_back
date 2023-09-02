const Article = require("../models/Article");
const formidable = require("formidable");
const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");
const { ObjectId } = require("mongoose").Types;

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
  auth: { persistSession: false },
});

// Display a listing of the resource.
async function index(req, res) {
  const articles = await Article.find();
  return res.json(articles);
}

// Display the specified resource.
async function show(req, res) {}

// Show the form for creating a new resource
async function create(req, res) {}

// Store a newly created resource in storage.
async function store(req, res) {
  const form = formidable({
    multiples: true,
    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.log(err);
      return res.status(500).json("Error interno del servidor");
    }

    const imageFilename = files.image.originalFilename;
    const { data, error } = await supabase.storage
      .from("img")
      .upload(`articles/${imageFilename}`, fs.createReadStream(files.image.filepath), {
        cacheControl: "3600",
        upsert: false,
        contentType: files.image.type,
        duplex: "half",
      });

    if (error) {
      console.error("Error uploading image to Supabase:", error);
      return res.status(500).json("Error al subir imagen a Supabase");
    }

    const article = new Article({
      name: fields.name,
      image: imageFilename,
      content: fields.content,
    });

    try {
      await article.save();
      return res.json("Publicación creada exitosamente");
    } catch (error) {
      console.error("Error al guardar la publicación:", error);
      return res.status(500).json("Error al guardar la publicación en la base de datos");
    }
  });
}

// Show the form for editing the specified resource.
async function edit(req, res) {}

// Update the specified resource in storage.
async function update(req, res) {}

// Remove the specified resource from storage.
async function destroy(req, res) {}

// Otros handlers...
// ...

module.exports = {
  index,
  show,
  create,
  store,
  edit,
  update,
  destroy,
};
