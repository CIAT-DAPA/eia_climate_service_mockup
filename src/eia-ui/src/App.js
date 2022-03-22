import './App.css';
import React, {useState, useEffect} from 'react'
import MapView from './components/MapView';
import CoordinatesForm from "./components/CoordinatesForm";
import Results from "./components/Results";
import Charts from "./components/Charts"
import Glossary from "./components/Glossary"
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col, Container, Spinner, Card, Badge } from "react-bootstrap";

const App = () => {

  const [selectedPosition, setSelectedPosition] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [returnedData,  setReturnedData] = useState();
  const [farmData, setFarmData] = useState();
  const [lotesSelected, setLotesSelected] = useState();
  const [cuantitativeData, setCuantitativeData] = useState();
  const [cualitativeData, setCualitativeData] = useState();
  
  const [error, setError] = useState(null);

  const urlApi = "http://localhost:105/dummy"
  const urlSearch = "http://localhost:105/farm/"
  const urlCuantitativeData = "http://localhost:105/cuantitative_data"
  const urlCualitativeData = "http://localhost:105/cualitative_data"

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Register the event listeners
  useEffect(() => {
    window.addEventListener('online', ()=> {
      setIsOnline(true);

      if(!returnedData){
        let formValues = JSON.parse(localStorage.getItem('formData'));
        consumeAPI(urlApi, formValues);
      }
    });
    window.addEventListener('offline', ()=> {
      setIsOnline(false);
 
    });
    
  }, []);

  const consumeAPI = (request, formData) => {
    
    if(isOnline){
      
      fetch(request, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      }).then(async (response) => {
            if (response.ok) {
              setReturnedData(await response.json());
              setError(null);
              setIsLoading(false);
              getCuantitativeData(); //Datos para las tablas
              getCualitativeData();
            } else{
              setError(await response.text());
              
            }
          })
          .catch((err) => {
            setError(err.message);
          });
    }
    else{
      alert("Se encuentra sin conexión. Los datos se enviarán cuando se tenga conexión nuevamente")
      localStorage.setItem('formData',  JSON.stringify(formData));

    }
    
    
    return returnedData;
  };

const searchApi = (name) => {
  let request = urlSearch+name

  fetch(request).then(async (response) => {
      if (response.ok) {
        setFarmData(await response.json());
       
      } else{
        setFarmData('');
        setError(await response.text());
        
      }
    })
    .catch((err) => {
      setError(err.message);
    });
}

const getCuantitativeData = () => {
  let request = urlCuantitativeData;

  fetch(request).then(async (response) => {
    if (response.ok) {
      setDataCuantitativeFormat(await response.json());
     
    } else{
      setError(await response.text());
      
    }
  })
  .catch((err) => {
    setError(err.message);
  });

}

const getCualitativeData = () => {
  let request = urlCualitativeData;

  fetch(request).then(async (response) => {
    if (response.ok) {
      setDataCualitativeFormat(await response.json());
     
    } else{
      setError(await response.text());
      
    }
  })
  .catch((err) => {
    setError(err.message);
  });

}

const setDataCuantitativeFormat = (data) => {


  let scatterDataFormatted = 
  [
    {name: 'Sowing_Seeds_Number', data:[], farm: ''}, 
    {name: 'Seeds_Per_Site', data:[], farm: ''}, 
    {name: 'Plant_Density_20_days', data:[], farm: ''},
    {name: 'Chemical_Treat_Disease', data:[], farm: ''}, 
    {name: 'Chemical_Treat_Weeds', data:[], farm: ''}, 
    {name: 'Chemical_Treat_Pests', data:[], farm: ''},
    {name: 'Total_N', data:[], farm: ''},
    {name: 'Total_P', data:[], farm: ''},
    {name: 'Total_K', data:[], farm: ''},
    {name: 'Number_Chemical_Ferti', data:[], farm: ''},
    {name: 'pH', data:[], farm: ''},
    {name: 'Efective_Depth', data:[], farm: ''},
    {name: 'TM_Avg_VEG', data:[], farm: ''},
    {name: 'TA_Avg_VEG', data:[], farm: ''},
    {name: 'DR_Avg_VEG', data:[], farm: ''},
    {name: 'SR_Accu_VEG', data:[], farm: ''},
    {name: 'P_10_Freq_VEG', data:[], farm: ''},
    {name: 'TA_Avg_CF', data:[], farm: ''},
    {name: 'SR_Accu_CF', data:[], farm: ''},
    {name: 'RH_Avg_CF', data:[], farm: ''},
    {name: 'SR_Accu_MAT', data:[], farm: ''},
    {name: 'P_10_Freq_MAT', data:[], farm: ''},
    {name: 'RH_Avg_MAT', data:[], farm: ''}

  ]
  
  for(const d in data) {
    
    for(const k in scatterDataFormatted){

        scatterDataFormatted[k].data.push([data[d][scatterDataFormatted[k].name], data[d]["Yield"]]);

    }
  }

  setCuantitativeData(scatterDataFormatted);

}

const setDataCualitativeFormat = (data) => {
 
  const keys = ["Sowing_Method", "Seeds_Treatment", "Cultivar", "Former_Crop",
  "Field_Drainage", "Harvest_Method", "Cultivar_Type", "Soil_Structure", "Runoff", "Soil_Texture", "Organic_Matter_Content", "year_sems"];

  //Initializes keys in order to simplify the loop
  let boxPlotDataFormatted = new Map([[keys[0], new Map()], [keys[1], new Map()],[keys[2], new Map()], [keys[3], new Map()],
    [keys[4], new Map()], [keys[5], new Map()], [keys[6], new Map()], [keys[7], new Map()], [keys[8], new Map()], [keys[9], new Map()],
    [keys[10], new Map()], [keys[11], new Map()]]);

  for(const d in data){

    for(let k=0; k < keys.length; k ++){

      let currentKey = keys[k];
      let currentCualitativeByKey = data[d][keys[k]];

      if(boxPlotDataFormatted.get(currentKey).has(currentCualitativeByKey)){
        let adittion = boxPlotDataFormatted.get(currentKey).get(currentCualitativeByKey);
        adittion.push(data[d]["Yield"]);
        boxPlotDataFormatted.set(currentCualitativeByKey, adittion);
      }
      else{
        let dataCualitativeMap = boxPlotDataFormatted.get(currentKey);
        dataCualitativeMap.set(currentCualitativeByKey, [data[d]["Yield"]]);
        boxPlotDataFormatted.set(currentKey, dataCualitativeMap);

      }

    }

  }

  let finalDataArrayFormatted = [];
  for (var [key, value] of boxPlotDataFormatted) {
     finalDataArrayFormatted.push({x: key, y: value});
  }
  finalDataArrayFormatted = Array.from(boxPlotDataFormatted, ([key, value]) => ({ key, value}));
  setCualitativeData(finalDataArrayFormatted);

}

  

  return (

    <Container className="mt-4" fluid>

      <Row>
      <h4 className="mb-4">Ingreso de datos</h4>
      <CoordinatesForm
            selectedPosition={selectedPosition}
            urlApi={urlApi}
            farmData={farmData}
            lotesSelected={lotesSelected}
            returnedData={returnedData}
            
            setReturnedData={setReturnedData}
            setSelectedPosition={setSelectedPosition}
            consumeAPI={consumeAPI}
            setIsLoading={setIsLoading}
            searchApi={searchApi}
            setLotesSelected={setLotesSelected}
            
          />
      </Row>

      <Row className="mt-3">
      <h4>Resultados de optimización y tablas <Glossary/></h4>
      


        <Row>
          
          {
            isLoading &&
              <Row className="row justify-content-center mt-4 mb-4">
                <Spinner animation="border" role="status" variant="success">
                  <span className="visually-hidden">Cargando...</span></Spinner>
                <Spinner animation="border" role="status" variant="light">
                  <span className="visually-hidden">Cargando...</span></Spinner>
                <Spinner animation="border" role="status" variant="dark">
                  <span className="visually-hidden">Cargando...</span></Spinner>
                
              </Row> 
          }

          {
            returnedData && <Results returnedData={returnedData} lotes={lotesSelected}/>
          }

         

        
        </Row>
        <Row>
            {
              cuantitativeData && <Charts 
                                    className="mt-4" 
                                    cuantitativeData={cuantitativeData}
                                    cualitativeData={cualitativeData}
                                  />
            }

          </Row>

      

      </Row>
      <Row>
        <Card
           bg={'Light'.toLowerCase()}
           text={'black'}
        >
          <Card.Header><h6>En colaboración de</h6></Card.Header>
            <Card.Body>
              <Row className="justify-content-md-center">
                <Col xs lg="2">
                  <img src={require('./images/fenalce.png')} height={80} width={211}/>
                </Col>
                <Col md="auto">
                  <img src={require('./images/cimmyt.png')} height={100} width={250}/>
                </Col>
                <Col xs lg="2">
                  <img src={require('./images/alliance.png')} height={101} width={212.8}/>
                </Col>
              </Row>
            </Card.Body>
      </Card>
      </Row>
      



    </Container>
   
                
          

  )
}

export default App;
