from django.urls import path
from . import views
from django.views.generic import TemplateView
from django.contrib.auth.decorators import login_required

urlpatterns = [
    path("", TemplateView.as_view(template_name="index.html"), name='index'),
]