import React, { useState, useEffect } from "react";
import { auth } from "@/firebase/config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import "./FirebaseAuthentication.css";

function FirebaseAuthentication() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [currentUser, setCurrentUser] = useState(null);

  const [authIsLoading, setAuthIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    setStatusMessage("Connecting to Firebase Auth...");
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
        setStatusMessage("User is logged in.");
        setIsError(false);
      } else {
        setCurrentUser(null);
        setStatusMessage("User is logged out.");
        setIsError(false);
      }

      setAuthIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setStatusMessage("Email and password are required.");
      setIsError(true);
      return;
    }

    setIsSubmitting(true);
    setIsError(false);
    setStatusMessage("Attempting to register...");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("FIREBASE REGISTERED USER:", userCredential);
      setStatusMessage("Registration successful! You are now logged in.");
    } catch (error) {
      console.error("FIREBASE REGISTER ERROR:", error.message);
      setStatusMessage(`Registration Failed: ${error.message}`);
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setStatusMessage("Email and password are required.");
      setIsError(true);
      return;
    }

    setIsSubmitting(true);
    setIsError(false);
    setStatusMessage("Attempting to log in...");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      console.log("FIREBASE LOGGED IN USER:", userCredential);
      setStatusMessage("Login successful!");
    } catch (error) {
      console.error("FIREBASE LOGIN ERROR:", error.message);
      setStatusMessage(`Login Failed: ${error.message}`);
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    setIsSubmitting(true);
    setStatusMessage("Logging out...");
    try {
      await signOut(auth);
      setStatusMessage("Logout successful.");
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("FIREBASE LOGOUT ERROR:", error.message);
      setStatusMessage(`Logout Failed: ${error.message}`);
      setIsError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authIsLoading) {
    return (
      <div className="container my-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading Auth...</span>
        </div>
        <p className="mt-2">Connecting to Firebase...</p>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="p-4 border rounded-3 shadow-sm bg-light">
            {/* Show this card if user is LOGGED IN */}
            {currentUser ? (
              <div>
                <h2 className="h4 mb-3">Auth Status: Logged In</h2>
                <div className="alert alert-success">
                  <p className="mb-1">
                    <strong>Email:</strong> {currentUser.email}
                  </p>
                  <p className="mb-0" style={{ wordBreak: "break-all" }}>
                    <strong>UID:</strong> {currentUser.uid}
                  </p>
                </div>
                <button
                  className="btn btn-danger w-100"
                  onClick={handleLogout}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Logging out..." : "Log Out"}
                </button>
              </div>
            ) : (
              /* Show this card if user is LOGGED OUT */
              <div>
                <h2 className="h4 mb-4">
                  Test Login - Firebase Auth Check EDITED BY MICO
                </h2>

                {statusMessage && (
                  <div
                    className={`alert ${
                      isError ? "alert-danger" : "alert-info"
                    }`}
                    role="alert"
                  >
                    {statusMessage}
                  </div>
                )}

                <form>
                  <div className="mb-3">
                    <label htmlFor="authEmail" className="form-label small">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="authEmail"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="test@example.com"
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="authPassword" className="form-label small">
                      Password
                    </label>
                    <input
                      type="password"
                      className="form-control"
                      id="authPassword"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password (min. 6 chars)"
                      required
                    />
                  </div>

                  <div className="d-grid gap-2">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleLogin}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "..." : "Login"}
                    </button>
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={handleRegister}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "..." : "Register"}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default FirebaseAuthentication;
