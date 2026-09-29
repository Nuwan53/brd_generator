from rest_framework import serializers
from .models import BRDDocument

class BRDDocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = BRDDocument
        fields = ['id', 'title', 'raw_input', 'generated_output', 'created_at']