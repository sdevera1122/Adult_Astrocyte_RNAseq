from django.shortcuts import render

from django.http import HttpResponse, StreamingHttpResponse
from django.template.loader import get_template
from django.template import RequestContext
from operator import itemgetter
import math
import os, datetime, calendar
import json
import operator
import time
import string
import tarfile
from django.db.models import Max
from django.conf import settings
from models import *
from django.shortcuts import render_to_response
from django.http import HttpResponse, HttpResponseRedirect
from django.db import transaction
import math
from collections import Counter

def homepage(request):
	try:
		del request.session['finalfpkmdata']
		del request.session['genelistOrder']
	except:
		pass
	tx = get_template('homepage.html')
	html_tx = tx.render({},request)
	return HttpResponse(html_tx)

def autocomplete(request):
    maxRows = request.GET['maxRows']
    genesearchTerm = request.GET['genesearchTerm']
    mygenes = justgenes.objects.filter(genename__icontains = genesearchTerm).values_list('genename',flat=True).order_by('genename')[:int(maxRows)]
    mygenes = [str(x) for x in mygenes]
    #print "----------",mygenes
    return StreamingHttpResponse( json.dumps(mygenes) )

def logdata(request):
	alldata = adultastro_logtable.objects.all().values('genelist')
	eachgenelist = []
	for row in alldata:
		eachgenelist += row['genelist'].split(",")

	logdatahits = dict(Counter(eachgenelist).most_common(10))
	geneNameList = []
	geneCountList = []

	d = logdatahits
	for w in sorted(d, key=d.get, reverse=True):
		geneNameList.append(w)
		geneCountList.append(d[w])
	return render_to_response( "logdata.html", { 'geneNameList': json.dumps(geneNameList), 'geneCountList':json.dumps(geneCountList) } )

def addgene(request):
    genename = request.GET['query']
    fpkmvalues = getgenedata(genename)
    try:
        loggeneentry(genename)
    except:
        pass
    return render_to_response( "results.html", {'finalfpkmdata': json.dumps(fpkmvalues) })


def getDistributionBins(datatype):
    if datatype == 'cortex':
        mydata = cortex.objects.all().values_list('ip_avg', flat=True)
    elif datatype == 'striatum':
        mydata = striatum_hippocampus.objects.all().values_list('str_ip_avg', flat=True)
    elif datatype == 'hippocampus':
        mydata = striatum_hippocampus.objects.all().values_list('hip_ip_avg', flat=True)
    mydata = [float(x) for x in mydata]
    
    mydata.sort()
    bin_a = 0
    bin_b = 0
    bin_c = 0
    bin_d = 0
    bin_e = 0
    bin_f = 0
    bin_g = 0
    bin_h = 0
    bin_i = 0
    bin_j = 0
    #bin_k = 0
    #bin_l = 0
    #bin_m = 0
    for x in mydata:
        if x == 0:
            bin_a += 1
        elif x > 0 and x <= 0.1:
            bin_b += 1
        elif x > 0.1 and x <= 1:
            bin_c += 1
        elif x > 1 and x <= 5:
            bin_d += 1
        elif x > 5 and x <= 10:
            bin_e += 1
        elif x > 10 and x <= 15:
            bin_f += 1
        elif x > 15 and x <= 20:
            bin_g += 1
        elif x > 20 and x <= 100:
            bin_h += 1
        elif x > 100 and x <= 1000:
            bin_i += 1
        elif x > 1000:
            bin_j += 1
    
    dist_bins = [bin_a, bin_b, bin_c, bin_d, bin_e, bin_f, bin_g, bin_h, bin_i, bin_j]
    return dist_bins

def getgenedata(genename):
    mydict = {}
    dd = {}
    
    cortex_dist_bins = getDistributionBins('cortex')
    striatum_dist_bins = getDistributionBins('striatum')
    hippocampus_dist_bins = getDistributionBins('hippocampus')

    #yy = cortex.objects.all().values_list('ip_avg', flat=True)
    #yy = [float(x) for x in yy]
    # mydict['cortex_test'] = yy

    mydict['cortex_dist_bins'] = cortex_dist_bins
    mydict['striatum_dist_bins'] = striatum_dist_bins
    mydict['hippocampus_dist_bins'] = hippocampus_dist_bins
   
    #cortex
    try:
        crtdata = cortex.objects.filter(genename=genename).values('ip_avg','input_avg','ip_sem','input_sem')[0]
        dd['cortex_ip_val'] = round( float(crtdata['ip_avg']),5)
        dd['cortex_input_val'] = round( float(crtdata['input_avg']),5)
        dd['cortex_ip_val_sem'] = round( float(crtdata['ip_sem']),5)
        dd['cortex_input_val_sem'] = round( float(crtdata['input_sem']),5)
    except Exception as e:
        print "Errot at cortex fetch", e
        dd['cortex_ip_val'] = 0
        dd['cortex_input_val'] = 0
        dd['cortex_ip_val_sem'] = 0
        dd['cortex_input_val_sem'] = 0
    
    #striatum n hippocampus
    try:
        str_hip_data = striatum_hippocampus.objects.filter(genename=genename).values('str_ip_avg','str_input_avg','hip_ip_avg','hip_input_avg', 'str_ip_sem','str_input_sem','hip_ip_sem','hip_input_sem', 'ratio_strip_hipip_de')[0]
        dd['striatum_ip_val'] = round( float(str_hip_data['str_ip_avg']),5)
        dd['striatum_input_val'] = round( float(str_hip_data['str_input_avg']),5)
        dd['striatum_ip_val_sem'] = round( float(str_hip_data['str_ip_sem']),5)
        dd['striatum_input_val_sem'] = round( float(str_hip_data['str_input_sem']),5)
        
        dd['hippocampus_ip_val'] = round( float(str_hip_data['hip_ip_avg']),5)
        dd['hippocampus_input_val'] = round( float(str_hip_data['hip_input_avg']),5)
        dd['hippocampus_ip_val_sem'] = round( float(str_hip_data['hip_ip_sem']),5)
        dd['hippocampus_input_val_sem'] = round( float(str_hip_data['hip_input_sem']),5)

        ratio_strip_hipip_de = round( float(str_hip_data['ratio_strip_hipip_de']),3)
    except Exception as e:
        print "Errot at str_hip fetch", e 
        dd['striatum_ip_val'] = 0
        dd['striatum_input_val'] = 0
        dd['hippocampus_ip_val'] = 0
        dd['hippocampus_input_val'] = 0

        ratio_strip_hipip_de = 0

    mydict[genename] = dd

    #protein_list
    proteinDataList = []
    try:
        proteindata = protein_list.objects.filter(genename=genename).values('proteinname','protein_accession','average_ratio_str_hip')
        if len(proteindata) > 0:
            for eachrow in proteindata:
                eachrow['average_ratio_str_hip'] = round( float(eachrow['average_ratio_str_hip']),3)
                eachrow['ratio_strip_hipip_de'] = ratio_strip_hipip_de
                proteinDataList.append( (eachrow) )
        else:
            proteindata = {'average_ratio_str_hip':'Undetected', 'protein_accession':'NA','proteinname':'NA','ratio_strip_hipip_de':ratio_strip_hipip_de}
            proteinDataList.append(proteindata)
    except Exception as e:
        print "Error while fetching protein data or no record found: ", e
        proteindata = {'average_ratio_str_hip':'Undetected', 'protein_accession':'NA','proteinname':'NA','ratio_strip_hipip_de':ratio_strip_hipip_de}
        proteinDataList.append(proteindata)
    
    mydict['proteindata'] = proteinDataList

    return mydict

@transaction.atomic()
def loggeneentry(genename):
	todaysdate = time.strftime("%Y-%m-%d")
	genelist = ''
	res = adultastro_logtable.objects.filter(date_added=todaysdate).values()
	if res.exists():
		print "record exists so update"
		mylogentry = res[0]
		mygenelist = mylogentry['genelist']
		if genename not in mygenelist:
			mygenelist = mygenelist+','+genename
			try:
				updaterow = adultastro_logtable.objects.get(date_added=todaysdate)
				updaterow.genelist = mygenelist
				updaterow.save()
			except Exception as e:
				print "Error updating log table", e
	else:
		print "no record exists so insert"
		try:
			aa = adultastro_logtable(genelist=genename, date_added=todaysdate)
			aa.save()
		except Exception as e:
			print "Error inserting log table", e


def downloadAstData(request):
	justfile_name = 'AdultAstrocytesData.tar.gz'
	url = '/reversedownload/downloadReadbrowser/' + justfile_name
	response = HttpResponse(content_type='application/x-gzip')
	response['Content-Disposition'] = 'attachment; filename=' + justfile_name
	response['X-Accel-Redirect'] = url
	return response

'''
bin_a = 0
    bin_b = 0
    bin_c = 0
    bin_d = 0
    bin_e = 0
    bin_f = 0
    bin_g = 0
    bin_h = 0
    bin_i = 0
    bin_j = 0
    bin_k = 0
    bin_l = 0
    bin_m = 0
    for x in mydata:
        if x == 0:
            bin_a += 1
        elif x > 0 and x <= 0.1:
            bin_b += 1
        elif x>0.1 and x <= 1:
            bin_c += 1
        elif x > 1 and x <= 2:
            bin_d += 1
        elif x > 2 and x <= 4:
            bin_e += 1
        elif x > 4 and x <= 6:
            bin_f += 1
        elif x > 6 and x <= 8:
            bin_g += 1
        elif x > 8 and x <= 10:
            bin_h += 1
        elif x > 10 and x <= 15:
            bin_i += 1
        elif x > 15 and x <= 20:
            bin_j += 1
        elif x > 20 and x <= 100:
            bin_k += 1
        elif x > 100 and x <= 1000:
            bin_l += 1
        elif x > 1000:
            bin_m += 1

'''