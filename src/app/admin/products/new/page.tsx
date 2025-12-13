"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export default function NewProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUrl, setImageUrl] = useState(""); // Aquí guardaremos la URL de la foto subida
  const [uploading, setUploading] = useState(false);

  // Función para subir la imagen a Cloudinary
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    // Usamos las variables de entorno que configuraste
    formData.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || ""); 
    formData.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: formData }
      );
      const data = await res.json();
      setImageUrl(data.secure_url); // ¡Guardamos la URL de la nube!
      setUploading(false);
    } catch (error) {
      console.error("Error subiendo imagen:", error);
      setUploading(false);
      alert("Error al subir la imagen");
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    
    // Armamos el objeto para enviar a la API
    const productData = {
      name: formData.get("name"),
      description: formData.get("description"),
      price: Number(formData.get("price")),
      stock: Number(formData.get("stock")),
      categoryId: Number(formData.get("categoryId")), // 1=Espejos, 2=Bazar, etc.
      image: imageUrl, // La URL de Cloudinary
      material: formData.get("material"),
      dimensions: formData.get("dimensions"),
    };

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      if (res.ok) {
        alert("Producto creado con éxito!");
        router.push("/admin"); // Volver al panel
        router.refresh();
      } else {
        alert("Error al crear producto");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200">
      <h1 className="text-2xl font-bold mb-6">Nuevo Producto</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nombre del Producto</label>
          <input name="name" required className="w-full border p-2 rounded-md" placeholder="Ej: Espejo Circular" />
        </div>

        {/* Imagen (Cloudinary) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Imagen Principal</label>
          <input 
            type="file" 
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800"
          />
          {uploading && <p className="text-xs text-blue-500 mt-2">Subiendo imagen a la nube...</p>}
          {imageUrl && (
            <div className="mt-2">
              <p className="text-xs text-green-600 mb-1">¡Imagen lista!</p>
              <Image src={imageUrl} alt="Vista previa" width={128} height={128} className="h-32 rounded-md object-cover border" />
            </div>
          )}
        </div>

        {/* Precio y Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Precio ($)</label>
            <input name="price" type="number" required className="w-full border p-2 rounded-md" placeholder="0.00" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Stock Inicial</label>
            <input name="stock" type="number" required className="w-full border p-2 rounded-md" defaultValue={1} />
          </div>
        </div>

        {/* Categoría (Manual por ahora, luego lo haremos dinámico) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
          <select name="categoryId" className="w-full border p-2 rounded-md bg-white">
            <option value="1">Espejos</option>
            <option value="2">Bazar</option>
            <option value="3">Deco</option>
          </select>
        </div>

        {/* Detalles */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Material</label>
            <input name="material" className="w-full border p-2 rounded-md" placeholder="Ej: Vidrio, Madera" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dimensiones</label>
            <input name="dimensions" className="w-full border p-2 rounded-md" placeholder="Ej: 40x40 cm" />
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
          <textarea name="description" rows={4} className="w-full border p-2 rounded-md" placeholder="Detalles del producto..."></textarea>
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-4 pt-4 border-t">
          <Link href="/admin" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900">
            Cancelar
          </Link>
          <button 
            type="submit" 
            disabled={isSubmitting || uploading || !imageUrl}
            className="px-6 py-2 bg-black text-white rounded-md text-sm font-medium hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Guardando..." : "Crear Producto"}
          </button>
        </div>

      </form>
    </div>
  );
}