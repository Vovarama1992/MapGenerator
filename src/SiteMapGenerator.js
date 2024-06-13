const fs = require('fs');
const path = require('path');
const InvalidDataException = require('./exceptions/InvalidDataException');
const FileAccessException = require('./exceptions/FileAccessException');

class SitemapGenerator {
    constructor(basePath, fileType, filePath) {
        this.basePath = basePath;
        this.fileType = fileType;
        this.filePath = filePath;

        this.pages = this.getPages(this.basePath);
        this.validatePages(this.pages);

        this.generateSitemap();
    }

    getPages(dir, baseURL = '') {
        let pages = [];
        const files = fs.readdirSync(dir);

        files.forEach(file => {
            const fullPath = path.join(dir, file);
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                pages = pages.concat(this.getPages(fullPath, path.join(baseURL, file)));
            } else if (file.endsWith('.html')) {
                pages.push({
                    loc: path.join(baseURL, file).replace(/\\/g, '/'),
                    lastmod: stat.mtime.toISOString().split('T')[0],
                    changefreq: 'daily',
                    priority: '0.5'
                });
            }
        });

        return pages;
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
            try {
                fs.mkdirSync(directory, { recursive: true });
            } catch (error) {
                throw new FileAccessException(`Cannot create directory: ${directory}`);
            }
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