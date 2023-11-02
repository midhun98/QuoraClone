from django.urls import path, include
from . import views
from django.views.generic import TemplateView
from django.contrib.auth.decorators import login_required
from rest_framework.routers import DefaultRouter
router = DefaultRouter()

router.register('users', views.CustomUserViewSet)

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/login/', views.login_api, name='login-api'),
    path('api/logout/', views.logout_api, name='logout-api'),
    path("login/", TemplateView.as_view(template_name="login.html"), name='login-page'),

]