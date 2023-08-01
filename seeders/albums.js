const albums = [
  {
    name: "Marzo",
    coverImage: "", // Dejar la propiedad en blanco para que la actualicemos más adelante
    images: [
      { src: "Maximiliano.jpg", alt: "Maximiliano" },
      { src: "campeones.jpg", alt: "campeones" },
    ],
    slug: "",
  },
  {
    name: "Abril",
    coverImage: "", // Dejar la propiedad en blanco para que la actualicemos más adelante
    images: [{ src: "Santiago.jpg", alt: "Santiago" }],
    slug: "",
  },
];

module.exports = albums.map((album) => ({
  ...album,
  coverImage: album.images.length > 0 ? album.images[0].src : "", // Asignar la primera imagen del array como la foto de portada
  slug: album.name.toLowerCase(),
}));
