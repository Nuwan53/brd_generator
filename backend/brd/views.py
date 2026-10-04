from django.shortcuts import render

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import BRDDocument
from .serializers import BRDDocumentSerializer
from .llm_service import generate_brd

@api_view(['POST'])
def create_brd(request):
    raw_text = request.data.get('raw_input', '').strip()
    if not raw_text:
        return Response({"error": "raw_input is required"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        output = generate_brd(raw_text)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_502_BAD_GATEWAY)

    doc = BRDDocument.objects.create(
        title=output.get("title", "Untitled BRD"),
        raw_input=raw_text,
        generated_output=output
    )
    serializer = BRDDocumentSerializer(doc)
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def list_brds(request):
    docs = BRDDocument.objects.all().order_by('-created_at')
    serializer = BRDDocumentSerializer(docs, many=True)
    return Response(serializer.data)


from django.http import FileResponse
from .export_service import export_to_docx, export_to_pdf

@api_view(['GET'])
def export_brd_docx(request, doc_id):
    try:
        doc = BRDDocument.objects.get(id=doc_id)
    except BRDDocument.DoesNotExist:
        return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

    buffer = export_to_docx(doc.generated_output)
    response = FileResponse(
        buffer,
        as_attachment=True,
        filename=f"{doc.title.replace(' ', '_')}.docx"
    )
    return response


@api_view(['GET'])
def export_brd_pdf(request, doc_id):
    try:
        doc = BRDDocument.objects.get(id=doc_id)
    except BRDDocument.DoesNotExist:
        return Response({"error": "Not found"}, status=status.HTTP_404_NOT_FOUND)

    buffer = export_to_pdf(doc.generated_output)
    response = FileResponse(
        buffer,
        as_attachment=True,
        filename=f"{doc.title.replace(' ', '_')}.pdf"
    )
    return response

from .llm_service import generate_brd, transcribe_audio

@api_view(['POST'])
def create_brd_from_voice(request):
    audio_file = request.FILES.get('audio')
    if not audio_file:
        return Response({"error": "audio file is required"}, status=status.HTTP_400_BAD_REQUEST)

    audio_bytes = audio_file.read()
    mime_type = audio_file.content_type or "audio/mpeg"

    try:
        transcript = transcribe_audio(audio_bytes, mime_type)
    except Exception as e:
        return Response({"error": f"Transcription failed: {str(e)}"}, status=status.HTTP_502_BAD_GATEWAY)

    if not transcript:
        return Response({"error": "Transcription returned empty text"}, status=status.HTTP_502_BAD_GATEWAY)

    try:
        output = generate_brd(transcript)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_502_BAD_GATEWAY)

    doc = BRDDocument.objects.create(
        title=output.get("title", "Untitled BRD"),
        raw_input=transcript,
        generated_output=output
    )
    serializer = BRDDocumentSerializer(doc)
    response_data = serializer.data
    response_data['transcript'] = transcript  # so frontend can show what was heard
    return Response(response_data, status=status.HTTP_201_CREATED)