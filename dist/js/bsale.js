/*Declaración de variables para obtener los diferentes elemnetos del DOM */
const d = document,
    $ulPagTop = d.querySelector("#paginationTop"),
    $ulPagEnd = d.querySelector("#paginationEnd"),
    $cardsProducts = d.querySelector(".cardsProducts"),
    $listCategories = d.querySelector(".listCategories"),
    $templateProducts = d.getElementById("templateProducts").content,
    $fragmentoProducts = d.createDocumentFragment(),
    $templateCategories = d.getElementById("templateCategories").content,
    $fragmentoCategories = d.createDocumentFragment();

/**Declaracíon de variable que almacena la ruta de una imagen para mostrar en lugar de los productos que no tienes registrada una image */
const imageProductDefault =
    "https://www.bicifan.uy/wp-content/uploads/2016/09/producto-sin-imagen.png";

/**Declaración de variables con las rutas de los endpoints que se van a consumir.*/
const productAllAPI = "https://bsaletestapirest.herokuapp.com/v1/productsPage/?page=",
    productsCategoryAPI = "https://bsaletestapirest.herokuapp.com/v1/productsCategoryPage?category=",
    productsNameAPI = "https://bsaletestapirest.herokuapp.com/v1/productsNamePage?name=",
    categoriesAllAPI = "https://bsaletestapirest.herokuapp.com/v1/categories";

/**Declaro la variable productAPI y le asigno como valor inicial la ruta del endpoint para obtener todos los productos */
let productAPI = productAllAPI;

/**Declaro la variable textFilter en blanco. */
let textFilter = "";

/**Función asincrona para consumir el endpoint que se utiliza para listar las categorias */
const getCategories = async() => {
    try {
        /**Consumo el endpoint de la la variable categoriesAllAPI:
         * - res: almacena la respuesta devuelta por el endpoint.
         * - json: convierte la respuesta en un json.
         */
        let res = await fetch(categoriesAllAPI),
            json = await res.json();

        /**Si la propiedad "ok" de la respuesta es falso, se genera un error. */
        if (!res.ok)
            throw {
                status: res.status,
                statusText: res.statusText,
            };

        /**Recorro cada elemento de la variable json. Utilizando la plantilla $templateCategories,
         * creo un nodo por cada categoria, almacenando en una etiiqueta <li>, con un enlace del nombre de la categoria.
         * Además, al enlace se le agrega la propiedad "data-category" para almecenar el id de la categoria.
         * Finalmente, creo la variable $clone para copiar el contenido de $templateCategories e insertar la lista en $fragmentoCategories
         */
        json.forEach((c) => {
            $templateCategories.querySelector("a").textContent = String(
                c.name
            ).toUpperCase();
            $templateCategories.querySelector("a").classList.add("category");
            $templateCategories
                .querySelector("a")
                .setAttribute("data-category", c.id);
            let $clone = document.importNode($templateCategories, true);
            $fragmentoCategories.appendChild($clone);
        });

        /**Dibujo la lista de categorias en la página HTML. */
        $listCategories.appendChild($fragmentoCategories);
    } catch (err) {
        /**Si existe un error dibujo el mensaje de error en lugar de la lista de categorias. */
        let message = err.statusText || "Ocurrio un error";
        $listCategories.innerHTML = message;
    }
};

/** Función para insertar la paginación en la página HTML, recibe como parametros:
 * - pageNumber: número de pagina actual que devuelve el endpoint.
 * - totalPages: total de páginas en el que se organiza la lista de productos que devuelve el endpoint.*/
const getPagination = (pageNumber, totalPages) => {
    /**Limpio la paginación superior e inferior */
    $ulPagTop.innerHTML = "";
    $ulPagEnd.innerHTML = "";

    /**Declaración de una variable tipo fragmento para facilitar la inserción de código en el DOM */
    let $fragmentoPaginacion = d.createDocumentFragment();

    /**Si la pagina de productos devuelta no es la primero o hay mas de dos páginas
     * se declara la variable $firstLink con una etiqueta <li> y un enlace que devolvera a la
     * primera página de productos. En caso contrario se declara la variable $firstLink vacií.
     */
    let $firstLink =
        pageNumber !== 0 && totalPages > 2 ?
        `<li class="page-item">
                <a class="page-link" href="#" data-page="0" tabindex="-1" aria-disabled="true">
                    Primero
                </a>
            </li>` :
        "";

    /**Si la pagina de productos devuelta no es la ultima o hay mas de dos páginas
     * se declara la variable $lastLink con una etiqueta <li> y un enlace que devolvera a la
     * última página de productos. En caso contrario se declara la variable $lastLink vacía.
     */
    let $lastLink =
        pageNumber < totalPages - 1 && totalPages > 2 ?
        `<li class="page-item">
                <a class="page-link" href="#" data-page="${
                  totalPages - 1
                }" tabindex="-1" aria-disabled="true">
                   Último
                </a>
            </li>` :
        "";

    /**Ciclo for que va agregando, al DocumentFragment $fragmentoPaginacion,
     * un nodo con la  etiqueta <li> con un enlace a cada número de página */
    for (let i = 0; i < totalPages; i++) {
        const $li = d.createElement("li");
        $li.classList.add("page-item");
        if (pageNumber === i) $li.classList.add("active");

        const $a = d.createElement("a");
        $a.classList.add("page-link");
        $a.setAttribute("href", "#")
        $a.setAttribute("data-page", i);
        $a.textContent = i + 1;

        $li.appendChild($a);

        $fragmentoPaginacion.appendChild($li);
    }

    /**Declaro la variable $clone para hacer una copia de la variable $fragmentoPaginacion,
     * esto para poder insertar la paginación en la inferior de la página.
     */
    let $clone = document.importNode($fragmentoPaginacion, true);

    /**Inserto el código de paginación en la parte superior de lista de productos. */
    $ulPagTop.innerHTML += $firstLink;
    $ulPagTop.appendChild($fragmentoPaginacion);
    $ulPagTop.innerHTML += $lastLink;

    /**Inserto el código de paginación en la parte superior de lista de productos. */
    $ulPagEnd.innerHTML += $firstLink;
    $ulPagEnd.appendChild($clone);
    $ulPagEnd.innerHTML += $lastLink;
};

/**Función asincrona para consumir los endpoint que se utilizan para listar los productos, recibe dos parametros:
 * - url: indica el endpoint del que se va obtener la lista de productos paginada.
 * - page: indica el número de página que se quiere obtener, si no ingresa por defecto retornara la primera página.
 */
const getProducts = async(url, page = 0) => {
    /**Limpio el texto del buscador de la parte superior en caso se este realizando una búsqueda para obtener la lista de productos */
    d.getElementById("inputSearch").value = "";

    try {
        /**Consumo el endpoint de la ruta almacenada en url e indicamos el número de pagina que se va a obtener:
         * - res: almacena la respuesta devuelta por el endpoint.
         * - json: convierte la respuesta en un json.
         */
        let res = await fetch(url + page),
            json = await res.json();

        /**Si la propiedad "ok" de la respuesta es falso, se genera un error. */
        if (!res.ok)
            throw {
                status: res.status,
                statusText: res.statusText,
            };

        /**Dibujo en el HTML la información sobre los productos que se estan mostrando. */
        d.getElementById(
            "titleFilter"
        ).innerHTML = `Mostrando ${json.totalElements} producto(s) ${textFilter}`;

        /**Limpio la vista de productos mostrados. */
        $cardsProducts.innerHTML = "";

        /**Obtengo la paginación */
        getPagination(json.pageable.pageNumber, json.totalPages);

        /**Recorro cada elemento almacenado la propiedad "content" de la respuesta. Utilizando la plantilla $templateProducts,
         * creo un nodo por cada producto, almacenando en una card la imagen, nombre y precio del producto.
         * Finalmente, creo la variable $clone para copiar el contenido de $templateProducts e insertar la card en $fragmentoProducts
         */
        json.content.forEach((p) => {
            $templateProducts
                .querySelector("img")
                .setAttribute(
                    "src",
                    p.url_image === null || p.url_image.trim() === "" ?
                    imageProductDefault :
                    p.url_image
                );

            $templateProducts.querySelector("#card-title").textContent = String(
                p.name
            ).toLowerCase();

            $templateProducts.querySelector(
                ".card-text"
            ).textContent = `$ ${p.price}`;

            let $clone = document.importNode($templateProducts, true);

            $fragmentoProducts.appendChild($clone);
        });

        /**Dibujo las cards de productos en la página HTML. */
        $cardsProducts.appendChild($fragmentoProducts);
    } catch (err) {
        /**Si existe un error dibujo el mensaje de error en lugar de las cards de productos. */
        let message = err.statusText || "Ocurrio un error";
        $cardsProducts.innerHTML = message;
    }
};

/**Función para obtener los productos filtrados por nombre. */
const getProductsName = () => {
    /**Capturo el texto ingresado en el input del buscador.*/
    let search = d.getElementById("inputSearch").value;

    /**Cambio el valor de la variable productAPI por la ruta del endpoint de productos filtrados por nombre. */
    productAPI = productsNameAPI + search + "&page=";

    /**Agrego texto a la variable textFilter para mostrar un resumen de los productos mostrados.*/
    textFilter =
        String(search).length > 0 ? `para <strong>"${search}"</strong>.` : "";

    /**Invoco a la función getProducts pasando como variable la ruta almacenada en productAPI */
    getProducts(productAPI);
}

/**Una vez el DOM este listo, agregamos las función getCategories para listar todas las categorias
 *  y getProducts para mostrar 16 productos por pagina.*/
d.addEventListener("DOMContentLoaded", getCategories);
d.addEventListener("DOMContentLoaded", getProducts(productAPI, (page = 0)));

/** */
d.addEventListener("click", (e) => {
    /**Si hacemos click en un enlace dentro de la etiqueta <ul> con la clase "pagination", se ejecuta la siguiente funcion*/
    if (e.target.matches(".pagination a")) {
        /**Invoco a la función getProducts pasando la ruta almacenada en la variable productAPI
         * y el valor de la propiedad data-page.
         */
        getProducts(productAPI, e.target.getAttribute("data-page"));
    }
    /**Si hacemos click en un enlace con la clase .category dentro de la etiqueta li, se ejecuta la siguiente funcion*/
    else if (e.target.matches("li .category")) {
        /**Creo un elemento del tipo <li>, asignado el nombre de la categoria e la que hacemos click y agrego las propiedades
         * para la barra de navegación.
         */
        let $li = d.createElement("li");
        $li.textContent = e.target.textContent;
        $li.classList.add("breadcrumb-item");
        $li.classList.add("active");
        $li.setAttribute("id", "breadcrumbCategory");

        /**Si la barra de navegación tiene un elemento con id "breadcrumbCategory" lo remuevo*/
        if (d.getElementById("breadcrumbCategory"))
            d.getElementById("breadcrumb").removeChild(
                d.getElementById("breadcrumbCategory")
            );

        /**Dibujo el elemento <li> almacenado en la variable $li dentro de la barra de navegación. */
        d.getElementById("breadcrumb").appendChild($li);

        /**Cambio el valor de la variable productAPI por la ruta del endpoint de productos filtrados por categoria*/
        productAPI =
            productsCategoryAPI + e.target.getAttribute("data-category") + "&page=";

        /**Agrego texto a la variable textFilter para mostrar un resumen de los productos mostrados.*/
        textFilter = `para  la categoria <strong>"${e.target.textContent}"</strong>.`;

        /**Invoco a la función getProducts pasando como variable la ruta almacenada en productAPI */
        getProducts(productAPI);


    }
    /**Si hacemos click en el enlace con la clase .searchName dentro de la etiqueta span, invoco a la funciona getProductsName */
    else if (e.target.matches("span .searchName")) {
        getProductsName()
    }
    /**Si hacemos click en el enlace con la clase .linkIndex dentro del elemento con id "breadcrumb", realizo la siguiente función.*/
    else if (e.target.matches("#breadcrumb .linkIndex")) {
        /**Si la barra de navegación tiene un elemento con id "breadcrumbCategory" lo remuevo*/
        if (d.getElementById("breadcrumbCategory"))
            d.getElementById("breadcrumb").removeChild(
                d.getElementById("breadcrumbCategory")
            );

        /**Cambio el valor de la variable productAPI por la ruta del endpoint que obtiene todos los productos*/
        productAPI = productAllAPI;

        /**Limpio la variable textFilter. */
        textFilter = "";

        /**Invoco a la función getProducts pasando como variable la ruta almacenada en productAPI */
        getProducts(productAPI);
    }
});

/**Agrego el evento keypress para desencadenar una función cuando se presiona una tecla en la web */
d.addEventListener("keypress", e => {
    /**Si presionamos la tecla enter dentro del input del buscador invoco a la funciona getProductsName */
    if (e.target.matches("#inputSearch") && e.key === "Enter") {
        getProductsName()
    }
});