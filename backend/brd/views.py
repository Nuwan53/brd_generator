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

@api_view(['POST'])
def create_brd(request):
    print("RAW BODY:", request.body)
    print("PARSED DATA:", request.data)
    raw_text = request.data.get('raw_input', '').strip()