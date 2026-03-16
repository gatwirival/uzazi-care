import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { parse } from 'csv-parse/sync';

// GET /api/files - Get all files
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const patientId = searchParams.get('patientId');

    const files = await prisma.file.findMany({
      where: {
        doctorId: session.user.id,
        ...(patientId && { patientId }),
      },
      orderBy: { uploadDate: 'desc' },
      include: {
        patient: {
          select: {
            id: true,
            name: true,
          },
        },
        _count: {
          select: { inferences: true },
        },
      },
    });

    return NextResponse.json({ files });
  } catch (error) {
    console.error('Get files error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/files - Upload a file
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const patientId = formData.get('patientId') as string;

    if (!file || !patientId) {
      return NextResponse.json(
        { error: 'File and patientId are required' },
        { status: 400 }
      );
    }

    // Verify patient belongs to doctor
    const patient = await prisma.patient.findFirst({
      where: {
        id: patientId,
        doctorId: session.user.id,
      },
    });

    if (!patient) {
      return NextResponse.json(
        { error: 'Patient not found' },
        { status: 404 }
      );
    }

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Parse CSV metadata if it's a CSV file
    let metadata: any = {};
    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      try {
        const csvText = buffer.toString('utf-8');
        const records = parse(csvText, {
          columns: true,
          skip_empty_lines: true,
        });
        metadata = {
          rowCount: records.length,
          columns: records.length > 0 ? Object.keys(records[0] as Record<string, any>) : [],
          sample: records.slice(0, 3), // First 3 rows as sample
        };
      } catch (csvError) {
        console.error('CSV parsing error:', csvError);
        metadata = { parseError: 'Could not parse CSV file' };
      }
    }

    // Upload to Cloudinary
    const uploadResult = await uploadToCloudinary(
      buffer,
      `clinintelai/patient-${patientId}`,
      `${Date.now()}-${file.name.replace(/\s+/g, '-')}`
    );

    // Create file record in database
    const fileRecord = await prisma.file.create({
      data: {
        doctorId: session.user.id,
        patientId,
        fileName: file.name,
        filePath: uploadResult.url,
        fileType: file.type || 'application/octet-stream',
        fileSize: uploadResult.size,
        status: 'UPLOADED',
        metadata: {
          ...metadata,
          cloudinaryPublicId: uploadResult.publicId,
          cloudinaryFormat: uploadResult.format,
        },
      },
    });

    return NextResponse.json({ file: fileRecord }, { status: 201 });
  } catch (error) {
    console.error('Upload file error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
