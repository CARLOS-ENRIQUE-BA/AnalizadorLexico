import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import Button from './components/Button';
import ResponseTable from './components/ResponsableTable';
import 'react-toastify/dist/ReactToastify.css';
import './styles/App.css';

function App() {
  const [file, setFile] = useState(null);
  const [code, setCode] = useState('');
  const [fileName, setFileName] = useState('');
  const [response, setResponse] = useState(null);
  const [responseOnCode, setResponseOnCode] = useState(null);

  const onFileChange = (event) => {
    setFile(event.target.files[0]);
    setFileName(event.target.files[0].name);
  };

  const onCodeChange = (event) => {
    setCode(event.target.value);
  };

  const onFileFormSubmit = async (event) => {
    event.preventDefault();
    if (!file) {
      toast.error('Por favor, selecciona un archivo');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetch('http://localhost:3003/upload', {
      method: 'POST',
      body: formData,
    });
    if (!response.ok) {
      const errorMessage = response.status === 404 ? 'No se encontraron tokens válidos en el archivo analizado' : await response.text();
      toast.error(errorMessage);
      return;
    }
    const data = await response.json();
    setResponse(data);
    toast.success('Tu archivo ha sido analizado con éxito');
  };

  const onCodeFormSubmit = async (event) => {
    event.preventDefault();
    if (!code.trim()) {
      toast.error('Por favor, introduce código');
      return;
    }
    const responseOnCode = await fetch('http://localhost:3003/analyze', {
      method: 'POST',
      body: code,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
    if (!responseOnCode.ok) {
      const errorMessage = responseOnCode.status === 404 ? 'No se encontraron tokens válidos en el código analizado' : await responseOnCode.text();
      toast.error(errorMessage);
      return;
    }
    const data = await responseOnCode.json();
    setResponseOnCode(data);
    toast.success('Tu código ha sido analizado con éxito');
  };


  return (
    <>
      <h1 className='title'>Analizador Léxico en Flask WEB</h1>
      <div className='container'>

        <div className="container-A">
          <form className='form-A' onSubmit={onFileFormSubmit}>
            <div class="input-div">
              <input class="input" name="file" type="file"  id='file' onChange={onFileChange} />
              <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" stroke-linejoin="round" stroke-linecap="round" viewBox="0 0 24 24" stroke-width="2" fill="none" stroke="currentColor" class="icon"><polyline points="16 16 12 12 8 16"></polyline><line y2="21" x2="12" y1="12" x1="12"></line><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path><polyline points="16 16 12 12 8 16"></polyline></svg>
            </div>
            <div>
              <span>{fileName || 'Haga clic para cargar el archivo'}</span>
            </div>
            <Button text='Generar Análisis' />
          </form>
          <ResponseTable response={response} />
        </div>

        <div className='container-B'>
          <form className='form-B' onSubmit={onCodeFormSubmit}>
            <textarea placeholder='Cuál es el código a analizar?' className='text-area-B' onChange={onCodeChange} value={code} />
            <Button text='Generar Análisis' />
          </form>
          <ResponseTable response={responseOnCode} />
        </div>

      </div>
      <ToastContainer />
    </>
  );
}

export default App;
