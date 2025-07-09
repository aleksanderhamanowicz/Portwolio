// Przełączanie mobilnego menu
const przyciskMenu = document.getElementById("przycisk-menu")
const menuNawigacji = document.getElementById("menu-nawigacji")
const linkiNawigacji = document.querySelectorAll(".link-nawigacji")

przyciskMenu.addEventListener("click", () => {
  menuNawigacji.classList.toggle("aktywne")
  przyciskMenu.classList.toggle("aktywne")
})

// Zamykanie mobilnego menu po kliknięciu w link
linkiNawigacji.forEach((link) => {
  link.addEventListener("click", () => {
    menuNawigacji.classList.remove("aktywne")
    przyciskMenu.classList.remove("aktywne")
  })
})

// Płynne przewijanie dla linków nawigacyjnych
document.querySelectorAll('a[href^="#"]').forEach((kotwica) => {
  kotwica.addEventListener("click", function (e) {
    e.preventDefault()
    const cel = document.querySelector(this.getAttribute("href"))
    if (cel) {
      cel.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

// Zmiana tła paska nawigacyjnego podczas przewijania
window.addEventListener("scroll", () => {
  const pasekNawigacyjny = document.getElementById("pasek-nawigacyjny")
  if (window.scrollY > 50) {
    pasekNawigacyjny.style.background = "rgba(255, 255, 255, 0.98)"
    pasekNawigacyjny.style.boxShadow = "0 2px 10px rgba(0, 0, 0, 0.1)"
  } else {
    pasekNawigacyjny.style.background = "rgba(255, 255, 255, 0.95)"
    pasekNawigacyjny.style.boxShadow = "none"
  }
})

// Obserwator przecięć dla animacji
const opcjeObserwatora = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
}

const obserwator = new IntersectionObserver((wpisy) => {
  wpisy.forEach((wpis) => {
    if (wpis.isIntersecting) {
      wpis.target.classList.add("pojawienie-sie")
    }
  })
}, opcjeObserwatora)

// Obserwowanie elementów do animacji
document.addEventListener("DOMContentLoaded", () => {
  const elementyDoAnimacji = document.querySelectorAll(".karta-umiejetnosci, .karta-projektu, .karta-kontaktu")
  elementyDoAnimacji.forEach((element) => obserwator.observe(element))
})

// Podświetlanie aktywnego linku nawigacyjnego
window.addEventListener("scroll", () => {
  const sekcje = document.querySelectorAll("section[id]")
  const linkiNawigacji = document.querySelectorAll(".link-nawigacji")

  let aktualnaSekcja = ""
  sekcje.forEach((sekcja) => {
    const goraSekcji = sekcja.offsetTop
    const wysokoscSekcji = sekcja.clientHeight
    if (scrollY >= goraSekcji - 200) {
      aktualnaSekcja = sekcja.getAttribute("id")
    }
  })

  linkiNawigacji.forEach((link) => {
    link.classList.remove("aktywny")
    if (link.getAttribute("href") === `#${aktualnaSekcja}`) {
      link.classList.add("aktywny")
    }
  })
})

// Dodawanie stylów dla aktywnej klasy
const styl = document.createElement("style")
styl.textContent = `
    .link-nawigacji.aktywny {
        color: var(--kolor-podstawowy);
    }
    .link-nawigacji.aktywny::after {
        width: 100%;
    }
`
document.head.appendChild(styl)

// Walidacja emaila (do przyszłego formularza kontaktowego)
function walidujEmail(email) {
  const wzorzec = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return wzorzec.test(email)
}

// Efekt pisania na maszynie dla tytułu głównego (opcjonalne ulepszenie)
function efektPisania(element, tekst, predkosc = 100) {
  let i = 0
  element.innerHTML = ""

  function pisz() {
    if (i < tekst.length) {
      element.innerHTML += tekst.charAt(i)
      i++
      setTimeout(pisz, predkosc)
    }
  }
  pisz()
}

// Odkomentuj aby włączyć efekt pisania
// document.addEventListener('DOMContentLoaded', () => {
//     const tytulGlowny = document.querySelector('.tytul-glowny');
//     const oryginalnyTekst = tytulGlowny.textContent;
//     efektPisania(tytulGlowny, oryginalnyTekst, 50);
// });

// Funkcja do płynnego pokazywania elementów
function pokazElementy() {
  const elementy = document.querySelectorAll(".karta-umiejetnosci, .karta-projektu")
  elementy.forEach((element, indeks) => {
    setTimeout(() => {
      element.style.opacity = "0"
      element.style.transform = "translateY(20px)"
      element.style.transition = "all 0.6s ease"

      setTimeout(() => {
        element.style.opacity = "1"
        element.style.transform = "translateY(0)"
      }, 100)
    }, indeks * 200)
  })
}

// Funkcja do liczenia statystyk (przykład)
function liczStatystyki() {
  const liczniki = document.querySelectorAll(".licznik")
  liczniki.forEach((licznik) => {
    const cel = Number.parseInt(licznik.getAttribute("data-cel"))
    let aktualna = 0
    const przyrost = cel / 100

    const timer = setInterval(() => {
      aktualna += przyrost
      if (aktualna >= cel) {
        aktualna = cel
        clearInterval(timer)
      }
      licznik.textContent = Math.floor(aktualna)
    }, 20)
  })
}

// Obsługa formularza kontaktowego (jeśli zostanie dodany)
function obslugaFormularza() {
  const formularz = document.getElementById("formularz-kontaktowy")
  if (formularz) {
    formularz.addEventListener("submit", (e) => {
      e.preventDefault()

      const email = document.getElementById("email").value
      const wiadomosc = document.getElementById("wiadomosc").value

      if (!walidujEmail(email)) {
        alert("Proszę wprowadzić poprawny adres email")
        return
      }

      if (wiadomosc.length < 10) {
        alert("Wiadomość musi mieć co najmniej 10 znaków")
        return
      }

      // Tutaj można dodać wysyłanie formularza
      alert("Dziękuję za wiadomość! Odpowiem wkrótce.")
      formularz.reset()
    })
  }
}

// Inicjalizacja po załadowaniu strony
document.addEventListener("DOMContentLoaded", () => {
  obslugaFormularza()
})
