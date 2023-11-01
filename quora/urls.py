from django.urls import path, include
from . import views
from django.views.generic import TemplateView
from django.contrib.auth.decorators import login_required
from rest_framework.routers import DefaultRouter
router = DefaultRouter()

router.register('questions', views.QuestionViewSet)
router.register('answers', views.AnswerViewSet)
router.register('likes', views.LikeViewSet)

urlpatterns = [
    path("", TemplateView.as_view(template_name="index.html"), name='index'),
    path("answers", TemplateView.as_view(template_name="answers.html"), name='index'),
    path('api/', include(router.urls)),
]