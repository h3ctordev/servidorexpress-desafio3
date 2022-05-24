const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const Contenedor = require("./Contenedor");

let count = 0;

const random = (min, max) => {
  const num = max - min;
  let random = Math.random() * (num + 1);
  random = Math.floor(random);
  return min + random;
};

app.get("/", (req, res) => {
  res.status(200).send("Las rutas definidas son: /productos /productoRandom");
});

app.get("/productos", async (req, res) => {
  const productos = new Contenedor("productos.txt");
  res.status(200).json(await productos.getAll());
});

app.get("/productorandom", async (req, res) => {
  const productos = new Contenedor("productos.txt");
  const producto = await productos.getById(+random(1, 4));
  console.log(producto);
  res.status(200).json(producto);
});

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
