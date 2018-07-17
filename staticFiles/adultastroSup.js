function drawfpkmchart(plottype,gridid, mygenename, mycategories, myfpkmvalues, errorplotvalues){
        var chartType = 'column';
        if (plottype == 'plot1'){
            var colArray = ['#128F76','#E36C09'];
            var titleStart = 'Cortex';
            chartType = 'column';
        }else if(plottype == 'plot2'){
            var colArray = ['#128F76','#128F76','#E36C09','#E36C09'];
            var titleStart = 'Striatum & Hipocampus';
        }

        var str_genename = '\"'+mygenename+'\"';
        var mychart_container = '#'+gridid;
        
        $(mychart_container).highcharts({
            chart: {
                inverted: true,
                marginTop: 50,
            },
            title: {
                text: '',
                //useHTML: true,
            },
            xAxis: [{
                categories: mycategories,
                crosshair: true,
                //title: {enabled: false}
            }],
            yAxis: [{ // Primary yAxis
                //title:{
                //    text:'',
                //},
                title: {enabled:false},
            }, { // Secondary yAxissss
                gridLineWidth: 0, 
                title: {
                    text: 'FPKM',
                },
                
                //labels: {
                    //format: '{value} mm',
                    /*style: {
                        color: 'black',
                        fontSize: '15px'
                    },
                    formatter: function() {
                        if(this.value === 0.00001){
                            return 0;
                        } else {
                            return this.value;
                        }
                    }*/
                //},
            }, { 
            }],
            legend: {
                layout: 'horizontal',
                align: 'left',
                x: 325,
                verticalAlign: 'top',
                y: 55,
                floating: true,
                itemStyle: {
                    fontSize:'15px',
                },
                backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
                enabled: false
            },
            plotOptions: {
                column: {
                    colorByPoint: true,
                    showInLegend: true,
                    dataLabels: {
                        enabled: false
                    }
                },
            },
            colors: colArray, //['#E36C09','#31859B'],
            series: [
                {
                    name: 'Mean',
                    type: 'column',
                    yAxis: 1,
                    data: myfpkmvalues,
                    tooltip: {
                        valueSuffix: ' avg'
                    }
                },
                {
                    name: 'SEM',
                    type: 'errorbar',
                    yAxis: 1,
                    data: errorplotvalues,
                    tooltip: {
                        pointFormat: '(error range: {point.low} - {point.high})<br/>'
                    }
                }
            ]
        });
}

function drawDistributionChart(chart_grid_id, seriesData){
        Highcharts.chart(chart_grid_id, {
            chart: {
                type: 'areaspline',
                
            },
            title: {
                text: 'Distribution curve of all genes'
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                categories: ['0','0.1','1','5','10','15','20','100','1000','1000+'],
                //categories: ['0','0.1','1','2','4','6','8','10','20','100','1000','1000+'],
                crosshair: false
            },
            yAxis: {
                min: 0,
                title: {
                    enabled:true,
                    text: '# of genes'
                },
                labels: {enabled:true},
                /*gridLineColor: 'transparent',
                gridLineWidth: 0,
                minorGridLineWidth: 0*/
                
            },
            tooltip: {
                enabled: false
            },
            /*plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                },
                series: {
                    marker: {
                        enabled: false
                    },
                }
            },*/
            plotOptions: {
                areaspline: {
                    //pointStart: 1940,
                    marker: {
                        enabled: false,
                        symbol: 'circle',
                        radius: 2,
                        states: {
                            hover: {
                                enabled: true
                            }
                        }
                    }
                }
            },
            
            series:seriesData
        });
}

/*function Cortextest(chart_grid_id, seriesData){
        Highcharts.chart(chart_grid_id, {
            chart: {
                type: 'area'
            },
            title: {
                text: 'Distribution curve of all genes'
            },
            subtitle: {
                text: ''
            },
            xAxis: {
                //categories: ['0.1','1','10','100','1000','1000+'],
                crosshair: false
            },
            yAxis: {
                min: 0,
                title: {enabled:false},
                labels: {enabled:true},
                
            },
            tooltip: {
                enabled: true
            },
            plotOptions: {
                column: {
                    pointPadding: 0.2,
                    borderWidth: 0
                },
                
            },
            series: [{
                name: 'FPKM',
                data: seriesData
            }]
            //series:seriesData
        });
}*/



function getBwFileDetails(){
        var myproteinboxCords = $( '#protein_data' ).position().top;
        $.ajax({
            dataType: 'json',
            url: 'getbigwiginfo/',
            data: {
                    'genename': GENENAME
            },
            success: function (data, status, xhr) {
                for (var xxx in data){
                    if (xxx == 'bwfiles'){
                        var bwfiledetails = data[xxx];
                    }
                    else if (xxx == 'genecords'){
                        var genecords = data[xxx];
                    }
                    else if (xxx == 'genome'){
                        var genome = data[xxx];
                    }
                }
                
                document.getElementById("splicerheaderID").style.visibility= "visible" ;
                $("#splicertextID").text("Splicing browser for gene "+genename);
                loadAstGebrowserIframe( JSON.parse(bwfiledetails), genecords, genome )
            }
        });
}

function loadAstGebrowserIframe(filedetails, genecords, genome){
        window.location.hash = '#splicerheaderID';
        document.getElementById('ast_gebrowserframe').src="getAdtAstGEbrowserHTML";
        document.getElementById("ast_gebrowserframe").onload = function() {
            document.getElementById('ast_gebrowserframe').contentWindow.astGeBrowser(filedetails, genecords, genome);
        }
}

function createProteinTable(proteindata){
    //var proteindata = JSON.parse(proteindata);
    var tablerow = '';
    for (eachrow in proteindata){
        var thisrow = (proteindata[eachrow]);
        var average_ratio_str_hip = thisrow['average_ratio_str_hip'];//Protein
        var ratio_strip_hipip_de = thisrow['ratio_strip_hipip_de'];//RNAseq
        var protein_accession = thisrow['protein_accession'];
        var proteinname = thisrow['proteinname'];
        tablerow = tablerow+'<tr><td>'+average_ratio_str_hip+'</td>'+'<td>'+ratio_strip_hipip_de+'</td>'+'<td>'+protein_accession+'</td>'+'<td>'+proteinname+'</td></tr>';
    }
    document.getElementById("tbody").innerHTML = tablerow;

}