const fs = require("fs");

module.exports = class Contenedor {
  constructor(file) {
    this.file = file;
    this.path = `./${this.file}`;
  }
  async save(object) {
    let completeObj;
    try {
      if (await fs.existsSync(this.path)) {
        completeObj = await fs.readFileSync(this.path, "utf-8");
        completeObj = JSON.parse(completeObj);

        // Se toma encuenta el ultimo objeto para geenrar el id y que no se repetitan.
        const id =
          completeObj.length === 0
            ? 1
            : completeObj[completeObj.length - 1].id + 1;

        const objToSave = {
          id,
          ...object,
        };

        completeObj.push(objToSave);

        await fs.writeFileSync(this.path, JSON.stringify(completeObj, null, 2));
        return objToSave.id;
      } else {
        const objToSave = { id: 1, ...object };
        await fs.appendFileSync(
          this.path,
          JSON.stringify([objToSave], null, 2)
        );
        return objToSave.id;
      }
    } catch (error) {
      throw error;
    }
  }
  async getById(id) {
    try {
      if (await fs.existsSync(this.path)) {
        const objects = await fs.readFileSync(this.path, "utf-8");
        const objectsParse = JSON.parse(objects);
        return objectsParse.find((o) => o.id === id) || null;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  }
  async getAll() {
    try {
      if (await fs.existsSync(this.path)) {
        const objects = await fs.readFileSync(this.path, "utf-8");
        const objectsParse = JSON.parse(objects);
        return objectsParse;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  }
  async deleteById(id) {
    let completeObj;
    try {
      if (await fs.existsSync(this.path)) {
        completeObj = await fs.readFileSync(this.path, "utf-8");
        completeObj = JSON.parse(completeObj);
        completeObj = completeObj.filter((o) => +o.id !== +id);

        await fs.writeFileSync(this.path, JSON.stringify(completeObj, null, 2));
      }
    } catch (error) {
      throw error;
    }
  }
  async deleteAll() {
    try {
      if (await fs.existsSync(this.path)) {
        await fs.writeFileSync(this.path, JSON.stringify([], null, 2));
      }
    } catch (error) {
      throw error;
    }
  }
};
