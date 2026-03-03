import React from 'react';
import { GitPullRequest, Users, MessageSquare, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Card = ({ children, className = "" }) => (
  <div className={`bg-white p-6 rounded-2xl shadow-sm border border-slate-100 ${className}`}>
    {children}
  </div>
);

export default function LandingPage() {
  const navigate=useNavigate();
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      <nav className="flex justify-between items-center px-8 py-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2 text-blue-600 font-bold text-2xl">
          <GitPullRequest size={28} />
          <span>BrainBridge</span>
        </div>
        <div className="flex gap-4">
          {/* <button 
            
            className="px-5 py-2 text-slate-600 font-medium hover:text-blue-600 transition-colors"
          >
            Login
          </button> */}
          <button 
            onClick={()=>navigate('/authForm')}
            className="px-6 py-2 bg-blue-600 text-white font-medium rounded-full shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
          >
            Sign In/Sign Up
          </button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 max-w-5xl mx-auto w-full py-12">
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
          BrainBridge: <span className="text-blue-600">Exchange knowledge,</span> build together.
        </h1>
        <p className="text-lg text-slate-500 mb-10 max-w-2xl">
          Connect with experts around the world. Teach what you love, learn what you need. 
          A community-driven platform for collaborative growth.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 mb-20 w-full sm:w-auto justify-center">
          <button 
            onClick={()=>navigate('/authForm')}
            className="px-10 py-4 bg-blue-600 text-white font-bold rounded-xl shadow-xl shadow-blue-200 hover:scale-105 hover:shadow-blue-300 transition-all text-lg"
          >
            Get Started
          </button>
          {/* <button 
            
            className="px-10 py-4 bg-white text-blue-600 font-bold rounded-xl border-2 border-blue-600 hover:bg-blue-50 transition-all text-lg"
          >
            Learn More
          </button> */}
        </div>

        <div className="grid md:grid-cols-3 gap-6 w-full text-left">
          <Card className="hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-4">
              <Users size={24} />
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-2">Matching Logic</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Smart algorithms connect you with peers based on complementary skills and levels.</p>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
              <MessageSquare size={24} />
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-2">Real-time Chat</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Coordinate sessions and exchange resources seamlessly through our built-in chat.</p>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center mb-4">
              <CheckCircle size={24} />
            </div>
            <h3 className="font-bold text-slate-800 text-lg mb-2">Feedback & Rating</h3>
            <p className="text-sm text-slate-500 leading-relaxed">Build your reputation within the community through transparent peer reviews.</p>
          </Card>
        </div>
      </main>

      <footer className="py-8 text-center text-slate-400 text-sm border-t border-slate-100 mt-8">
        <p>© 2024 BrainBridge Platform. All rights reserved.</p>
      </footer>
    </div>
  );
}