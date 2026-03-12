import { NextRequest, NextResponse } from "next/server"
import { writeFile, mkdir } from "fs/promises"
import { join } from "path"
import { randomBytes } from "crypto"

const MAX_SIZE = 10 * 1024 * 1024 // 10MB

const ALLOWED_MIME_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/png",
])

const ALLOWED_EXTENSIONS = new Set([".pdf", ".jpg", ".jpeg", ".png"])

function getExtension(filename: string): string {
  const dot = filename.lastIndexOf(".")
  return dot !== -1 ? filename.slice(dot).toLowerCase() : ""
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file")

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "No file provided." },
        { status: 400 }
      )
    }

    // Validate MIME type
    if (!ALLOWED_MIME_TYPES.has(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only PDF, JPG, and PNG files are accepted." },
        { status: 400 }
      )
    }

    // Validate extension
    const ext = getExtension(file.name)
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json(
        { error: "Invalid file extension. Only .pdf, .jpg, .jpeg, and .png are accepted." },
        { status: 400 }
      )
    }

    // Validate size
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File is too large. Maximum size is 10MB." },
        { status: 400 }
      )
    }

    // Generate safe random filename
    const random = randomBytes(16).toString("hex")
    const safeName = `permit_${Date.now()}_${random}${ext}`

    // Ensure upload directory exists
    const uploadDir = join(process.cwd(), "public", "uploads", "permits")
    await mkdir(uploadDir, { recursive: true })

    // Write file
    const bytes = await file.arrayBuffer()
    await writeFile(join(uploadDir, safeName), new Uint8Array(bytes))

    const url = `/uploads/permits/${safeName}`

    return NextResponse.json({ url })
  } catch (err) {
    console.error("[UPLOAD_PERMIT] Error:", err)
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 500 }
    )
  }
}
