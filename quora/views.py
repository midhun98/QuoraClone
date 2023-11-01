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

    @action(detail=False, methods=['GET'],  url_path="answers-to-question")
    def answers_to_question(self, request):
        question_id = request.query_params.get('question_id')
        answers = self.queryset.filter(question_id=question_id)
        serializer = AnswerSerializer(answers, many=True)
        return Response(serializer.data)  # Return the serialized data

class LikeViewSet(viewsets.ModelViewSet):
    queryset = Like.objects.all().order_by('id')
    pagination_class = CustomPageNumberPagination
    serializer_class = LikeSerializer
    http_method_names = ['get', 'post', 'head']  # Add 'post' to http_method_names

    @action(detail=False, methods=['GET'])
    def answer_like_count(self, request):
        # Get the answer ID from the request, e.g., /api/likes/answer_like_count/?answer_id=1
        answer_id = request.query_params.get('answer_id')

        # Calculate the like count for the specified answer
        like_count = Like.objects.filter(answer_id=answer_id).count()

        return Response({'answer_id': answer_id, 'like_count': like_count})

    @action(detail=False, methods=['POST'],  url_path="like-answer")
    def like_answer(self, request):
        answer_id = request.data.get('answer_id')
        print("answer_id", answer_id)

        user = request.user  # Assuming you have user authentication

        # Check if the user has already liked this answer
        existing_like = Like.objects.filter(answer_id=answer_id, user=user).first()
        if existing_like:
            return Response({'message': 'You have already liked this answer.'}, status=status.HTTP_400_BAD_REQUEST)

        answer = Answer.objects.get(id=answer_id)
        like = Like(answer=answer, user=user)
        like.save()
        return Response({'message': 'Answer liked successfully.'}, status=status.HTTP_200_OK)

