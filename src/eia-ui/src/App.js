import './App.css';
import React, {useState, useEffect} from 'react'
import MapView from './components/MapView';
import CoordinatesForm from "./components/CoordinatesForm";
import Results from "./components/Results";
import Charts from "./components/Charts"
import 'bootstrap/dist/css/bootstrap.min.css';
import { Row, Col, Container, Spinner, Card, Image } from "react-bootstrap";

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
    {name: 'DIST_PLANTAS', data:[], farm: ''}, 
    {name: 'DIST_SURCOS', data:[], farm: ''}, 
    {name: 'NUM_SEMILLAS', data:[], farm: ''},
    {name: 'OBJ_RDT', data:[], farm: ''}, 
    {name: 'POBLACION_20DIAS', data:[], farm: ''}, 
    {name: 'production_har', data:[], farm: ''},
    {name: 'SEM_POR_SITIO', data:[], farm: ''},
    {name: 'area_fie', data:[], farm: ''},
    {name: 'humidity_percentage_har', data:[], farm: ''}
  ]
  
  for(const d in data) {
    
    for(const k in scatterDataFormatted){

        scatterDataFormatted[k].data.push(data[d][scatterDataFormatted[k].name], data[d].RDT);

    }
  }

  setCuantitativeData(scatterDataFormatted);

}

const setDataCualitativeFormat = (data) => {
  
  const keys = ['ALMACENAMIENTO_FINCA', 'COLOR_ENDOSPERMO', 'CULT_ANT', 'DRENAJE', 'MATERIAL_GENETICO', 
    'METODO_COSECHA', 'PROD_COSECHADO', 'SEM_TRATADAS', 'TIPO_CULTIVO',
    'TIPO_SIEMBRA', 'name_gen_sow'];

  //Initializes keys in order to simplify the loop
  let boxPlotDataFormatted = new Map([[keys[0], new Map()], [keys[1], new Map()],[keys[2], new Map()], [keys[3], new Map()],
    [keys[4], new Map()], [keys[5], new Map()], [keys[6], new Map()], [keys[7], new Map()], [keys[8], new Map()], [keys[9], new Map()],
    [keys[10], new Map()]]);

  for(const d in data){

    for(let k=0; k < keys.length; k ++){

      let currentKey = keys[k];
      let currentCualitativeByKey = data[d][keys[k]];

      if(boxPlotDataFormatted.get(currentKey).has(currentCualitativeByKey)){
        let adittion = boxPlotDataFormatted.get(currentKey).get(currentCualitativeByKey);
        adittion.push(data[d].RDT);
        boxPlotDataFormatted.set(currentCualitativeByKey, adittion);
      }
      else{
        let dataCualitativeMap = boxPlotDataFormatted.get(currentKey);
        dataCualitativeMap.set(currentCualitativeByKey, [data[d].RDT]);
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

      <Row className="mt-4">
      <h4 className="mb-4">Resultados de optimización, mapa y tabla</h4>

        <Col>
          <h6>En el mapa podrá ver la ubicación de los lotes seleccionados</h6>
          <MapView
            selectedPosition={selectedPosition}
            lotesSelected={lotesSelected}

            setSelectedPosition={setSelectedPosition}
            
          />

          <Row>
            {
              cuantitativeData && <Charts 
                                    className="mt-4" 
                                    cuantitativeData={cuantitativeData}
                                    cualitativeData={cualitativeData}
                                  />
            }

          </Row>
          

            
      
        </Col>

        <Col>
          
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

         

        
        </Col>

      

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
