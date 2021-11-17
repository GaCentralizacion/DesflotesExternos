export default {
    "development":
    {
        "port": 4070,
        "seguridad": {
            "host": "192.168.20.137",
            "port": 4000,
            "method": "POST",
            "headers": {
                "Content-Type": "multipart/form-data"
            },
            "protocolo": "http"
        },
        "aplicacionId": 21,
        "bpro": {
            "dealerId": 1001,
            "apiKey": "08a0faf0-ae65-4034-b693-ffd1ef39eff6",
            "apiSecret": "gjcAsJGXgkvo9Ns2cJoZ8tQTSbz+zhUYPUD62nnkbWa3LgqM2PlgKzyy",
            "host": "192.168.20.123",
            "port": 5900,
            "method": "POST",
            "headers": {
                "Content-Type": "multipart/form-data"
            },
            "protocolo": "http"
        },
        "proveedorFactura": {
            "host": 'http://192.168.20.123/Proveedores/api/CargAapi/1',
            'rutaArchivos': 'C:\\APLICACIONES\\Proveedores\\GIT\\proveedores\\app\\static\\files',
            'rutaPdf': 'http://192.168.20.123:8081/INTEGRA/CFD/PDF/',
            'rutaXml': 'http://192.168.20.123:8081/INTEGRA/CFD/XML/'
            // 'rutaPdf': 'C:\\BPRO\\BPRO_CFD\\INTEGRA\\CFD\\PDF\\',
            // 'rutaXml': 'C:\\BPRO\\BPRO_CFD\\INTEGRA\\CFD\\XML\\'
        },
        "proveedorComprobante": {
            "host": 'http://192.168.20.123/ApiCentralCXC/api/documentoapi',
        },
        "intelimotor": {
            "host": 'https://app.intelimotor.com/api',
            "apiKey": 'XBT3XfffHM',
            "apiSecret": 'F46DBB5693BFCCFCEF43638D2125861A348F8BBDD97D5EE6EB9BACBF7A'

        }

    },
    "production": {

    },
    "qa": {

    },
    "training": {

    }
};
