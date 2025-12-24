"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { Save, ArrowLeft, Image as ImageIcon } from "lucide-react"; 

interface Category {
  id: number;
  name: string;
}

interface EditProductFormProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  product: any;
  categories: Category[];
}

export default function EditProductForm({ product, categories }: EditProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(product.images?.[0]?.url || "");

  // Inicializamos el estado con los datos que nos llegan del servidor
  const [formData, setFormData] = useState({
    name: product.name,
    description: product.description || "",
    price: Number(product.price),
    stock: product.stock,
    categoryId: product.categoryId, // Usamos el ID real que viene del producto
    material: product.material || "",
    dimensions: product.dimensions || "",
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const toastId = toast.loading("Subiendo imagen...");
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || "");
    data.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "");

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        { method: "POST", body: data }
      );
      const json = await res.json();
      setImageUrl(json.secure_url);
      toast.success("Imagen cargada", { id: toastId });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Error al subir imagen", { id: toastId });
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Guardando...");

    try {
      const res = await fetch(`/api/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, image: imageUrl }),
      });

      if (res.ok) {
        toast.success("Producto guardado correctamente ✨", { id: toastId });
        router.push("/admin/products");
        router.refresh();
      } else {
        toast.error("Error al guardar", { id: toastId });
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Error de conexión", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20">
      
      
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500">
           <ArrowLeft size={20} />
        </Link>
        <div>
           <h1 className="text-2xl font-bold text-gray-900">Editar Producto</h1>
           <p className="text-sm text-gray-500">ID: #{product.id}</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        
        
        <div className="bg-gray-50 px-8 py-4 border-b border-gray-100">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Información General</span>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          
         
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Nombre del Producto</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all placeholder:text-gray-300"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Categoría</label>
              <div className="relative">
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:ring-2 focus:ring-black outline-none appearance-none cursor-pointer"
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-3">Imagen del Producto</label>
            <div className="flex flex-col sm:flex-row gap-6 items-start">
                <div className="shrink-0">
                    {imageUrl ? (
                        <div className="relative h-40 w-40 rounded-lg overflow-hidden border border-gray-200 shadow-sm group">
                            <Image
                                src={imageUrl}
                                alt="Vista previa"
                                fill
                                className="object-cover"
                            />
                            <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                        </div>
                    ) : (
                        <div className="h-40 w-40 rounded-lg border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 bg-gray-50">
                            <ImageIcon size={32} className="mb-2 opacity-50"/>
                            <span className="text-xs">Sin imagen</span>
                        </div>
                    )}
                </div>
                <div className="flex-1">
                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50/50">
                        <input
                            type="file"
                            onChange={handleImageUpload}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-black file:text-white hover:file:bg-gray-800 cursor-pointer"
                        />
                        <p className="text-xs text-gray-400 mt-2">Recomendado: Formato JPG, PNG. Máx 5MB.</p>
                    </div>
                </div>
            </div>
          </div>

          <hr className="border-gray-100" />

          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Precio ($)</label>
              <input
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-black outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Stock</label>
              <input
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-black outline-none transition-all"
              />
            </div>
          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Material</label>
              <input
                name="material"
                value={formData.material}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-black outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Dimensiones</label>
              <input
                name="dimensions"
                value={formData.dimensions}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-black outline-none transition-all"
              />
            </div>
          </div>

         
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase mb-2">Descripción</label>
            <textarea
              name="description"
              rows={4}
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-black outline-none resize-y"
            />
          </div>

         
          <div className="flex gap-3 pt-6 border-t border-gray-100">
            <Link
              href="/admin/products"
              className="flex-1 flex items-center justify-center px-4 py-2.5 border border-gray-200 text-gray-700 text-sm font-bold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-black text-white text-sm font-bold rounded-lg hover:bg-gray-800 transition-all disabled:opacity-50"
            >
              {loading ? "Guardando..." : <><Save size={16} /> Guardar Cambios</>}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}