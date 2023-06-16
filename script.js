const typeAction = document.querySelector("#type-action");
const categorieAction = document.querySelector("#categorie-action");
const voitureAction = document.querySelector("#voiture-action");
const lavageAction = document.querySelector("#lavage-action");

const idLavage = document.querySelector("#id-lavage")
const voiture = document.querySelector("#voiture");
const lavage = document.querySelector("#lavage");
const prix = document.querySelector("#prix");

const typeLavage = document.querySelector("#typelavage");

const categorieType = document.querySelector("#categorietype");
const categorieDesignation = document.querySelector("#categoriedesignation");
const categorieModele = document.querySelector("#categoriemodele");
const categoriePrix = document.querySelector("#categorieprix");

const voiturePlaque = document.querySelector("#voitureplaque");
const voitureModele = document.querySelector("#voituremodele");

const listType = document.querySelector("#list-type");
const listCategorie = document.querySelector("#list-categorie");
const listVoiture = document.querySelector("#list-voiture");

let lavages, types, categories, voitures, category = [];

document.addEventListener("DOMContentLoaded", async() => {

  // Setting localstorage;
  initialLocalStorage();

  //Get datas from localstorage
  lavages = JSON.parse(localStorage.getItem('lavages'));
  types = JSON.parse(localStorage.getItem('types'));
  categories = JSON.parse(localStorage.getItem('categories'));
  voitures = JSON.parse(localStorage.getItem('voitures'));

  // // Get datas from json-server
  // lavages = await getData("lavages");
  // types = await getData("types");
  // categories = await getData("categories");
  // voitures = await getData("voitures");
  
  // Show items in table
  showLavage(allItemLavage());

  // Datalist
  dataList (listType, dataProperty(types, "nom"));
  dataList (listVoiture, dataProperty(voitures, "plaque"));
  
});

lavageAction.addEventListener("click", e => {
  e.preventDefault();
  const value = {
    lavage: lavage.value,
    voiture: voiture.value,
    prix: prix.value,
  }

  if (checkData(value).length > 0) return;
  
  value.time = formatDate(new Date());
  value.lavage = dataProperty(categories, "designation").indexOf(lavage.value);
  value.voiture = dataProperty(voitures, "plaque").indexOf(voiture.value);

  notif("Ajout - Lavage voiture", "L'enregistrement s'est effectué avec success");

  if(idLavage.value === "") {
    console.log(value)
    lavages = [...lavages, value];
    console.log(lavages)
    // saveData("lavages", value);
  }
  if(idLavage.value !== "") {
    // saveData("lavages", value, idLavage.value)
    idLavage.value = "";
  }
  showLavage(allItemLavage());
  lavage.value = voiture.value = prix.value = "";

});

typeAction.addEventListener("click", e => {
  e.preventDefault();
  const value = {nom : typeLavage.value};

  if (checkData({typelavage: value}).length > 0) return;

  if(arrayLowerCase(types).indexOf(value.nom.toLowerCase()) !== -1) {
    typeLavage.value = "";
    return document.querySelector("#typelavage-wrong").innerHTML = `<i class="fa-solid fa-asterisk"></i> Cet élément ${value} existe déjà`;
  }

  types = [...types, value];
  typeLavage.value = "";
  saveData("types", value);
  // Localstorage
  localStorage.setItem('types', JSON.stringify(types));

  dataList (listType,  dataProperty(types, "nom"));
  notif("Ajout - Type de Lavage", "L'enregistrement s'est effectué avec success");
  
});

categorieAction.addEventListener("click", e => {
  e.preventDefault();
  const value = {
    categorietype: categorieType.value,
    categoriedesignation: categorieDesignation.value,
    categoriemodele: categorieModele.value,
    categorieprix: categoriePrix.value
  }

  if (checkData(value).length > 0) return;
  const datas = dataProperty(categories, "designation");
  if(arrayLowerCase(datas).indexOf(categorieDesignation.value.toLowerCase()) !== -1) {
    categorieDesignation.value = "";
    return document.querySelector("#categoriedesignation-wrong").innerHTML = `<i class="fa-solid fa-asterisk"></i> Cet élément ${categorieDesignation.value} existe déjà`;
  }

  const categorie = {
    type: dataProperty(types, "nom").indexOf(categorieType.value),
    designation: categorieDesignation.value,
    modele: categorieModele.value,
    prix: categoriePrix.value
  }
  saveData("categories", categorie);
  categories = [...categories, categorie];
  // Localstorage
  localStorage.setItem('categories', JSON.stringify(categories));

  notif("Ajout - Categorie de lavage", "L'enregistrement s'est effectué avec success");
  categorieType.value = categorieDesignation.value = categorieModele.value = categoriePrix.value = "";
  
});

voitureAction.addEventListener("click", e => {
  e.preventDefault();
  const value = {
    voitureplaque: voiturePlaque.value,
    voituremodele: voitureModele.value
  }

  if (checkData(value).length > 0) return;

  const datas = dataProperty(voitures, "plaque");

  if(arrayLowerCase(datas).indexOf(voiturePlaque.value.toLowerCase()) !== -1) {
    voiturePlaque.value = "";
    return document.querySelector("#voitureplaque-wrong").innerHTML = `<i class="fa-solid fa-asterisk"></i> Cet élément ${value} existe déjà`;
  }

  const voiture = {
    plaque: voiturePlaque.value,
    modele: voitureModele.value
  }

  saveData("voitures", voiture);
  voitures = [...voitures, voiture];
  // Localstorage
  localStorage.setItem('voitures', JSON.stringify(voitures));

  notif("Ajout - Voiture ", "L'enregistrement s'est effectué avec success");
  dataList (listVoiture, dataProperty(voitures, "plaque"));

  voiturePlaque.value = voitureModele.value = "";

});

categorieType.addEventListener("change", e => {
  e.preventDefault();
  if(dataProperty(types, "nom").indexOf(categorieType.value) === -1) categorieType.value = "";
})

voiture.addEventListener("change", e => {
  e.preventDefault();
  const model = voitures.filter(vehicule => vehicule.plaque === voiture.value);
  if(model.length < 0) return voiture.value = "";
  
  category = categories.filter(categorie => categorie.modele === model[0].modele); 
  dataList (listCategorie, dataProperty(category, "designation")); 
});

lavage.addEventListener("change", e => {
  e.preventDefault();
  const cat = category.filter(netoyage => netoyage.designation === lavage.value);
  if(cat.length < 0) return lavage.value = "";
  const lavageVoiture = categories.filter(cat => cat.designation === lavage.value);
  prix.value = lavageVoiture[0].prix;
});

const initialLocalStorage = () => {
  if(localStorage.getItem('lavages') === null) {
    localStorage.setItem('lavages', JSON.stringify([]));
  }

  if(localStorage.getItem('types') === null) {
    localStorage.setItem('types', JSON.stringify([]));
  }

  if(localStorage.getItem('categories') === null) {
    localStorage.setItem('categories', JSON.stringify([]));
  }

  if(localStorage.getItem('voitures') === null) {
    localStorage.setItem('voitures', JSON.stringify([]));
  }
}

const dataList = (list, datas) => {
  let opts = "";
  datas.map(data => {
    opts += `<option value="${data}">`;
  });
  list.innerHTML = opts;
}

const checkData = objs => {
  let data = [];

  for (const obj in objs) {
    if (objs[obj] === "") {
      data = [...data, obj];
      // Show error on UI under cell
      document.querySelector(`#${obj}-wrong`).innerHTML = `<i class="fa-solid fa-asterisk"></i> Ce champs est obligatoire`;
    }
    if (objs[obj] !== "") document.querySelector(`#${obj}-wrong`).innerHTML = "";
  }
  return data
}

const dataProperty = (array, prop) => {
  let data = [];

  array.map(arr => {
    if(arr.hasOwnProperty(prop)) data = [...data, arr[prop]];
  });

  return data;
}

const arrayLowerCase = array => {
  let arr = []
  array.map(element => {
    arr = [...arr, element.toLowerCase()]
  });
  return arr;
}

const formatDate = inputDate => {
  let date, month, year;

  date = inputDate.getDate();
  month = inputDate.getMonth() + 1;
  year = inputDate.getFullYear();
  date = date.toString().padStart(2, '0');
  month = month.toString().padStart(2, '0');

  return `${date}/${month}/${year}`;
}

const showLavage = lavage => {
  const tbody = document.querySelector("tbody");
  showItemsInTable(lavage, tbody);

  console.log("here")
  // Localstorage
  localStorage.setItem('lavages', JSON.stringify(lavages));

  Array.from(tbody.children).forEach(child => {
    child.addEventListener("click", e => {
      e.preventDefault();

      updateLavage(e.target.parentElement);

      // Delete task function
      deleteLavage(e.target.parentElement);
      
    });
  });
}

const updateLavage = target => {
  if(target.classList.contains("edit-lavage")){
    const id = target.getAttribute("data-id");
    const obj = lavages[id];
    voiture.value = voitures[obj.voiture].plaque;
    lavage.value = categories[obj.lavage].designation;
    prix.value = obj.prix;
    idLavage.value = id;
  }
}

const deleteLavage = target => {
  if(target.classList.contains("delete-lavage")){
    lavages.splice(target.getAttribute("data-id"), 1);
    deleteData("lavages", target.getAttribute("data-id"))
    showLavage(lavages);
    notif("Suppression de lavage","La suppression s'est effectuée avec success");
  }
}


const showItemsInTable = (items, tbody) => {
  tbody.innerHTML = "";
  let total = 0, cp = 0;
  items.map((item, index) => {
    cp++;
    total += parseInt(item.prix);
    tbody.insertAdjacentHTML("beforeend", `
      <tr>
        <td>${index + 1}</td>
        <td>${item.date}</td>
        <td>${item.plaque}</td>
        <td>${item.modele}</td>
        <td>${item.type}</td>
        <td>${item.categorie}</td>
        <td title="Le prix de la categorie est ${item.prixCategorie}">${item.prix}</td>
        <td>
          <button style="--bg:#00ffc4" class="edit-lavage" data-id="${index}">
            <i class="fa-solid fa-pencil"></i>
          </button>
          <button style="--bg:#ff0000c2" class="delete-lavage" data-id="${index}">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      </tr>
    `);
  });
  if(cp > 0) {
    tbody.insertAdjacentHTML("beforeend", `
      <tr class="total">
        <td colspan="6">Total</td>
        <td>${total}</td>
        <td></td>
      </tr>
    `);
  }
}

const allItemLavage = () => {
  let data = [];
  lavages.map(lavage => {
    const obj = {
      date : lavage.time,
      plaque : voitures[lavage.voiture].plaque,
      modele : voitures[lavage.voiture].modele,
      type : types[categories[lavage.lavage].type].nom,
      categorie : categories[lavage.lavage].designation,
      prixCategorie : categories[lavage.lavage].prix,
      prix : lavage.prix
    };
    data = [...data, obj]
  });

  return data;
}

const notif = (title, message) => {
  const notification = document.querySelector(".notification");
  notification.innerHTML = `
    <div class="notif">
      <div class="notif-header">
        <h3>${title}</h3>
      </div>
      <div class="notif-body">
        <h4>${message}</h4>
      </div>
    </div>
  `;
  setTimeout(()=>{
    notification.innerHTML = "";
  }, 5000);
}