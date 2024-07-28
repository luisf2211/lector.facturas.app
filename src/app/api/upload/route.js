import { NextResponse } from "next/server";
import fs from 'fs';
import path from 'path';
import Blob from 'blob';
export async function POST(req) {
    try {
        const formData = await req.formData();
        const file = formData.get('receipt');
        
        if (file.name === '') {
            return  NextResponse.json({ response: 'Debes adjuntar un archivo.' }, {status: 400});
        }
        
        const validateFile = validateFileType(file);
        if(!validateFile.isValid){
            return  NextResponse.json({ response: validateFile.message }, {status: 400});
        }

        const responseUploadFile = await uploadFile(file);
        if (!responseUploadFile.isUploaded) {
            return NextResponse.json({ response: responseUploadFile.message }, {status: 400});    
        }

        const responseReadReceipt = await readReceipt(responseUploadFile.file_path);

        if (responseReadReceipt.status >= 200 && responseReadReceipt.status <= 300) {
            const dataResponseReadReceipt = await responseReadReceipt.json(); 
            console.log(dataResponseReadReceipt);
            const response = {
                text : dataResponseReadReceipt.receipts[0].ocr_text
            }
            return NextResponse.json({ response: response }, {status: 200});
        }

        const dataResponseReadReceipt = await responseReadReceipt.json(); 
        return NextResponse.json({ response: dataResponseReadReceipt }, { status: 400 });
    } catch (error) {
        return NextResponse.json({ response: 'Ha ocurrido un error'}, { status: 400 });
    }
}

const validateFileType = (file) => {
    if (file.type !== 'image/jpeg' && file.type !== 'image/png' && file.type !== 'image/jpg') {
        return {
            isValid: false,
            message: 'file not supported.'
        }
    }
    return {
        isValid: true,
        message: 'file supported'
    }
}

const uploadFile = async (file) => {
    try {
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        const filePath = path.join(uploadDir, file.name);
        const buffer = await file.arrayBuffer();
        fs.writeFileSync(filePath, Buffer.from(buffer));
        console.log('File uploaded and saved to', filePath);
        return {
            isUploaded: true,
            message: 'file uploaded',
            file_path: filePath
        }
    } catch (error) {
        console.error(error);
        return {
            isUploaded: false,
            message: 'file not uploaded'
        }    
    }
}

const readReceipt = async (path) => {
    try {
        const formdata = new FormData();
        const fileBuffer = fs.readFileSync(path);
        const blob = new Blob([fileBuffer]);
        formdata.append("receipt", blob, path);
        const requestOptions = {
            method: "POST",
            body: formdata,
            redirect: "follow"
        };

        const response = await fetch("http://ocr.asprise.com/api/v1/receipt", {
            method: 'POST',
            body: formdata
        });
        
        return response;
    } catch (error) {
        console.log(error)
        return {
            message: "Ha ocurrido un error al intentar leer el recibo."
        }    
    }
}