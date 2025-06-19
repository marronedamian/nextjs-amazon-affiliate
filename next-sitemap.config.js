/** @type {import('next-sitemap').IConfig} */

module.exports = {
    siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://bestpickr.store',
    generateRobotsTxt: true,
    sitemapSize: 5000,
    exclude: [],
    robotsTxtOptions: {
      policies: [{ userAgent: '*', allow: '/' }]
    }
  };