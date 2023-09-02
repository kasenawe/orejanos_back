const { mongoose, Schema } = require("../db");

// Crear esquema y modelo Article...
const articleSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
);

articleSchema.methods.toJSON = function () {
  const article = this.toObject();
  article.id = article._id.toString();
  delete article._id;
  return article;
};
const Article = mongoose.model("Article", articleSchema);

module.exports = Article;
