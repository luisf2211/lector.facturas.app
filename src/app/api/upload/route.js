import { NextResponse } from "next/server";
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

        const responseReadReceipt = await readReceipt(file);
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

const readReceipt = async (file) => {
    try {
        const formdata = new FormData();
        const blob = new Blob([file]);
        formdata.append("receipt", blob);

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