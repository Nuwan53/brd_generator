from django.urls import path
from . import views

urlpatterns = [
    path('generate/', views.create_brd, name='create_brd'),
    path('generate-voice/', views.create_brd_from_voice, name='create_brd_from_voice'),
    path('list/', views.list_brds, name='list_brds'),
    path('export/<int:doc_id>/docx/', views.export_brd_docx, name='export_brd_docx'),
    path('export/<int:doc_id>/pdf/', views.export_brd_pdf, name='export_brd_pdf'),
]