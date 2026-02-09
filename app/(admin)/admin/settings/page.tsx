"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import ChangePasswordForm from "@/components/auth/ChangePasswordForm";

export default function SettingsPage() {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white p-4 md:p-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl md:text-5xl font-black uppercase mb-2">
              Configurações
            </h1>
            <p className="text-gray-600">
              Gerencie as configurações da sua conta
            </p>
          </div>

          <ChangePasswordForm />
        </div>
      </div>
    </ProtectedRoute>
  );
}
