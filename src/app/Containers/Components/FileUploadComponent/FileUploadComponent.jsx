export default function FileUploadComponent() {
    async function getFile(event) {
        const formData = new FormData();
        formData.append('api_key', 'TEST');
        formData.append('recognizer', 'auto');
        formData.append('ref_no', 'my_ref_123');
        formData.append('file', event.target.files[0]);
        try {
            const response = await fetch('https://ocr.asprise.com/api/v1/receipt', {
                method: 'POST',
                body: formData,
            });
    
            if (response.ok) {
                const result = await response.json();
                console.log('Archivo subido con éxito:', result);
            } else {
                console.error('Error al subir el archivo:', response.statusText);
            }
        } catch (error) {
            console.error('Error al subir el archivo:', error);
        }


        console.log(event.target.files[0])
    }

    return (
        <form> 
            <input type='file' onChange={(e) => getFile(e)} ></input>    
        </form>  
  )
}
