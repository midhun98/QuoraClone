from django.shortcuts import render
from rest_framework import status, viewsets
from core.views import CustomPageNumberPagination

from .serializers import (
    QuestionSerializer,
    AnswerSerializer,
    LikeSerializer,
)

from .models import (
    Question,
    Answer,
    Like,
)
# Create your views here.


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all().order_by('id')
    pagination_class = CustomPageNumberPagination
    serializer_class = QuestionSerializer


