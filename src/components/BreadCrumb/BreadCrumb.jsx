import React from 'react'
import './BreadCrumb.css'

function BreadCrumb() {
  return (
    <nav aria-label="breadcrumb">
      <ol className="breadcrumb">
        <li className="breadcrumb-item active" aria-current="page">
          Dashboard
        </li>
      </ol>
    </nav>
  )
}

export default BreadCrumb
