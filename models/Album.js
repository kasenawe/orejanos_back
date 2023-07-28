const { mongoose, Schema } = require("../db");

// Crear esquema y modelo Album...
const albumSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  coverImage: {
    type: String,
    required: true,
  },
  images: [
    {
      src: {
        type: String,
        required: true,
      },
      alt: {
        type: String,
        required: true,
      },
    },
  ],
});

const Album = mongoose.model("Album", albumSchema);

module.exports = Album;
