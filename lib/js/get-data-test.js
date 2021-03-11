 //adapted from the cerner smart on fhir guide. updated to utalize client.js v2 library and FHIR R4
    //create a fhir client based on the sandbox enviroment and test paitnet.
    const client = new FHIR.client({
    serverUrl: "https://r4.smarthealthit.org",
    tokenResponse: {
    patient: "2744ab6f-91dd-4e4f-8208-fe52ee2c27d1"
}
});

 let PatientData = new Array();


    // helper function to process fhir resource to get the patient name.
    function getPatientName(pt) {
    if (pt.name) {
    let names = pt.name.map(function(name) {
    return name.given.join(" ") + " " + name.family;
});
    return names.join(" / ")
} else {
    return "anonymous";
}
}

    // display the patient name gender and dob in the index page
    function displayPatient(pt) {
    document.getElementById('patient_name').innerHTML = getPatientName(pt);
    document.getElementById('gender').innerHTML = pt.gender;
    document.getElementById('dob').innerHTML = pt.birthDate;
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
    let formattedBPObservations = [];
    BPObservations.forEach(function(observation) {
    let BP = observation.component.find(function(component) {
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
    ldl: {
    value: ''
},
    hdl: {
    value: ''
},
        bmi:{
        value:''
        },

};
}


    //function to display the observation values you will need to update this
    function displayObservation(obs) {
    //hdl.innerHTML = obs.hdl;
    //ldl.innerHTML = obs.ldl;
    //    let bp = obs.sys+"/"+obs.dia;
   // sys.innerHTML = obs.sys;
    height.innerHTML = obs.height;
    weight.innerHTML = obs.weight;
    //dia.innerHTML = obs.dia;
    document.getElementById('height').innerHTML = obs.height;
    document.getElementById('weight').innerHTML = obs.weight;
}

    // get patient object and then display its demographics info in the banner
    client.request(`Patient/${client.patient.id}`).then(
    function(patient) {
    displayPatient(patient);
    console.log(patient);
}
    );
 let meta_query = new URLSearchParams();
 let notes = '';

 meta_query.set("patient", client.patient.id);
    client.request('metadata/'+meta_query,{
        pageLimit:0
    }).then(
        function (resources){

            var resource = resources.rest[0].resource;
            for(let res of resource){

                var hasPatient = false;
                for (let param of res.searchParam) {

                    if (param.name == "patient") {
                        //console.log(res.type);
                        hasPatient = true;
                        break;
                    }

                }
                    try {

                        client.request(res.type + "?patient=" + client.patient.id).then(
                            function (resourceSearch){
                                if (resourceSearch.total > 0) {
                                    console.log(res.type);
                                    PatientData.push(res.type);
                                    PatientData.push(resourceSearch);

                                }
                            }
                        );

                    } catch (err) {
                        //console.log(err)
                    }
                }
                }




    );

    // get observation resoruce values
    // you will need to update the below to retrive the weight and height values
    let query = new URLSearchParams();
 //   let notes = '';

    query.set("patient", client.patient.id);
    query.set("_count", 100);
    query.set("_sort", "-date");
    query.set("code", [
    'http://loinc.org|8462-4',
    'http://loinc.org|8480-6',
    'http://loinc.org|2085-9',
    'http://loinc.org|2089-1',
    'http://loinc.org|55284-4',
    'http://loinc.org|3141-9',
    'http://loinc.org|29463-7',
    'http://loinc.org|8302-2',
    'http://loinc.org|39156-5',
    ].join(","));

    client.request("Observation?" + query, {
    pageLimit: 0,
    flat: true
}).then(
    function(ob) {

    // group all of the observation resoruces by type into their own
    let byCodes = client.byCodes(ob, 'code');
    let systolicbp = getBloodPressureValue(byCodes('55284-4'), '8480-6');
    let diastolicbp = getBloodPressureValue(byCodes('55284-4'), '8462-4');
    let hdl = byCodes('2085-9');
    let ldl = byCodes('2089-1');
    let height = byCodes('8302-2');
    let weight = byCodes('29463-7');
    let bmi = byCodes('39156-5');

    // create patient object
    let p = defaultPatient();

    // set patient value parameters to the data pulled from the observation resoruce
    if (typeof systolicbp != 'undefined') {
    p.sys = systolicbp;
} else {
    p.sys = 'undefined';
}

    if (typeof diastolicbp != 'undefined') {
    p.dia = diastolicbp;
} else {
    p.dia = 'undefined';
}

    p.hdl = getQuantityValueAndUnit(hdl[0]);
    p.ldl = getQuantityValueAndUnit(ldl[0]);
    p.height = getQuantityValueAndUnit(height[0]);
    p.weight = getQuantityValueAndUnit(weight[0]);
    p.bmi = getQuantityValueAndUnit(bmi[0]);
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
    .then(data => data.entry.map(item => getMedicationName(
    getPath(item, "resource.medicationCodeableConcept.coding") ||
    getPath(item, "resource.medicationReference.code.coding")
    ))).then(displayMedication,displayMedication);



    let cond_query = new URLSearchParams();
    cond_query.set("patient",client.patient.id);
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

let datas_weight = [];
let data_time =[];


let query3 = new URLSearchParams();
let notes3 = '';

query3.set("patient", client.patient.id);
query3.set("_count", 100);
query3.set("_sort", "-date");
query3.set("code", [
  'http://loinc.org|29463-7',
].join(","));

client.request("Observation?" + query3, {
  pageLimit: 0,
  flat: true
}).then(
      function(ob) {

        // group all of the observation resoruces by type into their own
        let byCodes = client.byCodes(ob, 'code');
        let weight = byCodes('29463-7');
        //console.log("Inside parseTime");
        // let parseTime = d3.time.format("%Y-%m-%dT%H:%M:%S").parse;
        // let parseTime = d3.parseTime("%B %d, %y");
        for ( w of weight) { 
          
         // console.log(w.valueQuantity.value+"---"+w.effectiveDateTime);
          
          if (w.valueQuantity.value !== undefined && w.valueQuantity.value !== null) {
            datas_weight.push(w.valueQuantity.value);
          } 
          else {
         // push 0 to signify no data
            datas_weight.push(0);
          }
         // console.log(datas_weight.values);
          date = w.effectiveDateTime;
          dateFormat = date.substring(0, date.length - 6)
         // console.log("Date Format", dateFormat);
          // dateFormat =  d3.time.format.utc("%Y-%m-%dT%H:%M:%S.%LZ");
          let parseTime = d3.time.format("%Y-%m-%dT%H:%M:%S").parse(dateFormat);
          console.log()
          data_time.push(parseTime);

        }  
      });
      
function displayChart(){

  console.log("Data time", data_time);
  console.log(datas_weight);

  document.getElementById("chartText").innerHTML="Weight Graph"
  let chart = c3.generate({
    
    data: {
                x: 'x',
         json: {
			x: data_time,
            Weight: datas_weight, 
        },
    
    },

    axis : {
     x : {
            type : 'timeseries',
            tick: {
               format: '%m-%d-%Y',

            },
            label: { // ADD
              text: 'Date',
             position: 'outer-center'
            }

        },
        y : {
            tick: {
                format: d3.format("s")
            },
            label: { // ADD
          text: 'Weight',
          position: 'outer-middle'
        }
        },
      }

            
        });

  }
  
let datas_sys = [];
let datas_dia =[];
let data_t =[];


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

        // group all of the observation resoruces by type into their own
        let byCodes = client.byCodes(ob, 'code');
        let blood_pressure = byCodes('55284-4');
       // console.log("Inside parseTime");
		
        for ( bp of blood_pressure) { 
		
		//	console.log(bp.effectiveDateTime);
		
			var comp = bp.component;
          
			for(b of comp){
				
			//	console.log("Code is --------"+b.code.coding[0].code);
				
				if (b.code.coding[0].code !== undefined && b.code.coding[0].code == '8462-4') {
					datas_dia.push(b.valueQuantity.value);
				} 
				if (b.code.coding[0].code !== undefined && b.code.coding[0].code == '8480-6') {
					datas_sys.push(b.valueQuantity.value);
				} 
				
				
				
			}
         //  console.log("Data SYS----------------"+datas_sys);
		 //  console.log("Data DIA----------------"+datas_dia);
		 
		   let date =  bp.effectiveDateTime;
		 //  console.log("Date is "+date);
          let dateFormat = date.substring(0, date.length - 6)
         //  console.log("Date Format", dateFormat);
          // dateFormat =  d3.time.format.utc("%Y-%m-%dT%H:%M:%S.%LZ");
           let parseTime = d3.time.format("%Y-%m-%dT%H:%M:%S").parse(dateFormat);
           console.log()
           data_t.push(parseTime);

        }  
      });
	  
	  
function displayBPChart(){

    document.getElementById("chartText").innerHTML="Blood Pressure Graph"
  let chart = c3.generate({
    
    data: {
                x: 'x',
         json: {
			x: data_t,
            systolic: datas_sys,
			diastolic : datas_dia
			
        },
    
    },

    axis : {
     x : {
            type : 'timeseries',
            tick: {
               format: '%m-%d-%Y',

            },
            label: { // ADD
              text: 'Date',
             position: 'outer-center'
            }

        },
        y : {
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
 // document.getElementById("add").addEventListener("click",displayChart());
