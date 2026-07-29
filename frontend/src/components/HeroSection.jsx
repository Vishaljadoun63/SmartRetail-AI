import React from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  Brain,
  ShieldCheck,
  Cloud,
  Users,
} from "lucide-react";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">

      {/* Background Glow */}

      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-cyan-500/10"></div>

      <div className="relative max-w-7xl mx-auto px-8 pt-5 pb-16">

        <div className="grid lg:grid-cols-2 gap-16 items-start">

          {/* LEFT */}

          <div>

            {/* Badge */}

            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-primary/30 bg-primary/10 mb-5">

              <Brain size={18} />

              <span className="font-medium">
                AI Powered Retail Intelligence
              </span>

            </div>

            {/* Heading */}

            <h1 className="text-6xl xl:text-7xl font-black leading-tight">

              SmartRetail

              <span className="text-primary"> AI</span>

            </h1>

            <h2 className="mt-4 text-5xl font-bold leading-tight text-gray-200">

              AI Powered Customer

              <br />

              Intelligence Platform

            </h2>

            {/* Description */}

            <p className="mt-5 text-xl text-gray-400 leading-9 max-w-xl">

              Revolutionize customer engagement using Artificial Intelligence,
              Computer Vision, Machine Learning and Predictive Analytics.

            </p>

            {/* Buttons */}

            <div className="mt-7 flex flex-wrap gap-5">

              <Link
                to="/login"
                className="btn-primary px-8 py-4 rounded-full flex items-center gap-3"
              >

                Get Started

                <ArrowRight size={20} />

              </Link>

              <a
                href="#features"
                className="px-8 py-4 rounded-full border border-white/10 hover:bg-white/5 transition"
              >

                Learn More

              </a>

            </div>

            {/* Bottom Trust */}

            <div className="flex flex-wrap gap-10 mt-14">

              <div className="flex items-center gap-3">

                <ShieldCheck className="text-primary" />

                <div>

                  <p className="font-semibold">
                    Secure
                  </p>

                  <p className="text-sm text-gray-500">
                    Enterprise Grade
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-3">

                <Cloud className="text-primary" />

                <div>

                  <p className="font-semibold">
                    Cloud Ready
                  </p>

                  <p className="text-sm text-gray-500">
                    Fast & Scalable
                  </p>

                </div>

              </div>

              <div className="flex items-center gap-3">

                <Users className="text-primary" />

                <div>

                  <p className="font-semibold">
                    Trusted
                  </p>

                  <p className="text-sm text-gray-500">
                    Modern Retail
                  </p>

                </div>

              </div>

            </div>

          </div>

        {/* RIGHT */}

        <div className="relative">

        {/* Main Dashboard */}

        <div className="glass-panel rounded-3xl p-6 border border-white/10 shadow-2xl">

            {/* Header */}

            <div className="flex justify-between items-center mb-6">

            <div>
                <h3 className="text-xl font-bold">
                Dashboard Overview
                </h3>

                <p className="text-gray-400 text-sm">
                Live Retail Analytics
                </p>
            </div>

            <div className="w-3 h-3 rounded-full bg-green-400 animate-pulse"></div>

            </div>

            {/* Top Cards */}

            <div className="grid grid-cols-2 gap-4 mb-6">

            <div className="rounded-2xl bg-primary/10 p-4 border border-primary/20">

                <p className="text-gray-400 text-sm">
                Revenue
                </p>

                <h2 className="text-3xl font-bold mt-2">
                $24.8K
                </h2>

            </div>

            <div className="rounded-2xl bg-emerald-500/10 p-4 border border-emerald-500/20">

                <p className="text-gray-400 text-sm">
                Customers
                </p>

                <h2 className="text-3xl font-bold mt-2">
                1,248
                </h2>

            </div>

            <div className="rounded-2xl bg-yellow-500/10 p-4 border border-yellow-500/20">

                <p className="text-gray-400 text-sm">
                Sentiment
                </p>

                <h2 className="text-3xl font-bold mt-2">
                94%
                </h2>

            </div>

            <div className="rounded-2xl bg-cyan-500/10 p-4 border border-cyan-500/20">

                <p className="text-gray-400 text-sm">
                Products
                </p>

                <h2 className="text-3xl font-bold mt-2">
                520
                </h2>

            </div>

            </div>

            {/* Fake Chart */}

            <div className="rounded-2xl bg-white/5 p-5 border border-white/10 mb-6">

            <div className="flex justify-between mb-4">

                <span className="font-semibold">
                Weekly Sales
                </span>

                <span className="text-primary">
                +18%
                </span>

            </div>

            <div className="flex items-end gap-3 h-36">

                <div className="bg-primary rounded w-6 h-16"></div>
                <div className="bg-primary rounded w-6 h-24"></div>
                <div className="bg-primary rounded w-6 h-20"></div>
                <div className="bg-primary rounded w-6 h-32"></div>
                <div className="bg-primary rounded w-6 h-28"></div>
                <div className="bg-primary rounded w-6 h-36"></div>
                <div className="bg-primary rounded w-6 h-24"></div>

            </div>

            </div>

            {/* AI Card */}

            <div className="rounded-2xl bg-gradient-to-r from-primary/20 to-cyan-500/20 border border-primary/20 p-5">

            <p className="font-semibold mb-2">

                🤖 SmartRetail AI

            </p>

            <p className="text-gray-300 text-sm">

                Customer satisfaction increased by

                <span className="text-primary font-bold">
                {" "}12%
                </span>

                this week.

            </p>

            </div>

        </div>

        </div>

        </div>

      </div>

    </section>
  );
};

export default HeroSection;