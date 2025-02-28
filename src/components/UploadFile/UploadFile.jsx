import React, { useState } from 'react';
import { api } from '../../apiImage';

const UploadFile = ({setMessage,setError}) => {
    const [fileName, setFileName] = useState(null); 
    const [file, setFile] = useState(null); 

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0]; 
        if (selectedFile) {
            setFileName(selectedFile.name);
            setFile(selectedFile); 
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!file) {
            return;
        }
        const formData = new FormData();
        formData.append('file', file);
        try {  
            const response = await api.post('',formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage("Файл был загружен успешно")
            console.log(response.data);
        } catch (error) {
            setError(error.reponse?.data)
            console.error('Ошибка при загрузке файла', error);
        }
    };

    return (
        <div className="col-lg-3 col-md-4 col-sm-6 d-flex justify-content-center">
            <div className="card mt-2 mb-2" style={{ width: '18rem', height: '23.5rem' }}>
                <div className="card-body d-flex flex-column justify-content-center align-items-center">
                    <h5 className="card-title text-center mb-4">Загрузите файл</h5>

                    <label htmlFor="file-upload" className="btn btn-primary btn-block">
                        Выберите файл
                    </label>
                    <input
                        id="file-upload"
                        type="file"
                        name="file"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />

                    {fileName && <p className="mt-3">{`Выбран файл: ${fileName}`}</p>}

                    <div className="mt-3">
                        <p className="text-muted">Поддерживаемые форматы: .jpg, .jpeg, .png</p>
                    </div>

                    <button className="btn btn-success mt-3" onClick={handleSubmit}>
                        Загрузить файл
                    </button>
                </div>
            </div>
        </div>
    );
};

export { UploadFile };
