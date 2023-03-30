// const loadData = heroes => {
//     console.log(heroes)
//     for (let i = 0; i < heroes.length; i++) {
//         console.log(heroes[i])
//     }
//     let tableData = "";
//     heroes.map((values) => {
//         tableData += `<tr>
//         <td><img src=${values.images.xs}></td>
//             <td>${values.name}</td>
//             <td>${values.biography.fullName}</td>
//             <td>Combat : ${values.powerstats.combat}<br>
//                 Durability : ${values.powerstats.durability}<br>
//                 Intelligence : ${values.powerstats.intelligence}<br>
//                 Power : ${values.powerstats.power}<br>
//                 Speed : ${values.powerstats.speed}<br>
//                 Strength : ${values.powerstats.strength}</td>
//             <td>${values.appearance.race}</td>
//             <td>${values.appearance.gender}</td>
//             <td>${values.appearance.height}</td>
//             <td>${values.appearance.weight}</td>
//             <td>${values.biography.placeOfBirth}</td>
//             <td>${values.biography.alignment}</td>
//             </tr>`;
//     });
//     document.getElementById("table_body").innerHTML = tableData
// }

// fetch('https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json')
//     .then((response) => response.json()) // parse the response from JSON
//     .then(loadData) // .then will call the `loadData` function with the JSON value.

document.addEventListener('DOMContentLoaded', loadData, false);

let heroes, table, sortCol;
let sortAsc = false;
let select = document.getElementById('hero-select');
let pageSize = 20;
select.onchange = function () {
    let select = document.getElementById('hero-select');
    let value = select.options[select.selectedIndex].value;
    pageSize = value
    console.log(value);
    renderTable()
}
let curPage = 1;

async function loadData() {
    table = document.querySelector('#myTable tbody');
    let resp = await fetch('https://rawcdn.githack.com/akabab/superhero-api/0.2.0/api/all.json');
    heroes = await resp.json();
    console.log(heroes)
    for (let i = 0; i < heroes.length; i++) {
        console.log(heroes[i])
        heroes[i].fullName = heroes[i].biography.fullName
        heroes[i].powerstat = (heroes[i].powerstats.combat + heroes[i].powerstats.durability + heroes[i].powerstats.intelligence + heroes[i].powerstats.power + heroes[i].powerstats.speed + heroes[i].powerstats.strength)
        heroes[i].race = heroes[i].appearance.race
        heroes[i].gender = heroes[i].appearance.gender
        if (heroes[i].appearance.height[1] == (parseFloat(heroes[i].appearance.height[1]).toString() + " meters")) {
            heroes[i].height = (parseFloat(heroes[i].height)*100).toString() + " cm"
            console.log(parseFloat(heroes[i].appearance.height[1]).toString() + " cmmmm");
        } else {
            heroes[i].height = heroes[i].appearance.height[1]
            console.log(parseFloat(heroes[i].appearance.height[1]).toString() + " cm");
        }
        heroes[i].weight = heroes[i].appearance.weight[1]
        heroes[i].birthplace = heroes[i].biography.placeOfBirth
        heroes[i].alignment = heroes[i].biography.alignment
    }

    renderTable();
    //clics pr trier
    document.querySelectorAll('#myTable thead tr th').forEach(t => {
        t.addEventListener('click', sortHero, false);
    });

    document.querySelector('#nextButton').addEventListener('click', nextPage, false);
    document.querySelector('#prevButton').addEventListener('click', previousPage, false);
    document.querySelectorAll('#img').forEach(t => {
        t.addEventListener('click', showDetails, false);
    });
}

function renderTable() {
    let result = '';
    let count = 0;
    heroes.filter((row, index) => {
        let start = (curPage - 1) * pageSize;
        let end = curPage * pageSize;
        if (index >= start && index < end) return true;
    }).forEach(values => {
        result += `<tr>
            <td><img src=${values.images.xs} id="img${count}"></td>
            <td>${values.name}</td>
            <td>${values.biography.fullName}</td>
            <td>Combat : ${values.powerstats.combat}<br>
                Durability : ${values.powerstats.durability}<br>
                Intelligence : ${values.powerstats.intelligence}<br>
                Power : ${values.powerstats.power}<br>
                Speed : ${values.powerstats.speed}<br>
                Strength : ${values.powerstats.strength}</td>
            <td>${values.appearance.race}</td>
            <td>${values.appearance.gender}</td>
            <td>${values.appearance.height[1]}</td>
            <td>${values.appearance.weight[1]}</td>
            <td>${values.biography.placeOfBirth}</td>
            <td>${values.biography.alignment}</td>
        </tr>`;
        count++;
    });
    table.innerHTML = result;
}

function sortHero(e) {
    let thisSort = e.target.dataset.sort;
    if (sortCol === thisSort) sortAsc = !sortAsc;
    sortCol = thisSort;
    console.log('sort dir is ', sortAsc, thisSort, sortCol);
    heroes.sort((a, b) => {
        if (a[sortCol] === "-" || a[sortCol] === "null" || a[sortCol] === "" || a[sortCol] == null || a[sortCol] == undefined || a[sortCol] == "0 kg" || a[sortCol] == "0 cm") {
            return 1;
        } else if (b[sortCol] === "-") {
            return -1;
        } else if (a[sortCol] < b[sortCol]) {
            if (sortAsc) {
                return 1;
            } else {
                return -1;
            }
        } else if (a[sortCol] > b[sortCol]) {
            if (sortAsc) {
                return -1;
            } else {
                return 1;
            }
        } else {
            return 0;
        }
    });
    renderTable();
}

function previousPage() {
    if (curPage > 1) curPage--;
    renderTable();
}

function nextPage() {
    if ((curPage * pageSize) < heroes.length) curPage++;
    renderTable();
}
