# Prueba técnica BSale

### Sobre el desafío

Construir una tienda online que despliegue productos agrupados por la categoría a la que pertenecen, generando por separado backend (API REST) y frontend (aplicación que la consuma).

Además, hay que agregar un buscador, el cual tiene que estar implementado a nivel de servidor, mediante una Api Rest cuyo lenguaje y framework puede ser de libre elección. Es decir, los datos de productos deben llegar filtrados al cliente.

### Solución realizada

Para cumplir con el desafío se desarrollo el front End utilizando HTML , Javascript y el framework Bootstrap. El archivo HTML y  JavaScript cuentan con comentarios que explican el funcionamiento de cada parte del codigo.

Para crear el API REST se utilizo  el lenguaje Java con el framework Spring bot. Todo el codigo se encuentra comentado para hacer mas facil entender el codigo utilizado. Además, todas las consultaas a la base de datos se han realizado con parametros, para evitar inyección de sql. Puede ver más información sobre el API REST en el siguiente enlace: https://github.com/Azgaf012/BSaleTestApiRest.git

Puede ver un deploy de la aplicación en el siguiente enlace: https://bsale-store-front.netlify.app/

# FrontEnd

El FrontEnd cuenta con una página principal responsiva. Al cargar la página principal consume un endpoint que devuelve una lista de productos paginada y otro endpoint para listar las categorias.

En la parte superior se encuentra una barra de navegación fija donde se pueden hacer filtros por categoría o utilizar el buscador para obtener resultados mas exactos.

Debajo de la barra de navegación hay un "breadcrumb" para indicar al usuario si es que ha realizado algun filtro por categoría o si se encuentra en la página principal.

En la siguiente fila, al lado izquierdo se muestra un texto resumen indicando la cantidad de productos retornados por el endpoint consumido y si es que se filtra por alguna categoria o un nombre ingresado en el buscador. En lado derecho muestra el menú de paginación.

Luego se muestra la lista de productos ordenados en columnas segun el tamaño de la pantalla (como máximo 4 columnas) y como máximo 16 productos por página..

Finalmente en la parte inferior nuevamente se muestra otro menú de paginación.

![Pantalla de inicio](https://raw.githubusercontent.com/Azgaf012/bsaletestclient/main/imagen%20web.png)

### Tecnologías utilizadas

- HTML 5.
- Javascript (Vanilla js).
- Bootstrap 5.1



