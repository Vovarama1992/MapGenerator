const SitemapGenerator = require('../src/SitemapGenerator');
const InvalidDataException = require('../src/exceptions/InvalidDataException');
const FileAccessException = require('../src/exceptions/FileAccessException');

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

const fileType = 'xml'; 
const filePath = '/var/www/site.ru/upload/sitemap.xml';

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