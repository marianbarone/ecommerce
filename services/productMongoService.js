// import { promises as fs } from "fs";
// import config from "./config.js";
import mongoose from "mongoose";
// import { ProductDao } from "../daos/index.js";
import Product from '../models/product.js';

class productMongoService {
  constructor(collection) {
    this.collection = mongoose.model(collection);
  }

  async getAll() {
    try {
      console.log('entre al try del getAll products')
      const products = await Product.find();
      return { products };
    } catch (error) {
      console.log("error al obtener productos", error);
    }
  }
}

export default productMongoService;
