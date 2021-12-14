import React, {useState, useEffect} from "react";
import { Row, Col, Button, Form, FloatingLabel, InputGroup, FormControl} from "react-bootstrap";
import Select from 'react-select';
import makeAnimated from 'react-select/animated';



import '../styles/coordinatesform.css'

const initialFormValues = {
        farm: null,
        lotes: [
            null
        
        ],
        predictores: null,
        initialMonth: null,
        finalMonth: null
}

const months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", 
                "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre",
                "Diciembre"]

const predictors=[
    {value: 'number_of_post_sowing_herbicides_applications', label: 'number_of_post_sowing_herbicides_applications'},
    {value: 'number_of_applications_of_insecticides', label: 'number_of_applications_of_insecticides'},
    {value: 'total_amount_of_nitrogen_applied_kg_ha', label: 'total_amount_of_nitrogen_applied_kg_ha'},
    {value: 'total_amount_of_phosporus_applied_kg_ha', label: 'total_amount_of_phosporus_applied_kg_ha'},
    {value: 'total_amount_of_potassium_applied', label: 'total_amount_of_potassium_applied'},
    {value: 'cultivars_group', label: 'cultivars_group'},
    {value: 'seed_treatment', label: 'seed_treatment'},
    {value: 'conservation_agriculture', label: 'conservation_agriculture'},

]

const animatedComponents = makeAnimated();


const CoordinatesForm = ({selectedPosition, urlApi, farmData, lotesSelected, returnedData,  setReturnedData, setSelectedPosition, consumeAPI, setIsLoading, searchApi, setLotesSelected}) => {

    
    
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const [formValues, setFormValues] = useState(initialFormValues);
    const [lotesOptions, setLotesoptions] = useState([]);

    
    const setFormatSelectLotes = () => {
        let lotes = []
        
        if (farmData){

            farmData.map( lote => lotes.push({value: [lote.ID_LOTE, lote.LAT_LOTE, lote.LONG_LOTE], label: lote.NOMBRE_LOTE}))

            

        }
        //console.log(lotes);
        setLotesoptions(lotes);

    }

    useEffect(() => {

        if(farmData){

            setFormatSelectLotes();

        }
    

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
        setIsLoading(true);
        consumeAPI(urlApi, formValues);
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
                        options={farmData ? lotesOptions:null}
                        isMulti
                        className="basic-multi-select"
                        classNamePrefix="select"
                        placeholder="Selecione uno o más lotes"
                        isDisabled={farmData?false:true}
                        onChange={lotesOnChange}
                        />
                </Form.Group>
            </Row>

            <Row className="mb-3">
            <h6>Selecciona uno o más predictores</h6>
            <Form.Group as={Col} controlId="predictSelect">
                    <Select
                        closeMenuOnSelect={false}
                        name="predictores"
                        options={predictors}
                        isMulti
                        className="basic-multi-select"
                        classNamePrefix="select"
                        placeholder="Selecione uno o más predictores"
                        onChange={predictsOnChange}
                        />
                </Form.Group>
            </Row>



            <Row>
                <h6>Selecciona un semestre</h6>
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


            </Row>

            
            

            <Row className="mt-4 mx-auto" style={{width: '825px'}}>
                <Col
                    className="d-grid gap-2"
                    
                >
                    <Button variant="primary" type="submit" size="lg">
                        Enviar
                    </Button>
                
                </Col>

            </Row>
                

        </Form>


      
    )
}

export default CoordinatesForm;