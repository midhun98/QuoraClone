from rest_framework import pagination
from .serializer import CustomUserSerializer
# Create your views here.
from rest_framework import viewsets
from .models import CustomUser

class CustomPageNumberPagination(pagination.PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all().order_by('id')
    pagination_class = CustomPageNumberPagination
    serializer_class = CustomUserSerializer
