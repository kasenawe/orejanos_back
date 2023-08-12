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
    if (err) {
      console.log(err);
      return res.status(500).json("Error interno del servidor");
    }

    let imageFiles;
    if (Array.isArray(files.images)) {
      imageFiles = files.images;
    } else {
      imageFiles = [files.images];
    }

    const albumImages = [];

    for (const imageFile of imageFiles) {
      const imageFilename = imageFile.originalFilename;
      const { data, error } = await supabase.storage
        .from("img")
        .upload(imageFilename, fs.createReadStream(imageFile.filepath), {
          cacheControl: "3600",
          upsert: false,
          contentType: imageFile.type,
          duplex: "half",
        });

      if (error) {
        console.error("Error uploading image to Supabase:", error);
        return res.status(500).json("Error al subir imagen a Supabase");
      }

      albumImages.push({ src: imageFilename, alt: imageFilename });
    }

    const album = new Album({
      name: fields.name,
      coverImage: albumImages.length > 0 ? albumImages[0].src : null, // You might want to adjust this based on your logic
      images: albumImages,
      slug: slugify(`${fields.name}`, {
        replacement: "-",
        lower: true,
      }),
    });

    try {
      await album.save();
      return res.json("Álbum creado exitosamente");
    } catch (error) {
      console.error("Error al guardar el álbum:", error);
      return res.status(500).json("Error al guardar el álbum en la base de datos");
    }
  });
}

// Show the form for editing the specified resource.
async function edit(req, res) {}

// Add photos to the specified resource in storage.
async function addPhoto(req, res) {
  const albumId = req.params.id;

  const form = formidable({
    multiples: true,
    keepExtensions: true,
  });
  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.log(err);
      return res.status(500).json("Error interno del servidor");
    }

    let imageFiles;
    if (Array.isArray(files.images)) {
      imageFiles = files.images;
    } else {
      imageFiles = [files.images];
    }

    const albumImages = [];
    try {
      // Fetch the existing album from the database
      const album = await Album.findById(albumId);

      for (const imageFile of imageFiles) {
        const imageFilename = imageFile.originalFilename;
        const { data, error } = await supabase.storage
          .from("img")
          .upload(imageFilename, fs.createReadStream(imageFile.filepath), {
            cacheControl: "3600",
            upsert: false,
            contentType: imageFile.type,
            duplex: "half",
          });

        if (error) {
          console.error("Error uploading image to Supabase:", error);
          return res.status(500).json("Error al subir imagen a Supabase");
        }

        albumImages.push({ src: imageFilename, alt: imageFilename });
      }

      // Concatenate the new images with the existing images
      album.images = album.images.concat(albumImages);

      // Save the updated album back to the database
      await album.save();
      return res.json("Fotos agregadas exitosamente");
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json("Error al agregar fotos al álbum");
    }
  });
}

// Update the specified resource in storage.
async function update(req, res) {
  try {
    await Album.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      slug: slugify(req.body.name, {
        replacement: "-",
        lower: true,
      }),
    });

    return res.json("Album updated");
  } catch {
    return res.json("Failed updating requested line");
  }
}

// Remove the specified resource from storage.
async function destroy(req, res) {
  try {
    const album = await Album.findByIdAndDelete(req.params.id);

    // Si el álbum fue encontrado y eliminado exitosamente
    if (album) {
      // Eliminar las imágenes de Supabase
      for (const image of album.images) {
        const { data, error } = await supabase.storage.from("img").remove([image.src]);

        if (error) {
          console.error("Error al eliminar la imagen de Supabase:", error);
          return res.status(500).json("Error al eliminar las imágenes del álbum");
        }
      }

      return res.json("Álbum y sus imágenes han sido eliminados");
    } else {
      return res.json("Álbum no encontrado");
    }
  } catch {
    return res.json("Failed deleting requested album");
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
  addPhoto,
  update,
  destroy,
};
