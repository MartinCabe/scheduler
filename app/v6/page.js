'use client'

import { count, e, evaluate, forEach } from "mathjs"
import styles from "./page.module.css";
import buttonTypes from "../components/button/boton.module.css";
import { useState, useEffect } from "react";

import Barra from "../components/Barra"
import Boton from "../components/button/Boton";
import Modal from "../components/modal/Modal";
import Entrada from "../components/input/Entrada";
import Columna from "../components/columna/Columna";
import Lote from "../components/lote/Lote";
import BarGraph from "../components/bargraph/BarGraph";

function generateRandomExpression() {
  const operators = ['+', '-', '*', '/', '%'];
  const randomNumber = () => Math.floor(Math.random() * 10) + 1; // Generate a random number between 1 and 10
  const randomOperator = () => operators[Math.floor(Math.random() * operators.length)]; // Pick a random operator

  // Generate a random expression with two numbers and one operator
  return `${randomNumber()} ${randomOperator()} ${randomNumber()}`;
}

function generateRandomNumber() {
  return Math.floor(Math.random() * 10) + 1; // Generates a random integer between 1 and 20
}

class Proceso {
  constructor(op, eta, id, algoritmo) {
    this.operacion = op;
    this.tme = eta; // Guardar el tme inicial
    this.eta = eta;
    this.id = id
    this.operacion_resuelta = evaluate(op)
    this.algoritmo = algoritmo;

    // TIEMPOS
    this.tiempo_llegada = null
    this.tiempo_finalizacion = null
    this.tiempo_retorno = null
    this.tiempo_respuesta = null
    this.tiempo_espera = null
    this.tiempo_servicio = null
  }
}

// Tiempos
// - [X] Llegada
// - [X] Finalizacion
// - [ ] Respuesta

class Lot {
  contenido = []
  estaLleno = false
  estaVacio = true

  agregar(proc) {
    this.contenido.push(proc)
    return true;
  }

  get obtenerContenido() {
    return this.contenido
  }
}

export default function Aplicacion() {
  // ------ STATE -------
  const [isModalOpen, setModalOpen] = useState(false)
  const [started, setStarted] = useState(false)
  const [lotes, setLotes] = useState([])
  const [nProcess, setNProcess] = useState(25);
  const [processing, setProcessing] = useState();
  const [altProcessing, setAltProcessing] = useState();
  const [countdown, setCountdown] = useState(0);
  const [altCountdown, setAltCountdown] = useState(0);
  const [trigger, setTrigger] = useState(false)
  const [altTrigger, setAltTrigger] = useState(false);
  const [processed, setProcessed] = useState([])
  const [pause, setPause] = useState(false)
  const [current, setCurrent] = useState()
  const [altCurrent, setAltCurrent] = useState()
  const [prevCurrent, setPrevCurrent] = useState(null)
  const [altPrevCurrent, setAltPrevCurrent] = useState(null)
  const [trigger2, setTrigger2] = useState(false)
  const [int, setInt] = useState(false)
  const [interrupted, setInterrupted] = useState(false)
  const [altInterrupted, setAltInterrupted] = useState(false)
  const [globalCounter, setGlobalCounter] = useState(0);
  // --------------------
  const [memory, setMemory] = useState([])
  const [altMemory, setAltMemory] = useState([])
  const [keyPressed, setKeyPressed] = useState()
  const [allProcess, setAllProcess] = useState([])
  const [quantumCounter, setQuantumCounter] = useState(0);
  const [rrTrigger, setRrTrigger] = useState(false);

  let auxCounter = globalCounter;
  const quantum = 2;

  const agregar_procesos = () => {
    setModalOpen(true);
  }

  const empezar_procesos = () => {
    setTrigger(!trigger)
    setStarted(true)
    setPause(!pause)
  }

  const empezar_procesos2 = () => {
    // setTrigger(!trigger)
    // setStarted(true)
    // setPause(!pause)
    setToMemory() // pone 4 dentro de la memoria
    setTrigger(!trigger)
    setAltTrigger(!altTrigger)
    setStarted(true)
    setPause(!pause)
  }

  useEffect(() => {
    if (memory.length > 0) {
      // lotes == procesos
      console.log("djsaqiodjq")
      let current_process = memory[0]
      setCountdown(current_process.eta)
      
      let new_memory = memory.slice(1);
      
      //let index = findNextProcessFifo();

      

      if(lotes.length > 0 && memory.length < 4) {
        
        let toBeAdded_process = lotes[0];
        toBeAdded_process.tiempo_llegada = globalCounter;
        new_memory.push(toBeAdded_process)
        setLotes(lotes.slice(1));
      };

      setMemory(new_memory);

      

      
      
      if(current_process.tiempo_respuesta == null) current_process.tiempo_respuesta = globalCounter; 
      setCurrent(current_process);
      console.log(current_process.tiempo_respuesta);

      setProcessing(current_process);
    } 
    else if (memory.length == 0 && altMemory.length == 0 && !current){
      setStarted(false)
    }
  }, [trigger]);

  useEffect(() => {
    if (altMemory.length > 0) {
      // lotes == procesos
      let current_process = altMemory[0]
      setAltCountdown(current_process.tme)
      
      let alt_new_memory = altMemory.slice(1);
      
      

      if(lotes.length > 0 && altMemory.length < 4) {
        console.log("lol")
        let toBeAdded_process = lotes[0];
        toBeAdded_process.tiempo_llegada = globalCounter;
        alt_new_memory.push(toBeAdded_process)
        setLotes(lotes.slice(1));
      };

      setAltMemory(alt_new_memory);

      
      
      if(current_process.tiempo_respuesta == null) current_process.tiempo_respuesta = globalCounter; 
      setAltCurrent(current_process);
      console.log(current_process.tiempo_respuesta);

      setAltProcessing(current_process);
    } 
    else if (memory.length == 0 && altMemory.length == 0 && !altCurrent) {
      setStarted(false)
    }
  }, [altTrigger]);

  const interrumpir_procesos = () => {
    setInterrupted(true)
    setStarted(false)

    // Set current remaining time
    let local_current = current
    local_current.eta = countdown

    //setProcessing([...processing, current])
    setMemory([...memory, current])
    setCurrent(null)

    setStarted(true)
  }

  const setToMemory = () => {
    // Paso #1 Lograr colocarlos en "ejecucion"
    // let new_memory = lotes.slice(0,3); 
    let newLotes = lotes;
    
    let newMemory = newLotes.splice(0, 4);
    console.log(newLotes)
    let altNewMemory = newLotes.splice(0, 4);
    //console.log(newLotes)

    setMemory(newMemory);
    setAltMemory(altNewMemory);
    setLotes(newLotes);
  }
    

  // Cierra modal, crea lotes y los agrega
  const cerrar_modal_y_agregar = () => {
    setModalOpen(false)

    let global_counter = 0
    let l = []

    for (let i = 0; i < nProcess; i++) {
      let randomNumber = generateRandomNumber();
      if (randomNumber > 5){
        l.push(new Proceso(generateRandomExpression(), randomNumber, global_counter, "SRT"))
      }
      else{
        l.push(new Proceso(generateRandomExpression(), randomNumber, global_counter, "FIFO"))
      }
      global_counter++;
    }
    setLotes([...l])
    setAllProcess([...l])
  }

  const handleKeyDown = (event) => {
    setKeyPressed(event.key)

    if (event.key == 'w') {
      terminateWithError()
    } else if (event.key == 'e') {
      interrumpir_procesos()
    } else if (event.key == 'p') {
      pausar()
    } else if (event.key == 'c') {
      continuar()
    }
  };

  const terminateWithError = () => {
    let mod = current
    mod.operacion_resuelta = "ERROR"
    setCurrent(mod)
    setCountdown(0)
  }

  const cerrar_modal = () => {
    setModalOpen(false)
  }

  const interrumpir = () => {
    if (!int) {
      setInt(true);
      setStarted(false)
      let localized = current
      current.eta = countdown

      setProcessing([...processing, localized])
      setProcessed(processed.slice(0, processed.length - 1))
      setCurrent(processing[0])
    }
  }

  const handleEntradaInputChange = (value) => {
    setNProcess(value);
  };

  const pausar = () => {
    setStarted(false)
  }

  const continuar = () => {
    if (int) {
      setInt(false)
      //setTrigger2(!trigger2);
      setCurrent(processing[0])
      setProcessing(processing.slice(1))
      setCountdown(processing[0].eta)

      setStarted(true)
      setPause(!pause)
    } else {
      setStarted(true)
      setPause(!pause)
    }
  }

  useEffect(() => {
    if (current) {
      setProcessed([...processed, current])
    }
    else if (altCurrent){
      setProcessed([...processed, altCurrent])
    }
  }, [trigger2]);


  useEffect(() => {
    if (prevCurrent != null && !interrupted) {
      prevCurrent.tiempo_finalizacion = globalCounter;
      setProcessed([...processed, prevCurrent])
    }
    if (interrupted) {
      console.log("dsadq")
      setPrevCurrent(null)
      setInterrupted(false)
      setCountdown(0)
    } else {
      setPrevCurrent(current)
    }

  }, [current]);

  useEffect(() => {
    if (altPrevCurrent != null && !altInterrupted) {
      altPrevCurrent.tiempo_finalizacion = globalCounter;
      setProcessed([...processed, altPrevCurrent])
    }
    if (altInterrupted) {
      setAltPrevCurrent(null)
      setAltInterrupted(false)
      setAltCountdown(0)
    }
    else {
      setAltPrevCurrent(altCurrent)
    }

  }, [altCurrent]);


  useEffect(() => {
    setStarted(false);
    if (current){
      let localCurrent = current;
      if (localCurrent.eta > quantum){
        setMemory([...memory, current]);
        localCurrent.eta = countdown - 1;
        setInterrupted(true);
        setCurrent(null);
      }
    }
    setStarted(true);
  }, [rrTrigger]);

  useEffect(() => {
    if (started) {
      const timer = setTimeout(() => {
        auxCounter++;
        setGlobalCounter(auxCounter);
        setQuantumCounter(quantumCounter + 1);
        if (quantumCounter == (quantum - 1) && memory.length != 0) {
          setRrTrigger(!rrTrigger);
          setQuantumCounter(0);
        }
        else if (countdown > 1){
            setCountdown(countdown - 1);
        }
        if (countdown <= 1){
          console.log("3213")
          setTrigger(!trigger);
          setCurrent(null);
          setQuantumCounter(0);
        }
        
      }, 1000); // Delay of 1000 milliseconds (1 second) for each countdown iteration

      // Clear the timeout if the component unmounts or if the countdown reaches 0
      return () => {
        clearTimeout(timer);
      };
    }
  }, [processing, countdown, pause]); // Run the effect whenever the countdown state changes


  useEffect(() => {
    if (started){
      const timer = setTimeout(() =>{
        if (altCountdown > 1) {
          setAltCountdown(altCountdown - 1); // Decrease the countdown by 1
        }
        else {
            setAltTrigger(!altTrigger);
            setAltCurrent(null);
        }
      }, 1000);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [pause, altCountdown, altProcessing]);

  return (
    <div tabIndex={0} onKeyDown={handleKeyDown}>

      {
        isModalOpen ?
          <Modal>
            <h1>Ingresa el numero de procesos</h1>
            <Entrada onInputChange={handleEntradaInputChange} />
            <div className={styles.rowLike}>
              <Boton text="Confimar" type={buttonTypes.confirm} action={cerrar_modal_y_agregar} />
              <Boton text="Cancelar" type={buttonTypes.cancel} action={cerrar_modal} />
            </div>
          </Modal>
          :
          null
      }

      <Barra>
        <Boton text="Agregar" type={buttonTypes.start} action={agregar_procesos} />
        <Boton text="Empezar" type={buttonTypes.start} action={empezar_procesos2} />
        <Boton text="Interrumpir" type={buttonTypes.int} action={interrumpir} />
        <Boton text="Pausar" type={buttonTypes.int} action={pausar} />
        <Boton text="Continuar" type={buttonTypes.int} action={continuar} />
      </Barra>

      <div className={styles.contenedorColumnas}>

        {/* // TODO: Mostrar numero de procesos en vez de lotes */}
        <Columna title={lotes.length + " procesos en espera"}>
          {/* // Esto mapea los lotes y por cada lote crea un "Lote" */}
          {/* // TODO: Crear un solo "Lote" con todos los procesos */}
            <Lote id={"Procesos "}>
              {lotes ? lotes.map((pro) => (
                <p key={pro.id} className={styles.proceso}>({pro.id}) Operación: {pro.operacion} | {pro.algoritmo}</p>
              )) : null }
            </Lote>
          
        </Columna>

        <div className={styles.processing_zone_container}>
          <h2>{started ? "Procesando" : "Modo espera"}</h2>
          <p className={styles.countdown}>Contador global: {globalCounter}</p>


          <>
            {started ? <p className={styles.countdown}>Faltan {countdown} segundos</p> : null}
            {current ?
              <p className={styles.procesoActual}>({current.id}) Resultado: {current.operacion} ETA: {current.eta}s TME: {current.tme}s</p>
              : null
            }
            <div className={styles.processing_zone}>
              {memory ? memory.map((pro) => (
                <p key={pro.id} className={styles.proceso}>({pro.id}) Operación: {pro.operacion} ETA: {pro.eta}s TME: {pro.tme}s</p>
              )) : null}
            </div>
          </>
          <BarGraph 
            array = {allProcess} 
            currentId={current ? current.id : null} 
            finished={processed}
            altCurrentId={altCurrent ? altCurrent.id : null}
          />
        </div>
        <div className={styles.processing_zone_container}>
          <h2>​</h2>
          <p className={styles.countdown}>​</p>
        <>
            {started ? <p className={styles.countdown}>Faltan {altCountdown} segundos</p> : null}
            {altCurrent ?
              <p className={styles.procesoActual}>({altCurrent.id}) Resultado: {altCurrent.operacion} ETA: {altCurrent.eta}s TME: {altCurrent.tme}s</p>
              : null
            }
            <div className={styles.processing_zone}>
              {altMemory ? altMemory.map((pro) => (
                <p key={pro.id} className={styles.proceso}>({pro.id}) Operación: {pro.operacion} ETA: {pro.eta}s TME: {pro.tme}s</p>
              )) : null}
            </div>
          </>
        </div>
        

        <Columna title={"Terminados"}>
          <Lote id={"TERMINADOS"}>
            {processed ? processed.map((pro, index) => (
              <div key={pro.id}>
                <p className={styles.proceso}>({pro.id}) Resultado: {pro.operacion_resuelta}</p>
              </div>
            )) : null}
          </Lote>
        </Columna>

      </div>
    </div>
    
  )
}