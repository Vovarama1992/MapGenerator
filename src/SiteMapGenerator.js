const fs = require('fs');
const path = require('path');
const InvalidDataException = require('./exceptions/InvalidDataException');
const FileAccessException = require('./exceptions/FileAccessException');

class SitemapGenerator {
    constructor(pages, fileType, filePath) {
        this.validatePages(pages);
        this.pages = pages;
        this.fileType = fileType;
        this.filePath = filePath;

        this.generateSitemap();
    }

    validatePages(pages) {
        for (const page of pages) {
            if (!page.loc || !page.lastmod || !page.priority || !page.changefreq) {
                throw new InvalidDataException(`Invalid page data: ${JSON.stringify(page)}`);
            }
        }
    }

    generateSitemap() {
        const directory = path.dirname(this.filePath);

        if (!fs.existsSync(directory)) {
            fs.mkdirSync(directory, { recursive: true });
        }

        switch (this.fileType) {
            case 'xml':
                this.generateXmlSitemap();
                break;
            case 'csv':
                this.generateCsvSitemap();
                break;
            case 'json':
                this.generateJsonSitemap();
                break;
            default:
                throw new InvalidDataException(`Unsupported file type: ${this.fileType}`);
        }
    }

    generateXmlSitemap() {
        const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n';
        const urlsetOpen = '<urlset xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">\n';
        const urlsetClose = '</urlset>';

        let urls = '';
        for (const page of this.pages) {
            urls += `<url>\n<loc>${page.loc}</loc>\n<lastmod>${page.lastmod}</lastmod>\n<priority>${page.priority}</priority>\n<changefreq>${page.changefreq}</changefreq>\n</url>\n`;
        }

        const xmlContent = xmlHeader + urlsetOpen + urls + urlsetClose;

        fs.writeFileSync(this.filePath, xmlContent);
    }

    generateCsvSitemap() {
        const header = 'loc;lastmod;priority;changefreq\n';
        let csvContent = header;

        for (const page of this.pages) {
            csvContent += `${page.loc};${page.lastmod};${page.priority};${page.changefreq}\n`;
        }

        fs.writeFileSync(this.filePath, csvContent);
    }

    generateJsonSitemap() {
        const jsonContent = JSON.stringify(this.pages, null, 2);

        fs.writeFileSync(this.filePath, jsonContent);
    }
}

module.exports = SitemapGenerator;
