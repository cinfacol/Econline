"use client";

import { useGetProfileQuery, useUpdateProfileMutation } from "@/redux/features/auth/authApiSlice";
import { Spinner } from "@/components/common";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

const genderOptions = [
  { value: "Male", label: "Masculino" },
  { value: "Female", label: "Femenino" },
  { value: "Other", label: "Otro" },
];

export default function FormLayout() {
  const { data: profile, isLoading, error } = useGetProfileQuery();
  const [form, setForm] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [updateProfile, { isLoading: isSaving, isSuccess, isError, error: saveError }] = useUpdateProfileMutation();
  const router = useRouter();

  // Inicializa el formulario cuando llegan los datos
  if (!form && profile) {
    setForm({
      about_me: profile.profile.about_me || "",
      license: profile.profile.license || "",
      gender: profile.profile.gender || "Other",
      is_buyer: profile.profile.is_buyer,
      is_seller: profile.profile.is_seller,
      is_agent: profile.profile.is_agent,
      profile_photo: null,
    });
  }

  if (isLoading || !form) {
    return (
      <div className="flex justify-center my-8">
        <Spinner lg />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center my-8">
        <p className="text-red-600">No se pudo cargar el perfil.</p>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      setForm((prev) => ({ ...prev, profile_photo: files[0] }));
      setPhotoPreview(URL.createObjectURL(files[0]));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => {
      if (key === "profile_photo" && value) {
        formData.append(key, value);
      } else if (key !== "profile_photo") {
        formData.append(key, value);
      }
    });
    try {
      await updateProfile({ username: profile.profile.username, data: formData }).unwrap();
    } catch (err) {
      // El feedback de error se maneja abajo
    }
  };

  if (isSuccess) {
    setTimeout(() => {
      router.push("/profile");
    }, 1200);
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6 md:p-10 border border-gray-200 space-y-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">Editar perfil</h2>
      <div className="flex flex-col items-center mb-8">
        <Image
          src={photoPreview || profile.profile.profile_photo || "/images/profile_default.png"}
          alt={profile.profile.full_name || "Usuario"}
          width={112}
          height={112}
          className="rounded-full object-cover border-4 border-indigo-200 shadow-lg h-28 w-28"
        />
        <label className="mt-4">
          <span className="inline-flex items-center gap-2 rounded bg-indigo-600 px-4 py-2 text-white font-semibold shadow hover:bg-indigo-500 cursor-pointer transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536M9 13l6-6m2 2l-6 6m-2 2h6a2 2 0 002-2v-6a2 2 0 00-2-2h-6a2 2 0 00-2 2v6a2 2 0 002 2z"/></svg>
            Cambiar imagen
          </span>
          <input
            type="file"
            name="profile_photo"
            accept="image/*"
            className="hidden"
            onChange={handleChange}
          />
        </label>
      </div>
      {isSuccess && (
        <div className="mb-4 flex items-center justify-center gap-2 text-green-600 bg-green-50 border border-green-200 rounded px-4 py-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
          ¡Perfil actualizado correctamente!
        </div>
      )}
      {isError && (
        <div className="mb-4 flex items-center justify-center gap-2 text-red-600 bg-red-50 border border-red-200 rounded px-4 py-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          Error al guardar los cambios: {saveError?.data?.detail || "Intenta de nuevo."}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-2 md:px-8">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
          <input
            type="text"
            value={profile.profile.username}
            disabled
            className="block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed px-3 py-2"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={profile.profile.email || profile.email}
            disabled
            className="block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 cursor-not-allowed px-3 py-2"
          />
        </div>
        <div className="md:col-span-2 mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Sobre mí</label>
          <textarea
            name="about_me"
            value={form.about_me}
            onChange={handleChange}
            rows={3}
            className="block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Licencia</label>
          <input
            type="text"
            name="license"
            value={form.license}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Género</label>
          <select
            name="gender"
            value={form.gender}
            onChange={handleChange}
            className="block w-full rounded-md border-gray-300 shadow-sm px-3 py-2 focus:ring-2 focus:ring-indigo-500"
          >
            {genderOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center space-x-6 md:col-span-2 mb-4">
          <label className="flex items-center text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              name="is_buyer"
              checked={form.is_buyer}
              onChange={handleChange}
              className="mr-2 accent-indigo-600"
            />
            Comprador
          </label>
          <label className="flex items-center text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              name="is_seller"
              checked={form.is_seller}
              onChange={handleChange}
              className="mr-2 accent-indigo-600"
            />
            Vendedor
          </label>
          <label className="flex items-center text-sm font-medium text-gray-700">
            <input
              type="checkbox"
              name="is_agent"
              checked={form.is_agent}
              onChange={handleChange}
              className="mr-2 accent-indigo-600"
            />
            Agente
          </label>
        </div>
      </div>
      <div className="flex justify-end mt-6">
        <button
          type="submit"
          className="w-full md:w-auto rounded-md bg-indigo-600 px-6 py-2 text-base font-semibold text-white shadow hover:bg-indigo-500 transition disabled:opacity-60 flex items-center gap-2 justify-center"
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path></svg>
              Guardando...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
              Guardar cambios
            </>
          )}
        </button>
      </div>
    </form>
  );
}
