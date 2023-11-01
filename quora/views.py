from django.shortcuts import render
from rest_framework import status, viewsets
from core.views import CustomPageNumberPagination
from rest_framework.response import Response
from rest_framework.decorators import action

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

    @action(detail=False, methods=['GET'])
    def answer_like_count(self, request):
        # Get the answer ID from the request, e.g., /api/likes/answer_like_count/?answer_id=1
        answer_id = request.query_params.get('answer_id')

        # Calculate the like count for the specified answer
        like_count = Like.objects.filter(answer_id=answer_id).count()

        return Response({'answer_id': answer_id, 'like_count': like_count})