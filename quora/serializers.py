from rest_framework import serializers
from .models import (
    Question,
    Answer,
    Like,
)

class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Question
        fields = '__all__'


class AnswerSerializer(serializers.ModelSerializer):
    question = QuestionSerializer()  # Include the nested serializer
    class Meta:
        model = Answer
        fields = '__all__'

class LikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = '__all__'
