'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function TestAuthPage() {
  const { user, loading: authLoading } = useAuth();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [testResults, setTestResults] = useState({});

  useEffect(() => {
    const runTests = async () => {
      const results = {};
      
      // Test 1: Check AuthContext state
      results.authContext = {
        user: user,
        loading: authLoading,
        isAuthenticated: !!user
      };
      
      // Test 2: Check NextAuth session
      results.nextAuth = {
        session: session,
        status: status
      };
      
      // Test 3: Check /api/auth/me endpoint
      try {
        const response = await fetch('/api/auth/me');
        results.apiAuthMe = {
          status: response.status,
          ok: response.ok,
          data: response.ok ? await response.json() : null
        };
      } catch (error) {
        results.apiAuthMe = {
          error: error.message
        };
      }
      
      // Test 4: Check document cookies
      results.cookies = document.cookie;
      
      setTestResults(results);
    };
    
    if (!authLoading && status !== 'loading') {
      runTests();
    }
  }, [user, authLoading, session, status]);

  if (authLoading || status === 'loading') {
    return <div>Loading authentication data...</div>;
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Authentication Test Page</h1>
      
      <button onClick={() => router.push('/login')}>Go to Login</button>
      <button onClick={() => router.push('/customer/dashboard')}>Go to Customer Dashboard</button>
      
      <h2>Test Results</h2>
      
      <h3>AuthContext State</h3>
      <pre>{JSON.stringify(testResults.authContext, null, 2)}</pre>
      
      <h3>NextAuth Session</h3>
      <pre>{JSON.stringify(testResults.nextAuth, null, 2)}</pre>
      
      <h3>API /auth/me Response</h3>
      <pre>{JSON.stringify(testResults.apiAuthMe, null, 2)}</pre>
      
      <h3>Document Cookies</h3>
      <pre>{testResults.cookies}</pre>
    </div>
  );
}