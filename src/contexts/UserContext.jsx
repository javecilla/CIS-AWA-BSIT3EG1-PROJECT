import { createContext, useState, useContext, useEffect } from 'react'
import { formatFullName } from '@/utils/formatter'
import {
  onAuthStateChange,
  getCurrentUser,
  getUserData
} from '@/services/authService'

const UserContext = createContext()

export function UserProvider({ children }) {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)

  // re-fetch user profile from centralized auth service
  const refreshUserData = async () => {
    const firebaseUser = getCurrentUser()
    if (firebaseUser && firebaseUser.emailVerified) {
      try {
        const result = await getUserData(firebaseUser.uid)
        if (result.success && result.data) {
          const data = result.data
          setUserData({
            ...data,
            formattedName: formatFullName(data.fullName) || firebaseUser.email,
            uid: firebaseUser.uid
          })
          setRole(data.role)
        } else {
          setUserData(null)
          setRole(null)
        }
      } catch (error) {
        console.error('Error refreshing user data:', error)
        setUserData(null)
        setRole(null)
      }
    } else {
      setUserData(null)
      setRole(null)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChange(async (firebaseUser) => {
      setUser(firebaseUser)

      if (firebaseUser && firebaseUser.emailVerified) {
        try {
          const result = await getUserData(firebaseUser.uid)
          if (result.success && result.data) {
            const data = result.data
            setUserData({
              ...data,
              formattedName:
                formatFullName(data.fullName) || firebaseUser.email,
              uid: firebaseUser.uid
            })
            setRole(data.role)
          } else {
            setUserData(null)
            setRole(null)
          }
        } catch (error) {
          console.error('Error fetching user data:', error)
          setUserData(null)
          setRole(null)
        }
      } else {
        setUserData(null)
        setRole(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  return (
    <UserContext.Provider
      value={{ userData, loading, user, role, refreshUserData }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  return context
}
