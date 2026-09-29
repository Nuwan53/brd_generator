from django.urls import path
from . import views

urlpatterns = [
    path('generate/', views.create_brd, name='create_brd'),
    path('list/', views.list_brds, name='list_brds'),
]