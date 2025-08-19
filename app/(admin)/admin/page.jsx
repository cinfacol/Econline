"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RetrieveUserInfo from "@/components/auth/RetrieveUser";

export default function AdminDashboard() {
  const router = useRouter();

  const modules = [
    {
      title: "Categorías",
      description: "Gestiona las categorías de productos",
      icon: "📁",
      route: "/categories",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      textColor: "text-blue-800",
      buttonColor: "bg-blue-600 hover:bg-blue-700",
    },
    {
      title: "Productos",
      description: "Administra tu catálogo de productos",
      icon: "📦",
      route: "/settings/product/new",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-800",
      buttonColor: "bg-green-600 hover:bg-green-700",
    },
    {
      title: "Inventario",
      description: "Controla stock, precios e imágenes",
      icon: "📊",
      route: "/admin/inventory",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      textColor: "text-purple-800",
      buttonColor: "bg-purple-600 hover:bg-purple-700",
    },
  ];

  const handleNavigate = (route) => {
    router.push(route);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Panel de Administración
          </h1>
          <p className="text-xl text-gray-600">
            Administra tu tienda online de manera eficiente
          </p>
          <div className="text-center mt-8 mb-12">
            <RetrieveUserInfo />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {modules.map((module, index) => (
            <div
              key={index}
              className={`${module.bgColor} ${module.borderColor} border rounded-lg p-6 transition-transform hover:scale-105`}
            >
              <div className="text-center mb-4">
                <div className="text-4xl mb-3">{module.icon}</div>
                <h3
                  className={`text-xl font-semibold ${module.textColor} mb-2`}
                >
                  {module.title}
                </h3>
                <p className="text-gray-600">{module.description}</p>
              </div>
              <button
                onClick={() => handleNavigate(module.route)}
                className={`w-full ${module.buttonColor} text-white py-3 px-4 rounded-lg transition-colors font-medium`}
              >
                Gestionar {module.title}
              </button>
            </div>
          ))}
        </div>

        {/* Flujo de trabajo */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Flujo de Trabajo Recomendado
          </h2>

          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Categorías</h3>
              <p className="text-sm text-gray-600">Organiza tus productos</p>
            </div>

            <div className="text-gray-400">
              <svg
                className="w-6 h-6 transform md:rotate-0 rotate-90"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                ></path>
              </svg>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-xl font-bold text-green-600">2</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Productos</h3>
              <p className="text-sm text-gray-600">Crea tu catálogo</p>
            </div>

            <div className="text-gray-400">
              <svg
                className="w-6 h-6 transform md:rotate-0 rotate-90"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                ></path>
              </svg>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                <span className="text-xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">Inventario</h3>
              <p className="text-sm text-gray-600">Configura precio y stock</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
