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


class AnswerViewSet(viewsets.ModelViewSet):
    queryset = Answer.objects.all().order_by('id')
    pagination_class = CustomPageNumberPagination
    serializer_class = AnswerSerializer

    def get_queryset(self):
        return self.queryset.filter(question__answer__isnull=False).distinct()


class LikeViewSet(viewsets.ModelViewSet):
    queryset = Like.objects.all().order_by('id')
    pagination_class = CustomPageNumberPagination
    serializer_class = LikeSerializer
