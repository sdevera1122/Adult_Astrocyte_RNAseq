
var initGEBrowser = function(divid){
    hh2 = $(window).height()-140;
    hh = $(window).height()-170;

    var maintabs = '<div id="gebrowsermainpanel"> \
                        <div id=\'gebrowserTabs\'> \
                            <ul style=\'margin-left: 10px;font-weight: bold;\'> \
                                <li>Home</li> \
                                <li onClick="loadgebrowserframe()">GE Browser</li> \
                            </ul> \
                            <div style="overflow: hidden;"> \
                                <div id="homegebrowser"> \
                                    <table height=' + hh + ' > \
                                        <tr> \
                                            <td width="50%"  style="padding:10px; vertical-align: top;border-right: 2px solid grey;"> \
                                                The <b>GE Browser</b>  Welcome to Gene enrichment genome browser. \
                                            </td> \
                                            <td width="50%" style="vertical-align: top;"> \
                                            </td> \
                                        </tr> \
                                    </table> \
                                </div> \
                            </div> \
                            <div style="overflow: hidden;"> \
                                <div style="height:' + hh + 'px" > \
                                	<iframe id="gebrowserframe" name="gebrowserframeName" frameborder="0" width="100%" height="100%"></iframe>\
                                </div> \
                            </div> \
                        </div> \
                    </div>';

    $("#" + divid).append(maintabs);

    $('#gebrowserTabs').jqxTabs({ 
        width: $(window).width()-50,
        height: $(window).height()-140,
        reorder:true,
        theme: theme
    });
}

function loadgebrowserframe(){
    document.getElementById('gebrowserframe').src="/hdinhd/gebrowser/init";
    document.getElementById("gebrowserframe").onload = function() {
    	document.getElementById('gebrowserframe').contentWindow.defaultGeBrowser();
    }
}

function loadgebrowserframe_userdefined(){
    document.getElementById('gebrowserframe').src="/hdinhd/gebrowser/init";
    document.getElementById("gebrowserframe").onload = function() {
    	document.getElementById('gebrowserframe').contentWindow.userDefinedGeBrowser();
    }
}
function loadTissueServaySamples(filedetails){
	document.getElementById("gebrowserDIV").innerHTML = "";
	embed_washugb({
		//host:'/gebrowserMain',
		host:'/hdinhd/gebrowser/gebrowserMain',
		//host:'https://coppolalab.ucla.edu',
		container:document.getElementById('gebrowserDIV'),
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

function ShowTissueSurvey(){
	var gewindow_divtag = '<div id="ge_samplewindow" >\
         <div id="windowHeader">Samples Selection Window</div> \
		 <div id="ge_sampleDetails" style="overflow: hidden;">\
			<table> \
        		<tr class="highlightX"> \
            		<td align="right">Gender:</td> \
            		<td align="left"><input type="hidden" id="ge_gender_combo" style="width:400px"/></td> \
        		</tr>\
				<tr class="highlightX"> \
					<td align="right">Data Type:</td> \
					<td align="left"><input type="hidden" id="ge_datatype_combo" style="width:400px"/></td> \
				</tr>\
				<tr class="highlightX"> \
					<td align="right">Tissue:</td> \
					<td align="left"><input type="hidden" id="ge_tissue_combo" style="width:400px"/></td> \
				</tr>\
				<tr class="highlightX"> \
					<td align="right">Q Size:</td> \
					<td align="left"><input type="hidden" id="ge_qsize_combo" style="width:400px"/></td> \
				</tr> \
			</table> \
		</div>\
	</div>';
	
	/*
	 * <!--\
	 * 			<tr class="highlightX"> \
            		<td align="right">Age:</td> \
            		<td align="left"><input type="hidden" id="ge_age_combo" style="postion:absolute; top:0px; width:300px"/></td> \
        		</tr>\
				-->\
        		
	 */
	var tg = '#ge_samplewindow';
	$("#gebrowser_tissuesurveyid").append(gewindow_divtag);

	$("#windowHeader").css("background-color", "#4D94FF");
	$("#windowHeader").css("color", "white");

	$("#ge_samplewindow").bind('close', function () {
		$('div').remove('#ge_samplewindow');
	});
	$('#ge_samplewindow').on('close', function () { $('#ge_samplewindow').remove('#ge_samplewindow');  }); 

		
	/*
	$('#ge_gender_combo').select2({
		placeholder: "Select gender",
        multiple: true,
        selectOnBlur: true,
        separator: "$$$", 
        tokenSeparators: [','],
        tags: ["Male", "Female"]
     });
	$('#ge_gender_combo').select2('open');
    $('#ge_gender_combo').select2('focus');*/
    
    var preload_sex = [{ id: 'MALE', text: 'Male'},
	                   { id: 'FEMALE', text: 'Female'} 
	];
    
	$('#ge_gender_combo').select2({
	                   placeholder: "Select gender",
	                   multiple: true,
	                   selectOnBlur: true,
	                   separator: "$$$", 
	                   tokenSeparators: [','],
	                   query: function (query){
	                       var data = {results: []};
	            
	                       $.each(preload_sex, function(){
	                           if(query.term.length == 0 || this.text.toUpperCase().indexOf(query.term.toUpperCase()) >= 0 ){
	                               data.results.push({id: this.id, text: this.text });
	                           }
	                       });
	            
	                       query.callback(data);
	                   }
	});
	$('#ge_gender_combo').select2('data', preload_sex );
	
	var preload_age = [{ id: '2', text: '2mon'},
	                   { id: '6', text: '6mon'},
	                   { id: '10', text: '10mon'} 
	];
	$('#ge_age_combo').select2({
	                   placeholder: "Select age",
	                   multiple: true,
	                   selectOnBlur: true,
	                   separator: "$$$",
	                   tags: preload_age,
	                   tokenSeparators: [','],
	                   query: function (query){
	                       var data = {results: []};
	            
	                       $.each(preload_age, function(){
	                           if(query.term.length == 0 || this.text.toUpperCase().indexOf(query.term.toUpperCase()) >= 0 ){
	                               data.results.push({id: this.id, text: this.text });
	                           }
	                       });
	            
	                       query.callback(data);
	                   }
	});
	//$('#ge_age_combo').select2('data', preload_age );


	var preload_datatype = [{ id: 'mRNA', text: 'mRNA'},
	                   { id: 'miRNA', text: 'miRNA'},
	 ];
	 $('#ge_datatype_combo').select2({
	                   placeholder: "Select data",
	                   multiple: true,
	                   selectOnBlur: true,
	                   separator: "$$$", 
	                   tokenSeparators: [','],
	                   query: function (query){
	                       var data = {results: []};
	            
	                       $.each(preload_datatype, function(){
	                           if(query.term.length == 0 || this.text.toUpperCase().indexOf(query.term.toUpperCase()) >= 0 ){
	                               data.results.push({id: this.id, text: this.text });
	                           }
	                       });
	            
	                       query.callback(data);
	                   }
	  });
	  $('#ge_datatype_combo').select2('data', preload_datatype[0] );

	  var preload_qsize = [{ id: 'Q20', text: 'Q20'},
	                       { id: 'Q80', text: 'Q80'},
	                       { id: 'Q92', text: 'Q92'},
	                       { id: 'Q140', text: 'Q140'},
	                       { id: 'Q111', text: 'Q111'},
	                   { id: 'Q175', text: 'Q175'},
	 ];
	 $('#ge_qsize_combo').select2({
	                   placeholder: "Select Qsize",
	                   multiple: true,
	                   selectOnBlur: true,
	                   separator: "$$$",
	                   tags: ['Q20', 'Q80', 'Q92', 'Q140', 'Q111', 'Q175'],
	                   tokenSeparators: [','],
	                   /*query: function (query){
	                       var data = {results: []};
	            
	                       $.each(preload_qsize, function(){
	                           if(query.term.length == 0 || this.text.toUpperCase().indexOf(query.term.toUpperCase()) >= 0 ){
	                               data.results.push({id: this.id, text: this.text });
	                           }
	                       });
	            
	                       query.callback(data);
	                   }*/
	 });
	 //$('#ge_qsize_combo').select2('data', preload_qsize );
	 
	 var preload_tissues = [{ id: 'AdiposeWhIntest', text: 'AdiposeWhIntest'},
	                   { id: 'Brainstem', text: 'Brainstem'}, 
	                   { id: 'AdiposeBrown', text: 'AdiposeBrown'},
	                   { id: 'HypothalamusThalamus', text: 'HypothalamusThalamus'}, 
	                   { id: 'Heart', text: 'Heart'},
	                   { id: 'Hippocampus', text: 'Hippocampus'}, 
	                   { id: 'Cerebellum', text: 'Cerebellum'},
	                   { id: 'AdiposeWhGonad', text: 'AdiposeWhGonad'}, 
	                   { id: 'CorpusCallosum', text: 'CorpusCallosum'},
	                   { id: 'Gastrocnemius', text: 'Gastrocnemius'}, 
	                   { id: 'Skin', text: 'Skin'}
	 ];

	 
	 $('#ge_tissue_combo').select2({
	                   placeholder: "Select tissue",
	                   multiple: true,
	                   selectOnBlur: true,
	                   separator: "$$$",
	                   tags: ["AdiposeBrown", "AdiposeWhIntest", "AdiposeWhGonad", "Brainstem", "Cerebellum","CorpusCallosum", "Heart", "Hippocampus", "HypothalamusThalamus","Gastrocnemius","Skin"],
	                   tokenSeparators: [',']
	 					
	                   /*query: function (query){
	                       var data = {results: []};
	            
	                       $.each(preload_tissues, function(){
	                           if(query.term.length == 0 || this.text.toUpperCase().indexOf(query.term.toUpperCase()) >= 0 ){
	                               data.results.push({id: this.id, text: this.text });
	                           }
	                       });
	            
	                       query.callback(data);
	                   }*/
	});
	//$('#ge_tissue_combo').select2('data', preload_tissues );
	
	$(tg).jqxWindow({
        showCollapseButton: false, maxHeight: 1200, maxWidth: 600, minHeight: 200, minWidth: 200, height: '60%', width: '80%',
        initContent: function () {$(tg).jqxWindow('focus');}
    });
	
	
	var xx =  '<div id = "ref_but"  style="position:absolute; top:400px;"> \
			   	<img id="refreshimg_ge1" alt="Refresh" style="position:absolute; top:15px; margin-left: 100px;" src="/static/images/repair_images/refresh.png"/> \
			 	<div style="position:absolute; top:15px; width:200px; margin-left: 150px;" id="tissuesamplescount"># Tissue samples </div> \
				<input type="button" value="Submit to GE Browser" style="position:absolute; margin-left: 100px; top:75px;" id="SubmitToGEBrowser" /> \
			 <div>';
	
	$('#ge_samplewindow').append(xx);
	
	$("#SubmitToGEBrowser").jqxButton({template: "success" });
	
	$("#refreshimg_ge1").click(function () {
		var row = new Object();
        if ( $("#ge_qsize_combo").val() != "" ){
        	row.ge_qsize_combo = $("#ge_qsize_combo").val();
        }
        if ( $("#ge_age_combo").val() != "" ){
        	row.ge_age_combo = $("#ge_age_combo").val();
        }
        row.ge_tissue_combo = $("#ge_tissue_combo").val();
        row.ge_datatype_combo = $("#ge_datatype_combo").val();
        if ( $("#ge_gender_combo").val() != "" ){
        	row.ge_gender_combo = $("#ge_gender_combo").val();
        }
        row.querystatus = 'totalcount';
        $.ajax({
                dataType: 'json',
                url: '/hdinhd/gebrowser/getTissueSurveyCounts',
                data: {
                    'params': JSON.stringify(row)
                },
                success: function (data, status, xhr) {
                	var msg = data + " Tissue samples";
                	$('#tissuesamplescount').text(msg);
                }
        });
	});
	
	$("#SubmitToGEBrowser").click(function () {
    	var row = new Object();
        
    	if ( $("#ge_qsize_combo").val() != "" ){
        	row.ge_qsize_combo = $("#ge_qsize_combo").val();
        }
        if ( $("#ge_age_combo").val() != "" ){
        	row.ge_age_combo = $("#ge_age_combo").val();
        }
        row.ge_tissue_combo = $("#ge_tissue_combo").val();
        row.ge_datatype_combo = $("#ge_datatype_combo").val();
        if ( $("#ge_gender_combo").val() != "" ){
        	row.ge_gender_combo = $("#ge_gender_combo").val();
        }
        row.querystatus = 'tissuesurverfiles';
        $.ajax({
                dataType: 'json',
                url: '/hdinhd/gebrowser/getTissueSurveyCounts',
                data: {
                    'params': JSON.stringify(row)
                },
                success: function (data, status, xhr) {                	
                    // update command is executed.
                	$('#ge_samplewindow').jqxWindow('close');
                	$('div').remove('#ge_samplewindow');
                	console.log(data)
                	loadTissueServaySamples(data)
                }
        });
        
    	
    });
	
}


function ShowTissuesOnly(){
	var gewindow_divtag = '<div id="ge_samplewindow" >\
         <div id="windowHeader">Samples Selection Window</div> \
		 <div id="ge_sampleDetails" style="overflow: hidden;">\
			<table> \
        		<tr class="highlightX"> \
					<td align="right">Age:</td> \
					<td align="left"><input type="hidden" id="ge_age_combo" style="width:300px"/></td> \
				</tr>\
				<tr class="highlightX"> \
					<td align="right">Data Type:</td> \
					<td align="left"><input type="hidden" id="ge_datatype_combo" style="width:400px"/></td> \
				</tr>\
				<tr class="highlightX"> \
					<td align="right">Tissue:</td> \
					<td align="left"><input type="hidden" id="ge_tissue_combo" style="width:400px"/></td> \
				</tr>\
				<tr class="highlightX"> \
					<td align="right">Q Size:</td> \
					<td align="left"><input type="hidden" id="ge_qsize_combo" style="width:400px"/></td> \
				</tr> \
			</table> \
		</div>\
	</div>';


	var tg = '#ge_samplewindow';
	$("#gebrowser_tissuesurveyid").append(gewindow_divtag);

	$("#windowHeader").css("background-color", "#4D94FF");
	$("#windowHeader").css("color", "white");

	$("#ge_samplewindow").bind('close', function () {
		$('div').remove('#ge_samplewindow');
	});
	$('#ge_samplewindow').on('close', function () { $('#ge_samplewindow').remove('#ge_samplewindow');  });


	var preload_age = [{ id: '2', text: '2mon'},
	                   { id: '6', text: '6mon'},
	                   { id: '10', text: '10mon'}
	];
	$('#ge_age_combo').select2({
	                   placeholder: "Select age",
	                   multiple: true,
	                   selectOnBlur: true,
	                   separator: "$$$",
	                   tags: preload_age,
	                   tokenSeparators: [','],
	                   query: function (query){
	                       var data = {results: []};

	                       $.each(preload_age, function(){
	                           if(query.term.length == 0 || this.text.toUpperCase().indexOf(query.term.toUpperCase()) >= 0 ){
	                               data.results.push({id: this.id, text: this.text });
	                           }
	                       });

	                       query.callback(data);
	                   }
	});
	$('#ge_age_combo').select2('data', preload_age );


	var preload_datatype = [{ id: 'mRNA', text: 'mRNA'},
	                   { id: 'miRNA', text: 'miRNA'},
	 ];
	 $('#ge_datatype_combo').select2({
	                   placeholder: "Select data",
	                   multiple: true,
	                   selectOnBlur: true,
	                   separator: "$$$",
	                   tokenSeparators: [','],
	                   query: function (query){
	                       var data = {results: []};

	                       $.each(preload_datatype, function(){
	                           if(query.term.length == 0 || this.text.toUpperCase().indexOf(query.term.toUpperCase()) >= 0 ){
	                               data.results.push({id: this.id, text: this.text });
	                           }
	                       });

	                       query.callback(data);
	                   }
	  });
	  $('#ge_datatype_combo').select2('data', preload_datatype[0] );

	  var preload_qsize = [{ id: 'Q20', text: 'Q20'},
	                       { id: 'Q80', text: 'Q80'},
	                       { id: 'Q92', text: 'Q92'},
	                       { id: 'Q140', text: 'Q140'},
	                       { id: 'Q111', text: 'Q111'},
	                   { id: 'Q175', text: 'Q175'},
	 ];
	 $('#ge_qsize_combo').select2({
	                   placeholder: "Select Qsize",
	                   multiple: true,
	                   selectOnBlur: true,
	                   separator: "$$$",
	                   tags: ['Q20', 'Q80', 'Q92', 'Q140', 'Q111', 'Q175'],
	                   tokenSeparators: [','],

	 });


	 $('#ge_tissue_combo').select2({
	                   placeholder: "Select tissue",
	                   multiple: true,
	                   selectOnBlur: true,
	                   separator: "$$$",
	                   tags: ["Cortex", "Striatum", "Liver"],
	                   tokenSeparators: [',']
	});


	$(tg).jqxWindow({
        showCollapseButton: false, maxHeight: 1200, maxWidth: 600, minHeight: 200, minWidth: 200, height: '60%', width: '80%',
        initContent: function () {$(tg).jqxWindow('focus');}
    });


	var xx =  '<div id = "ref_but"  style="position:absolute; top:400px;"> \
			   	<img id="refreshimg_ge1" alt="Refresh" style="position:absolute; top:15px; margin-left: 100px;" src="/static/images/repair_images/refresh.png"/> \
			 	<div style="position:absolute; top:15px; width:200px; margin-left: 150px;" id="tissuesamplescount"># Tissue samples </div> \
				<input type="button" value="Submit to GE Browser" style="position:absolute; margin-left: 100px; top:75px;" id="SubmitToGEBrowser" /> \
			 <div>';

	$('#ge_samplewindow').append(xx);

	$("#SubmitToGEBrowser").jqxButton({template: "success" });

	$("#refreshimg_ge1").click(function () {
		var row = new Object();
        if ( $("#ge_qsize_combo").val() != "" ){
        	row.ge_qsize_combo = $("#ge_qsize_combo").val();
        }
        if ( $("#ge_age_combo").val() != "" ){
        	row.ge_age_combo = $("#ge_age_combo").val();
        }
        row.ge_tissue_combo = $("#ge_tissue_combo").val();
        row.ge_datatype_combo = $("#ge_datatype_combo").val();
        if ( $("#ge_gender_combo").val() != "" ){
        	row.ge_gender_combo = $("#ge_gender_combo").val();
        }
        row.querystatus = 'totalcount';
        $.ajax({
                dataType: 'json',
                url: '/hdinhd/gebrowser/getTissueSurveyCounts',
                data: {
                    'params': JSON.stringify(row)
                },
                success: function (data, status, xhr) {
                	var msg = data + " Tissue samples";
                	$('#tissuesamplescount').text(msg);
                }
        });
	});

	$("#SubmitToGEBrowser").click(function () {
    	var row = new Object();

    	if ( $("#ge_qsize_combo").val() != "" ){
        	row.ge_qsize_combo = $("#ge_qsize_combo").val();
        }
        if ( $("#ge_age_combo").val() != "" ){
        	row.ge_age_combo = $("#ge_age_combo").val();
        }
        row.ge_tissue_combo = $("#ge_tissue_combo").val();
        row.ge_datatype_combo = $("#ge_datatype_combo").val();
        if ( $("#ge_gender_combo").val() != "" ){
        	row.ge_gender_combo = $("#ge_gender_combo").val();
        }
        row.querystatus = 'tissuesurverfiles';
        $.ajax({
                dataType: 'json',
                url: '/hdinhd/gebrowser/getTissueSurveyCounts',
                data: {
                    'params': JSON.stringify(row)
                },
                success: function (data, status, xhr) {
                    // update command is executed.
                	$('#ge_samplewindow').jqxWindow('close');
                	$('div').remove('#ge_samplewindow');
                	loadTissueServaySamples(data)
                }
        });


    });

}
