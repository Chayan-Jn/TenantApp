import { Link } from 'react-router'

export default function Breadcrumb({ crumbs }) {
  return (
    <nav className="flex items-center gap-1 text-sm mb-4">
      {crumbs.map((crumb, i) => {
        const isLast = i === crumbs.length - 1
        return (
          <span key={i} className="flex items-center gap-1">
            {i > 0 && <span className="text-gray-300">/</span>}
            {isLast ? (
              <span className="text-gray-500 font-medium">{crumb.label}</span>
            ) : (
              <Link
                to={crumb.to}
                className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
              >
                {crumb.label}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}