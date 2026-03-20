import { NextRequest, NextResponse } from "next/server";
import { uploadToCloudinary } from "@/lib/cloudinary";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

const MAX_VIDEO_SIZE_BYTES = 100 * 1024 * 1024;

export async function GET() {
  try {
    const videos = await prisma.educationVideo.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json({ videos });
  } catch (error) {
    console.error("Education videos fetch error:", error);
    return NextResponse.json({ error: "Could not load videos." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
      return NextResponse.json(
        { error: "Video upload is not configured. Add Cloudinary keys to environment variables." },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll("videos").filter((item): item is File => item instanceof File);

    if (!files.length) {
      return NextResponse.json({ error: "At least one video file is required." }, { status: 400 });
    }

    const uploads = [] as Array<{ id: string; name: string; url: string; publicId: string; size: number }>;

    for (const file of files) {
      if (!file.type.startsWith("video/")) {
        return NextResponse.json(
          { error: `Unsupported file type for ${file.name}. Please upload video files only.` },
          { status: 400 }
        );
      }

      if (file.size > MAX_VIDEO_SIZE_BYTES) {
        return NextResponse.json(
          { error: `${file.name} exceeds the 100MB upload limit.` },
          { status: 400 }
        );
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploaded = await uploadToCloudinary(
        buffer,
        "afya/education-videos",
        `${Date.now()}-${file.name.replace(/\s+/g, "-").replace(/[^a-zA-Z0-9.-]/g, "")}`
      );

      const record = await prisma.educationVideo.create({
        data: {
          title: file.name.replace(/\.[^/.]+$/, ""),
          fileName: file.name,
          url: uploaded.url,
          publicId: uploaded.publicId,
          fileSize: uploaded.size,
        },
      });

      uploads.push({
        id: record.id,
        name: file.name,
        url: uploaded.url,
        publicId: uploaded.publicId,
        size: uploaded.size,
      });
    }

    return NextResponse.json({ uploads }, { status: 201 });
  } catch (error) {
    console.error("Education video upload error:", error);
    return NextResponse.json({ error: "Could not upload video(s)." }, { status: 500 });
  }
}
