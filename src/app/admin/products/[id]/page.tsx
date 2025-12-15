"use client";

import { useState, useEffect, use } from "react"; 
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-hot-toast";

// 1. Definimos params como una Promesa
export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  
  // 2. Desempaquetamos el ID. A partir de ahora usamos 'id', NO 'params.id'
  const { id } = use(params); 

  const [loading, setLoading] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [formData, setFormData] = useState({
    name: "", description: "", price: 0, stock: 0, categoryId: 1, material: "", dimensions: ""
  });

  useEffect(() => {
    // CORREGIDO: Usamos `${id}` en lugar de `${params.id}`
    fetch(`/api/products/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
           alert("Producto no encontrado");
           router.push("/admin");
           return;
        }
        setFormData({
          name: data.name,
          description: data.description,
          price: Number(data.price),
          stock: data.stock,
          categoryId: data.categoryId,
          material: data.material || "",
          dimensions: data.dimensions || ""
        });
        if (data.images && data.images.length > 0) {
          setImageUrl(data.images[0].url);
        }
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, [id, router]); // CORREGIDO: La dependencia es [id], NO [params.id]

  // ... (Funciones de carga de imagen y cambios de input se mantienen igual) ...
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_PRESET || "");
    data.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "");

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, { method: "POST", body: data });
      const json = await res.json();
      setImageUrl(json.secure_url);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("Error subiendo imagen");
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, image: imageUrl }),
      });

      if (res.ok) {
      
        toast.success("Producto guardado correctamente ✨"); 
        router.push("/admin");
        router.refresh();
      } else {
        toast.error("Error al guardar el producto");
      }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert("Error al guardar");
    }
  };

  if (loading) return <div className="p-10 text-center">Cargando producto...</div>;

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-gray-200">
      <h1 className="text-2xl font-bold mb-6">Editar Producto #{id}</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Nombre</label>
          <input name="name" value={formData.name} onChange={handleChange} required className="w-full border p-2 rounded-md" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Imagen</label>
          <input type="file" onChange={handleImageUpload} className="w-full text-sm mb-2" />
          
          {/* Solución al error de Image: Usamos <img> normal si Next/Image falla por config */}
          {imageUrl && (
             <div className="relative h-32 w-32 rounded-md overflow-hidden border">
                <Image src={imageUrl} alt="Vista previa" width={128} height={128} className="w-full h-full object-cover" />
             </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Precio</label>
            <input name="price" type="number" value={formData.price} onChange={handleChange} className="w-full border p-2 rounded-md" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stock</label>
            <input name="stock" type="number" value={formData.stock} onChange={handleChange} className="w-full border p-2 rounded-md" />
          </div>
        </div>

         {/* Resto del formulario... */}
         <div>
            <label className="block text-sm font-medium mb-1">Categoría</label>
            <select name="categoryId" value={formData.categoryId} onChange={handleChange} className="w-full border p-2 rounded-md bg-white">
                <option value="1">Espejos</option>
                <option value="2">Bazar</option>
                <option value="3">Deco</option>
            </select>
        </div>
         <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium mb-1">Material</label>
                <input name="material" value={formData.material} onChange={handleChange} className="w-full border p-2 rounded-md" />
            </div>
            <div>
                <label className="block text-sm font-medium mb-1">Dimensiones</label>
                <input name="dimensions" value={formData.dimensions} onChange={handleChange} className="w-full border p-2 rounded-md" />
            </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Descripción</label>
          <textarea name="description" rows={4} value={formData.description} onChange={handleChange} className="w-full border p-2 rounded-md" />
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t">
          <Link href="/admin" className="px-4 py-2 text-sm text-gray-600 hover:text-black">Cancelar</Link>
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Guardar Cambios</button>
        </div>
      </form>
    </div>
  );
}