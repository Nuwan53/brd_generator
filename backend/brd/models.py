from django.db import models

from django.db import models

class BRDDocument(models.Model):
    title = models.CharField(max_length=255)
    raw_input = models.TextField()
    generated_output = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
