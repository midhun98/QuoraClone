import json

from django.contrib.auth import authenticate, login, logout, get_user_model
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.shortcuts import render
from rest_framework import pagination
# Create your views here.
from rest_framework import viewsets

from .models import CustomUser
from .serializer import CustomUserSerializer

User = get_user_model()


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


def signup(request):
    if request.method == 'POST':
        # Parse the JSON data from the request body
        body = json.loads(request.body)

        # Extract user data from the JSON object
        first_name = body.get('first_name')
        last_name = body.get('last_name')
        password = body.get('password')
        confirm_password = body.get('confirm_password')
        phone_number = body.get('phone')
        email = body.get('email')

        print('password', password)
        print('confirm_password', confirm_password)
        # Check if passwords match
        if password != confirm_password:
            print("no match")
            return JsonResponse({'status': 'error', 'message': 'Passwords do not match'})

        # Create the user
        User = get_user_model()
        user = User.objects.create(
            first_name=first_name,
            last_name=last_name,
            phone_number=phone_number,
            email=email,
        )
        user.set_password(password)
        user.save()

        return JsonResponse({'status': 'success', 'message': 'User created successfully'})

    return JsonResponse({'status': 'error', 'message': 'Invalid request method'})
