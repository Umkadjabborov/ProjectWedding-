import { auth } from "@/lib/auth";
import { ok, unauthorized, err, serverError } from "@/lib/api-response";
import { uploadImage } from "@/lib/cloudinary";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) return unauthorized();

    const formData = await req.formData();
    const files = formData.getAll("files") as File[];

    if (!files.length) return err("Fayl tanlanmadi", 400);
    if (files.length > 10) return err("Ko'pi bilan 10 ta fayl", 400);

    const urls = await Promise.all(files.map((f) => uploadImage(f)));
    return ok({ urls });
  } catch (e) {
    console.error("[UPLOAD]", e);
    return serverError();
  }
}
