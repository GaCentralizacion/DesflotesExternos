export default {
    "development":
    {
        "port": 3666,//nos definiran el puerto
        "seguridad": {
            "host": "apiseguridad.grupoandrade.com",
            "port": 443,
            "method": "POST",
            "headers": {
                "Content-Type": "multipart/form-data"
            },
            "protocolo": "https"
        },
        "aplicacionId": 14,
        "bpro": {
            "dealerId": 1001,
            "apiKey": "e04afb0f-5053-4877-8300-fbc98e968411",
            "apiSecret": "CdhjHGWQuQJ4XelPxa13oVJXkjOmE/BuikY+P1U21oxqzW6xLFNRdIi+TlLlUwaP6PTbNnCaGfLpOGG0PtgcazzFbgr8Ppb2E0AZ/gyoUawlMCbyI1uQjA==",
            "host": "192.168.20.89",
            "port": 5900,
            "method": "POST",
            "headers": {
                "Content-Type": "multipart/form-data"
            },
            "protocolo": "http"
        },
        "proveedorFactura": {
            "host": 'http://192.168.20.89/Proveedores/api/CargAapi/1',
            'rutaArchivos': 'E:\\Aplicaciones\\Portal_Proveedores_Produccion\\portal-proveedores\\app\\static\\files',
            'rutaPdf': 'http://192.168.20.105:8081/INTEGRA/CFD/PDF/',
            'rutaXml': 'http://192.168.20.105:8081/INTEGRA/CFD/XML/'
            // 'rutaPdf': 'C:\\BPRO\\BPRO_CFD\\INTEGRA\\CFD\\PDF\\',
            // 'rutaXml': 'C:\\BPRO\\BPRO_CFD\\INTEGRA\\CFD\\XML\\'
        },
        "proveedorComprobante": {
            "host": 'http://192.168.20.89/ApiCentralCXC/api/documentoapi',
        },
        "intelimotor":{
            "apiKey": '3bbce11b44d5',
            "apiSecret": 'MYvlQ4W5Lq4ftXnyVxreX6dpG0nTpufC5p542mz5CZrzDDfun1a',
            "host": "https://app.intelimotor.com/api",
            "port": 403,
            "method": "GET",
            "headers": {
                "Content-Type": "multipart/form-data"
            },
            "protocolo": "https"
            // "host": 'https://app.intelimotor.com/api',
            // "apiKey": 'XBT3XfffHM',
            // "apiSecret": 'F46DBB5693BFCCFCEF43638D2125861A348F8BBDD97D5EE6EB9BACBF7A'

        }

    },
    "production": {

    },
    "qa": {

    },
    "training": {

    }
};
