import { useNavigate } from "react-router-dom";
import AuthForm from "../components/AuthForm";

const Signup = () => {
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    try {
      const res = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        // Store user info to simulate auth
        localStorage.setItem("user", JSON.stringify({ email }));
        navigate("/dashboard");
      } else {
        alert(data.message || "Signup failed. Please try again.");
      }
    } catch (error) {
      alert("An error occurred. Please try again.");
    }
  };

  return <AuthForm title="Create Account" onSubmit={handleSignup} buttonText="Sign Up" isLogin={false} />;
};

export default Signup;
