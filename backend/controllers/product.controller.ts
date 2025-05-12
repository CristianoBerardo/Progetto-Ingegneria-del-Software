import { Request, Response } from 'express';
import Product from '../models/product.model';

// Crea prodotto
export const createProduct = async (req: Request, res: Response) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
};

// Leggi tutti i prodotti
export const getProducts = async (_: Request, res: Response) => {
  const products = await Product.find();
  res.json(products);
};

// Leggi singolo prodotto
export const getProduct = async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Prodotto non trovato' });
  res.json(product);
};

// Aggiorna prodotto
export const updateProduct = async (req: Request, res: Response) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!product) return res.status(404).json({ message: 'Prodotto non trovato' });
  res.json(product);
};

// Elimina prodotto
export const deleteProduct = async (req: Request, res: Response) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product) return res.status(404).json({ message: 'Prodotto non trovato' });
  res.status(204).send();
};
