const SitemapGenerator = require('sitemap-generator-custom-volodzya');
const InvalidDataException = require('sitemap-generator-custom-volodzya/src/exceptions/InvalidDataException');
const FileAccessException = require('sitemap-generator-custom-volodzya/src/exceptions/FileAccessException');

const pages = [
    {
        loc: 'https://example.com/',
        lastmod: '2023-06-13',
        changefreq: 'daily',
        priority: '1.0'
    },
    {
        loc: 'https://example.com/about',
        lastmod: '2023-06-12',
        changefreq: 'monthly',
        priority: '0.8'
    }
];

const fileType = 'xml'; // можно использовать 'csv' или 'json'
const filePath = './sitemap.xml'; // обновите путь в зависимости от вашей структуры

try {
    new SitemapGenerator(pages, fileType, filePath);
    console.log("Sitemap generated successfully.");
} catch (error) {
    if (error instanceof InvalidDataException || error instanceof FileAccessException) {
        console.error("Error:", error.message);
    } else {
        console.error("An unexpected error occurred:", error.message);
    }
}