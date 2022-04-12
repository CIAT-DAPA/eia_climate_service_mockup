import React, {useState, useEffect} from "react";
import '../styles/nvd3.css'
import Chart from "react-apexcharts";
import { Stack, Col, Form, FloatingLabel} from "react-bootstrap";

const styles = {
  fontFamily: "sans-serif",
  textAlign: "center"
  
};


const Charts = ({cuantitativeData, cualitativeData, managmentFactors}) => {


  const variablesCuantitatives = ["Sowing_Seeds_Number", "Seeds_Per_Site", "Plant_Density_20_days", "Chemical_Treat_Disease",
  "Chemical_Treat_Weeds", "Chemical_Treat_Pests", "Total_N", "Total_P", "Total_K", "Number_Chemical_Ferti", "pH",
  "Efective_Depth", "TM_Avg_VEG", "TA_Avg_VEG", "DR_Avg_VEG", "SR_Accu_VEG", "P_10_Freq_VEG", "TA_Avg_CF", "SR_Accu_CF", "P_Accu_CF",
  "RH_Avg_CF", "SR_Accu_MAT", "P_10_Freq_MAT", "RH_Avg_MAT"
  ]
  
  const variablesCualitatives = ["Sowing_Method", "Seeds_Treatment", "Cultivar", "Former_Crop",
  "Field_Drainage", "Harvest_Method", "Cultivar_Type", "Soil_Structure", "Runoff", "Soil_Texture", "Organic_Matter_Content", "year_sems"];
  
  const managmentFactorsDescript = {
    Chemical_Treat_Disease: ["Número de tratamientos químicos para enfermedades", "(frecuencia)"],
    Chemical_Treat_Pests: ["Número de tratamientos químicos para malezas", "(frecuencia)"],
    Chemical_Treat_Weeds: ["Número de tratamientos químicos para plagas", "(frecuencia)"],
    Cultivar: ["Variedad", ""],
    Cultivar_Type: ["Tipo de variedad", ""],
    Harvest_Method: ["Método de cosecha", ""],
    Number_Chemical_Ferti: ["Número de aplicaciones con fertilizante químico", "(frecuencia)"],
    Plant_Density_20_days: ["Densidad de plantas a los 20 días", "(plantas/ha)"],
    Seeds_Per_Site: ["Número de semillas plantadas por sitio", "(semillas/sitio)"],
    Seeds_Treatment: ["Tratamiento de semillas", ""],
    Sowing_Method: ["Método de siembra", ""],
    Sowing_Seeds_Number: ["Número de semillas sembradas por hectárea", "(semillas/ha)"],
    Total_K: ["Cantidad total de potasio", "(kg/ha)"],
    Total_N: ["Cantidad total de nitrógenol", "(kg/ha)"],
    Total_P: ["Cantidad total de fósforo", "(kg/ha)"],
    pH: ["pH del suelo", "(pH)"],
    Efective_Dept: ["Profundidad efectiva del suelo", "(cms)"],
    TM_Avg_VEG: ["Temperatura mínima en el ciclo vegetativo", "(°C)"], 
    TA_Avg_VEG: ["Temperatura promedio en el ciclo vegetativo", "(°C)"], 
    DR_Avg_VEG: ["Rango diurno en el ciclo vegetativo", "(°C)"], 
    SR_Accu_VEG: ["Radiación solar acumulada en el ciclo vegetativo", "(Cal/cm²)"],
    P_10_Freq_VEG: ["Frecuencia de días con precipitación mayor a 10 mm en el ciclo vegetativo", "(días)"],
    TA_Avg_CF: ["Temperatura promedio en el ciclo reproductivo", "(°C)"],
    SR_Accu_CF: ["Radiación solar acumulada en el ciclo reproductivo", "(Cal/cm²)"],
    P_Accu_CF: ["Precipitación acumulada en el ciclo reproductivo", "(mm)"], 
    RH_Avg_CF: ["Humedad relativa promedio en el ciclo reproductivo", "(%)"],
    SR_Accu_MAT: ["Radiación solar acumulada en el ciclo de maduración", "(Cal/cm²)"],
    P_10_Freq_MAT: ["Frecuencia de días con precipitación mayor a 10 mm en el ciclo de maduración", "(días)"],
    RH_Avg_MAT: ["Humedad relativa promedio en el ciclo maduración", "(%)"] 

  }

  const [cuantitativeDataFilter, setCuantitativeDataFilter] = useState([]);
  const [cualitativeDataFilter, setCualitativeDataFilter] = useState([]);


  useEffect(() => {
    if(managmentFactors){
     console.log(managmentFactors["Sowing_Seeds_Number"][0]);

    }


}, [managmentFactors]);

  const translateValue = (i) => {
    return managmentFactorsDescript[variablesCuantitatives[i]][0];
  }

    const variableOnChangeCuantitativeData = (e) => {

      if(cuantitativeData){
        var result = cuantitativeData.filter(obj => {
          return obj.name === e
        })
        setCuantitativeDataFilter(result);
        
      }

    }

    const variableOnChangeCualitativeData = (e) => {

      if(cualitativeData){
        var result = cualitativeData.filter(obj => {
          return obj.key === e
        })
        var finalFormat = [];
        for(const [key, value] of result[0].value){
          finalFormat.push({x: key, y: value.sort(function(a, b) {return a - b;})});

        }
        setCualitativeDataFilter(finalFormat);
      }

    }

    const Boxplot = () => {

      let state = {
          
        series: 
        [
          {
            type: 'boxPlot',
            data: cualitativeDataFilter
          }
        ],
        options: {
          chart: {
            type: 'boxPlot',
            height: 350
          },
          yaxis: {
            show: true,
            showAlways: true,
            title: {
              text: "Rendimiento t/ha",
              rotate: -90,
              offsetX: 0,
              offsetY: 0,
              style: {
                  color: undefined,
                  fontSize: '12px',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  fontWeight: 600,
                  cssClass: 'apexcharts-yaxis-title',
              },
            },
     

          },

          title: {
            text: 'Rendimiento vs prácticas de manejo en datos cualitativos',
            align: 'left'
          },
          plotOptions: {
            boxPlot: {
              colors: {
                upper: '#5C4742',
                lower: '#A5978B'
              }
            }
          }
        },
      
      
      };

      return(
        <Chart options={state.options} series={state.series} type="boxPlot" height={350} />

    
      )

    }

 

    const Scatter =() => {

        let options = {
          chart: {
          animations: {
            enabled: false, 
          },
          dataLabels: {
            enabled: false
          },
          markers: {
            size: 0
          },
            height: 350,
            type: 'scatter',
            zoom: {
              enabled: true,
              type: 'xy'
            }
          },
          title: {
            text: 'Rendimiento vs prácticas de manejo en datos cuantitativos',
            align: 'left'
          },
          xaxis: {
            tickAmount: 10,
            labels: {
              formatter: function(val) {
                return parseFloat(val).toFixed(1)
              }
            }
          },
          yaxis: {
            tickAmount: 7,
            title: {
              text: "Rendimiento t/ha",
              rotate: -90,
              offsetX: 0,
              offsetY: 0,
              style: {
                  color: undefined,
                  fontSize: '12px',
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  fontWeight: 600,
                  cssClass: 'apexcharts-yaxis-title',
              },
            },
            
          }
        }
        
        return(
          <Chart options={options} series={cuantitativeDataFilter} type="scatter" height={350} />
        );
          
    }




    return(
        <div className="mt-4 mb-4">
          <h6>Comparación de datos históricos de rendimiento vs prácticas de manejo</h6>
           
              
              <Stack direction="horizontal" gap={2}>


                    <Form.Group as={Col} controlId="formGridSelectPredictor">
                                    
                                    <FloatingLabel controlId="floatingSelectInitialMonth" label="Seleccione variable a comparar con el rendimiento">
                                        <Form.Select 
                                            aria-label="Floating label select example"
                                            onChange={e => variableOnChangeCuantitativeData(e.target.value)}
                                            
                                        >
                                            <option>Seleccionar</option>
                                            {
                                            variablesCuantitatives.map( (variable, i) => (
                                                
                                                <option value={variable}>{variable}</option>

                                                    )

                                                )
                                            }
                                            
                                        </Form.Select>
                                    </FloatingLabel>

                    {
                      cuantitativeDataFilter && <Scatter/> 
                    }
                    </Form.Group>
                  

                    <Form.Group as={Col} controlId="formGridSelectPredictor">
                                    
                                    <FloatingLabel controlId="floatingSelectInitialMonth" label="Seleccione variable a comparar con el rendimiento">
                                        <Form.Select 
                                            aria-label="Floating label select example"
                                            onChange={e => variableOnChangeCualitativeData(e.target.value)}
                                            
                                        >
                                            <option>Seleccionar</option>
                                            {
                                            variablesCualitatives.map( variable => (
                                                
                                                <option>{variable}</option>

                                                    )

                                                )
                                            }
                                            
                                        </Form.Select>
                                    </FloatingLabel>

                    {
                      cuantitativeDataFilter && <Boxplot/> 
                    }
                    </Form.Group>
                  

                    
                
                


              </Stack>
            
            
           
          
          

        

        </div>
    )


}
export default Charts;