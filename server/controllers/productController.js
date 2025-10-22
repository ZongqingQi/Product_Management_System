import mongoose from 'mongoose';
import Product from '../models/Product.js'

// GET /api/products -- get all products
export const getAllProducts = async (req, res) => {
  try {
    // 获取分页参数
    const page = parseInt(req.query.page) || 1;        //  从URL参数获取页码(比如 /api/products?page=2), 当前第几页，默认第1页
    const limit = parseInt(req.query.limit) || 10;     // 每页显示几条，默认10条
    const skip = (page - 1) * limit;                   // 计算跳过多少条数据

    const { search } = req.query;
    let query = {};

    if (search) {    //如果找到了search
      query = {     //修改query对象
        $or: [                           //$or - 或操作符，满足任一条件即可(MongoDB的语法)
          { name: new RegExp(search, "i") },   //new RegExp(search, "i") - 创建正则表达式, "i" - 不区分大小写（case-insensitive）
          { description: new RegExp(search, "i") },
        ],
      };
    }

    // 获取总数据量
    const total = await Product.countDocuments(query);

    const products = await Product.find(query)
     .skip(skip)      // 跳过前面的数据
     .limit(limit);   // 只取 limit 条数据;     MongoDB的分页方法

    res.status(200).json({
      products,                          // 产品数据
      currentPage: page,                 // 当前页码
      totalPages: Math.ceil(total / limit),  // 总页数,  向上取整
      totalProducts: total               // 总产品数
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

// POST /api/products -- add a new product
export const createProduct = async (req, res) => {
    try {
        const newProduct = new Product(req.body);
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

};

// GET /api/products/:id -- get a specific product
export const getProductById = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
    }

    try {
        const product = await Product.findById(id);
        if (!product) return res.status(404).json({ error: "Product not found" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// PUT /api/products/:id -- update a specific product
export const updateProductById = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
    }

    try {
        const updated = await Product.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updated) return res.status(404).json({ error: "Product not found" });
        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// DELETE /api/products/:id -- delete a specific product
export const deleteProductById = async (req, res) => {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid product ID" });
    }

    try {
        const deleted = await Product.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ error: "Product not found" });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};