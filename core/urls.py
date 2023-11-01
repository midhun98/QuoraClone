from django.urls import path, include
from . import views
from django.views.generic import TemplateView
from django.contrib.auth.decorators import login_required
from rest_framework.routers import DefaultRouter
router = DefaultRouter()

router.register('users', views.CustomUserViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
]