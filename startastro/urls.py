from django.conf.urls import url
from django.conf import settings
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
#from django.shortcuts import get_object_or_404
from django.views.generic.base import RedirectView

from views import *

urlpatterns = [
    #url(r'^adultastro/$', RedirectView.as_view(url='/adultastro')), #doesnt work on production as it redirects to ww.c.edu/adultastro
    url('^/?$', homepage),
    url('^adultastro$', homepage),
    url('^autocomplete',autocomplete),
    url('^addgene',addgene),
    url('^downloadAstData',downloadAstData),
    url('^logdata',logdata),
    #url(r'^adultastro/', homepage),
    #url('^adultastro/$', homepage),#New add 
    #url('adultastro/adultastro', homepage), #New add 
    #url('adultastro/autocomplete',autocomplete),#New add 
    #url('adultastro/addgene',addgene),#New add 
    #url('^adultastro/downloadAstData',downloadAstData), #Newadd
    
]
