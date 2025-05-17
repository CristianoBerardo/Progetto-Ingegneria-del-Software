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

export const readProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const productId = req.params.id;
    const product = await Product.findById(productId);
    if (!product) {
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

export const deleteProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const productId = req.params.id;
    const product = await Product.findByIdAndDelete(productId);
    if (!product) {
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

export const completeUpdateProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const productId = req.params.id;
    const productData = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      productData,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updatedProduct) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: updatedProduct,
      message: "Product updated successfully",
    });

    return;
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update product",
    });
    return;
  }
};
export const partialUpdateProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const productId = req.params.id;
    const productData = req.body;

    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      productData,
      {
        new: true,
        runValidators: true,
      },
    );
    if (!updatedProduct) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
      return;
    }
    res.status(200).json({
      success: true,
      data: updatedProduct,
      message: "Product partially updated successfully",
    });
    return;
  } catch (error) {
    console.error("Error partially updating :", error);
    res.status(500).json({
      success: false,
      message: "Failed to partially update ",
    });
    return;
  }
};

//* ------------------ SEARCH ------------------ *//

export const searchProducts = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const {
      name,
      category,
      minPrice,
      maxPrice,
      producer,
      sort = "name:asc",
      page = 1,
      limit = 10,
    } = req.query;

    console.log("Query parameters:", req.query);

    const query: any = {};

    if (name) {
      query.name = { $regex: new RegExp(name as string, "i") }; // Case-insensitive search
    }

    if (category) {
      query.category = { $regex: new RegExp(category as string, "i") }; // Case-insensitive search
    }

    if (minPrice) {
      query.price = {
        ...query.price,
        $gte: parseFloat(minPrice as string),
      };
    }

    if (maxPrice) {
      query.price = {
        ...query.price,
        $lte: parseFloat(maxPrice as string),
      };
    }

    const sortOption: any = {};
    if (sort) {
      //MongoDB conventions --> 1 for ascending, -1 for descending
      const [field, order] = String(sort).split(":");
      sortOption[field] = order === "desc" ? -1 : 1;
    }

    if (producer) {
      query.producer = producer;
    }

    const products = await Product.find(query)
      .sort(sortOption)
      .populate("producer")
      .skip((parseInt(page as string) - 1) * parseInt(limit as string))
      .limit(parseInt(limit as string));

    // const totalProducts = await Product.countDocuments(query);

    if (!products || products.length === 0) {
      res.status(404).json({
        success: false,
        message: "No products found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: products,
      message: "Products retrieved successfully",
      // totalProducts,
      // totalPages: Math.ceil(totalProducts / parseInt(limit as string)),
      // currentPage: parseInt(page as string),
    });
  } catch (error) {
    console.error("Error searching products:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search products",
    });
    return;
  }
};
