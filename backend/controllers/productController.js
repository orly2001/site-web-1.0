const Product = require('../models/Product');

const getProductsByCategory = async (req, res) => {
    /* const { category } = req.params;
    if (!category) {
        return res.status(400).json({ error: 'Category is required' });
    } */
    try {
        const products = await Product.findAll();
        res.render('products', { title: `Produits - Pages`, products });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getProductById = async (req, res) => {
    const { category, id } = req.params;
    if (!category || !id) {
        return res.status(400).json({ error: 'Category and ID are required' });
    }
    try {
        const product = await Product.findByPk(id);
        if (product && product.page === category) {
            res.render('product-detail', { title: product.title, product });
        } else {
            res.status(404).send('Produit non trouvé');
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const addProduct = async (req, res) => {
    const { title, content, image, page, parent_id, position } = req.body;
    try {
        await Product.create({ title, content, image, page, parent_id, position });
        res.redirect(`/admin/products/${page}`);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const editProduct = async (req, res) => {
    const { id, title, content, image, page, parent_id, position } = req.body;
    try {
        const product = await Product.findByPk(id);
        if (product) {
            product.title = title;
            product.content = content;
            product.image = image;
            product.page = page;
            product.parent_id = parent_id;
            product.position = position;
            await product.save();
            res.redirect(`/admin/products/${page}`);
        } else {
            res.status(404).send('Produit non trouvé');
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteProduct = async (req, res) => {
    const { id, page } = req.body;
    try {
        const product = await Product.findByPk(id);
        if (product) {
            await product.destroy();
            res.redirect(`/admin/products/${page}`);
        } else {
            res.status(404).send('Produit non trouvé');
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getHeaderData = async (req, res, next) => {
    try {
        const products = await Product.findAll();
        const categories = products.reduce((acc, product) => {
            const { page } = product;
            if (!acc[page]) {
                acc[page] = {
                    name: page,
                    products: []
                };
            }
            acc[page].products.push(product);
            return acc;
        }, {});
        res.locals.productsCategories = Object.values(categories);
        next();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getProductsByCategory,
    getProductById,
    addProduct,
    editProduct,
    deleteProduct,
    getHeaderData,
};
