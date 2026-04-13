"use client";

import { useState, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import { deletePhoto } from "@/app/(app)/trips/[tripId]/photos/actions";
import { useRouter } from "next/navigation";

interface TripPhoto {
  id: string;
  storage_path: string;
  user_id: string;
  created_at: string;
}

interface TripPhotoGalleryProps {
  tripId: string;
  photos: TripPhoto[];
  currentUserId: string;
  isAdmin: boolean;
  supabaseUrl: string;
}

export function TripPhotoGallery({
  tripId,
  photos,
  currentUserId,
  isAdmin,
  supabaseUrl,
}: TripPhotoGalleryProps) {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  function getPublicUrl(path: string) {
    return `${supabaseUrl}/storage/v1/object/public/trip-photos/${path}`;
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type and size (max 5MB)
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) return;

    setUploading(true);
    try {
      const supabase = createClient();
      const ext = file.name.split(".").pop();
      const path = `${tripId}/${crypto.randomUUID()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("trip-photos")
        .upload(path, file);

      if (uploadError) {
        console.error("Upload error:", uploadError);
        return;
      }

      // Save metadata to database
      const { error: dbError } = await supabase.from("trip_photos").insert({
        trip_id: tripId,
        user_id: currentUserId,
        storage_path: path,
      });

      if (dbError) {
        console.error("DB error:", dbError);
        // Cleanup uploaded file
        await supabase.storage.from("trip-photos").remove([path]);
        return;
      }

      router.refresh();
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDelete(photoId: string) {
    const result = await deletePhoto(tripId, photoId);
    if (result.error) {
      console.error(result.error);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-2.5">
        <h3 className="text-sm font-bold text-text-primary m-0">
          تصاویر سفر
        </h3>
        <label
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[10px] text-xs font-semibold cursor-pointer transition-all
            ${uploading ? "bg-card text-text-muted" : "bg-accent-soft text-accent hover:brightness-110 active:scale-[0.97]"}`}
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path
              d="M10 4.167v11.666M4.167 10h11.666"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
          {uploading ? "در حال آپلود..." : "افزودن عکس"}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleUpload}
            disabled={uploading}
          />
        </label>
      </div>

      {photos.length === 0 ? (
        <p className="text-text-muted text-sm text-center py-4">
          هنوز عکسی اضافه نشده
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo) => (
            <div key={photo.id} className="relative group">
              <button
                type="button"
                className="w-full aspect-square rounded-xl overflow-hidden border border-border bg-input-bg cursor-pointer p-0"
                onClick={() => setPreviewUrl(getPublicUrl(photo.storage_path))}
              >
                <img
                  src={getPublicUrl(photo.storage_path)}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
              {(isAdmin || photo.user_id === currentUserId) && (
                <button
                  type="button"
                  onClick={() => handleDelete(photo.id)}
                  className="absolute top-1.5 left-1.5 w-6 h-6 rounded-full bg-bg/80 text-danger flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer border-0 p-0"
                >
                  <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
                    <path
                      d="M6 6l8 8M14 6l-8 8"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Fullscreen preview overlay */}
      {previewUrl && (
        <div
          className="fixed inset-0 z-50 bg-bg/95 flex items-center justify-center p-4"
          onClick={() => setPreviewUrl(null)}
        >
          <button
            type="button"
            onClick={() => setPreviewUrl(null)}
            className="absolute top-4 left-4 w-10 h-10 rounded-full bg-card border border-border text-text-primary flex items-center justify-center cursor-pointer"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M6 6l8 8M14 6l-8 8"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
          <img
            src={previewUrl}
            alt=""
            className="max-w-full max-h-[85vh] rounded-2xl object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
