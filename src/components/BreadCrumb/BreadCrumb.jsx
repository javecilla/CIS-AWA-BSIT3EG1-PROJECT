import React from 'react'
import { useLocation, Link } from 'react-router-dom'
import './BreadCrumb.css'

function formatLabel(segment) {
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export default function BreadCrumb() {
  const { pathname } = useLocation()
  let segments = pathname.split('/').filter(Boolean)

  const ignoredSegments = ['p']
  segments = segments.filter((seg) => !ignoredSegments.includes(seg))

  console.log('Breadcrumb segments:', segments)

  return (
    <nav className="breadcrumb" aria-label="breadcrumb">
      <ul>
        {/* hide this dashboard breadcrumb if page is dashboard */}
        {segments[0] !== 'dashboard' && (
          <li className="breadcrumb-item">
            <Link to="/">Dashboard</Link>
            <span className="slash"> </span>
          </li>
        )}

        {segments.map((segment, index) => {
          const isLast = index === segments.length - 1
          const label = formatLabel(segment)

          return (
            <li
              key={index}
              className={`breadcrumb-item ${isLast ? 'active' : ''}`}
            >
              {isLast ? (
                <>
                  {label}
                  <span className="slash"> </span>
                </>
              ) : (
                <>
                  <Link to={`/${segment}`}>{label}</Link>
                  <span className="slash"> </span>
                </>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
