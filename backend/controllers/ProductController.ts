import { Request, Response } from "express";

import Product from "../models/ProductModel";

export const createProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const productData = req.body;
  try {
    const newProduct = new Product(productData).save();
    res.status(201).json({
      success: true,
      data: newProduct,
      message: "Product created successfully",
    });
    return;
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create product",
    });
  }
};

export const readProducts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const products = await Product.find();
    res.status(200).json({
      success: true,
      data: products,
      message: "Products retrieved successfully",
    });
    return;
  } catch (error) {
    console.error("Error retrieving products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve products",
    });
    return;
  }
};

export const readProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!productId) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: product,
      message: "Product retrieved successfully",
    });
    return;
  } catch (error) {
    console.error("Error retrieving product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve product",
    });
    return;
  }
};

export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const productId = req.params.id;
    const product = await Product.findByIdAndDelete(productId);
    if(!product) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: product,
      message: "Product deleted successfully",
    });
    return;
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
    return;
  }
};
    
