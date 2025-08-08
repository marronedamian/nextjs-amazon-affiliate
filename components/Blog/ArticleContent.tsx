// components/ArticleContent.tsx
"use client";

import { cn } from "@/lib/utils";

export default function ArticleContent({ html }: { html: string }) {
  return (
    <article className="max-w-3xl mx-auto px-4 py-4">
      <div
        className="rich-content space-y-8"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <style jsx global>{`
        .rich-content {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          line-height: 1.75;
          color: #e5e5e5;
        }
        
        /* Tipografía minimalista para modo oscuro */
        .rich-content h2 {
          font-size: 1.9rem;
          font-weight: 700;
          margin-top: 0rem;
          margin-bottom: 1.8rem;
          color: #ffffff;
          letter-spacing: -0.015em;
          position: relative;
          padding-bottom: 0.8rem;
          cursor: default;
        }
        
        .rich-content h2::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 3.5rem;
          height: 3px;
          background: linear-gradient(90deg, #10b981, #3b82f6);
          border-radius: 3px;
          transition: width 0.3s ease;
        }
        
        .rich-content h2:hover::after {
          width: 6rem;
        }
        
        .rich-content h3 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 2.8rem;
          margin-bottom: 1.5rem;
          color: #f0f0f0;
          position: relative;
          padding-left: 1.8rem;
          cursor: default;
          transition: color 0.2s ease;
        }
        
        .rich-content h3:hover {
          color: #ffffff;
        }
        
        .rich-content h3::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0.55em;
          height: 0.35em;
          width: 0.9em;
          background: #10b981;
          border-radius: 2px;
          transition: transform 0.3s ease;
        }
        
        .rich-content h3:hover::before {
          transform: translateX(0.3rem);
        }
        
        .rich-content p {
          margin-bottom: 1.7rem;
          font-size: 1.08rem;
          color: #d1d1d1;
          font-weight: 380;
          line-height: 1.85;
          cursor: default;
        }
        
        /* Listas mejoradas para modo oscuro */
        .rich-content ul, .rich-content ol {
          padding-left: 0;
          margin-bottom: 2.2rem;
        }
        
        .rich-content li {
          position: relative;
          padding-left: 1.7rem;
          margin-bottom: 1.4rem;
          list-style: none;
          line-height: 1.75;
          cursor: default;
        }
        
        .rich-content li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0.5em;
          width: 0.6rem;
          height: 0.6rem;
          border-radius: 50%;
          background: #10b981;
          transition: all 0.2s ease;
        }
        
        .rich-content li:hover::before {
          transform: scale(1.2);
          background: #3b82f6;
        }
        
        .rich-content li p {
          margin-bottom: 0.6rem;
        }
        
        /* Estilo para items con iconos */
        .rich-content li > p:first-child {
          display: flex;
          align-items: center;
          gap: 0.7rem;
          margin-bottom: 0.7rem;
          font-weight: 500;
          color: #f5f5f5;
          cursor: default;
        }
        
        .rich-content li > p:first-child strong {
          font-weight: 600;
        }
        
        .rich-content li > p:first-child span {
          font-size: 1.25rem;
          opacity: 0.85;
          transition: transform 0.3s ease;
        }
        
        .rich-content li:hover > p:first-child span {
          transform: rotate(5deg) scale(1.1);
        }
        
        /* Listas anidadas mejoradas */
        .rich-content li ul, .rich-content li ol {
          margin-top: 0.9rem;
          margin-bottom: 0;
          padding-left: 0rem;
        }
        
        .rich-content li li {
          padding-left: 2rem;
        }
        
        .rich-content li li::before {
          background: none;
          border: 2px solid #10b981;
          width: 0.45rem;
          height: 0.45rem;
          top: 0.6em;
          transition: all 0.2s ease;
        }
        
        .rich-content li li:hover::before {
          border-color: #3b82f6;
          transform: scale(1.2);
        }
        
        .rich-content li li li::before {
          border-style: dashed;
        }
        
        /* Bloques especiales */
        .rich-content blockquote {
          border-left: 3px solid #10b981;
          padding: 1.7rem 1.7rem 1.7rem 2.2rem;
          margin: 2.5rem 0;
          font-style: italic;
          color: #c5c5c5;
          background: rgba(16, 185, 129, 0.05);
          border-radius: 0 8px 8px 0;
          position: relative;
          cursor: default;
          transition: all 0.3s ease;
        }
        
        .rich-content blockquote:hover {
          background: rgba(16, 185, 129, 0.08);
          border-left-color: #3b82f6;
          transform: translateX(0.3rem);
        }
        
        .rich-content blockquote::before {
          content: '"';
          position: absolute;
          left: 0.8rem;
          top: 0.5rem;
          font-size: 3rem;
          color: rgba(16, 185, 129, 0.2);
          font-family: Georgia, serif;
        }
        
        /* Botones con micro-interacciones */
        .interactive-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          cursor: pointer;
          padding: 0.85rem 2rem;
          border-radius: 9999px;
          font-size: 1rem;
          font-weight: 600;
          transition: all 0.3s ease-in-out;
          background: rgba(16, 185, 129, 0.18);
          color: #a7f3d0 !important;
          border: 1px solid rgba(16, 185, 129, 0.3);
          backdrop-filter: blur(6px);
          text-decoration: none;
          margin: 1.2rem 0;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          position: relative;
          overflow: hidden;
        }
        
        .interactive-button:hover {
          background: rgba(16, 185, 129, 0.25);
          color: #ffffff !important;
          transform: scale(1.05);
          box-shadow: 0 6px 16px rgba(16, 185, 129, 0.25);
          border-color: rgba(16, 185, 129, 0.4);
        }
        
        .interactive-button:active {
          transform: scale(0.96);
        }
        
        .interactive-button::after {
          content: '';
          position: absolute;
          top: -50%;
          left: -60%;
          width: 1.5rem;
          height: 200%;
          background: rgba(255, 255, 255, 0.15);
          transform: rotate(30deg);
          transition: all 0.6s ease;
        }
        
        .interactive-button:hover::after {
          left: 120%;
        }
        
        /* Tarjetas de productos en modo oscuro */
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 1.8rem;
          margin: 3.5rem 0;
        }
        
        .product-card {
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 14px;
          padding: 2rem;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.1);
          background: rgba(20, 25, 35, 0.6);
          backdrop-filter: blur(12px);
          position: relative;
          overflow: hidden;
          cursor: pointer;
        }
        
        .product-card:hover {
          transform: translateY(-8px) scale(1.01);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
          border-color: rgba(16, 185, 129, 0.4);
          background: rgba(20, 30, 40, 0.7);
        }
        
        .product-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #10b981, transparent);
          opacity: 0.3;
          transition: opacity 0.3s ease;
        }
        
        .product-card:hover::before {
          opacity: 0.8;
        }
        
        .product-card h3 {
          font-size: 1.3rem;
          margin-top: 0;
          color: #ffffff;
          padding-left: 0;
          margin-bottom: 0.7rem;
          position: relative;
          z-index: 2;
        }
        
        .product-card h3::before {
          display: none;
        }
        
        .product-card .price {
          font-weight: 700;
          color: #10b981;
          font-size: 1.3rem;
          margin: 1rem 0;
          position: relative;
          z-index: 2;
          transition: color 0.3s ease;
        }
        
        .product-card:hover .price {
          color: #6ee7b7;
        }
        
        .product-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.8rem 1.7rem;
          border-radius: 9999px;
          font-weight: 500;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          text-decoration: none;
          background: rgba(16, 185, 129, 0.15);
          color: #a7f3d0 !important;
          border: 1px solid rgba(16, 185, 129, 0.25);
          font-size: 0.95rem;
          cursor: pointer;
          position: relative;
          z-index: 2;
          overflow: hidden;
        }
        
        .product-button:hover {
          background: rgba(16, 185, 129, 0.25);
          color: #ffffff !important;
          transform: scale(1.08);
          box-shadow: 0 5px 15px rgba(16, 185, 129, 0.2);
        }
        
        .product-button::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(120deg, 
            rgba(255,255,255,0) 0%, 
            rgba(255,255,255,0.1) 50%, 
            rgba(255,255,255,0) 100%);
          transform: translateX(-100%);
          transition: transform 0.6s ease;
        }
        
        .product-button:hover::after {
          transform: translateX(100%);
        }
        
        /* FAQ con micro-interacciones */
        .faq-item {
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          padding: 2rem 0;
          transition: border-color 0.3s ease;
          cursor: pointer;
        }
        
        .faq-item:hover {
          border-bottom-color: rgba(16, 185, 129, 0.4);
        }
        
        .faq-question {
          font-weight: 600;
          display: flex;
          align-items: center;
          margin-bottom: 1rem;
          color: #f0f0f0;
          font-size: 1.15rem;
          transition: color 0.2s ease;
        }
        
        .faq-item:hover .faq-question {
          color: #ffffff;
        }
        
        .faq-question::before {
          content: '❓';
          margin-right: 0.9rem;
          font-size: 1.2rem;
          opacity: 0.8;
          transition: transform 0.3s ease;
        }
        
        .faq-item:hover .faq-question::before {
          transform: rotate(10deg) scale(1.1);
        }
        
        .faq-answer {
          color: #c5c5c5;
          padding-left: 2.5rem;
          line-height: 1.75;
          transition: color 0.3s ease;
        }
        
        .faq-item:hover .faq-answer {
          color: #e0e0e0;
        }
        
        /* Estilo minimalista para listas con iconos */
        .feature-list {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          padding-left: 0;
          margin: 2.5rem 0;
        }
        
        .feature-list > li {
          list-style: none;
          background: rgba(25, 25, 35, 0.4);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          padding: 1.5rem;
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.1);
          backdrop-filter: blur(6px);
          position: relative;
          overflow: hidden;
          cursor: default;
        }
        
        .feature-list > li:hover {
          transform: translateY(-4px);
          border-color: rgba(16, 185, 129, 0.2);
          background: rgba(30, 30, 40, 0.5);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
        }
        
        .feature-list > li::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, #10b981, transparent);
          opacity: 0.3;
        }
        
        .feature-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        
        .feature-icon {
          font-size: 1.4rem;
          width: 2.5rem;
          height: 2.5rem;
          border-radius: 50%;
          background: rgba(16, 185, 129, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.3s ease;
        }
        
        .feature-list > li:hover .feature-icon {
          transform: scale(1.05);
          background: rgba(16, 185, 129, 0.2);
        }
        
        .feature-title {
          font-size: 1.2rem;
          font-weight: 600;
          color: #ffffff;
          margin: 0;
        }
        
        .feature-content {
          padding-left: 3.5rem;
          margin-top: 0.5rem;
        }
        
        .feature-content ul {
          padding-left: 0;
          margin: 0;
        }
        
        .feature-content li {
          list-style: none;
          position: relative;
          padding-left: 1.3rem;
          margin-bottom: 0.6rem;
          color: #d1d1d1;
          font-size: 1.03rem;
          line-height: 1.6;
          font-weight: 350;
        }
        
        .feature-content li::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0.65em;
          width: 0.4rem;
          height: 0.4rem;
          border-radius: 50%;
          background: rgba(16, 185, 129, 0.6);
          transition: transform 0.2s ease;
        }
        
        .feature-content li:hover::before {
          transform: scale(1.3);
        }
        
        .feature-content li:last-child {
          margin-bottom: 0;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .rich-content {
            font-size: 1.05rem;
          }
          
          .rich-content h2 {
            font-size: 1.75rem;
          }
          
          .rich-content h3 {
            font-size: 1.35rem;
            padding-left: 1.5rem;
          }
          
          .rich-content h3::before {
            width: 0.8em;
          }
          
          .product-grid {
            grid-template-columns: 1fr;
          }
          
          .rich-content li {
            padding-left: 2.2rem;
          }
          
          .interactive-button {
            padding: 0.8rem 1.6rem;
            font-size: 0.95rem;
          }
          
          .feature-list {
            grid-template-columns: 1fr;
            gap: 1.2rem;
          }
          
          .feature-header {
            gap: 0.8rem;
          }
          
          .feature-icon {
            width: 2.3rem;
            height: 2.3rem;
            font-size: 1.2rem;
          }
          
          .feature-content {
            padding-left: 3.3rem;
          }
        }
        
        @media (max-width: 480px) {
          .rich-content h2 {
            font-size: 1.65rem;
          }
          
          .rich-content h3 {
            font-size: 1.25rem;
          }
          
          .feature-title {
            font-size: 1.15rem;
          }
        }
      `}</style>
    </article>
  );
}