const sequelize = require('./config/database');
const axios = require('axios');
const cheerio = require('cheerio');
const { Sequelize, DataTypes } = require('sequelize');
const translate = require('@vitalets/google-translate-api');

// Définition du modèle Product
const Product = sequelize.define('Product', {
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    content: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    page: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    parent_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    position: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    timestamps: false,
});

// Fonction pour traduire le texte en français
const translateText = async (text) => {
    try {
        const res = await translate(text, { to: 'fr' });
        return res.text;
    } catch (error) {
        console.error('Erreur de traduction:', error);
        return text; // Retourne le texte original en cas d'erreur
    }
};

const extractProductData = async (url, page, parent_id = null, position = 'main') => {
    try {
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const title = await translateText($('h1').text().trim());
        const content = await translateText($('div.product-description').text().trim() || $('div.entry-content').text().trim());
        const image = $('img.product-image').attr('src') || $('div.entry-content img').attr('src');

        return { title, content, image, page, parent_id, position };
    } catch (error) {
        console.error(`Erreur lors de l'extraction des données de ${url}:`, error);
        return null;
    }
};

const insertProductData = async (productData) => {
    try {
        await Product.create(productData);
        console.log(`Produit ${productData.title} inséré avec succès.`);
    } catch (error) {
        console.error('Erreur lors de l\'insertion des données du produit:', error);
    }
};

const main = async () => {
    await sequelize.authenticate();
    await sequelize.sync({ force: true }); // Synchroniser la base de données

    const urls = [
        // Liste des URLs des pages produits avec les catégories respectives
        { url: 'https://www.soaptec.biz/en/saponification/', page: 'saponification', position: 'main' },
        { url: 'https://www.soaptec.biz/en/saponification/crutcher/', page: 'saponification', position: 'sub' },
        { url: 'https://www.soaptec.biz/en/saponification/reactor-column/', page: 'saponification', position: 'sub' },
        { url: 'https://www.soaptec.biz/en/saponification/saponification-reactor/', page: 'saponification', position: 'sub' },
        { url: 'https://www.soaptec.biz/en/saponification/washing-column/', page: 'saponification', position: 'sub' },

        { url: 'https://www.soaptec.biz/en/dryer/', page: 'dryer', position: 'main' },
        { url: 'https://www.soaptec.biz/en/dryer/heat-exchanger/', page: 'dryer', position: 'sub' },
        { url: 'https://www.soaptec.biz/en/dryer/atomizers/', page: 'dryer', position: 'sub' },
        { url: 'https://www.soaptec.biz/en/dryer/soap-vapour-separator/', page: 'dryer', position: 'sub' },
        { url: 'https://www.soaptec.biz/en/dryer/fines-separators/', page: 'dryer', position: 'sub' },
        { url: 'https://www.soaptec.biz/en/dryer/fines-extruders/', page: 'dryer', position: 'sub' },
        { url: 'https://www.soaptec.biz/en/dryer/vacuum-system/', page: 'dryer', position: 'sub' },
        { url: 'https://www.soaptec.biz/en/dryer/cylinder-coolers/', page: 'dryer', position: 'sub' },

        { url: 'https://www.soaptec.biz/en/finishing-lines/', page: 'finishing-line', position: 'main' },
        { url: 'https://www.soaptec.biz/en/finishing-lines/mixers/', page: 'finishing-line', position: 'sub' },
        { url: 'https://www.soaptec.biz/en/finishing-lines/refiners/', page: 'finishing-line', position: 'sub' },
        { url: 'https://www.soaptec.biz/en/finishing-lines/roll-mills/', page: 'finishing-line', position: 'sub' },
        { url: 'https://www.soaptec.biz/en/finishing-lines/duplex-vacuum-plodder/', page: 'finishing-line', position: 'sub' },
        { url: 'https://www.soaptec.biz/en/finishing-lines/cutters/', page: 'finishing-line', position: 'sub' },
        { url: 'https://www.soaptec.biz/en/finishing-lines/stampers/', page: 'finishing-line', position: 'sub' },
        { url: 'https://www.soaptec.biz/en/finishing-lines/artisan-series/', page: 'finishing-line', position: 'sub' },
        { url: 'https://www.soaptec.biz/en/finishing-lines/flow-packs/', page: 'finishing-line', position: 'sub' },
        { url: 'https://www.soaptec.biz/en/finishing-lines/pilot-finishing-line/', page: 'finishing-line', position: 'sub' },
        { url: 'https://www.soaptec.biz/en/finishing-lines/marble-and-striped-soap/', page: 'finishing-line', position: 'sub' },

        { url: 'https://www.soaptec.biz/en/pneumatic-transport/', page: 'pneumatic-transport', position: 'main' },

        { url: 'https://www.soaptec.biz/en/liquid-detergent/', page: 'detergent', position: 'main' },
        { url: 'https://www.soaptec.biz/en/powder-detergent/', page: 'detergent', position: 'main' },
    ];

    for (const { url, page, position } of urls) {
        const productData = await extractProductData(url, page, null, position);
        if (productData) {
            await insertProductData(productData);
        }
    }

    sequelize.close();
};

main();
