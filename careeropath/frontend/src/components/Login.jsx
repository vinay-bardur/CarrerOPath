import { useEffect, useRef, useState } from "react";



export default function Login({ onLogin }) {
  const gbtnRef = useRef(null);
  const [googleReady, setGoogleReady] = useState(false);

  // Load Google script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => setGoogleReady(true);
    document.body.appendChild(script);
  }, []);

  // Render button only after google loads + ref is mounted
  useEffect(() => {
    if (googleReady && window.google && gbtnRef.current) {
      window.google.accounts.id.initialize({
        client_id: "512609989715-telv3n2r6jro4uu979n5uksisp7r6668.apps.googleusercontent.com",
        callback: async (response) => {
          try {
            const res = await fetch("http://127.0.0.1:8000/auth/google", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ id_token: response.credential }),
            });
            const data = await res.json();
            onLogin(data);
          } catch (error) {
            console.error("Authentication error:", error);
          }
        },
      });

      window.google.accounts.id.renderButton(gbtnRef.current, {
        theme: "outline",
        size: "large",
      });
    }
  }, [googleReady, onLogin]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to CareerPath</h1>
          <p className="text-gray-600">Sign in to discover your ideal tech career</p>
        </div>
        
        <div className="space-y-6">
          <div className="flex justify-center">
            {!googleReady ? (
              <div className="flex items-center space-x-2 text-gray-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span>Loading Google Sign-In...</span>
              </div>
            ) : (
              <div ref={gbtnRef}></div>
            )}
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-500">
              By signing in, you agree to our terms of service and privacy policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
