import { createContext, useContext, useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [mfaVerified, setMfaVerified] = useState(false)
  const [mfaEnrolled, setMfaEnrolled] = useState(null) // null = loading, true/false
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session?.user) {
        fetchProfile(session.user.id, session.user)
        checkMfaStatus()
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
        if (session?.user) {
          fetchProfile(session.user.id, session.user)
          checkMfaStatus()
        } else {
          setProfile(null)
          setMfaVerified(false)
          setMfaEnrolled(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function checkMfaStatus() {
    const { data, error } = await supabase.auth.mfa.listFactors()
    if (data) {
      const totp = data.totp || []
      const verifiedFactors = totp.filter(f => f.status === 'verified')
      setMfaEnrolled(verifiedFactors.length > 0)

      // Check if current session has aal2
      const { data: aalData } = await supabase.auth.mfa.getAuthenticatorAssuranceLevel()
      if (aalData?.currentLevel === 'aal2') {
        setMfaVerified(true)
      }
    }
  }

  async function fetchProfile(userId, userObj = null, retries = 0) {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (data) {
      setProfile(data)
      setLoading(false)
      return
    }

    // Profile not found — might be race condition with trigger
    if (retries < 2) {
      await new Promise(r => setTimeout(r, 1000))
      return fetchProfile(userId, userObj, retries + 1)
    }

    // After retries, create profile manually (for users created before SQL ran)
    const user = userObj || session?.user
    if (user) {
      const { count } = await supabase
        .from('user_profiles')
        .select('*', { count: 'exact', head: true })

      const isFirstUser = count === 0

      const { data: newProfile } = await supabase
        .from('user_profiles')
        .insert({
          id: userId,
          email: user.email,
          role: isFirstUser ? 'admin' : 'viewer',
          display_name: user.user_metadata?.display_name || user.email?.split('@')[0],
          status: isFirstUser ? 'approved' : 'pending',
        })
        .select()
        .single()

      if (newProfile) {
        setProfile(newProfile)
      } else {
        console.error('Could not create profile:', error?.message)
      }
    }
    setLoading(false)
  }

  async function refreshProfile() {
    if (!session?.user) return
    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()
    if (data) setProfile(data)
    return data
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  }

  async function signUp(email, password, displayName) {
    // Check if email is authorized before attempting sign-up
    const { data: isAllowed, error: rpcError } = await supabase
      .rpc('check_email_allowed', { check_email: email })

    if (rpcError) {
      return { error: { message: 'Error verificando email. Intenta de nuevo.' } }
    }

    if (!isAllowed) {
      return { error: { message: 'Este email no esta autorizado. Contacta al administrador.' } }
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { display_name: displayName } },
    })
    return { error }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setMfaVerified(false)
    setMfaEnrolled(null)
    setProfile(null)
  }

  // MFA: Enroll — returns QR code URI
  async function enrollMfa() {
    // First, clean up any existing unverified factors to avoid conflicts
    try {
      const { data: factors } = await supabase.auth.mfa.listFactors()
      if (factors?.totp) {
        for (const f of factors.totp.filter(f => f.status === 'unverified')) {
          await supabase.auth.mfa.unenroll({ factorId: f.id })
        }
      }
    } catch (e) {
      // Ignore cleanup errors
    }

    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'totp',
      friendlyName: `Vicenza-${Date.now()}`,
    })
    if (error) return { error: error.message }
    return { data } // data.id, data.totp.qr_code, data.totp.uri, data.totp.secret
  }

  // MFA: Verify TOTP code (used for both enrollment verification and login verification)
  async function verifyMfa(factorId, code) {
    // Create a challenge
    const { data: challenge, error: challengeError } = await supabase.auth.mfa.challenge({ factorId })
    if (challengeError) return { error: challengeError.message }

    // Verify the code
    const { data, error } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challenge.id,
      code,
    })
    if (error) return { error: error.message }

    setMfaVerified(true)
    setMfaEnrolled(true)
    return { success: true }
  }

  // MFA: Unenroll (admin can remove MFA for a user, or user removes their own)
  async function unenrollMfa(factorId) {
    const { error } = await supabase.auth.mfa.unenroll({ factorId })
    if (error) return { error: error.message }
    setMfaEnrolled(false)
    setMfaVerified(false)
    return { success: true }
  }

  const role = profile?.role || null
  const status = profile?.status || null
  const isAdmin = role === 'admin'
  const isEditor = role === 'editor'
  const isViewer = role === 'viewer'
  const isPending = status === 'pending'
  const isApproved = status === 'approved'
  const isRejected = status === 'rejected'

  const value = {
    session,
    user: session?.user || null,
    profile,
    role,
    status,
    isAdmin,
    isEditor,
    isViewer,
    isPending,
    isApproved,
    isRejected,
    mfaVerified,
    mfaEnrolled,
    loading,
    signIn,
    signUp,
    signOut,
    enrollMfa,
    verifyMfa,
    unenrollMfa,
    checkMfaStatus,
    refreshProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}
