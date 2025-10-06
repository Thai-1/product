//Button Status

const buttonStatus = document.querySelectorAll("[button-status]");

if (buttonStatus.length > 0) {
    let url = new URL(window.location.href);

    buttonStatus.forEach(button => {
        button.addEventListener("click", () => {
            const status = button.getAttribute("button-status");

            if (status) {
                url.searchParams.set("status", status);
            }
            else
                url.searchParams.delete("status");
            window.location.href = url.href;
        })
    })
}
// console.log(buttonStatus);

//Form Seach
const formSearch = document.querySelector("#form-search")
if (formSearch) {
    let url = new URL(window.location.href)
    formSearch.addEventListener("submit", (e) => {
        e.preventDefault();
        // console.log(e.target.elements.keyword.value);
        if (e.target.elements.keyword.value)
            url.searchParams.set("keyword", e.target.elements.keyword.value)
        else
            url.searchParams.delete("keyword")
        window.location.href = url.href
    })
}

//Button Pagination

const buttonPagination = document.querySelectorAll("[button-pagination]");


if (buttonPagination) {
    let url = new URL(window.location.href);
    buttonPagination.forEach(button => {
        button.addEventListener("click", () => {
            const page = button.getAttribute("button-pagination")
            url.searchParams.set("page", page)
            window.location.href = url.href
        })
    })
}

