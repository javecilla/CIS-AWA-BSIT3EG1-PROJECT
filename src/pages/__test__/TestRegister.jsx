import React, { useState, useEffect } from 'react'
import { ref, push, onValue } from 'firebase/database'
import { db } from '@/firebase/config.js'

function TestRegister() {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [middleName, setMiddleName] = useState('')
  const [suffixName, setSuffixName] = useState('')
  const [email, setEmail] = useState('')

  const [userData, setUserData] = useState([])
  const [statusMessage, setStatusMessage] = useState('')
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleRegister = (e) => {
    e.preventDefault()

    if (!firstName || !lastName || !email) {
      setStatusMessage('Error: First Name, Last Name, and Email are required.')
      setIsError(true)
      return
    }

    setStatusMessage('Attempting to save data...')
    setIsError(false)

    const newPatientData = {
      email: email,
      fullName: {
        firstName: firstName,
        lastName: lastName,
        middleName: middleName || '',
        suffixName: suffixName || ''
      },
      registrationDate: new Date().toISOString(),
      profile: 'https://placehold.co/150'
    }

    push(ref(db, 'users/'), newPatientData)
      .then(() => {
        setStatusMessage(
          'Data successfully saved! Real-time list should update.'
        )
        setIsError(false)
        setFirstName('')
        setLastName('')
        setMiddleName('')
        setSuffixName('')
        setEmail('')
      })
      .catch((error) => {
        console.error('FIREBASE WRITE ERROR:', error)
        setStatusMessage('WRITE FAILED! Check console for errors.')
        setIsError(true)
      })
  }

  useEffect(() => {
    setIsLoading(true)
    const usersRef = ref(db, 'users/')

    const unsubscribe = onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const usersArray = []
        snapshot.forEach((childSnapshot) => {
          usersArray.push({
            id: childSnapshot.key,
            ...childSnapshot.val()
          })
        })
        setUserData(usersArray.reverse())
        console.log('User data updated:', usersArray)
      } else {
        console.log('No user data found')
        setUserData([])
      }
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <div className="container my-5">
      <div className="row g-5">
        <div className="col-lg-5">
          <div className="p-4 border rounded-3 shadow-sm bg-light">
            <h2 className="h4 mb-4">Test Register - Database Check</h2>

            {statusMessage && (
              <div
                className={`alert ${
                  isError ? 'alert-danger' : 'alert-success'
                }`}
                role="alert"
              >
                {statusMessage}
              </div>
            )}

            <form onSubmit={handleRegister}>
              <div className="row g-2 mb-3">
                <div className="col-sm-6">
                  <label htmlFor="firstName" className="form-label small">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="firstName"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="First Name"
                    required
                  />
                </div>
                <div className="col-sm-6">
                  <label htmlFor="lastName" className="form-label small">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="lastName"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Last Name"
                    required
                  />
                </div>
                <div className="col-sm-8">
                  <label htmlFor="middleName" className="form-label small">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="middleName"
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                    placeholder="Middle Name (Optional)"
                  />
                </div>
                <div className="col-sm-4">
                  <label htmlFor="suffixName" className="form-label small">
                    Suffix
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="suffixName"
                    value={suffixName}
                    onChange={(e) => setSuffixName(e.target.value)}
                    placeholder="Suffix (Optional)"
                  />
                </div>
              </div>

              <div className="mb-3">
                <label htmlFor="email" className="form-label small">
                  Email
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Register Patient Data
              </button>
            </form>
          </div>
        </div>

        <div className="col-lg-7">
          <h2 className="h4 mb-4">
            Registered Users{' '}
            <span className="badge bg-secondary">{userData.length}</span>
          </h2>

          {isLoading && (
            <div className="d-flex justify-content-center mt-5">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          )}

          {!isLoading && userData.length === 0 && (
            <div className="alert alert-info">
              No user data found. Add a user to see them here.
            </div>
          )}

          <div className="row row-cols-1 row-cols-md-2 g-3">
            {userData.map((user) => (
              <div key={user.id} className="col">
                <div className="card h-100 shadow-sm">
                  <img
                    src={user.profile}
                    className="card-img-top"
                    alt="Profile"
                    style={{
                      height: '150px',
                      objectFit: 'cover',
                      background: '#eee'
                    }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">
                      {user.fullName.firstName} {user.fullName.lastName}
                    </h5>
                    <p className="card-text text-muted">{user.email}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestRegister
