import { useLocation, Link } from 'react-router-dom'
import './BreadCrumb.css'
import { PATIENT, STAFF } from '@/constants/user-roles'

function formatLabel(segment) {
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export default function BreadCrumb() {
  const { pathname } = useLocation()
  let segments = pathname.split('/').filter(Boolean)

  const ignoredSegments = [PATIENT, STAFF]
  segments = segments.filter((seg) => !ignoredSegments.includes(seg))

  segments = segments.map((seg) => {
    if (/^[A-Za-z0-9]{15,}$/.test(seg)) return 'patient'
    return seg
  })

  return (
    <nav className="breadcrumb" aria-label="breadcrumb">
      <ul>
        {/* hide dashboard breadcrumb if on dashboard */}
        {segments[0] !== 'dashboard' && (
          <li className="breadcrumb-item">
            <Link to="/">Dashboard </Link>
            <span className="slash"></span>
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
                  {label}
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
