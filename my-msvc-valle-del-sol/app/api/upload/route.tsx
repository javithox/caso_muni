import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // Validación: verificar si el usuario está autenticado
        return {
          allowedContentTypes: ['video/mp4', 'video/quicktime', 'video/x-matroska'],
          tokenPayload: JSON.stringify({
            // Datos personalizados, ej: userId
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log('Upload completed', blob.url);
        // Aquí podrías guardar la URL del video en tu base de datos (Postgres, MongoDB)
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 }
    );
  }
}