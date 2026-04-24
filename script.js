let produits = JSON.parse(localStorage.getItem("produits")) || [
  {
    image: "img/1.jpg",
    titre: "OLIVE OIL",
    prix: 60,
    desc: "400ML",
  },
  {
    image: "img/2.jpg",
    titre: "OIL",
    prix: 70,
    desc: "450ML",
  },
  {
    image: "img/2-removebg-preview (1).png",
    titre: "BOUTAIL GRAS",
    prix: 300,
    desc: "5L",
  },
  {
    image: "img/remove1.png",
    titre: "POUTITE BOUAIL",
    prix: 40,
    desc: "240ML",
  },
  {
    image: "img/remove2.png",
    titre: "ZayFbs",
    prix: 100,
    desc: "PAQUE 2 BOUTAIL OLIVE OIL 1500ML",
  },
];

let panier = JSON.parse(localStorage.getItem("panier")) || [];
let editIndex = -1;

const container = document.getElementById("cardsContainer");
const form = document.getElementById("formAjout");
const imageInput = document.getElementById("image");
const preview = document.getElementById("preview");

function saveProduits() {
  localStorage.setItem("produits", JSON.stringify(produits));
}

function savePanier() {
  localStorage.setItem("panier", JSON.stringify(panier));
}

function afficherProduits() {
  if (!container) return;

  container.innerHTML = "";

  if (produits.length === 0) {
    container.innerHTML =
      '<p style="text-align: center; color: #1d3d19; font-size: 18px;">Aucun produit disponible</p>';
    return;
  }

  produits.forEach((p, index) => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <div class="card-img-wrap">
        <img src="${p.image}" alt="${p.titre}" onerror="this.src='img/logo4.png'">
      </div>
      <h3>${p.titre}</h3>
      <p class="prix">${p.prix} DH</p>
      <p class="desc">${p.desc}</p>
      <div class="actions">
        <button class="add-cart-btn" onclick="ajouterPanier(${index})" title="Ajouter au panier">
          <i class="fa-solid fa-cart-plus"></i> Ajouter
        </button>
        <button class="edit-btn" onclick="modifierProduit(${index})" title="Modifier">
          <i class="fa-solid fa-pen"></i>
        </button>
        <button class="delete-btn" onclick="supprimerProduit(${index})" title="Supprimer">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `;

    container.appendChild(card);
  });
}

function afficherPanier() {
  const panierContainer = document.getElementById("panierContainer");
  const panierTotal = document.getElementById("panierTotal");
  const badge = document.getElementById("cartBadge");

  if (!panierContainer) return;

  panierContainer.innerHTML = "";
  let total = 0;

  if (panier.length === 0) {
    panierContainer.innerHTML = `
      <div class="panier-empty">
        <i class="fa-solid fa-cart-shopping" style="font-size: 50px; color: #d8e2a8; display: block; margin-bottom: 15px;"></i>
        <p>Votre panier est vide</p>
      </div>
    `;
  } else {
    panier.forEach((p, index) => {
      total += p.prix * p.qte;

      const item = document.createElement("div");
      item.className = "panier-item";
      item.innerHTML = `
        <div class="panier-item-info">
          <strong>${p.titre}</strong>
          <span>${p.prix} DH x ${p.qte}</span>
        </div>
        <div class="panier-item-controls">
          <button class="ctrl-btn" onclick="diminuerQte(${index})">−</button>
          <span class="qte">${p.qte}</span>
          <button class="ctrl-btn" onclick="augmenterQte(${index})">+</button>
          <button class="panier-item-delete" onclick="supprimerDuPanier(${index})">
            <i class="fa-solid fa-trash"></i>
          </button>
        </div>
      `;
      panierContainer.appendChild(item);
    });
  }

  if (panierTotal) panierTotal.textContent = total + " DH";

  const totalItems = panier.reduce((sum, p) => sum + p.qte, 0);
  if (badge) {
    if (totalItems > 0) {
      badge.style.display = "flex";
      badge.textContent = totalItems;
    } else {
      badge.style.display = "none";
    }
  }
}

function ajouterPanier(index) {
  const produit = produits[index];
  const exist = panier.find((p) => p.titre === produit.titre);

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

function supprimerDuPanier(index) {
  panier.splice(index, 1);
  savePanier();
  afficherPanier();
}

function augmenterQte(index) {
  panier[index].qte += 1;
  savePanier();
  afficherPanier();
}

function diminuerQte(index) {
  if (panier[index].qte > 1) {
    panier[index].qte -= 1;
  } else {
    panier.splice(index, 1);
  }
  savePanier();
  afficherPanier();
}

function supprimerProduit(index) {
  if (confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
    produits.splice(index, 1);
    saveProduits();
    afficherProduits();
  }
}

function modifierProduit(index) {
  const p = produits[index];

  document.getElementById("titre").value = p.titre;
  document.getElementById("prix").value = p.prix;
  document.getElementById("description").value = p.desc;

  if (preview) {
    preview.src = p.image;
    preview.style.display = "block";
  }

  const btnAdd = document.getElementById("btnAdd");
  if (btnAdd) btnAdd.innerHTML = "✔ Modifier";

  form.style.display = "flex";
  editIndex = index;
}

function resetForm() {
  document.getElementById("titre").value = "";
  document.getElementById("prix").value = "";
  document.getElementById("description").value = "";
  if (imageInput) imageInput.value = "";
  if (preview) {
    preview.src = "";
    preview.style.display = "none";
  }

  const btnAdd = document.getElementById("btnAdd");
  if (btnAdd) btnAdd.innerHTML = "✔ Ajouter";

  editIndex = -1;
}

function openPanier() {
  const box = document.getElementById("panierBox");
  const overlay = document.getElementById("panierOverlay");
  if (box) box.classList.add("open");
  if (overlay) overlay.classList.add("open");
  document.body.style.overflow = "hidden";
}

function closePanier() {
  const box = document.getElementById("panierBox");
  const overlay = document.getElementById("panierOverlay");
  if (box) box.classList.remove("open");
  if (overlay) overlay.classList.remove("open");
  document.body.style.overflow = "";
}

document.addEventListener("DOMContentLoaded", function () {
  afficherProduits();
  afficherPanier();

  const cartBtn = document.getElementById("cartBtn");
  const panierClose = document.getElementById("panierClose");
  const panierOverlay = document.getElementById("panierOverlay");

  if (cartBtn) cartBtn.addEventListener("click", openPanier);
  if (panierClose) panierClose.addEventListener("click", closePanier);
  if (panierOverlay) panierOverlay.addEventListener("click", closePanier);

  const showBtn = document.getElementById("showFormBtn");
  const cancelBtn = document.getElementById("btnCancel");
  const btnAdd = document.getElementById("btnAdd");

  if (showBtn && form) {
    showBtn.addEventListener("click", () => {
      form.style.display = "flex";
      resetForm();
    });
  }

  if (cancelBtn && form) {
    cancelBtn.addEventListener("click", () => {
      form.style.display = "none";
      resetForm();
    });
  }

  if (imageInput && preview) {
    imageInput.addEventListener("change", function () {
      const file = this.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          preview.src = e.target.result;
          preview.style.display = "block";
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (btnAdd) {
    btnAdd.addEventListener("click", function () {
      const titre = document.getElementById("titre").value.trim();
      const prix = document.getElementById("prix").value;
      const desc = document.getElementById("description").value.trim();
      const file = imageInput ? imageInput.files[0] : null;

      if (!titre || !prix) {
        alert("Veuillez remplir le titre et le prix !");
        return;
      }

      const prixNum = Number(prix);
      if (isNaN(prixNum) || prixNum <= 0) {
        alert("Le prix doit être un nombre positif !");
        return;
      }

      const saveProduct = (imageData) => {
        const productData = {
          image:
            imageData ||
            (editIndex >= 0 ? produits[editIndex].image : "img/logo4.png"),
          titre: titre,
          prix: prixNum,
          desc: desc || "Sans description",
        };

        if (editIndex === -1) {
          produits.push(productData);
        } else {
          produits[editIndex] = productData;
        }

        saveProduits();
        afficherProduits();
        form.style.display = "none";
        resetForm();
      };

      if (file) {
        const reader = new FileReader();
        reader.onload = function (e) {
          saveProduct(e.target.result);
        };
        reader.readAsDataURL(file);
      } else if (editIndex >= 0) {
        saveProduct(null);
      } else {
        alert("Veuillez sélectionner une image !");
      }
    });
  }

  // Commander
  const commanderBtn = document.getElementById("commander");
  if (commanderBtn) {
    commanderBtn.addEventListener("click", function () {
      if (panier.length === 0) {
        alert("Votre panier est vide !");
        return;
      }

      if (confirm("Confirmer la commande ?")) {
        alert(
          "Commande confirmée ! ✅\nTotal: " +
            document.getElementById("panierTotal").textContent,
        );
        panier = [];
        savePanier();
        afficherPanier();
        closePanier();
      }
    });
  }
});
