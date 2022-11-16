Entrega final curso Backend - Coderhouse
Mariano Barone

La entrega se realizo de tal forma que se permita probar todas las funcionalidades desde el front (realizado principalmente en Handlebars)
Lo unico no testeable desde el front es el filtro de categorias ya que devuelve un json cuando se clickea en el filtro de la NavBar en vez de renderizar la vista. De todas formas puede testearse tambien mediante la api (http://localhost:8080/api/products/category/:category) siendo :category Action o Drama.

image.png

La home no solicita iniciar sesion para poder ver los productos, tal como funciona cualquier ecommerce.

El login y el registro fueron realizados con passport, y una vez iniciada la sesion se puede realizar la compra y ver el perfil del usuario con sus respectivas ordenes.

Dentro del perfil, se encuentra el chat realizado con WebSockets. El mismo pide un 'nickname' para identificar al usuario y la funcion esperada es que de ser logueado con otro usuario el mismo pueda comunicarse como si fuera 'Soporte' y charlar en el chat.

El carrito va sumando los items en la NavBar y luego se muestran detallados una vez dentro de la vista del mismo. Ademas pueden eliminarse los productos o reducir los 'items' en 1.

Todo esto se guarda en MongoAtlas.

La ruta /info muestra la informacion del servidor
La ruta /config muestra las configuraciones que se deben realizar en el archivo .env
La ruta /checkout finaliza la compra y envia el mail con los datos de la misma a la casilla configurada. 

Una credencial de acceso para utilizar es:

Username: test9
Pass: 1234

Aspectos a mejorar:
Guardar el carrito antes de que inicie sesion asi no se pierde una vez que el usuario lo hace.
Tomar el nickname del usuario en uso para el Chat.