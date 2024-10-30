import './App.css'
import { useEffect, useState } from 'react';

function App() {

  const [decibeles, setDecibeles] = useState('Esperando datos......');
  const [estaConectado, setEstaConectado] = useState(false);

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');

    ws.onopen = () => {
      console.log('Conectado con WebSocket');
      setEstaConectado(true);
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setDecibeles(data.decibels)
    };

    ws.onerror = (error) => {
      console.error('Error WebSocket:', error);
    }

    ws.onclose = () => {
      console.log('WebSocket cerrado');
      setEstaConectado(false);
    }

    // Limpiar la conexión cuando el componente se desmonte
    return () => {
      ws.close();
    };

  }, []);



  return (
    <>
      <div>
        <p> {estaConectado ? 'Conectado' : 'Desconectado'} </p>
        <h1>Medidor de decibeles ESP32</h1>

        <p>{estaConectado ? `Decibeles: ${decibeles}` : 'No hay datos'}</p>

      </div>
    </>
  )
}

export default App
