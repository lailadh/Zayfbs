let produits = JSON.parse(localStorage.getItem("produits")) || [
  {
    image: "img/ZAYTON1.png",
    titre: "Huile Olive",
    prix: 60,
    desc: "huile naturelle",
  },
  {
    image: "img/1.jpg",
    titre: "Produit 2",
    prix: 99,
    desc: "description",
  },
  {
    image: "img/2.jpg",
    titre: "Produit 3",
    prix: 100,
    desc: "description",
  },
  {
    image: "img/3.jpg",
    titre: "Produit 4",
    prix: 50,
    desc: "description",
  },
  {
    image: "img/remove1.png",
    titre: "Produit 5",
    prix: 100,
    desc: "description",
  },
  {
    image: "img/remove2.png",
    titre: "Produit 6",
    prix: 100,
    desc: "description",
  },
];

let panier = JSON.parse(localStorage.getItem("panier")) || [];

const container = document.getElementById("cardsContainer");
const form = document.getElementById("formAjout");

function saveProduits() {
  localStorage.setItem("produits", JSON.stringify(produits));
}

function savePanier() {
  localStorage.setItem("panier", JSON.stringify(panier));
}

function afficherProduits() {
  if (!container) return;

  container.innerHTML = "";

  produits.forEach((p, index) => {
    container.innerHTML += `
      <div class="card">
        <img src="${p.image}" alt="${p.titre}">
        <h3>${p.titre}</h3>
        <p class="prix">${p.prix} DH</p>
        <p class="desc">${p.desc}</p>
        <button onclick="ajouterPanier(${index})" title="Ajouter au panier">🛒</button>
        <button onclick="modifier(${index})" title="Modifier">✏️</button>
        <button onclick="supprimer(${index})" title="Supprimer">🗑️</button>
      </div>
    `;
  });
}

function afficherPanier() {
  const panierContainer = document.getElementById("panierContainer");
  const panierTotal = document.getElementById("panierTotal");

  if (!panierContainer) return;

  panierContainer.innerHTML = "";
  let total = 0;
  let totalItems = 0;

  if (panier.length === 0) {
    panierContainer.innerHTML = `
      <div class="panier-empty">
        <i class="fa-solid fa-cart-shopping"></i>
        <p>Votre panier est vide</p>
      </div>
    `;
  } else {
    panier.forEach((p, index) => {
      total += p.prix * p.qte;
      totalItems += p.qte;

      panierContainer.innerHTML += `
        <div class="panier-item">
          <div class="panier-item-info">
            <strong>${p.titre}</strong>
            <span>${p.prix * p.qte} DH</span>
          </div>
          <div class="panier-item-controls">
            <button class="ctrl-btn" onclick="diminuer(${index})">−</button>
            <span class="qte">${p.qte}</span>
            <button class="ctrl-btn" onclick="augmenter(${index})">+</button>
            <button class="panier-item-delete" onclick="supprimerPanier(${index})">🗑️</button>
          </div>
        </div>
      `;
    });

    totalItems = panier.reduce((sum, p) => sum + p.qte, 0);
  }

  if (panierTotal) panierTotal.textContent = total + " DH";

  const badge = document.querySelector(".cart-badge");
  if (badge) {
    const count = panier.reduce((sum, p) => sum + p.qte, 0);
    if (count > 0) {
      badge.style.display = "flex";
      badge.textContent = count;
    } else {
      badge.style.display = "none";
    }
  }

  const cartCount = document.getElementById("cartCount");
  if (cartCount) {
    cartCount.textContent = panier.reduce((sum, p) => sum + p.qte, 0);
  }
}

function openPanier() {
  document.getElementById("panierBox")?.classList.add("open");
  document.getElementById("panierOverlay")?.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closePanier() {
  document.getElementById("panierBox")?.classList.remove("open");
  document.getElementById("panierOverlay")?.classList.remove("open");
  document.body.style.overflow = "";
}

function supprimer(index) {
  if (confirm("Supprimer ce produit ?")) {
    produits.splice(index, 1);
    saveProduits();
    afficherProduits();
  }
}

function modifier(index) {
  let p = produits[index];

  document.getElementById("titre").value = p.titre;
  document.getElementById("prix").value = p.prix;
  document.getElementById("description").value = p.desc;

  form.style.display = "flex";

  produits.splice(index, 1);
  saveProduits();
  afficherProduits();
}

function ajouterPanier(index) {
  let produit = produits[index];
  let exist = panier.find((p) => p.titre === produit.titre);

  if (exist) {
    exist.qte += 1;
  } else {
    panier.push({
      titre: produit.titre,
      prix: produit.prix,
      qte: 1,
    });
  }

  savePanier();
  afficherPanier();
  openPanier();
}

function supprimerPanier(index) {
  panier.splice(index, 1);
  savePanier();
  afficherPanier();
}

function augmenter(index) {
  panier[index].qte += 1;
  savePanier();
  afficherPanier();
}

function diminuer(index) {
  if (panier[index].qte > 1) {
    panier[index].qte -= 1;
  } else {
    panier.splice(index, 1);
  }
  savePanier();
  afficherPanier();
}

document.addEventListener("DOMContentLoaded", function () {
  afficherProduits();
  afficherPanier();

  // PANIER OPEN / CLOSE
  const cartBtn = document.getElementById("cartBtn");
  const panierClose = document.getElementById("panierClose");
  const panierOverlay = document.getElementById("panierOverlay");

  if (cartBtn) cartBtn.addEventListener("click", openPanier);
  if (panierClose) panierClose.addEventListener("click", closePanier);
  if (panierOverlay) panierOverlay.addEventListener("click", closePanier);

  // FORM SHOW/HIDE
  const showBtn = document.getElementById("showFormBtn");
  const cancelBtn = document.getElementById("btnCancel");

  if (showBtn && form) {
    showBtn.addEventListener("click", () => {
      form.style.display = "flex";
    });
  }

  if (cancelBtn && form) {
    cancelBtn.addEventListener("click", () => {
      form.style.display = "none";
    });
  }

  // IMAGE PREVIEW
  const imageInput = document.getElementById("image");
  const preview = document.getElementById("preview");

  if (imageInput && preview) {
    imageInput.addEventListener("change", function () {
      let file = this.files[0];
      if (file) {
        let reader = new FileReader();
        reader.onload = function (e) {
          preview.src = e.target.result;
          preview.style.display = "block";
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // ADD PRODUCT
  const btnAdd = document.getElementById("btnAdd");

  if (btnAdd) {
    btnAdd.addEventListener("click", function () {
      const imageInput = document.getElementById("image");
      const file = imageInput.files[0];
      const titre = document.getElementById("titre").value;
      const prix = document.getElementById("prix").value;
      const desc = document.getElementById("description").value;

      if (!file || !titre || !prix) {
        alert("Remplissez les informations");
        return;
      }

      let reader = new FileReader();
      reader.onload = function (e) {
        produits.push({
          image: e.target.result,
          titre,
          prix: Number(prix),
          desc,
        });
        saveProduits();
        afficherProduits();

        form.style.display = "none";
        document.getElementById("titre").value = "";
        document.getElementById("prix").value = "";
        document.getElementById("description").value = "";
        imageInput.value = "";
        if (preview) preview.style.display = "none";
      };
      reader.readAsDataURL(file);
    });
  }
});
