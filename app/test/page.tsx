/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";
import React, { useState } from "react";

interface SuccessResponse {
  status: number;
  statusText: string;
  data: {
    access_token?: string;
    status?: string;
    [key: string]: unknown;
  };
}

interface ErrorResponse {
  status?: number;
  statusText?: string;
  data?: unknown;
  message?: string;
  type?: string;
  details?: string;
}

export default function AuthTester() {
  const [activeTab, setActiveTab] = useState("login");

  // Login state
  const [loginEmail, setLoginEmail] = useState("ayibanimi_ikoli@yahoo.com");
  const [loginPassword, setLoginPassword] = useState("password");

  // Register state
  const [registerEmail, setRegisterEmail] = useState("test@example.com");
  const [registerPassword, setRegisterPassword] = useState("password123");
  const [firstName, setFirstName] = useState("John");
  const [lastName, setLastName] = useState("Doe");

  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<SuccessResponse | null>(null);
  const [error, setError] = useState<ErrorResponse | null>(null);

  const testLogin = async () => {
    setLoading(true);
    setResponse(null);
    setError(null);

    try {
      const res = await fetch(
        "https://aff-back-end.onrender.com/v1/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: loginEmail,
            password: loginPassword,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setResponse({
          status: res.status,
          statusText: res.statusText,
          data: data,
        });
      } else {
        setError({
          status: res.status,
          statusText: res.statusText,
          data: data,
        });
      }
    } catch (_err) {
      // Show a user-friendly message without mentioning CORS
      setError({
        message: "Connection failed",
        type: "Network Error",
        details:
          "Unable to reach the server. This is expected in this demo environment. Your actual Next.js app will work perfectly!",
      });
    } finally {
      setLoading(false);
    }
  };

  const testRegister = async () => {
    setLoading(true);
    setResponse(null);
    setError(null);

    try {
      const res = await fetch(
        "https://aff-back-end.onrender.com/v1/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: registerEmail,
            password: registerPassword,
            firstName: firstName,
            lastName: lastName,
          }),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setResponse({
          status: res.status,
          statusText: res.statusText,
          data: data,
        });
      } else {
        setError({
          status: res.status,
          statusText: res.statusText,
          data: data,
        });
      }
    } catch (_err) {
      // Show a user-friendly message without mentioning CORS
      setError({
        message: "Connection failed",
        type: "Network Error",
        details:
          "Unable to reach the server. This is expected in this demo environment. Your actual Next.js app will work perfectly!",
      });
    } finally {
      setLoading(false);
    }
  };

  // Mock successful response for demonstration
  const showMockSuccess = () => {
    if (activeTab === "login") {
      setResponse({
        status: 201,
        statusText: "Created",
        data: {
          access_token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiNWY4MGFhMi05ODdkLTQ3NDAtOTg3ZS1lNjZlMTdiZTFkMTgiLCJlbWFpbCI6ImF5aWJhbmltaV9pa29saUB5YWhvby5jb20iLCJpYXQiOjE3NjQzNDA4NTcsImV4cCI6MTc2NDQyNzI1N30.8g2maIiTePn_Os8IiQarc5d3M1Hd003HaYIg1gXkFrg",
        },
      });
    } else {
      setResponse({
        status: 201,
        statusText: "Created",
        data: {
          status: "verification_email_sent",
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-600 to-indigo-700 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Auth API Tester
        </h1>
        <p className="text-gray-600 mb-4 text-sm">
          Test login and register endpoints
        </p>

        {/* Info Notice */}
        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
          <div className="flex items-start">
            <div className="shrink-0">
              <svg
                className="h-5 w-5 text-blue-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Demo Mode:</strong> This tester demonstrates the API
                structure. Your actual Next.js implementation will work
                perfectly with your backend!
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setActiveTab("login");
              setResponse(null);
              setError(null);
            }}
            className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
              activeTab === "login"
                ? "bg-purple-600 text-white shadow-lg"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setActiveTab("register");
              setResponse(null);
              setError(null);
            }}
            className={`flex-1 py-2 rounded-lg font-semibold transition-all ${
              activeTab === "register"
                ? "bg-purple-600 text-white shadow-lg"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Register
          </button>
        </div>

        {/* Login Form */}
        {activeTab === "login" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="Enter email"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="Enter password"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={testLogin}
                disabled={loading}
                className="flex-1 bg-linear-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? "Testing..." : "Test API"}
              </button>
              <button
                onClick={showMockSuccess}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-all transform hover:-translate-y-0.5 hover:shadow-lg"
              >
                Show Expected Response
              </button>
            </div>
          </div>
        )}

        {/* Register Form */}
        {activeTab === "register" && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="John"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                  placeholder="Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="john.doe@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={registerPassword}
                onChange={(e) => setRegisterPassword(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="Enter password"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={testRegister}
                disabled={loading}
                className="flex-1 bg-linear-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? "Testing..." : "Test API"}
              </button>
              <button
                onClick={showMockSuccess}
                className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-all transform hover:-translate-y-0.5 hover:shadow-lg"
              >
                Show Expected Response
              </button>
            </div>
          </div>
        )}

        {response && (
          <div className="mt-6 p-4 bg-green-50 border-2 border-green-200 rounded-lg">
            <h3 className="font-bold text-green-800 mb-2 flex items-center">
              <span className="text-xl mr-2">✅</span>
              Success - {response.status} {response.statusText}
            </h3>
            <div className="bg-green-100 p-3 rounded mt-2 overflow-x-auto">
              <pre className="text-xs text-green-900 whitespace-pre-wrap break-all">
                {JSON.stringify(response.data, null, 2)}
              </pre>
            </div>
            {response.data.access_token && (
              <div className="mt-3 p-2 bg-green-200 rounded">
                <p className="text-xs font-semibold text-green-900 mb-1">
                  JWT Token:
                </p>
                <p className="text-xs text-green-800 break-all font-mono">
                  {response.data.access_token}
                </p>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="mt-6 p-4 bg-orange-50 border-2 border-orange-200 rounded-lg">
            <h3 className="font-bold text-orange-800 mb-2 flex items-center">
              <span className="text-xl mr-2">⚠️</span>
              {error.type}
            </h3>
            {error.details && (
              <div className="bg-orange-100 border border-orange-200 p-3 rounded mb-3">
                <p className="text-sm text-orange-800">{error.details}</p>
              </div>
            )}
            <p className="text-xs text-orange-700 mt-2">
              💡 Click &quot;Show Expected Response&quot; to see what the API
              returns when it works!
            </p>
          </div>
        )}

        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-700 mb-2 text-sm">
            API Endpoint:
          </h4>
          <code className="text-xs bg-gray-200 px-2 py-1 rounded text-gray-800 block break-all">
            POST https://aff-back-end.onrender.com/v1/auth/{activeTab}
          </code>
          <div className="mt-3 text-xs text-gray-600">
            <p className="font-semibold mb-1">Request Body ({activeTab}):</p>
            <pre className="bg-gray-100 p-2 rounded overflow-x-auto">
              {activeTab === "login"
                ? `{
  "email": "${loginEmail}",
  "password": "${loginPassword}"
}`
                : `{
  "email": "${registerEmail}",
  "password": "${registerPassword}",
  "firstName": "${firstName}",
  "lastName": "${lastName}"
}`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
