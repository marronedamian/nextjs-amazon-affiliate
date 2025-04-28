/** @type {import('next-sitemap').IConfig} */

module.exports = {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
    generateRobotsTxt: true,
    sitemapSize: 5000,
    exclude: [],
    robotsTxtOptions: {
      policies: [{ userAgent: '*', allow: '/' }]
    }
  };