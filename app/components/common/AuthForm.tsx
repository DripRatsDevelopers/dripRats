"use client";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { auth, googleProvider } from "@/lib/firebase";
import { setCookie } from "cookies-next";
import { FirebaseError } from "firebase/app";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import {
  AlertCircle,
  CheckCircle2,
  Chrome,
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
} from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";

interface AuthFormProps {
  isSignUp?: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  fullName?: string;
  general?: string;
}

export default function AuthForm({ isSignUp = false }: AuthFormProps) {
  useAuthRedirect();

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
  });

  const [formState, setFormState] = useState({
    loading: false,
    showPassword: false,
    errors: {} as FormErrors,
    touched: {} as Record<string, boolean>,
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect");

  const parsedRedirectPath = useMemo(
    () => (redirectPath ? decodeURIComponent(redirectPath) : "/"),
    [redirectPath]
  );

  // Validation functions
  const validateEmail = useCallback((email: string): string | undefined => {
    if (!email) return "Email is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Please enter a valid email address";
    }
    return undefined;
  }, []);

  const validatePassword = useCallback(
    (password: string): string | undefined => {
      if (!password) return "Password is required";
      if (password.length < 6) return "Password must be at least 6 characters";
      if (password.length > 128) return "Password is too long";
      return undefined;
    },
    []
  );

  const validateFullName = useCallback(
    (fullName: string): string | undefined => {
      if (isSignUp && !fullName.trim()) return "Full name is required";
      if (fullName.length > 100) return "Name is too long";
      return undefined;
    },
    [isSignUp]
  );

  // Real-time validation
  const validateForm = useCallback(() => {
    const errors: FormErrors = {};

    const emailError = validateEmail(formData.email);
    const passwordError = validatePassword(formData.password);
    const fullNameError = validateFullName(formData.fullName);

    if (emailError) errors.email = emailError;
    if (passwordError) errors.password = passwordError;
    if (fullNameError) errors.fullName = fullNameError;

    return errors;
  }, [formData, validateEmail, validatePassword, validateFullName]);

  // Update form data and validate
  const updateFormData = useCallback(
    (field: keyof typeof formData, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));

      // Clear errors for the field being updated
      setFormState((prev) => ({
        ...prev,
        errors: { ...prev.errors, [field]: undefined, general: undefined },
      }));
    },
    []
  );

  // Handle field blur for validation
  const handleFieldBlur = useCallback(
    (field: keyof typeof formData) => {
      setFormState((prev) => ({
        ...prev,
        touched: { ...prev.touched, [field]: true },
      }));

      // Validate specific field
      const errors = validateForm();
      setFormState((prev) => ({
        ...prev,
        errors: { ...prev.errors, [field]: errors[field] },
      }));
    },
    [validateForm]
  );

  // Firebase error mapping
  const getFirebaseErrorMessage = useCallback(
    (error: FirebaseError): string => {
      switch (error.code) {
        case "auth/user-not-found":
          return "No account found with this email address";
        case "auth/wrong-password":
          return "Incorrect password";
        case "auth/invalid-email":
          return "Invalid email address";
        case "auth/user-disabled":
          return "This account has been disabled";
        case "auth/email-already-in-use":
          return "An account with this email already exists";
        case "auth/weak-password":
          return "Password is too weak";
        case "auth/network-request-failed":
          return "Network error. Please check your connection";
        case "auth/too-many-requests":
          return "Too many failed attempts. Please try again later";
        case "auth/popup-closed-by-user":
          return "Sign-in was cancelled";
        default:
          return error.message || "Authentication failed. Please try again.";
      }
    },
    []
  );

  // Main authentication handler
  const handleAuth = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      const errors = validateForm();
      if (Object.keys(errors).length > 0) {
        setFormState((prev) => ({
          ...prev,
          errors,
          touched: { email: true, password: true, fullName: true },
        }));
        return;
      }

      setFormState((prev) => ({ ...prev, loading: true, errors: {} }));

      try {
        let userCredential;

        if (isSignUp) {
          userCredential = await createUserWithEmailAndPassword(
            auth,
            formData.email,
            formData.password
          );

          if (formData.fullName.trim()) {
            await updateProfile(userCredential.user, {
              displayName: formData.fullName.trim(),
            });
          }

          toast.success("Account created successfully!", {
            description: "Welcome to DripRats!",
          });
        } else {
          userCredential = await signInWithEmailAndPassword(
            auth,
            formData.email,
            formData.password
          );

          toast.success("Welcome back!", {
            description: `Good to see you again, ${userCredential.user.displayName || "there"}!`,
          });
        }

        const token = await userCredential.user.getIdToken();
        setCookie("authToken", token, {
          maxAge: 60 * 60 * 24 * 7, // 7 days
          secure: process.env.NODE_ENV === "production",
          sameSite: "strict",
        });

        router.push(parsedRedirectPath);
      } catch (error) {
        const firebaseError = error as FirebaseError;
        const errorMessage = getFirebaseErrorMessage(firebaseError);

        setFormState((prev) => ({
          ...prev,
          errors: { general: errorMessage },
        }));

        toast.error("Authentication failed", {
          description: errorMessage,
        });
      } finally {
        setFormState((prev) => ({ ...prev, loading: false }));
      }
    },
    [
      formData,
      validateForm,
      isSignUp,
      getFirebaseErrorMessage,
      parsedRedirectPath,
      router,
    ]
  );

  // Google authentication
  const handleGoogleLogin = useCallback(async () => {
    setFormState((prev) => ({ ...prev, loading: true, errors: {} }));

    try {
      const userCredential = await signInWithPopup(auth, googleProvider);

      toast.success("Welcome!", {
        description: `Signed in as ${userCredential.user.displayName || userCredential.user.email}`,
      });

      const token = await userCredential.user.getIdToken();
      setCookie("authToken", token, {
        maxAge: 60 * 60 * 24 * 7, // 7 days
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      router.push(parsedRedirectPath);
    } catch (error) {
      const firebaseError = error as FirebaseError;
      const errorMessage = getFirebaseErrorMessage(firebaseError);

      setFormState((prev) => ({
        ...prev,
        errors: { general: errorMessage },
      }));

      toast.error("Google sign-in failed", {
        description: errorMessage,
      });
    } finally {
      setFormState((prev) => ({ ...prev, loading: false }));
    }
  }, [getFirebaseErrorMessage, parsedRedirectPath, router]);

  // Password reset
  const handleResetPassword = useCallback(async () => {
    const emailError = validateEmail(formData.email);
    if (emailError) {
      setFormState((prev) => ({
        ...prev,
        errors: { email: emailError },
        touched: { ...prev.touched, email: true },
      }));
      toast.error("Please enter a valid email address");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, formData.email);
      toast.success("Password reset email sent!", {
        description: "Check your inbox for reset instructions",
      });
    } catch (error) {
      const firebaseError = error as FirebaseError;
      const errorMessage = getFirebaseErrorMessage(firebaseError);
      toast.error("Failed to send reset email", {
        description: errorMessage,
      });
    }
  }, [formData.email, validateEmail, getFirebaseErrorMessage]);

  // Navigation handler
  const handleToggleMode = useCallback(() => {
    setFormData({ email: "", password: "", fullName: "" });
    setFormState((prev) => ({
      ...prev,
      errors: {},
      touched: {},
      showPassword: false,
    }));

    const newPath = isSignUp ? "/auth/login" : "/auth/signup";
    const search = window.location.search;
    router.push(`${newPath}${search}`);
  }, [isSignUp, router]);

  const isFormValid = useMemo(() => {
    const errors = validateForm();
    return (
      Object.keys(errors).length === 0 &&
      formData.email &&
      formData.password &&
      (!isSignUp || formData.fullName)
    );
  }, [validateForm, formData, isSignUp]);

  return (
    <div className="min-h-screen bg-background flex justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">DripRats</h1>
          <p className="text-muted-foreground">
            {isSignUp ? "Create your account" : "Welcome back"}
          </p>
        </div>

        {/* Main Card */}
        <Card className="border shadow-lg">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-semibold">
              {isSignUp ? "Sign Up" : "Sign In"}
            </CardTitle>
            <CardDescription className="mt-2">
              {isSignUp
                ? "Enter your details to create an account"
                : "Enter your credentials to access your account"}
            </CardDescription>
          </CardHeader>

          <CardContent className="px-6 pb-6">
            {/* General Error Alert */}
            {formState.errors.general && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{formState.errors.general}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleAuth} className="space-y-4">
              {/* Full Name Field (Sign Up only) */}
              {isSignUp && (
                <div className="space-y-2">
                  <Label htmlFor="fullName" className="text-sm font-medium">
                    Full Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={formData.fullName}
                      onChange={(e) =>
                        updateFormData("fullName", e.target.value)
                      }
                      onBlur={() => handleFieldBlur("fullName")}
                      disabled={formState.loading}
                      className={`pl-10 ${
                        formState.touched.fullName && formState.errors.fullName
                          ? "border-destructive focus-visible:ring-destructive"
                          : ""
                      }`}
                      required={isSignUp}
                    />
                  </div>
                  {formState.touched.fullName && formState.errors.fullName && (
                    <p className="text-sm text-destructive flex items-center gap-1 mt-1">
                      <AlertCircle className="h-3 w-3" />
                      {formState.errors.fullName}
                    </p>
                  )}
                </div>
              )}

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => updateFormData("email", e.target.value)}
                    onBlur={() => handleFieldBlur("email")}
                    disabled={formState.loading}
                    className={`pl-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                      formState.touched.email && formState.errors.email
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                    required
                  />
                </div>
                {formState.touched.email && formState.errors.email && (
                  <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    {formState.errors.email}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={formState.showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={(e) => updateFormData("password", e.target.value)}
                    onBlur={() => handleFieldBlur("password")}
                    disabled={formState.loading}
                    className={`pl-10 pr-10 border-gray-300 focus:border-blue-500 focus:ring-blue-500 ${
                      formState.touched.password && formState.errors.password
                        ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                        : ""
                    }`}
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
                    onClick={() =>
                      setFormState((prev) => ({
                        ...prev,
                        showPassword: !prev.showPassword,
                      }))
                    }
                    disabled={formState.loading}
                  >
                    {formState.showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {formState.touched.password && formState.errors.password && (
                  <p className="text-sm text-red-600 flex items-center gap-1 mt-1">
                    <AlertCircle className="h-3 w-3" />
                    {formState.errors.password}
                  </p>
                )}
              </div>

              {/* Forgot Password Link */}
              {!isSignUp && (
                <div className="text-right">
                  <Button
                    type="button"
                    variant="link"
                    onClick={handleResetPassword}
                    disabled={formState.loading}
                    className="p-0 h-auto text-sm text-primary hover:text-primary/80"
                  >
                    Forgot your password?
                  </Button>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={formState.loading || !isFormValid}
                className="w-full font-medium py-2.5"
              >
                {formState.loading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                    {isSignUp ? "Creating Account..." : "Signing In..."}
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    {isSignUp ? "Create Account" : "Sign In"}
                  </div>
                )}
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-card px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Sign In */}
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              disabled={formState.loading}
              className="w-full font-medium py-2.5"
            >
              <Chrome className="mr-2 h-4 w-4" />
              Sign in with Google
            </Button>

            {/* Toggle Mode */}
            <div className="text-center pt-6">
              <span className="text-muted-foreground text-sm">
                {isSignUp
                  ? "Already have an account?"
                  : "Don't have an account?"}
              </span>
              <Button
                type="button"
                variant="link"
                onClick={handleToggleMode}
                disabled={formState.loading}
                className="ml-1 p-0 h-auto text-sm font-medium text-primary hover:text-primary/80"
              >
                {isSignUp ? "Sign in" : "Sign up"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
