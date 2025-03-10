import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../services/authService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await forgotPassword(email);
      setMessage("If the email exists, you will receive a password reset link.");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container fade-in">
      <div className="auth-card">
        <div className="auth-header">
          <h2 className="auth-title">Forgot Password</h2>
          <p className="auth-subtitle">Enter your email to receive a reset link</p>
        </div>
        <div className="auth-body">
          {message && (
            <div className="alert alert-success">
              {message}
            </div>
          )}
          {error && (
            <div className="alert alert-danger">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-control"
                placeholder="Enter your email"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`btn btn-primary btn-block ${loading ? 'disabled' : ''}`}
            >
              {loading ? "Processing..." : "Send Reset Link"}
            </button>
          </form>
        </div>
        <div className="auth-footer">
          <p>
            Remember your password? <a href="/login" className="auth-link">Back to Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;