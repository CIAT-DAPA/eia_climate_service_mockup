import React, {useState, useEffect} from "react";
import { Row, Col, Button, Form, FloatingLabel, InputGroup, FormControl, Alert, Stack} from "react-bootstrap";
import Glossary from "./Glossary"
import MapView from './MapView';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';



import '../styles/coordinatesform.css'

const initialFormValues = {
        farm: null,
        lotes: null,
        predictores: null,
        initialMonth: null,
        finalMonth: null
}

const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
                "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre",
                "Diciembre"]

const predictors=[
    {value: 'número de aplicaciones de herbicidas posteriores a la siembra', label: 'número de aplicaciones de herbicidas posteriores a la siembra'},
    {value: 'número de aplicaciones de insecticidas', label: 'número de aplicaciones de insecticidas'},
    {value: 'cantidad total de nitrógeno aplicado kg / ha', label: 'cantidad total de nitrógeno aplicado kg / ha'},
    {value: 'cantidad total de fósforo aplicado kg / ha', label: 'cantidad total de fósforo aplicado kg / ha'},
    {value: 'cantidad total de potasio aplicada', label: 'cantidad total de potasio aplicada'},
    {value: 'grupo de cultivares', label: 'grupo de cultivares'},
    {value: 'tratamiento de semillas', label: 'tratamiento de semillas'},
    {value: 'agricultura de conservación', label: 'agricultura de conservación'},

]

const animatedComponents = makeAnimated();


const CoordinatesForm = ({selectedPosition, urlApi, farmData, lotesSelected, returnedData,  setReturnedData, setSelectedPosition, consumeAPI, setIsLoading, searchApi, setLotesSelected}) => {

    
    
    const [error, setError] = useState(null);
    const [formValues, setFormValues] = useState(initialFormValues);
    const [lotesOptions, setLotesoptions] = useState([]);
    const [visible, setVisible] = useState(false);

    
    const setFormatSelectLotes = () => {
        let lotes = []
        
        if (farmData){

            farmData.map( lote => lotes.push({value: [lote.ID_CULTIVO, lote.LAT_LOTE, lote.LONG_LOTE], label: lote.NOMBRE_LOTE}))

        }
        setLotesoptions(lotes);

    }

    useEffect(() => {

        if(farmData){

            setFormatSelectLotes();

        }
        else if (farmData === ''){
            setError("No se encontró la finca. Ingrese una existente");
            setTimeout(()=>{setError(null)}, 5000);
            
        }

        console.log(formValues);
    

        // if(selectedPosition){ Click and mark on map

        //     const changedFormValues = {
        //         ...formValues,
        //         lat: selectedPosition.lat,
        //         lng: selectedPosition.lng
        //     }
        //     setFormValues(changedFormValues);
        // }
        // else{
        //     //setFormValues(initialFormValues);
        // }
    
    }, [farmData]);

    


    const onFormSubmit = (e) =>{
        e.preventDefault();
        
        if(!(formValues.farm)){
            setError("Ingrese el nombre de una finca y seleccione 'Click para buscar finca'");
        }
        else if(!(formValues.lotes)){
            setError("Seleccione al menos un lote");
        }
        // else if(!(formValues.predictores)){
        //     setError("Seleccione al menos un predictor");
        // }
        else if(!(formValues.initialMonth)){
            setError("Seleccione un mes inicial");
        }
        else if(!(formValues.finalMonth)){
            setError("Seleccione un mes final");
        }
        else{
            setIsLoading(true);
            consumeAPI(urlApi, formValues);
        }
        setTimeout(()=>{setError(null)}, 5000);
    }
    
    const handleSearch = (e) => {

        searchApi(formValues.farm);
        
    }

    const lotesOnChange = (value) => {
        const changedFormValues = {
            ...formValues,
            lotes: value
            
        }
        setLotesSelected(value);
        setFormValues(changedFormValues);
    }

    const predictsOnChange = (value) => {
        const changedFormValues = {
            ...formValues,
            predictores: value
            
        }
        setFormValues(changedFormValues);
    }
    

    


    return(
        


        <Form onSubmit={onFormSubmit} >


            <Row className="mb-3">
                <h6>Ingresa el nombre de una finca y luego selecciona uno o más lotes</h6>
                
                <InputGroup as={Col}>
                    
                    <FormControl
                    aria-label="Example text with button addon"
                    aria-describedby="basic-addon1"
                    placeholder="Nombre finca"
                    onChange={e => setFormValues({ ...formValues, farm: e.target.value })}
                    />
                    <Button 
                        variant="outline-primary" 
                        id="button-addon1"
                        onClick={() => handleSearch()}
                        
                    >
                    Click para buscar finca
                    </Button>
                </InputGroup>

                <Form.Group as={Col} controlId="searchSelect">
                    <Select
                        closeMenuOnSelect={false}
                        name="lotes"
                        options={farmData && farmData !== '' ? lotesOptions:null}
                        isMulti
                        className="basic-multi-select"
                        classNamePrefix="select"
                        placeholder="Selecione uno o más lotes"
                        isDisabled={farmData && farmData !== '' ? false:true}
                        onChange={lotesOnChange}
                        menuPortalTarget={document.body} 
                        styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                        />
                </Form.Group>
            </Row>
            <Row className="mb-3">
                <h6>En el mapa podrá ver la ubicación de los lotes seleccionados</h6>
                <MapView
                    selectedPosition={selectedPosition}
                    lotesSelected={lotesSelected}

                    setSelectedPosition={setSelectedPosition}
                    
                />
            </Row>


            {/* <h6>Selecciona uno o más factores de manejo</h6>
            <Stack direction="horizontal" gap={2} className="mb-3">
            <Form.Group as={Col} controlId="predictSelect" className="me-auto">
                    <Select
                        closeMenuOnSelect={false}
                        name="predictores"
                        options={predictors}
                        isMulti
                        className="basic-multi-select"
                        classNamePrefix="select"
                        placeholder="Selecione uno o más factores de manejo"
                        onChange={predictsOnChange}
                        />
                </Form.Group>
            </Stack> */}
                



            <h6>Selecciona un semestre</h6>
            <Stack direction="horizontal" gap={3}>
                <Form.Group as={Col} controlId="formGridInitialMonth">
                
                    <FloatingLabel controlId="floatingSelectInitialMonth" label="Mes inicial">
                        <Form.Select 
                            aria-label="Floating label select example"
                            onChange={e => setFormValues({ ...formValues, initialMonth: e.target.value })}
                            
                        >
                            <option>Selecciona un mes</option>
                            {
                            months.map( month => (
                                
                                <option>{month}</option>

                                    )

                                )
                            }
                            
                        </Form.Select>
                    </FloatingLabel>

                </Form.Group>
                <Form.Group as={Col} controlId="formGridFinalMonth">
                
                    <FloatingLabel controlId="floatingSelectFinalMonth" label="Mes final">
                        <Form.Select 
                            aria-label="Floating label select example"
                            onChange={e => setFormValues({ ...formValues, finalMonth: e.target.value })}
                            
                        >
                            <option>Selecciona un mes</option>
                            {
                            months.map( month => (
                                
                                <option value={month}>{month}</option>

                                    )

                                )
                            }
                            
                        </Form.Select>
                    </FloatingLabel>

                </Form.Group>
                <Button variant="primary" type="submit" size="lg">
                        Enviar
                </Button>


            </Stack>

            
            

            <Row className="mt-4 mx-auto" style={{width: '825px'}}>
                <Col
                    className="d-grid gap-2"
                    
                >
                    {
                        error &&
                        <Alert key={"currentFormError"} variant={"warning"}>{error}</Alert>
                        
                        
                    }
                    
                
                </Col>

            </Row>
                

        </Form>


      
    )
}

export default CoordinatesForm;