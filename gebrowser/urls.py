from django.conf.urls import *

from views import *

urlpatterns = patterns('',
    ('^getAdtAstGEbrowserHTML', getAdtAstGEbrowserHTML),
    ('^getbigwiginfo', getbigwiginfo),
    ('^gebrowserMain', gebrowserMain),
)