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
async function update(req, res) {
  try {
    const form = formidable({
      multiples: true,
      keepExtensions: true,
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.log(err);
        return res.status(500).json("Error interno del servidor");
      }

      // Check if image field is present
      if (fields.image) {
        // Update the rest of the fields
        await Article.findByIdAndUpdate(req.params.id, {
          name: fields.name,
          content: fields.content,
        });

        // Send response here after updating
        return res.json("Article updated");
      } else {
        // Fetch the existing article image path name from the database
        const article = await Article.findById(req.params.id);

        const { data, error } = await supabase.storage
          .from("img")
          .remove(`articles/${article.image}`);

        if (error) {
          console.error("Error al eliminar la imagen de Supabase:", error);
          return res.status(500).json("Error al eliminar la imágen del articulo");
        }
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

      // Update the article with the image filename
      await Article.findByIdAndUpdate(req.params.id, {
        name: fields.name,
        image: imageFilename,
        content: fields.content,
      });
      // Send response here after updating
      return res.json("Article updated");
    });
  } catch (error) {
    console.error("Error in update function:", error);
    return res.status(500).json("Failed updating requested article");
  }
}

// Remove the specified resource from storage.
async function destroy(req, res) {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);

    // Si articulo fue encontrado y eliminado exitosamente
    if (article) {
      // Eliminar imágen de Supabase

      const { data, error } = await supabase.storage
        .from("img")
        .remove(`articles/${article.image}`);

      if (error) {
        console.error("Error al eliminar la imagen de Supabase:", error);
        return res.status(500).json("Error al eliminar la imágen del articulo");
      }

      return res.json("Articulo e imágen han sido eliminados");
    } else {
      return res.json("Articulo no encontrado");
    }
  } catch {
    return res.json("Failed deleting requested article");
  }
}

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
