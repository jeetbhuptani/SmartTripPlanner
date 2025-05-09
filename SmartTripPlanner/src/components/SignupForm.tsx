import React, { useState, useEffect } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

export default function SignupForm() {
    const { login, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const [formData, setFormData] = useState({
        firstname: "",
        lastname: "",
        email: "",
        password: "",
    });

    const [error, setError] = useState("");

    // Redirect if already authenticated
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/preferences');
        }
    }, [isAuthenticated, navigate]);

    // Handle Input Change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    // Handle Form Submit
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log("button clicked");
        setError(""); // Clear previous errors

        try {
            console.log(`${API_BASE_URL}`)
            const response = await fetch(`http://localhost:5000/api/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || "Signup failed. Please try again.");
                console.log(data.message);
                return;
            }

            // Save token and authenticate user
            await login(data.token);
        } catch (err) {
            setError("Something went wrong. Please try again.");
        }
    };

    const handleGoogleLoginSuccess = async (credentialResponse: any) => {
        try {
          const token = credentialResponse.credential;
          if (token) {
            await login(token);
            // The navigation will happen automatically due to the useEffect above
          }
        } catch (error) {
          console.error("Error processing Google login:", error);
        }
      };

    return (
        <div className="px-8 pt-6">
            <div className="text-center mb-6">
                <h2 className="font-bold text-2xl text-neutral-800 dark:text-neutral-200">
                    Welcome to SmartTripPlanner
                </h2>
                <p className="text-neutral-600 text-sm max-w-sm mx-auto dark:text-neutral-300 mt-2">
                    Create your account and start planning your next adventure
                </p>
            </div>

            {error && (
                <div className="mb-4 p-2 text-red-500 text-center bg-red-100 rounded">
                    {error}
                </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mb-4">
                    <LabelInputContainer>
                        <Label htmlFor="firstname">First name</Label>
                        <Input
                            id="firstname"
                            placeholder="John"
                            type="text"
                            value={formData.firstname}
                            onChange={handleChange}
                            className="h-10 text-black dark:text-white"
                            required
                        />
                    </LabelInputContainer>
                    <LabelInputContainer>
                        <Label htmlFor="lastname">Last name</Label>
                        <Input
                            id="lastname"
                            placeholder="Doe"
                            type="text"
                            value={formData.lastname}
                            onChange={handleChange}
                            className="h-10 text-black dark:text-white"
                            required
                        />
                    </LabelInputContainer>
                </div>

                <LabelInputContainer>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                        id="email"
                        placeholder="you@example.com"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="h-10 text-black dark:text-white"
                        required
                    />
                </LabelInputContainer>

                <LabelInputContainer>
                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        placeholder="••••••••"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="h-10 text-black dark:text-white"
                        required
                    />
                </LabelInputContainer>

                <button
                    className="relative w-full h-10 dark:bg-gray-800 text-black dark:text-white rounded-lg font-medium shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 group/btn"
                    type="submit"
                >
                    Create Account
                    <BottomGradient />
                </button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white dark:bg-gray-900 text-gray-500">Or continue with</span>
                    </div>
                </div>

                <div className="w-full flex items-center justify-center mb-4">
                    <GoogleLogin
                        onSuccess={handleGoogleLoginSuccess}
                        onError={() => setError("Google login failed")}
                    />
                </div>
            </form>
        </div>
    );
}

const BottomGradient = () => {
    return (
        <>
            <span className="group-hover/btn:opacity-100 block transition duration-500 opacity-0 absolute h-px w-full -bottom-px inset-x-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            <span className="group-hover/btn:opacity-100 blur-sm block transition duration-500 opacity-0 absolute h-px w-1/2 mx-auto -bottom-px inset-x-10 bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
        </>
    );
};

const LabelInputContainer = ({
    children,
    className,
}: {
    children: React.ReactNode;
    className?: string;
}) => {
    return <div className={cn("flex flex-col space-y-2 w-full", className)}>{children}</div>;
};
