//Called from viewFilter.js and multiStuydComparision.js
function getstudy_uniid(selgene, contrast_id, gridid ){
    $.get("getstudy_uniid", {contrast_id:contrast_id}, function(data) {
        loadRepairGeBrowserWindow(selgene, data, gridid);
    });
}
//Called from repair_gebrowser.js and searchannotationgrid.js
function loadRepairGeBrowserWindow(genename, studyname, gridid){

    //Create new window with iframe
    var hh2 = $(window).height()-140;
    var hh = $(window).height()-170;


    var xx = $(gridid).css("z-index");
    var newZZ = (parseInt(xx)+100);
    var mygeneinfo = genename+':'+studyname;
    var mygeneinfoXX = "\'"+mygeneinfo+"\'";

    //disabled ----
    var maintabs = '<div id="repair_gebrowsermainpanel" > \
                        <div id="repair_geHeader" ><label class="label label-info center-block" style="font-size:16px;">GeBrowser</label> \
                        </div>\
                        <div style="height:' + hh + 'px" > \
                               <button type="button" id="showrepairbwfilesbutton" class="btn btn-primary btn-sm center-block disabled" onclick="showrepairbwfiles('+mygeneinfoXX+','+newZZ+')" data-toggle="modal" data-target="#myModal"> \
                                Select Samples \
                               </button> \
                               <iframe id="repair_gebrowserframe" name="repair_gebrowserframeName" frameborder="0" width="100%" height="100%"></iframe>\
                        </div> \
                    </div>';

    $("#extrastuff").append(maintabs);
    var tgx = '#repair_gebrowsermainpanel'
    $(tgx).jqxWindow({
                    showCollapseButton: true, maxHeight: 2000, maxWidth: 2000, minHeight: 200, minWidth: 200, height: '95%', width: '95%',
                    initContent: function () {
                        $(tgx).jqxWindow('focus');
                        getBwFileDetails(mygeneinfo)
                    }
    });

    $(tgx).css("z-index",newZZ);
    $(tgx).bind('close', function () {
        $('div').remove(tgx);
    });
    $(tgx).on('close', function () {
        $(tgx).remove(tgx);
    });
}

function showrepairbwfiles(mygeneinfoXX,newZZ){

    $.ajax({
            dataType: 'json',
            url: 'getAllrepairBwfileDetails',
            data: {
                    'mygeneinfo': mygeneinfoXX
            },
            success: function (data, status, xhr) {
                for (var xxx in data){
                    if (xxx == 'bwfiles'){
                        var bwfiledetails = data[xxx];
                    }
                    else if (xxx == 'genome'){
                        var genome = data[xxx];
                    }
                }

                var mybwfiles = bwfiledetails.split(",");
                var xx = '';
                for (var i=0;  i<mybwfiles.length; i++){
                    //onClick="chkcontrol('+mybwfiles[i]+')"
                    xx = xx + '<div class="checkbox"><label><input class="btn  btn-toggle" name="bwfile" value='+mybwfiles[i]+' type="checkbox">'+mybwfiles[i]+'</label></div>';
                }

                var bwmodal = '<div class="modal" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" > \
                                    <div class="modal-dialog"> \
                                        <div class="modal-content"> \
                                            <div class="modal-header"> \
                                                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button> \
                                                <h4 class="modal-title" id="myModalLabel">Select samples (Maximum of 10 samples are allowed)</h4> \
                                            </div> \
                                            <div class="modal-body" id="filediv" value="0" style="max-height: 500px;overflow: auto;" >'+xx+'</div> \
                                            <div class="modal-footer"> \
                                                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button> \
                                                <button type="button" id="SubmitGeBrowser" class="btn btn-primary" data-dismiss="modal">Submit to GeBrowser</button> \
                                            </div> \
                                         </div> \
                                    </div> \
                              </div>';
                $("#repair_gebrowsermainpanel").append(bwmodal);
                $("#myModal").modal('show');
                //$("#myModal").css("z-index",newZZ+100);
                $('.modal-backdrop').remove();

                $("input:checkbox").click(function() {
                    if ($(this).is(":checked")) {
                        //alert($(this).attr("name"));
                        var totalbwfiles = document.getElementById('filediv').getAttribute('value');
                        var totalbwfiles = parseInt(totalbwfiles)+1;
                        document.getElementById("filediv").setAttribute('value', totalbwfiles);
                        if (totalbwfiles > 10){
                             alert("Only 10 samples are allowed.");
                        }
                    }else{
                        var totalbwfiles = document.getElementById('filediv').getAttribute('value');
                        document.getElementById("filediv").setAttribute('value', parseInt(totalbwfiles)-1);
                    }
                });

                $('#SubmitGeBrowser').on('click', function (e) {
                    var totalbwfiles = document.getElementById('filediv').getAttribute('value');
                    if (totalbwfiles <= 10){
                        var favorite = [];
                        $.each($("input[name='bwfile']:checked"), function(){
                            favorite.push($(this).val());
                        });
                        //alert("My favourite files are: " + favorite.join(", "));
                        submitUserFilesToGebrowser(favorite, genome);
                    }
                    else{
                        alert("You can select upto 10 samples only.")
                    }
                });


            }
    });
}


//function chkcontrol(mybwfile) {
//    var total = document.getElementById('filediv').getAttribute('value');
//    document.getElementById("filediv").setAttribute('value', parseInt(total)+1);
//}

function getBwFileDetails(mygeneinfo){
    $.ajax({
            dataType: 'json',
            url: 'getrepairbwfiles',
            data: {
                    'mygeneinfo': mygeneinfo
            },
            success: function (data, status, xhr) {
                for (var xxx in data){
                    if (xxx == 'totalbwfiles'){
                        var totalbwfiles = Number(data[xxx]);
                    }
                    else if (xxx == 'bwfiles'){
                        var bwfiledetails = data[xxx];
                    }
                    else if (xxx == 'genecords'){
                        var genecords = data[xxx];
                    }
                    else if (xxx == 'genome'){
                        var genome = data[xxx];
                    }
                }

                if (totalbwfiles > 0){
                    $('#showrepairbwfilesbutton').removeClass('disabled');
    		        $('#showrepairbwfilesbutton').addClass('enabled');

                    loadRepairGebrowserIframe( JSON.parse(bwfiledetails), genecords, genome )
                }else{
                    alert("No bigwig files found for your study");
                    $('#showrepairbwfilesbutton').removeClass('enabled');
                    $('#showrepairbwfilesbutton').addClass('disabled');
                }

            }
    });

}

function submitUserFilesToGebrowser(allbigwigfiles, genome){
    $.ajax({
            //dataType: 'json',
            url: 'getsecondreq_repairbwfiles',
            data: {
                    'allbigwigfiles': allbigwigfiles.join(","),
                    'genome':genome,
            },
            success: function (data, status, xhr) {
                loadRepairUserFiles(data, genome);
            }
    });
}

function loadRepairUserFiles(filedetails, genome){
    document.getElementById('repair_gebrowserframe').src="getRepairGebrowserHTML";
    document.getElementById("repair_gebrowserframe").onload = function() {
       document.getElementById('repair_gebrowserframe').contentWindow.geneRepairGeBrowser(filedetails, '', genome);
    }
    /*
	document.getElementById("repair_gebrowserDIV").innerHTML = "";
	embed_washugb({
		host:'repair_gebrowsermain',
		container:document.getElementById('repair_gebrowserDIV'),
		genome:'mm10',
		//maxTrackHeight:30,
		panelWidth: mywidth - 300,
		leftSpaceWidth:200,
		noDeleteButton:true,
		showSingularFacetTable:true,
		showContent:filedetails
	});*/

}

function loadRepairGebrowserIframe(bwfiledetails, genecords, genome){
    document.getElementById('repair_gebrowserframe').src="getRepairGebrowserHTML";
    document.getElementById("repair_gebrowserframe").onload = function() {
    	document.getElementById('repair_gebrowserframe').contentWindow.geneRepairGeBrowser(bwfiledetails, genecords, genome);
        //document.getElementById('repair_gebrowserframe').contentWindow.defaultRepairGeBrowser();
    }
}

/*
function loadRepairBwFiles(filedetails){
    document.getElementById('repair_gebrowserframe').src="getRepairGebrowserHTML";
    document.getElementById("repair_gebrowserframe").onload = function() {
	    document.getElementById("repair_gebrowserDIV").innerHTML = "ekssssssss";
	    embed_washugb({
	        host:'repair_gebrowsermain',
		    container:document.getElementById('repair_gebrowserDIV'),
		    genome:'mm9',
		    //maxTrackHeight:30,
		    panelWidth: mywidth - 300,
		    leftSpaceWidth:200,
		    noDeleteButton:true,
		    //publichubs:['encode','longrange'],
		    showSingularFacetTable:true,
		    showContent:filedetails
	    });
	}
}*/


/*
    var maintabs = '<div id="repair_gebrowsermainpanel" > \
                        <div id="repair_geHeader" ><label class="label label-info center-block" style="font-size:16px;">GeBrowser</label> \
                        </div>\
                        <div style="height:' + hh + 'px" > \
                               <button class="btn btn-sm btn-primary center-block disabled"  onclick="showrepairbwfiles('+mygeneinfoXX+','+newZZ+')" id="showrepairbwfilesbutton" type="button">Select samples</button> \
                               <iframe id="repair_gebrowserframe" name="repair_gebrowserframeName" frameborder="0" width="100%" height="100%"></iframe>\
                        </div> \
                    </div>';*/