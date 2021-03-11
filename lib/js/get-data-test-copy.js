//adapted from the cerner smart on fhir guide. updated to utalize client.js v2 library and FHIR R4
//create a fhir client based on the sandbox enviroment and test paitnet.
const client = new FHIR.client({
  serverUrl: "https://r4.smarthealthit.org",
  tokenResponse: {
    patient: "2744ab6f-91dd-4e4f-8208-fe52ee2c27d1"
  }
});

// helper function to process fhir resource to get the patient name.
function getPatientName(pt) {
  if (pt.name) {
    var names = pt.name.map(function(name) {
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
    ldl: {
      value: ''
    },
    hdl: {
      value: ''
    },
    
  };
}


//function to display the observation values you will need to update this
function displayObservation(obs) {
  hdl.innerHTML = obs.hdl;
  ldl.innerHTML = obs.ldl;
  sys.innerHTML = obs.sys;
  dia.innerHTML = obs.dia;
  height.innerHTML = obs.height;
  weight.innerHTML = obs.weight;
}

// get patient object and then display its demographics info in the banner
client.request(`Patient/${client.patient.id}`).then(
  function(patient) {
    displayPatient(patient);
    console.log(patient);
  }
);

// get observation resoruce values
// you will need to update the below to retrive the weight and height values
var query = new URLSearchParams();
var notes = '';

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
    var hdl = byCodes('2085-9');
    var ldl = byCodes('2089-1');
    var height = byCodes('8302-2');
    var weight = byCodes('29463-7')
    
    // create patient object
    var p = defaultPatient();

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
    displayObservation(p);
  });


  const rxnorm = "http://www.nlm.nih.gov/research/umls/rxnorm";
  //const client1 = new FHIR.client("https://r3.smarthealthit.org");
  const getPath = client.getPath;

function displayMedication(med) {
    //const output = document.getElementById("med_list");
    //output.innerText =<ul>data</ul> ;
    document.getElementById("med_list").innerHTML=data;

    for (x of med) { 
      document.getElementById("med_list") 
        .innerHTML += x + "<br>"; 
    } 
}

function getMedicationName(medCodings = []) {
    var coding = medCodings.find(c => c.system === rxnorm);
    return coding && coding.display || "Unnamed Medication(TM)";
}

var data = new Array();

var query = new URLSearchParams();
query.set("patient", client.patient.id);
client.request("MedicationRequest?" + query, {
  resolveReferences: "medicationReference"
})
.then(data => data.entry.map(item => getMedicationName(
  getPath(item, "resource.medicationCodeableConcept.coding") ||
  getPath(item, "resource.medicationReference.code.coding")
))).then(displayMedication,displayMedication);

var datas_weight = [];
var data_time =[];

var query = new URLSearchParams();
var notes = '';

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
    var weight = byCodes('29463-7');
    for ( w of weight) { 
      
      datas_weight.push(w.valueQuantity.valueQuantity);
      data_time.push(w.effectiveDateTime);

    } 
  }
);  
    

var chart_weight = c3.generate({
  title: {
        text: function (d) {return " Weight Data"; }
  },
  data: {
              x: 'x',
       json: {
          weight: datas_weight,
          x: data_time
       },
  
  },
  subchart: {
      show: true
  },
  axis : {
   x : {
          type : 'timeseries',
          tick: {
            count: 6,
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
            text: 'weight',
            position: 'outer-middle'
          }
      },
  },
  tooltip: {
      format: {
          title: function (d) {var dr=formatTime(d); return 'weight: ' + dr; },
          value: function (value) {
                return format(value);
          }

      }
  }

});

document.getElementById("chart") 
        .innerHTML = chart_weight;
