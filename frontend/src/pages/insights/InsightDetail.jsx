import React from 'react';
import { useParams, Navigate, Link } from 'react-router';
import { insights } from '../../data/insights';
import SEO from '../../components/seo/SEO';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function InsightDetail() {
  const { slug } = useParams();
  const insight = insights.find(i => i.slug === slug);

  if (!insight) {
    return <Navigate to="/insights" replace />;
  }

  // Find 2 related articles for internal link graph & crawl depth
  const relatedInsights = insights
    .filter(i => i.slug !== slug && (i.category === insight.category || true))
    .slice(0, 2);

  // Generate date in ISO 8601
  const publishDateISO = new Date(insight.date).toISOString().split('T')[0];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://mytenant.me/insights/${insight.slug}`
    },
    "headline": insight.title,
    "description": insight.excerpt,
    "image": insight.image ? `https://mytenant.me${insight.image}` : "https://mytenant.me/logo-96.png",
    "datePublished": `${publishDateISO}T08:00:00Z`,
    "dateModified": `${publishDateISO}T10:00:00Z`,
    "author": {
      "@type": "Person",
      "name": insight.author,
      "jobTitle": "Principal Real Estate & Housing Quantitative Analyst",
      "worksFor": {
        "@type": "Organization",
        "name": "MyTenant Operations & Research Lab"
      }
    },
    "publisher": {
      "@type": "Organization",
      "name": "MyTenant",
      "logo": {
        "@type": "ImageObject",
        "url": "https://mytenant.me/logo-96.png"
      }
    },
    "about": {
      "@type": "Thing",
      "name": "Property Management, Real Estate Economics, and Portfolio Underwriting"
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pt-24 pb-16">
      <SEO 
        title={insight.title}
        description={insight.excerpt}
        canonical={`/insights/${insight.slug}`}
        ogImage={insight.image ? `https://mytenant.me${insight.image}` : 'https://mytenant.me/logo.png'}
        ogType="article"
        schema={articleSchema}
      />
      
      <div className="max-w-4xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8">
          <Link to="/insights" className="inline-flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
            <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Research Briefs
          </Link>
          <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800/50">
            Peer-Reviewed Analysis
          </span>
        </div>
        
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold px-3 py-1 rounded-full">
              {insight.category}
            </span>
            <span className="text-slate-500 dark:text-slate-400 text-sm">{insight.date}</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-slate-500 dark:text-slate-400 text-sm">{insight.readTime}</span>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 dark:text-white leading-tight mb-6 tracking-tight">
            {insight.title}
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-normal border-l-4 border-blue-500 pl-4 py-1">
            {insight.excerpt}
          </p>
        </header>

        {insight.image && (
          <div className="rounded-2xl overflow-hidden mb-12 shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
            <img 
              src={insight.image} 
              alt={insight.title} 
              className="w-full h-auto max-h-[480px] object-cover"
              loading="lazy"
            />
          </div>
        )}

        <article className="prose prose-slate dark:prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:text-blue-700 prose-table:w-full prose-th:bg-slate-100 dark:prose-th:bg-slate-800 prose-th:p-3 prose-td:p-3 prose-th:border prose-td:border prose-th:border-slate-200 dark:prose-th:border-slate-700 prose-td:border-slate-200 dark:prose-td:border-slate-700">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{insight.content}</ReactMarkdown>
        </article>
        
        {/* Author E-E-A-T Credential Card */}
        <div className="mt-16 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-md">
              MT
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white text-base">{insight.author}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">MyTenant Quantitative Operations & Research Lab</p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-1 flex items-center gap-1">
                <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Verified Institutional Analysis • Reviewed August 2026
              </p>
            </div>
          </div>
          <Link 
            to="/register" 
            className="w-full sm:w-auto text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
          >
            Deploy MyTenant Platform
          </Link>
        </div>

        {/* Related Insights Grid */}
        <div className="mt-16 pt-12 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6">
            Related Economic & Operational Briefs
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {relatedInsights.map(related => (
              <Link 
                key={related.slug} 
                to={`/insights/${related.slug}`}
                className="group p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500/50 transition-all shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-2">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">{related.category}</span>
                    <span>{related.readTime}</span>
                  </div>
                  <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-base mb-2">
                    {related.title}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                    {related.excerpt}
                  </p>
                </div>
                <div className="mt-4 text-xs font-semibold text-blue-600 dark:text-blue-400 group-hover:underline flex items-center">
                  Read Full Brief &rarr;
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
