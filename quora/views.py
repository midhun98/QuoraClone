from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from core.views import CustomPageNumberPagination
from .models import (
    Question,
    Answer,
    Like,
)
from .serializers import (
    QuestionSerializer,
    AnswerSerializer,
    LikeSerializer,
)


# Create your views here.


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all().order_by('id')
    pagination_class = CustomPageNumberPagination
    serializer_class = QuestionSerializer

    @action(detail=False, methods=['GET'], url_path="questions-without-answer")
    def questions_without_answer(self, request):
        questions_without_answer = Question.objects.filter(answer__isnull=True)
        page = self.paginate_queryset(questions_without_answer)
        serializer = self.get_serializer(page, many=True)
        return self.get_paginated_response(serializer.data)

    def create(self, request, *args, **kwargs):
        question_data = {
            'title': request.data.get('title'),
            'user': request.user,
        }
        Question.objects.create(**question_data)
        return Response({'success': True}, status=status.HTTP_201_CREATED)


class AnswerViewSet(viewsets.ModelViewSet):
    queryset = Answer.objects.all().order_by('id')
    pagination_class = CustomPageNumberPagination
    serializer_class = AnswerSerializer

    def get_queryset(self):
        return self.queryset.filter(question__answer__isnull=False).distinct()

    @action(detail=False, methods=['GET'], url_path="answers-to-question")
    def answers_to_question(self, request):
        question_id = request.query_params.get('question_id')
        answers = self.queryset.filter(question_id=question_id)
        page = self.paginate_queryset(answers)
        serializer = self.get_serializer(page, many=True)
        return self.get_paginated_response(serializer.data)

    def create(self, request, *args, **kwargs):
        question_id = request.data.get('question')
        question_obj = Question.objects.get(id=question_id)
        answer_data = {
            'content': request.data.get('content'),
            'user': request.user,
            'question': question_obj
        }
        Answer.objects.create(**answer_data)
        return Response({'success': True}, status=status.HTTP_201_CREATED)


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

    @action(detail=False, methods=['POST'], url_path="like-answer")
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
