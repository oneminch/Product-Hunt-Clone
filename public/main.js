// ===========================================================================
// 0 - JavaScript to handle display of navigation items in mobile view & footer date
// ===========================================================================

const navBar = document.querySelector("nav ul"); // Navigation List Container

// If the hamburger menu is clicked, toggle displaying navigation items
// If clicked on anywhere else on the page, and if nav menu is expanded, collapse it
document.body.addEventListener(
	"click",
	function (e) {
		if (e.target.classList.contains("menu-btn")) {
			navBar.classList.toggle("mobile-menu");
		} else {
			if (navBar.classList.contains("mobile-menu")) {
				navBar.classList.remove("mobile-menu");
			}
		}
	},
	true
);

document.querySelector(
	"footer p"
).innerHTML = `&copy; ${new Date().getFullYear()} Discover&Share, !nc.`;

// ===========================================================================
// 1 - JavaScript to make sure the user has entered info in your contact form for
//     each of the fields. If not, displays an error message on page to inform the
//     user they need to enter info in all fields.
// ===========================================================================

const errorMsg = document.querySelector(".err-msg"); // Error message
const contactSubmit = document.querySelector(".contact-submit"); // Submit button
const contactInputs = document.querySelectorAll(".contact-inputs"); // All input fields

// When submit is clicked, loops through & checks if any field is empty
// If so, shows disappearing error message to user to fill all the fields
contactSubmit.addEventListener("click", function (e) {
	e.preventDefault();

	for (let i = 0; i < contactInputs.length; i++) {
		if (contactInputs[i].value == "" || contactInputs[i].value == null) {
			// Shows the message
			errorMsg.classList.remove("err-msg-hidden");
			errorMsg.classList.add("err-msg-shown");

			// Hides message after 3 seconds
			setTimeout(function () {
				errorMsg.classList.remove("err-msg-shown");
				errorMsg.classList.add("err-msg-hidden");
				contactForm.reset();
			}, 3000);

			break;
		}
	}
});

// ===========================================================================
// 2 - JavaScript feature that will change the appearance of something based
//     on user interaction: on hover or click on a button, link, image, etc
// ===========================================================================

const menu = document.querySelector(".menu"); // Hamburger Menu Button

// Enlarges the hamburger icon when a user hovers over it
menu.addEventListener("mouseover", function () {
	this.style.transform = "scale(1.1)";
});
menu.addEventListener("mouseout", function () {
	this.style.transform = "scale(1)";
});
