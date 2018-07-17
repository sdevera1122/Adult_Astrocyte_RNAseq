from django.http import StreamingHttpResponse
from django.template.loader import get_template
from django.template import RequestContext
from django.conf import settings
from django.core.urlresolvers import resolve
import urllib2
from django.contrib.auth.models import User, Permission
import json
import urllib
from django.conf import settings
from django.db.models.query_utils import Q
from gebrowserdbmm9.models import *
from gebrowserdbmm10.models import *
from django.core.context_processors import csrf
from django.views.decorators.csrf import requires_csrf_token
from django.views.decorators.csrf import csrf_exempt
import random


def getAdtAstGEbrowserHTML(request):
    pgx = get_template('gebrowser.html')
    html_pgx = pgx.render(RequestContext(request,{}))    
    return StreamingHttpResponse(html_pgx)

@csrf_exempt
def gebrowserMain(request):
    abs_url = request.build_absolute_uri()
    parseURL_raw = abs_url.split('gebrowserMain')
    parseURL = parseURL_raw[1]
    if "/images/" in parseURL:
        parseURL = "/browser"+parseURL
    else:
        parseURL = parseURL
    myurl = 'http://127.0.0.1:8087'+parseURL
    s_d = urllib2.urlopen(myurl).read()
    return StreamingHttpResponse(s_d,content_type="text/plain")

def getbigwiginfo(request):
    genename = request.GET['genename']
    genecords = ''
    genome = 'mm10'
    if genome == 'mm10':
        try:
            myChr = RefGenemm10.objects.filter(name__iexact=genename.strip()).values('chrom', 'start', 'stop', 'name')[0]
            genecords = myChr['chrom']+":"+str(myChr['start'])+"-"+str(myChr['stop'])
        except Exception,e:
            genecords = 'chr5:24038514-24046266'
    elif genome == 'mm9':
        try:
            myChr = RefGenemm9.objects.filter(name__iexact=genename.strip()).values('chrom', 'start', 'stop', 'name')[0]
            genecords = myChr['chrom']+":"+str(myChr['start'])+"-"+str(myChr['stop'])
        except Exception,e:
            genecords = 'chr5:24038514-24046266'

    pos_col_grd = ["#ff3311/#b30000", "#ff33cc/#B30086", "#4d4dfc/#0202BD", "#4CF4FD/#028B92"]
    neg_col_grd = ["#FEB34B/#AC6502", "#3333ff/#0000b3", "#71FD4E/#23A602", "#D045FE/#7F04A9"]
    myfiles_tracks = []
    mydataDict = {}
    mydataDict['genecords'] = genecords
    
    
    '''
    allbigwigfiles = [
        '579_Ctx_IP.bw','580_Ctx_IP.bw','581_Ctx_IP.bw','595_Ctx_IP.bw','579_Ctx_input.bw','580_Ctx_input.bw','581_Ctx_input.bw','595_Ctx_input.bw',
        '970_Str_IP.bw','971_Str_IP.bw','974_Str_IP.bw','977_Str_IP.bw','970_Hip_IP.bw','971_Hip_IP.bw','974_Hip_IP.bw','977_Hip_IP.bw',
        '970_Str_input.bw','971_Str_input.bw','974_Str_input.bw','977_Str_input.bw','970_Hip_input.bw','971_Hip_input.bw','974_Hip_input.bw','977_Hip_input.bw'
    ]
    '''

    allbigwigfiles = [
        '579_Ctx_Astrocyte.bw','580_Ctx_Astrocyte.bw','581_Ctx_Astrocyte.bw','595_Ctx_Astrocyte.bw','579_Ctx_Wholetissue.bw','580_Ctx_Wholetissue.bw','581_Ctx_Wholetissue.bw','595_Ctx_Wholetissue.bw',
        '970_Str_Astrocyte.bw','971_Str_Astrocyte.bw','974_Str_Astrocyte.bw','977_Str_Astrocyte.bw','970_Hip_Astrocyte.bw','971_Hip_Astrocyte.bw','974_Hip_Astrocyte.bw','977_Hip_Astrocyte.bw',
        '970_Str_Wholetissue.bw','971_Str_Wholetissue.bw','974_Str_Wholetissue.bw','977_Str_Wholetissue.bw','970_Hip_Wholetissue.bw','971_Hip_Wholetissue.bw','974_Hip_Wholetissue.bw','977_Hip_Wholetissue.bw'
    ]
    for eachbw in allbigwigfiles:
        if '_Astrocyte.bw' in eachbw:
            colorpositive = "#2fb69b/#1a6556"#light/dark
        elif '_Wholetissue.bw' in eachbw:
            colorpositive = "#fc8f36/#b05103"
        mydict = {}
        mydict['type'] = "bigWig"
        mydict['url'] = "http://127.0.0.1/static/bigwig/adultastrobigwig/"+eachbw
        mydict['name'] = eachbw
        mydict['mode'] = "show"
        mydict['colorpositive'] = colorpositive
        mydict['colornegative'] = random.choice(neg_col_grd)
        mydict['height'] = "40"
        mydict['fixedscale'] = {'min':-10,'max':10}
        myfiles_tracks.append(mydict)
    mydataDict['bwfiles'] = json.dumps(myfiles_tracks)
    mydataDict['genome'] = genome
    return StreamingHttpResponse(json.dumps(mydataDict), content_type="application/json")




