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
    path("answers/<int:question_id>", TemplateView.as_view(template_name="answers.html"), name='index'),
    path("questions-without-answers", TemplateView.as_view(template_name="questions_without_answers.html"), name='questions-without-answers'),
    path("add-question", TemplateView.as_view(template_name="add_question.html"), name='add-question'),
    path('api/', include(router.urls)),
]