// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()

    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth"
    })
  })
})


// Card hover glow effect
const cards = document.querySelectorAll(".card")

cards.forEach(card => {

  card.addEventListener("mousemove", e => {

    const rect = card.getBoundingClientRect()

    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    card.style.background =
      `radial-gradient(circle at ${x}px ${y}px, rgba(59,130,246,0.2), rgba(255,255,255,0.03))`
  })

  card.addEventListener("mouseleave", () => {
    card.style.background = "rgba(255,255,255,0.05)"
  })

})


// Hero parallax effect
window.addEventListener("scroll", () => {

  const hero = document.querySelector(".hero")

  const offset = window.scrollY * 0.3

  hero.style.transform = `translateY(${offset}px)`
})
