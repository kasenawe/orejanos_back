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
      description: {
        type: String,
        required: false,
      },
    },
  ],
  slug: {
    type: String,
    required: true,
  },
});

albumSchema.methods.toJSON = function () {
  const album = this.toObject();
  album.id = album._id.toString();
  delete album._id;
  return album;
};
const Album = mongoose.model("Album", albumSchema);

module.exports = Album;
