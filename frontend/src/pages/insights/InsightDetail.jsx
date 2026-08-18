import React from 'react';
import { useParams, Navigate, Link } from 'react-router';
import { insights } from '../../data/insights';
import SEO from '../../components/seo/SEO';
import ReactMarkdown from 'react-markdown';

export default function InsightDetail() {
  const { slug } = useParams();
  const insight = insights.find(i => i.slug === slug);

  if (!insight) {
    return <Navigate to="/insights" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pt-24 pb-12">
      <SEO 
        title={insight.title}
        description={insight.excerpt}
        canonical={`/insights/${insight.slug}`}
        ogImage={`https://mytenant.me${insight.image}`}
        ogType="article"
      />
      
      <div className="max-w-3xl mx-auto px-6">
        <Link to="/insights" className="inline-flex items-center text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-8 transition-colors">
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Insights
        </Link>
        
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
          
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            {insight.excerpt}
          </p>
        </header>

        {insight.image && (
          <div className="rounded-3xl overflow-hidden mb-12 shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
            <img 
              src={insight.image} 
              alt={insight.title} 
              className="w-full h-auto max-h-[500px] object-cover"
            />
          </div>
        )}

        <article className="prose prose-slate dark:prose-invert prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:text-blue-700">
          <ReactMarkdown>{insight.content}</ReactMarkdown>
        </article>
        
        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
              MT
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-white">{insight.author}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">MyTenant Operations & Research Team</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
