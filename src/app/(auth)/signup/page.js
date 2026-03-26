"use client"
import Image from "next/image"
import GoogleSignIn from "@/components/auth/googleSignin" // Adjust path if needed
import Link from "next/link";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4">
      <div className="w-full max-w-md">
        {/* Main Card Container */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 space-y-8">
          {/* Logo Section */}
          <div className="flex flex-col items-center space-y-6">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full blur-lg opacity-20 scale-110"></div>
              <div className="relative bg-white rounded-full p-4 shadow-lg">
                <Image
                  src="/tradio_logo.png"
                  alt="Tradio Logo"
                  width={80}
                  height={80}
                  className="rounded-full"
                  priority
                />
              </div>
            </div>

            {/* Tagline */}
            <div className="text-center space-y-2">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Trade Better Every Day
              </h1>
              <p className="text-gray-500 text-sm">Join thousands of traders improving their skills</p>
            </div>
          </div>

          {/* Google Sign In Button */}
          <div className="space-y-4">
            <GoogleSignIn />

            {/* Terms and Privacy */}
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              By signing up, you agree to our{" "}
              
            </p>
          </div>
        </div>
        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-400 text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium cursor-pointer">
              Sign in here
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
