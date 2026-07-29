import { useEffect, useState } from "react";
import api from "../services/api";
import React from 'react';
import { motion } from 'framer-motion';
import { Users, UserPlus, Eye, MessageSquare, TrendingUp } from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement);

const StatCard = ({ title, value, icon, trend, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay }}
    className="glass-panel p-6 flex flex-col justify-between"
  >
    <div className="flex justify-between items-start">
      <div>
        <p className="text-gray-400 text-sm font-medium">{title}</p>
        <h3 className="text-3xl font-bold mt-2">{value}</h3>
      </div>
      <div className="p-3 bg-white/5 rounded-lg text-primary">{icon}</div>
    </div>
    <div className="mt-4 flex items-center text-sm">
      <TrendingUp size={16} className="text-accent mr-1" />
      <span className="text-accent font-medium">{trend}</span>
      <span className="text-gray-500 ml-2">vs last month</span>
    </div>
  </motion.div>
);

const DashboardHome = () => {
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get("/dashboard/analytics");
        setAnalytics(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAnalytics();
  }, []);

  if (!analytics) {
    return (
      <div className="flex justify-center items-center h-96 text-xl">
        Loading Dashboard...
      </div>
    );
  }
  const lineData = {
    labels: analytics.footfall.labels,
    datasets: [
      {
        label: "Visits",
        data: analytics.footfall.data,
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59,130,246,0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const doughnutData = {
    labels: ["Positive", "Negative", "Neutral"],
    datasets: [
      {
        data: [
          analytics.sentiment_distribution.positive,
          analytics.sentiment_distribution.negative,
          analytics.sentiment_distribution.neutral
        ],
        backgroundColor: [
          "#10b981",
          "#ef4444",
          "#3b82f6"
        ],
        borderWidth: 0
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: '#9ca3af' } } },
    scales: {
      x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9ca3af' } },
      y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#9ca3af' } }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'bottom', labels: { color: '#9ca3af', padding: 20 } } },
  };

  return (
    <div className="space-y-6 pb-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Platform Overview</h1>
        <button
          className="btn-primary"
          onClick={() =>
            window.open(
              "http://localhost:8000/api/v1/dashboard/download-report",
              "_blank"
            )
          }
        >
          Download Report
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

        <StatCard
          title="Total Customers"
          value={analytics.summary.total_customers}
          icon={<Users size={24} />}
          trend="+0%"
          delay={0.1}
        />

        <StatCard
          title="Returning Customers"
          value={analytics.summary.returning_customers}
          icon={<UserPlus size={24} />}
          trend="+0%"
          delay={0.2}
        />

        <StatCard
          title="Daily Visits"
          value={analytics.summary.daily_visits}
          icon={<Eye size={24} />}
          trend="+0%"
          delay={0.3}
        />

        <StatCard
          title="Total Reviews"
          value={analytics.summary.total_reviews}
          icon={<MessageSquare size={24} />}
          trend="+0%"
          delay={0.4}
        />

      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[400px]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="lg:col-span-2 glass-panel p-6 h-full flex flex-col"
        >
          <h3 className="text-lg font-medium mb-4">Customer Footfall Trend</h3>
          <div className="flex-1 relative">
            <Line data={lineData} options={chartOptions} />
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="glass-panel p-6 h-full flex flex-col"
        >
          <h3 className="text-lg font-medium mb-4">Sentiment Distribution</h3>
          <div className="flex-1 relative flex items-center justify-center">
            <Doughnut data={doughnutData} options={doughnutOptions} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default DashboardHome;
