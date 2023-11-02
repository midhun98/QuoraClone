import json

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import pagination
# Create your views here.
from rest_framework import viewsets

from .models import CustomUser
from .serializer import CustomUserSerializer


class CustomPageNumberPagination(pagination.PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 100


class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all().order_by('id')
    pagination_class = CustomPageNumberPagination
    serializer_class = CustomUserSerializer


def login_api(request):
    if request.method == 'POST':
        body = json.loads(request.body)
        print('body', body)
        username = body.get('username')
        password = body.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({'status': 'success'})
        else:
            return JsonResponse({'status': 'failed'})
    return JsonResponse({'status': 'failed'})


@login_required
def logout_api(request):
    logout(request)
    return render(request, 'index.html')
