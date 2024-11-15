from django.shortcuts import render
from django.http import HttpResponse
# Create your views here.
def yasalam(request):
    return HttpResponse("chiba yasalam ! .")
