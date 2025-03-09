import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import Layout from "../../components/Layout";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [answer, setAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data } = await axios.post("/api/v1/auth/forgot-password", {
        email,
        answer,
        newPassword,
      });

      if (data.success) {
        toast.success(data.message);
        setTimeout(() => {
          navigate("/login");
        }, 1500);
      } else {
        toast.error(data.message);
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error(error);
      setIsSubmitting(false);
      if (error.response && error.response.data && error.response.data.message) {
        toast.error(error.response.data.message); // ✅ Display actual error message
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <Layout title="Forgot Password">
      <div className="container mt-4">
        <h2 className="mb-3">Forgot Password</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="mb-3">
            <label>Security Answer</label>
            <input
              type="text"
              className="form-control"
              placeholder="Enter your security answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          <div className="mb-3">
            <label>New Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Reset Password
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default ForgotPassword;