//adapted from the cerner smart on fhir guide. updated to utalize client.js v2 library and FHIR R4

// helper function to process fhir resource to get the patient name.
function getPatientName(pt) {
  if (pt.name) {
    var names = pt.name.map(function(name) {
      return name.given.join(" ") + " " + name.family;
    });
    return names.join(" / ");
  } else {
    return "anonymous";
  }
}

// display the patient name gender and dob in the index page
function displayPatient(pt) {
  document.getElementById('patient_name').innerHTML = getPatientName(pt);
  document.getElementById('gender').innerHTML = pt.gender;
  document.getElementById('patient_name_top').innerHTML = getPatientName(pt);
}


//helper function to get quanity and unit from an observation resoruce.
function getQuantityValueAndUnit(ob) {
  if (typeof ob != 'undefined' &&
    typeof ob.valueQuantity != 'undefined' &&
    typeof ob.valueQuantity.value != 'undefined' &&
    typeof ob.valueQuantity.unit != 'undefined') {
    return Number(parseFloat((ob.valueQuantity.value)).toFixed(2)) + ' ' + ob.valueQuantity.unit;
  } else {
    return undefined;
  }
}

// helper function to get both systolic and diastolic bp
function getBloodPressureValue(BPObservations, typeOfPressure) {
  var formattedBPObservations = [];
  BPObservations.forEach(function(observation) {
    var BP = observation.component.find(function(component) {
      return component.code.coding.find(function(coding) {
        return coding.code == typeOfPressure;
      });
    });
    if (BP) {
      observation.valueQuantity = BP.valueQuantity;
      formattedBPObservations.push(observation);
    }
  });

  return getQuantityValueAndUnit(formattedBPObservations[0]);
}

// create a patient object to initalize the patient
function defaultPatient() {
          return {
          height: {
          value: ''
        },
          weight: {
          value: ''
        },
          sys: {
          value: ''
        },
          dia: {
          value: ''
        },
        

        };
}

//function to display the observation values you will need to update this
function displayObservation(obs) {
    weight.innerHTML = obs.weight;
    height.innerHTML = obs.height;

    document.getElementById('height').innerHTML = obs.height;
    document.getElementById('weight').innerHTML = obs.weight;

}

let PatientData = new Array();
let datas_weight = new Array();
let data_time = new Array();



let datas_sys = new Array();
let datas_dia =new Array();
let data_t = new Array();
let patient_id = '';

//once fhir client is authorized then the following functions can be executed
FHIR.oauth2.ready().then(function(client) {

	// get patient object and then display its demographics info in the banner
	client.request(`Patient/${client.patient.id}`).then(
		function(patient) {
		displayPatient(patient);
		console.log(patient);
		}
	);

	// get observation resoruce values
	// you will need to update the below to retrive the weight and height values
  
	patient_id = client.patient.id;
	var query = new URLSearchParams();

	query.set("patient", client.patient.id);
	query.set("_count", 100);
	query.set("_sort", "-date");
	query.set("code", [
		'http://loinc.org|8462-4',
		'http://loinc.org|8480-6',
		'http://loinc.org|55284-4',
		'http://loinc.org|3141-9',
		'http://loinc.org|29463-7',
		'http://loinc.org|8302-2',
	].join(","));

	client.request("Observation?" + query, {
		pageLimit: 0,
		flat: true
	}).then(
		function(ob) {

		// group all of the observation resoruces by type into their own
		var byCodes = client.byCodes(ob, 'code');
		var systolicbp = getBloodPressureValue(byCodes('55284-4'), '8480-6');
		var diastolicbp = getBloodPressureValue(byCodes('55284-4'), '8462-4');
		var height = byCodes('8302-2');
		var weight = byCodes('29463-7');

		// create patient object
		var p = defaultPatient();

		// set patient value parameters to the data pulled from the observation resoruce
		if (typeof systolicbp != 'undefined') {
			p.sys = systolicbp;
		} else {
			p.sys = 'undefined'
		}

		if (typeof diastolicbp != 'undefined') {
			p.dia = diastolicbp;
		} else {
			p.dia = 'undefined'
		}
		p.height = getQuantityValueAndUnit(height[0]);
		p.weight = getQuantityValueAndUnit(weight[0]);
		displayObservation(p);
	});

	const rxnorm = "http://www.nlm.nih.gov/research/umls/rxnorm";
    //const client1 = new FHIR.client("https://r3.smarthealthit.org");
    const getPath = client.getPath;

    function displayMedication(med) {
      for (i of med) {
        document.getElementById("med_list")
        .innerHTML += i + "<br>";
      }
    }

    function getMedicationName(medCodings = []) {
      let coding = medCodings.find(c => c.system === rxnorm);
      return coding && coding.display || "Unnamed Medication(TM)";
    }

    let data = new Array();

    let query2 = new URLSearchParams();
    query2.set("patient", client.patient.id);
    client.request("MedicationRequest?" + query2, {
    resolveReferences: "medicationReference"
    })
    .then (
        data => data.entry.map(item => getMedicationName(
        getPath(item, "resource.medicationCodeableConcept.coding") ||
        getPath(item, "resource.medicationReference.code.coding")
    ))).then(displayMedication,displayMedication);


    let cond_query = new URLSearchParams();
    cond_query.set("patient",client.patient.id);
    cond_query.set("_count", 3);
    client.request("Condition?" +cond_query,{
        pageLimit:0,
        flat:true
    }).then(
        function(cond){
           // console.log(cond);
            for(let c of cond){
                document.getElementById("cond_list").innerHTML += c.code.text +"<br>";
            }
        }
    )
   
    let query4 = new URLSearchParams();
    query4.set("patient", client.patient.id);
    query4.set("_count", 100);
    query4.set("_sort", "-date");
    query4.set("code", [
      'http://loinc.org|55284-4',
        'http://loinc.org|8462-4',
        'http://loinc.org|8480-6',
    ].join(","));
    
    client.request("Observation?" + query4, {
      pageLimit: 0,
      flat: true
    }).then(
          function(ob) {
              //group all of the observation resoruces by type into their own
              let byCodes = client.byCodes(ob, 'code');
              let blood_pressure = byCodes('55284-4');
        
              for ( bp of blood_pressure) {
                PatientData.push(bp);
                let date =  bp.effectiveDateTime;
                var dateTime = document.getElementById("datepicker").value;//new Date().getFullYear()
                let dateFormat = date.substring(0, date.length - 6);
                let parseTime = d3.time.format("%Y-%m-%dT%H:%M:%S").parse(dateFormat);             
                var comp = bp.component;	  
                for(b of comp) {
                    //console.log("Code is --------"+b.code.coding[0].code);
                    let value = b.valueQuantity.value;
                    displayValue = String(value).substring(0,3);
                    if (b.code.coding[0].code !== undefined && b.code.coding[0].code == '8462-4' && typeof(value)!='undefined' ){
                    datas_dia.push(displayValue);
                    data_t.push(parseTime);
                    } 
                    if (b.code.coding[0].code !== undefined && b.code.coding[0].code == '8480-6' && typeof(value)!='undefined'){
                    datas_sys.push(displayValue);
                    data_t.push(parseTime);
                    }
                }
              }
          }
    );

	function downloadRecord(){
		//getCompleteRecord(client);
		console.log("Patient Data is "+PatientData.length);

		if(PatientData.length>0)
			downloadObjectAsJson(PatientData, "Medical_Record");
		else
			alert("There is no record");
	}

	function downloadObjectAsJson(exportObj, exportName) {
		var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObj));
		var downloadAnchorNode = document.createElement('a');
		downloadAnchorNode.setAttribute("href", dataStr);
		downloadAnchorNode.setAttribute("download", exportName + ".json");
		document.body.appendChild(downloadAnchorNode); // required for firefox
		downloadAnchorNode.click();
		downloadAnchorNode.remove();
	}

	function displayBPChart() {
		//document.getElementById("chartText").innerHTML = "Blood Pressure Graph"
		let chart = c3.generate({
			data: {
				x: 'x',
				json: {
					x: data_t,
					systolic: datas_sys,
					diastolic: datas_dia
				},
			},
			axis: {
				x: {
					type: 'timeseries',
					tick: {
						format: '%m-%d-%Y',

					},
					label: { // ADD
						text: 'Date',
						position: 'outer-center'
					}
				},
				y: {
					tick: {
						format: d3.format("s")
					},
					label: { // ADD
						text: 'Blood Pressure',
						position: 'outer-middle'
					}
				},
			}
		});
	}

	function addObservation() {
		let systolic_value = document.getElementById("systolic");
		let diastolic_value = document.getElementById("diastolic");
		if (systolic_value==" " ||diastolic_value==" "){
		return;
		}
		if (typeof(systolic_value)=='undefined' || typeof(diastolic_value)=='undefined'){
		return;
		}

			let cat_coding ={
				system: "http://terminology.hl7.org/CodeSystem/observation-category",
				code: "vital-signs",
				display: "vital-signs"
			}
			let cod_coding ={
				system: "http://loinc.org",
				code: "55284-4",
				display: "Blood Pressure"
			}
			let code ={
				coding : cod_coding,
				text : "Blood Pressure"
			}

				let subject="Patient/"+patient_id
	
				var	component= 
				[
							{"code": {
							"coding": 
							{
								"system": "http://loinc.org",
								"code": "8462-4",
								"display": "Diastolic Blood Pressure"
							}
							,
							"text": "Diastolic Blood Pressure"
						},
						"valueQuantity": {
							"value": diastolic_value,
							"unit": "mm[Hg]",
							"system": "http://unitsofmeasure.org",
							"code": "mm[Hg]"
						}},{"code": {
							"coding": 
							{
								"system": "http://loinc.org",
								"code": "8480-6",
								"display": "Systolic Blood Pressure"
							}
							,
							"text": "Systolic Blood Pressure"
						},
						"valueQuantity": {
							"value": systolic_value,
							"unit": "mm[Hg]",
							"system": "http://unitsofmeasure.org",
							"code": "mm[Hg]"
						}}
				];
				var ob = {
						resourceType: "Observation",
						status : "final",
						category : cat_coding,
						code : code,
						subject: {
							"reference": "Patient/"+client.patient.id
							},
						effectiveDateTime : new Date(),
						issued : new Date(),
						component : component
					};


		var test = client.create(ob).then(function(ob){

			console.log("Patient/"+patient_id);
			console.log(ob);
		});
			console.log(test);
	}

	function filterReadings() {
			var dateTime = document.getElementById("datepicker").value;
			console.log("Date Time is :"+dateTime);
			document.getElementById("myDynamicTable").innerHTML=" ";
			let query4 = new URLSearchParams();
			query4.set("patient", client.patient.id);
			query4.set("_count", 100);
			query4.set("_sort", "-date");
			query4.set("code", [
			'http://loinc.org|55284-4',
				'http://loinc.org|8462-4',
				'http://loinc.org|8480-6',
			].join(","));
			
			FHIR.client.request("Observation?" + query4, {
			pageLimit: 0,
			flat: true
			}).then(
				function(ob) {
		
				// group all of the observation resoruces by type into their own
				let byCodes = client.byCodes(ob, 'code');
				let blood_pressure = byCodes('55284-4');
			// console.log("Inside parseTime");
			
			
			/////CODE FOR TABLE OF READINGS//////
			var myTableDiv = document.getElementById("myDynamicTable");

			var table = document.createElement('TABLE');
			table.border='1';

			var tableBody = document.createElement('TBODY');
			table.appendChild(tableBody);
					
				
			var tr = document.createElement('TR');
			tableBody.appendChild(tr);

			var td = document.createElement('TH');
			td.width='75';
			td.appendChild(document.createTextNode("Date"));
			tr.appendChild(td);
			var td = document.createElement('TH');
			td.width='75';
			td.appendChild(document.createTextNode("Systolic"));
			tr.appendChild(td);
			var td = document.createElement('TH');
			td.width='75';
			td.appendChild(document.createTextNode("Diastolic"));
			tr.appendChild(td);
				
			
				for ( bp of blood_pressure) { 
				
							PatientData.push(bp);
							//	console.log(bp.effectiveDateTime);
							let date =  bp.effectiveDateTime;
							console.log("Date is "+date);
							
							let n = date.indexOf(dateTime);
							console.log(n);

							
							
							if(date.indexOf(dateTime)==0){

								let dateFormat = date.substring(0, date.length - 6);
							
							let parseTime = d3.time.format("%Y-%m-%dT%H:%M:%S").parse(dateFormat);
							console.log("Parse Time is :"+parseTime);
							
				
							var tr = document.createElement('TR');
							tableBody.appendChild(tr)
			
				
							var comp = bp.component;
							var td = document.createElement('TD');
							td.width='250';
							td.appendChild(document.createTextNode(parseTime));
							tr.appendChild(td);
				
							for(b of comp){

									var td = document.createElement('TD');
									td.width='75';


									//console.log("Code is --------"+b.code.coding[0].code);
									let value = b.valueQuantity.value;
									displayValue = String(value).substring(0,3);
									
									if (b.code.coding[0].code !== undefined && b.code.coding[0].code == '8462-4' && typeof(value)!='undefined' ){
									var td = document.createElement('TD');
									td.appendChild(document.createTextNode(displayValue));
									tr.appendChild(td);
									} 
									
									if (b.code.coding[0].code !== undefined && b.code.coding[0].code == '8480-6' && typeof(value)!='undefined'){
									td.appendChild(document.createTextNode(displayValue));
									tr.appendChild(td);
									} 



							}

						
						myTableDiv.appendChild(table);
								
							}
							else{
								continue;
							}

				}  
			}
			);
	}

});
