const fs = require("fs");

module.exports = class Contenedor {
  constructor(file) {
    this.file = file;
  }

  async exists(path) {
    try {
      await fs.promises.access(path);
      return true;
    } catch (error) {
      return false;
    }
  }

  async save(object) {
    let completeObj;
    try {
      if (await this.exists(this.file)) {
        completeObj = await fs.promises.readFile(this.file, "utf-8");
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

        await fs.promises.writeFile(
          this.file,
          JSON.stringify(completeObj, null, 2)
        );
        return objToSave.id;
      } else {
        const objToSave = { id: 1, ...object };
        await fs.promises.appendFile(
          this.file,
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
      if (await this.exists(this.file)) {
        const objects = await fs.promises.readFile(this.file, "utf-8");
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
      if (await this.exists(this.file)) {
        const objects = await fs.promises.readFile(this.file, "utf-8");
        const objectsParse = JSON.parse(objects);
        return objectsParse;
      } else {
        return [];
      }
    } catch (error) {
      throw error;
    }
  }
  async deleteById(id) {
    let completeObj;
    try {
      if (await this.exists(this.file)) {
        completeObj = await fs.promises.readFile(this.file, "utf-8");
        completeObj = JSON.parse(completeObj);
        completeObj = completeObj.filter((o) => +o.id !== +id);

        await fs.promises.writeFile(
          this.file,
          JSON.stringify(completeObj, null, 2)
        );
      }
    } catch (error) {
      throw error;
    }
  }
  async deleteAll() {
    try {
      if (await this.exists(this.file)) {
        await fs.promises.writeFile(this.file, JSON.stringify([], null, 2));
      }
    } catch (error) {
      throw error;
    }
  }
};
