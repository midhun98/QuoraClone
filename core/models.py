from django.contrib.auth.models import AbstractBaseUser, Group, User, PermissionsMixin
from django.utils import timezone
from core.manager import  CustomUserManager


from django.db import models

# Create your models here.

class CustomUser(AbstractBaseUser, PermissionsMixin):
    phone_number = models.CharField(max_length=15, unique=True, db_index=True)
    email = models.EmailField(unique=True, null=True, blank=True)
    first_name = models.CharField(max_length=30, blank=True)
    last_name = models.CharField(max_length=30, blank=True)
    profile_picture = models.ImageField(upload_to='profile/', blank=True, null=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = "phone_number"
    REQUIRED_FIELDS = []

    objects = CustomUserManager()

    def __str__(self):
        return self.phone_number