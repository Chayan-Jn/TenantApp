import React from 'react';
import { Link } from 'react-router';
import { insights } from '../../data/insights';
import SEO from '../../components/seo/SEO';

export default function Insights() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors pt-24 pb-12">
      <SEO 
        title="Landlord Insights & Real Estate Research"
        description="Daily insights, academic research, and operational strategies for independent landlords and property managers."
        keywords="Landlord Insights, Real Estate Economics, Property Management Strategy, Tenant Retention Research"
        canonical="/insights"
      />
      
      <div className="max-w-6xl mx-auto px-6">
        <div className="mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight">
            Landlord <span className="text-blue-600 dark:text-blue-500">Insights</span>
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl">
            Empirical research, behavioral economics, and operational strategies for modern property management.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {insights.map((insight) => (
            <Link 
              key={insight.id} 
              to={`/insights/${insight.slug}`}
              className="group flex flex-col bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-300"
            >
              {insight.image && (
                <div className="h-48 overflow-hidden bg-slate-100 dark:bg-slate-800 relative">
                  <img 
                    src={insight.image} 
                    alt={insight.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  <div className="absolute top-4 left-4 bg-white/90 dark:bg-slate-900/90 backdrop-blur text-xs font-bold px-3 py-1 rounded-full text-slate-900 dark:text-white">
                    {insight.category}
                  </div>
                </div>
              )}
              
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 mb-3 space-x-3">
                  <span>{insight.date}</span>
                  <span>•</span>
                  <span>{insight.readTime}</span>
                </div>
                
                <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                  {insight.title}
                </h2>
                
                <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-3 mb-4 flex-1">
                  {insight.excerpt}
                </p>
                
                <div className="flex items-center text-blue-600 dark:text-blue-500 font-semibold text-sm mt-auto">
                  Read Article 
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
