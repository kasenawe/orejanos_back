const Album = require("../models/Album");
const Admin = require("../models/Admin");
const formidable = require("formidable");
const slugify = require("slugify");
const fs = require("fs");
const path = require("path");
const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY, {
  auth: { persistSession: false },
  debug: true, // Habilitar modo de depuración
});

// Display a listing of the resource.
async function index(req, res) {
  const albums = await Album.find();
  return res.json(albums);
}

// Display the specified resource.
async function show(req, res) {
  const album = await Album.findOne({ slug: req.params.slug });
  return res.json({ album });
}

// Show the form for creating a new resource
async function create(req, res) {}

// Store a newly created resource in storage.
async function store(req, res) {
  const form = formidable({
    multiples: true,

    keepExtensions: true,
  });

  form.parse(req, async (err, fields, files) => {
    console.log(files);
    if (err) {
      console.log(err);
    }
    let imageFilename;
    if (files.images) {
      imageFilename = files.images.originalFilename;
      coverImageFilename = files.images.originalFilename;

      const { data, error } = await supabase.storage
        .from("img")
        .upload(`${imageFilename}`, fs.createReadStream(files.images.filepath), {
          cacheControl: "3600",
          upsert: false,
          contentType: files.images.mimetype,
          duplex: "half",
        });
      // ...
      if (error) {
        console.error("Error uploading image to Supabase:", error);
        return res.json("Album create failed when saving image");
      }
    }
    const album = new Album({
      name: fields.name,
      coverImage: coverImageFilename,
      images: [{ src: imageFilename, alt: imageFilename }],
      slug: slugify(`${fields.name} `, {
        replacement: "-",
        lower: true,
      }),
    });

    await album.save();

    return res.json("Album updated");
  });
}

// Show the form for editing the specified resource.
async function edit(req, res) {}

// Update the specified resource in storage.
async function update(req, res) {}

// Remove the specified resource from storage.
async function destroy(req, res) {
  try {
    await Album.findByIdAndDelete(req.params.id);
    return res.json("Album has been deleted");
  } catch {
    return res.json("Failed deleting requested album");
  }
}

async function deleteImage(req, res) {
  try {
    const imageFilename = req.params.filename;

    // Eliminar la imagen de Supabase
    const { data, error } = await supabase.storage.from("img").remove([imageFilename]);

    if (error) {
      console.error("Error al eliminar la imagen de Supabase:", error);
      return res.status(500).json("Error al eliminar la imagen");
    }

    return res.json("Imagen eliminada de Supabase");
  } catch (error) {
    console.error("Error en la función deleteImage:", error);
    return res.status(500).json("Error interno del servidor");
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
  deleteImage,
};
