import { Request, Response } from "express";
import Producer from "../models/ProducerModel";
import Product from "../models/ProductModel";

// V1 Functions (from dev branch - no authentication)
export const createProduct = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const productData = req.body;
  try {
    const newProduct = await new Product(productData).save();
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

// V2 Function (with authentication and producer logic)
export const createProductV2 = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const productData = req.body;
    const currentUserUid = req.body.decodedToken.uid;

    const producer = await Producer.findOne({ uid: currentUserUid });
    if (!producer) {
      res.status(404).json({
        success: false,
        message: "Producer not found",
      });
      return;
    }

    productData.producer = producer._id;

    const newProduct = await new Product(productData).save();

    await Producer.findByIdAndUpdate(
      producer._id,
      { $push: { products: newProduct._id } },
      { new: true },
    );

    res.status(201).json({
      success: true,
      data: newProduct,
      message: "Product created successfully",
    });
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
  const query = req.query;

  if (Object.keys(query).length > 0) {
    searchProducts(req, res);
    return;
  }

  try {
    const products = await Product.find().populate("producer", "_id name");

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

// V1 Delete (from dev branch)
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

// V2 Delete (with authentication)
export const deleteProductV2 = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const productId = req.params.id;
    const currentUserUid = req.body.decodedToken.uid;

    const product = await Product.findById(productId).populate("producer");
    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
      return;
    }

    if ((product.producer as any).uid !== currentUserUid) {
      res.status(403).json({
        success: false,
        message: "You can only delete your own products",
      });
      return;
    }

    await Producer.findByIdAndUpdate(
      product.producer._id,
      { $pull: { products: productId } },
      { new: true },
    );

    const deletedProduct = await Product.findByIdAndDelete(productId);

    res.status(200).json({
      success: true,
      data: deletedProduct,
      message: "Product deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete product",
    });
  }
};

// V1 Update (from dev branch)
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

// V2 Complete Update (with authentication)
export const completeUpdateProductV2 = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const productId = req.params.id;
    const currentUserUid = req.body.decodedToken.uid;

    const product = await Product.findById(productId).populate("producer");
    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
      return;
    }

    if ((product.producer as any).uid !== currentUserUid) {
      res.status(403).json({
        success: false,
        message: "You can only update your own products",
      });
      return;
    }

    const productData = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      productData,
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      success: true,
      data: updatedProduct,
      message: "Product updated successfully",
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update product",
    });
  }
};

// V1 Partial Update (from dev branch)
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

// V2 Partial Update (with authentication)
export const partialUpdateProductV2 = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const productId = req.params.id;
    const currentUserUid = req.body.decodedToken.uid;

    const product = await Product.findById(productId).populate("producer");
    if (!product) {
      res.status(404).json({
        success: false,
        message: "Product not found",
      });
      return;
    }

    if ((product.producer as any).uid !== currentUserUid) {
      res.status(403).json({
        success: false,
        message: "You can only update your own products",
      });
      return;
    }

    const productData = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      productData,
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      success: true,
      data: updatedProduct,
      message: "Product partially updated successfully",
    });
  } catch (error) {
    console.error("Error partially updating:", error);
    res.status(500).json({
      success: false,
      message: "Failed to partially update",
    });
  }
};

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
      // page = 1,
      // limit = 9,
    } = req.query;

    console.log("Query parameters:", req.query);

    const query: any = {};

    if (name) {
      query.name = { $regex: new RegExp(name as string, "i") };
    }

    if (category) {
      query.category = { $regex: new RegExp(category as string, "i") };
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
      const [field, order] = String(sort).split(":");
      sortOption[field] = order === "desc" ? -1 : 1;
    }

    if (producer) {
      query.producer = producer;
    }

    const products = await Product.find(query)
      .sort(sortOption)
      .populate("producer", "_id name");
    // .skip((parseInt(page as string) - 1) * parseInt(limit as string))
    // .limit(parseInt(limit as string));

    if (!products || products.length === 0) {
      res.status(200).json({
        success: true,
        data: [],
        total: 0,
        message: "No products found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: products,
      total: products.length,
      message: "Products retrieved successfully",
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
