// =============================================================
// FAYL: lib/cloudinary.ts
// MAQSAD: Cloudinary orqali rasm yuklash.
//         uploadImage() — bitta File obyektini Cloudinary ga
//         yuklaydi va secure URL qaytaradi.
//         Rasm buffer ga aylantiriladi va stream orqali yuklanadi.
// =============================================================

import { v2 as cloudinary } from "cloudinary";

// Cloudinary SDK ni .env.local sozlamalari bilan konfiguratsiya qilish
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Rasm yuklash funksiyasi
// file   — brauzerdan kelgan File obyekti
// folder — Cloudinary dagi papka nomi (default: "wedding-halls")
// return — yuklangan rasmning HTTPS URL si
export async function uploadImage(
  file: File,
  folder = "wedding-halls"
): Promise<string> {
  // File ni ArrayBuffer ga, keyin Node.js Buffer ga aylantirish
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  // Promise orqali stream yuklash (Cloudinary async callback ishlatadi)
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder, resource_type: "image" }, (error, result) => {
        if (error) reject(error);
        else resolve(result!.secure_url); // HTTPS URL qaytarish
      })
      .end(buffer); // Buffer ni stream ga yuborish
  });
}

export default cloudinary;
