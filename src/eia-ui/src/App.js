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

  //const urlApi = "https://jsonplaceholder.typicode.com/comments";
  const urlApi = "http://localhost:105/dummy"
  const urlSearch = "http://localhost:105/farm/"
  const urlCuantitativeData = "http://localhost:105/cuantitative_data"
  const urlCualitativeData = "http://localhost:105/cualitative_data"

  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // const setOnline = (event) => {
  //   console.log('We are online!');
  //   isOnline(true);
  // };
  // const setOffline = (event) => {
  //   console.log('We are offline!');
  //   isOnline(false);
  // };

  // Register the event listeners
  useEffect(() => {
    window.addEventListener('online', ()=> {
      setIsOnline(true);

      if(!returnedData){
        let formValues = JSON.parse(localStorage.getItem('formData'));
        consumeAPI(urlApi, formValues);
      }
      //console.log('We are online!');
    });
    window.addEventListener('offline', ()=> {
      setIsOnline(false);
      //console.log('We are offline!');
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
        //console.log(await response.json());
        setFarmData(await response.json());
       
      } else{
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
      //console.log(await response.json());
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
      //console.log(await response.json());
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
        //scatterDataFormatted[k].farm = data[d].NOMBRE_LOTE; 

    }
  }
  console.log(scatterDataFormatted);
  setCuantitativeData(scatterDataFormatted);

}

const setDataCualitativeFormat = (data) => {
  console.log(data);
  

  // let boxPlotDataFormatted = 
  // [
  //   {name: 'TIPO_SIEMBRA', data:[]}, 
  //   {name: 'SEM_TRATADAS', data:[]}, 
  //   {name: 'TIPO_CULTIVO', data:[]},
  //   {name: 'COLOR_ENDOSPERMO', data:[]}, 
  //   {name: 'MATERIAL_GENETICO', data:[]}, 
  //   {name: 'CULT_ANT', data:[]},
  //   {name: 'DRENAJE', data:[]},
  //   {name: 'METODO_COSECHA', data:[]},
  //   {name: 'PROD_COSECHADO', data:[]},
  //   {name: 'NOMBRE_LOTE', data:[]},
  //   {name: 'name_gen_sow', data:[]},
  //   {name: 'ALMACENAMIENTO_FINCA', data:[]}
  // ]

  let boxPlotDataFormatted = new Map();
  const keys = ['ALMACENAMIENTO_FINCA', 'COLOR_ENDOSPERMO', 'CULT_ANT', 'DRENAJE', 'MATERIAL_GENETICO', 
    'METODO_COSECHA', 'PROD_COSECHADO', 'SEM_TRATADAS', 'TIPO_CULTIVO',
    'TIPO_SIEMBRA', 'name_gen_sow'];
  let finalDataArrayFormatted = [];

  for(const d in data){

    for(let k=0; k < keys.length; k ++){
  
        if(boxPlotDataFormatted.has(data[d][keys[k]])){
          let adittion = boxPlotDataFormatted.get(data[d][keys[k]]);
          adittion.rdt.push(data[d].RDT);
          boxPlotDataFormatted.set(data[d][keys[k]], adittion);
        }
        else{
          boxPlotDataFormatted.set(data[d][keys[k]], {managmentPractice: keys[k], rdt: [data[d].RDT]});
        }

    }
    
  }
  // for (var [key, value] of boxPlotDataFormatted) {
  //   alert(key + " = " + value);
  //   finalDataArrayFormatted.push({x: key, y: value});
  // }

  console.log(boxPlotDataFormatted);
  setCualitativeData(boxPlotDataFormatted);

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
