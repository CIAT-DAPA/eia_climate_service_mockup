import React, {useState, useEffect} from "react";
import { Table, Accordion} from "react-bootstrap";

const Results = (returnedData) => {
    
    let returnedDataFixed = returnedData.returnedData;
    const managmentFactorsTraduction = {
        Chemical_Treat_Disease: "Enfermedad de tratamiento químico",
        Chemical_Treat_Pests: "Plagas de tratamiento químico",
        Chemical_Treat_Weeds: "Tratamiento químico de malas hierbas",
        Cultivar: "Cultivar",
        Cultivar_Type: "Tipo de cultivo",
        Harvest_Method: "Método de cosecha",
        Number_Chemical_Ferti: "Número químico del fertilizante",
        Plant_Density_20_days: "Densidad de plantas 20 días",
        Seeds_Per_Site: "Semillas por sitio",
        Seeds_Treatment: "Tratamiento de semillas",
        Sowing_Method: "Método de siembra",
        Sowing_Seeds_Number: "Número de semillas de siembra",
        Total_K: "Potasio total",
        Total_N: "Nitrógeno total",
        Total_P: "Fósforo total"

    }
    

    useEffect(() => {
        returnedDataFixed = returnedData.returnedData;
        
        
      }, [returnedData]);


    

    
    return(

        <div className="mt-1">

            

                
                    {   //Se recorre el objeto (que eran un json antes de estar en este componente) y se ponen los datos en la tabla
                        
                        returnedDataFixed.map((predictorsByLote, i)=>(
                            <div>
                                

                            <Accordion defaultActiveKey={['0']} alwaysOpen>
                                <Accordion.Item eventKey={i.toString()}>
                                    <Accordion.Header>{returnedData.lotes[i].label}</Accordion.Header>

                                    <Accordion.Body>
                                    <Table size="sm" striped={true} borderless={true} bordered={true}>
                                       
                                       <thead>
                                           <tr>
                                            <th>Factores de manejo</th>
                                            <th>Actual</th>
                                            <th>Óptimo</th>
                                           </tr>
                                       </thead>

                                           {   //Aquí se leen los resultados. Debido a que son arrays anidados, se deben leer los resultados de esa manera.
                                               // predictorsByLote.predictors - todos los predictores
                                               // currentPredictor - la llave del primero predictor. Es una posicion en el arreglo
                                               // Object.keys(predictorsByLote.predictors[currentPredictor]) - el nombre del predictor
                                               Object.keys(predictorsByLote.optimo[0]).map((currentPredictor, i)=>(
                                                   <tbody>
               
                                                   {
                                                       (currentPredictor !== 'Performance') &&
                                                       <tr>
                                               
                                                           <td>{managmentFactorsTraduction[currentPredictor]}</td>
                                                           <td>{predictorsByLote.actual[0][currentPredictor]}</td>
                                                           <td>{predictorsByLote.optimo[0][currentPredictor]}</td>
                                                           {/* <td>{predictorsByLote.predictors[currentPredictor][Object.keys(predictorsByLote.predictors[currentPredictor])].current}</td>
                                                           <td>{predictorsByLote.predictors[currentPredictor][Object.keys(predictorsByLote.predictors[currentPredictor])].optimal}</td> */}

                                                       </tr>

                                                   }
                                                   </tbody>
               
                                                   )
                       
                                               )

                                           }

                                       


                                       <thead>
                                           <tr>
                               
                                           <th>Rendimiento t/ha</th>
                                           <th>{predictorsByLote.actual[0]["Yield"]}</th>
                                           <th>{predictorsByLote.optimo[0]["Performance"]}</th>
                                           </tr>
                                       </thead>
                               </Table>
        
                                    </Accordion.Body>

                                </Accordion.Item>

                                
                            </Accordion>
                            </div>
                            )

                        )
                    }
                

                    
        </div>



        
    )
}

export default Results;