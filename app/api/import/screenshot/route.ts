import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No image uploaded.' }, { status: 400 });
    }

    // Placeholder: later send the image to your extraction model / OCR pipeline.
    // For now return a review-required example shape.

    return NextResponse.json({
      rows: [],
      message:
        'Screenshot parsing route is wired. Next step is connecting your image extraction pipeline and returning candidate rows for review.',
    });
  } catch {
    return NextResponse.json({ error: 'Failed to parse screenshot.' }, { status: 500 });
  }
}