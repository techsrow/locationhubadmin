/* eslint-disable react-hooks/immutability */
"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import Link from "next/link";

interface SetType {
  id: string;
  title: string;
  mainImage: string;
  createdAt: string;
}

export default function SetListPage() {
  const [sets, setSets] = useState<SetType[]>([]);

  useEffect(() => {
    fetchSets();
  }, []);

  const fetchSets = async () => {
    const res = await api.get("/set");
    setSets(res.data);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this set?")) return;

    await api.delete(`/set/${id}`);
    fetchSets();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Sets</h1>
        <Link
          href="/dashboard/set/create"
          className="bg-black text-white px-4 py-2 rounded"
        >
          + Create Set
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {sets.map((set) => (
          <div
            key={set.id}
            className="border rounded overflow-hidden shadow"
          >
            <img src={`${process.env.NEXT_PUBLIC_FILE_URL}${set.mainImage}`} />


            <div className="p-4">
              <h2 className="font-semibold mb-2">{set.title}</h2>

              <div className="flex justify-between">
                <Link
                  href={`/dashboard/set/${set.id}`}
                  className="text-blue-600"
                >
                  Manage
                </Link>

                <button
                  onClick={() => handleDelete(set.id)}
                  className="text-red-600"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
