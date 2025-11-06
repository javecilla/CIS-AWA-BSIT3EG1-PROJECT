import { createContext, useState, useContext, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { ref, get, child } from 'firebase/database'
import { auth, db } from '@/libs/firebase'
import { formatFullName } from '@/utils/formatter'

const UserContext = createContext()

export function UserProvider({ children }) {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)

  const refreshUserData = async () => {
    const firebaseUser = auth.currentUser
    if (firebaseUser && firebaseUser.emailVerified) {
      try {
        const userRef = child(ref(db), `users/${firebaseUser.uid}`)
        const snapshot = await get(userRef)

        if (snapshot.exists()) {
          const data = snapshot.val()
          setUserData({
            ...data,
            formattedName: formatFullName(data.fullName) || firebaseUser.email,
            uid: firebaseUser.uid
          })
          setRole(data.role)
        } else {
          //handle case where user exists in Auth but not RTDB
          setUserData(null)
          setRole(null)
        }
      } catch (error) {
        console.error('Error refreshing user data:', error)
        setUserData(null)
        setRole(null)
      }
    } else {
      //no user or not verified
      setUserData(null)
      setRole(null)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)

      if (firebaseUser && firebaseUser.emailVerified) {
        try {
          const userRef = child(ref(db), `users/${firebaseUser.uid}`)
          const snapshot = await get(userRef)

          if (snapshot.exists()) {
            const data = snapshot.val()
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
