/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import api from "@/lib/api";
import SetGalleryManager from "@/app/components/SetGalleryManager";


// Dynamically load CKEditor React wrapper
const CKEditor = dynamic(
  () => import("@ckeditor/ckeditor5-react").then((mod) => mod.CKEditor),
  { ssr: false }
);

interface SetType {
  id: string;
  title: string;
  mainImage: string;
  content: string;
}

export default function SetDetailPage() {
  const { id } = useParams();
  const router = useRouter();

  const [Editor, setEditor] = useState<any>(null); // CKEditor build
  const [setData, setSetData] = useState<SetType | null>(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mainImage, setMainImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 🔥 Load ClassicEditor only on client
  useEffect(() => {
    import("@ckeditor/ckeditor5-build-classic").then((mod) => {
      setEditor(() => mod.default);
    });
  }, []);

  useEffect(() => {
    if (id) fetchSet();
  }, [id]);

  const fetchSet = async () => {
    try {
      const res = await api.get(`/set/${id}`);
      setSetData(res.data);
      setTitle(res.data.title);
      setContent(res.data.content);
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageChange = (file: File) => {
    setMainImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);

      if (mainImage) {
        formData.append("mainImage", mainImage);
      }

      await api.put(`/set/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Updated successfully");
      fetchSet();
      setPreview(null);
      setMainImage(null);
    } catch (error) {
      console.error(error);
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!setData) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Set</h1>
        <button
          onClick={() => router.push("/dashboard/set")}
          className="text-blue-600"
        >
          Back
        </button>
      </div>

      {/* CURRENT MAIN IMAGE */}
      <div className="mb-6">
        <label className="block mb-2 font-medium">Current Main Image</label>
        <img
          src={`${process.env.NEXT_PUBLIC_FILE_URL}${setData.mainImage}`}
          className="w-72 h-44 object-cover rounded"
          alt="Main"
        />
      </div>

      {/* TITLE */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Title</label>
        <input
          type="text"
          className="w-full border p-2 rounded"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      {/* REPLACE IMAGE */}
      <div className="mb-6">
        <label className="block mb-2 font-medium">
          Replace Main Image (Optional)
        </label>

        <input
          type="file"
          accept="image/*"
          onChange={(e) =>
            e.target.files && handleImageChange(e.target.files[0])
          }
        />

        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="mt-4 w-72 h-44 object-cover rounded"
          />
        )}
      </div>

      {/* CKEDITOR */}
      <div className="mb-6">
        <label className="block mb-2 font-medium">Content</label>

        {Editor && (
          <CKEditor
            editor={Editor}
            data={content}
            onChange={(event: any, editor: any) => {
              const data = editor.getData();
              setContent(data);
            }}
          />
        )}
      </div>

      {/* UPDATE BUTTON */}
      <button
        onClick={handleUpdate}
        disabled={loading}
        className="bg-black text-white px-6 py-2 rounded mb-10"
      >
        {loading ? "Updating..." : "Update Set"}
      </button>

      <hr className="my-10" />

      {/* GALLERY */}
      <h2 className="text-xl font-bold mb-4">Gallery Images</h2>

     <SetGalleryManager setId={id as string} />

    </div>
  );
}
