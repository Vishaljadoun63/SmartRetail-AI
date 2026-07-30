import React from 'react';
import HeroSection from "./components/HeroSection";
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import {
  ArrowRight,
  Brain,
  Bot,
  ScanFace,
  BarChart3,
  MessageSquare,
  PackageSearch,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import Layout from './components/Layout';
import Login from './pages/Login';
import DashboardHome from './pages/DashboardHome';
import FaceRecognition from './pages/FaceRecognition';
import ProductClassifier from './pages/ProductClassifier';
import SentimentAnalysis from './pages/SentimentAnalysis';
import ChatbotUI from './pages/ChatbotUI';
import CustomerManagement from './pages/CustomerManagement';
import ReviewManagement from './pages/ReviewManagement';

const features = [
  {
    icon: <BarChart3 size={32} />,
    title: "Analytics Dashboard",
    desc: "Visualize customer trends, revenue, and store performance in real time.",
  },
  {
    icon: <MessageSquare size={32} />,
    title: "Sentiment Analysis",
    desc: "Understand customer emotions from reviews using AI.",
  },
  {
    icon: <ScanFace size={32} />,
    title: "Face Recognition",
    desc: "Recognize returning customers instantly.",
  },
  {
    icon: <PackageSearch size={32} />,
    title: "Product Classification",
    desc: "Automatically classify products using Deep Learning.",
  },
  {
    icon: <Bot size={32} />,
    title: "AI Assistant",
    desc: "Ask SmartRetail AI anything about your business.",
  },
  {
    icon: <ShieldCheck size={32} />,
    title: "Secure Platform",
    desc: "Authentication and protected access for store managers.",
  },
];

const Landing = () => {
  return (
    <div className="min-h-screen bg-background text-white overflow-x-hidden">
      {/* Navbar */}

      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-background/70 border-b border-white/10">

        <div className="max-w-7xl mx-auto flex items-center justify-between px-8 py-3">

          {/* Logo */}

          <Link
            to="/"
            className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
          >
            SmartRetail AI
          </Link>

          {/* Menu */}

          <div className="hidden md:flex items-center gap-10">

            <a
              href="#features"
              className="text-gray-300 hover:text-primary transition"
            >
              Features
            </a>

            <a
              href="#how-it-works"
              className="text-gray-300 hover:text-primary transition"
            >
              How it Works
            </a>

            <a
              href="#footer"
              className="text-gray-300 hover:text-primary transition"
            >
              Contact
            </a>

          </div>

          {/* Login Button */}

          <Link
            to="/login"
            className="px-6 py-2 rounded-full border border-primary/40 hover:bg-primary hover:text-white transition-all"
          >
            Login
          </Link>

        </div>

      </nav>

      <HeroSection />

      {/* Features */}

      <section id="features" className="max-w-7xl mx-auto px-8 py-16">

        <h2 className="text-5xl font-bold text-center">

          Platform Features

        </h2>

        <p className="text-center text-gray-400 mt-4">

          Everything needed to modernize your retail business.

        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">

          {features.map((feature) => (

            <div
              key={feature.title}
              className="glass-panel p-8 hover:scale-105 transition duration-300"
            >

              <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mb-6">

                {feature.icon}

              </div>

              <h3 className="text-2xl font-semibold mb-3">

                {feature.title}

              </h3>

              <p className="text-gray-400">

                {feature.desc}

              </p>

            </div>

          ))}

        </div>

      </section>

      {/* Stats */}

      <section className="py-16 bg-white/5">

        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10 text-center">

          <div>
            <h2 className="text-5xl font-bold text-primary">95%</h2>
            <p className="text-gray-400 mt-2">Prediction Accuracy</p>
          </div>

          <div>
            <h2 className="text-5xl font-bold text-primary">6+</h2>
            <p className="text-gray-400 mt-2">AI Modules</p>
          </div>

          <div>
            <h2 className="text-5xl font-bold text-primary">24/7</h2>
            <p className="text-gray-400 mt-2">AI Assistant</p>
          </div>

          <div>
            <h2 className="text-5xl font-bold text-primary">100%</h2>
            <p className="text-gray-400 mt-2">Cloud Ready</p>
          </div>

        </div>

      </section>

      {/* How it Works */}

      <section
        id="how-it-works"
        className="max-w-6xl mx-auto px-8 py-16"
      >

        <h2 className="text-5xl font-bold text-center">

          How It Works

        </h2>

        <div className="grid md:grid-cols-4 gap-6 mt-10">

          {[
            "Collect Customer Data",
            "AI Processing",
            "Generate Insights",
            "Business Decisions",
          ].map((step, i) => (

            <div
              key={step}
              className="glass-panel p-8 text-center"
            >

              <div className="text-5xl font-bold text-primary mb-4">

                0{i + 1}

              </div>

              <h3 className="font-semibold">

                {step}

              </h3>

            </div>

          ))}

        </div>

      </section>

      {/* CTA */}

      <section className="text-center py-16">

        <h2 className="text-5xl font-bold">

          Ready to Transform Your Retail Store?

        </h2>

        <p className="text-gray-400 mt-5">

          Experience the future of AI-driven retail analytics.

        </p>

        <a
          href="/login"
          className="btn-primary inline-flex items-center gap-3 mt-6 px-10 py-5 rounded-full text-lg"
        >
          Access Dashboard

          <ArrowRight />

        </a>

      </section>

      {/* Footer */}

      <footer className="border-t border-slate-700 py-8 text-center">
        <p className="text-gray-400">
          © 2026 SmartRetail AI • Vishal Jadoun
        </p>

        <p className="mt-2 text-sm text-gray-500">
          Built with React • FastAPI • Hugging Face • MongoDB
        </p>

        <p className="mt-3 text-sm text-gray-400">
          Designed & Developed by{" "}
          <a
            href="https://vishal-jadoun-portfolio.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-blue-400 hover:text-blue-300 transition-colors duration-300"
          >
            Vishal Jadoun
          </a>
        </p>
      </footer>

    </div>
  );
};

function App() {
  return (
    <div className="min-h-screen text-white font-sans bg-background">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/dashboard" element={<Layout />}>
          <Route index element={<DashboardHome />} />
          <Route path="customers" element={<CustomerManagement />} />
          <Route path="reviews" element={<ReviewManagement />} />
          <Route path="face-auth" element={<FaceRecognition />} />
          <Route path="products" element={<ProductClassifier />} />
          <Route path="sentiment" element={<SentimentAnalysis />} />
          <Route path="chatbot" element={<ChatbotUI />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
