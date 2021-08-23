const d = document,
    $ulPagTop = d.querySelector("#paginationTop"),
    $ulPagEnd = d.querySelector("#paginationEnd"),
    $cardsProducts = d.querySelector(".cardsProducts"),
    $listCategories = d.querySelector(".listCategories"),
    $templateProducts = d.getElementById("templateProducts").content,
    $fragmentoProducts = d.createDocumentFragment(),
    $templateCategories = d.getElementById("templateCategories").content,
    $fragmentoCategories = d.createDocumentFragment();

const imageProductDefault =
    "https://www.bicifan.uy/wp-content/uploads/2016/09/producto-sin-imagen.png";

const productAllAPI = "https://bsaletestapirest.herokuapp.com/v1/productsPage/?page=";
const productsCategoryAPI = "https://bsaletestapirest.herokuapp.com/v1/productsCategoryPage?category=";
const productsNameAPI = "https://bsaletestapirest.herokuapp.com/v1/productsNamePage?name=";
const categoriesAllAPI = "https://bsaletestapirest.herokuapp.com/v1/categories";

let productAPI = productAllAPI
let textFilter = ""


const getPagination = (pageNumber, totalPages) => {
    $ulPagTop.innerHTML = ""
    $ulPagEnd.innerHTML = ""

    let $fragmentoPaginacion = d.createDocumentFragment();


    let $firstLink = pageNumber !== 0 && totalPages > 2 ?
        `<li class="page-item">
                <a class="page-link" href="#" data-page="0" tabindex="-1" aria-disabled="true">
                    Primero
                </a>
            </li>` :
        "";

    let $lastLink = pageNumber < totalPages - 1 && totalPages > 2 ?
        `<li class="page-item">
                <a class="page-link" href="#" data-page="${totalPages-1}" tabindex="-1" aria-disabled="true">
                   Último
                </a>
            </li>` :
        "";


    for (let i = 0; i < totalPages; i++) {
        const $li = d.createElement("li")
        $li.classList.add("page-item")
        if (pageNumber === i) $li.classList.add("active")

        const $a = d.createElement("a")
        $a.classList.add("page-link")
        $a.setAttribute("data-page", i)
        $a.textContent = i + 1

        $li.appendChild($a)

        $fragmentoPaginacion.appendChild($li)
    }

    let $clone = document.importNode($fragmentoPaginacion, true);

    $ulPagTop.innerHTML += $firstLink
    $ulPagTop.appendChild($fragmentoPaginacion)
    $ulPagTop.innerHTML += $lastLink

    $ulPagEnd.innerHTML += $firstLink
    $ulPagEnd.appendChild($clone)
    $ulPagEnd.innerHTML += $lastLink
}

const getProducts = async(url, page = 0) => {

    d.getElementById("inputSearch").value = ""

    try {
        let res = await fetch(url + page),
            json = await res.json();

        if (!res.ok) throw {
            status: res.status,
            statusText: res.statusText,
        };

        d.getElementById("titleFilter").innerHTML = `Mostrando ${json.totalElements} producto(s) ${textFilter}`

        $cardsProducts.innerHTML = ""

        getPagination(json.pageable.pageNumber, json.totalPages)

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
        $cardsProducts.appendChild($fragmentoProducts);
    } catch (err) {
        let message = err.statusText || "Ocurrio un error";
        $cardsProducts.innerHTML = message;
    }
};

const getCategories = async() => {
    try {
        let res = await fetch(categoriesAllAPI),
            json = await res.json();

        if (!res.ok)
            throw {
                status: res.status,
                statusText: res.statusText,
            };
        //console.log(json)
        json.forEach((c) => {
            $templateCategories.querySelector("a").textContent = String(c.name).toUpperCase();
            $templateCategories.querySelector("a").classList.add('category')
            $templateCategories.querySelector("a").setAttribute("data-category", c.id)
            let $clone = document.importNode($templateCategories, true);
            $fragmentoCategories.appendChild($clone);
        });
        $listCategories.appendChild($fragmentoCategories);
        /* $cards.appendChild($fragmento); */
    } catch (err) {
        let message = err.statusText || "Ocurrio un error";
    }
};

d.addEventListener("DOMContentLoaded", getProducts(productAPI, page = 0));
d.addEventListener("DOMContentLoaded", getCategories);
d.addEventListener("click", e => {
    if (e.target.matches(".pagination a")) {
        e.preventDefault()
        getProducts(productAPI, e.target.getAttribute("data-page"))
    } else if (e.target.matches("li .category")) {


        let $li = d.createElement("li")
        $li.textContent = e.target.textContent
        $li.classList.add("breadcrumb-item")
        $li.classList.add("active")
        $li.setAttribute("id", "breadcrumbCategory")

        productAPI = productsCategoryAPI + e.target.getAttribute("data-category") + '&page='

        textFilter = `para  la categoria <strong>"${e.target.textContent}"</strong>.`
        getProducts(productAPI)

        if (d.getElementById("breadcrumbCategory")) d.getElementById("breadcrumb").removeChild(d.getElementById("breadcrumbCategory"))

        d.getElementById("breadcrumb").appendChild($li)
    } else if (e.target.matches("span .searchName")) {
        e.preventDefault()

        let search = d.getElementById("inputSearch").value
        productAPI = productsNameAPI + search + '&page='
        textFilter = (String(search).length > 0) ? `para <strong>"${search}"</strong>.` : ""
        getProducts(productAPI)
    } else if (e.target.matches("#breadcrumb .linkIndex")) {

        if (d.getElementById("breadcrumbCategory")) d.getElementById("breadcrumb").removeChild(d.getElementById("breadcrumbCategory"))

        productAPI = productAllAPI
        textFilter = ""
        getProducts(productAPI, page = 0)
    }
})
d.addEventListener("keypress", e => {
    if (e.target.matches("#inputSearch") && e.key === 'Enter') {
        e.preventDefault()
        let search = d.getElementById("inputSearch").value
        productAPI = productsNameAPI + search + '&page='

        textFilter = (String(search).length > 0) ? `para <strong>"${search}"</strong>.` : ""
        getProducts(productAPI)
    }
})